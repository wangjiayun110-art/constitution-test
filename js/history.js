/**
 * 历史记录与导出模块
 * 使用 localStorage 存储，html2canvas + jsPDF 导出报告
 */
const History = {
  KEY: 'constitution_history_v1',
  MAX: 50,

  // 保存一条记录
  save(resultData) {
    const list = this.list();
    const now = new Date();
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      ts: now.getTime(),
      dateStr: now.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }),
      primary: {
        code: resultData.primary.code,
        name: resultData.primary.name,
        icon: resultData.primary.icon,
        transform: resultData.primary.transform,
        level: resultData.primary.level
      },
      all: resultData.all.map(r => ({
        code: r.code, name: r.name, icon: r.icon,
        color: r.color, transform: r.transform, level: r.level
      }))
    };
    list.unshift(record);
    if (list.length > this.MAX) list.length = this.MAX;
    try {
      localStorage.setItem(this.KEY, JSON.stringify(list));
    } catch (e) {
      console.error('保存历史失败', e);
    }
    return record;
  },

  list() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
  },

  // 渲染历史页
  renderPage() {
    const records = this.list();
    const summaryEl = document.getElementById('historySummary');
    const listEl = document.getElementById('historyList');
    const trendCanvas = document.getElementById('trendChart');

    if (records.length === 0) {
      summaryEl.innerHTML = '';
      listEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-text">还没有历史记录，完成一次测试后会自动保存</div>
          <button class="btn btn-primary" onclick="App.switchView('quiz')">去测试</button>
        </div>`;
      const ctx = trendCanvas.getContext('2d');
      ctx.clearRect(0, 0, trendCanvas.width, trendCanvas.height);
      trendCanvas.parentElement.innerHTML = '<div class="empty-state" style="padding:30px"><div class="empty-text">完成测试后这里会显示体质变化趋势</div></div>';
      return;
    }

    // 概要统计
    const latest = records[0];
    const typeCount = {};
    records.forEach(r => { typeCount[r.primary.code] = (typeCount[r.primary.code] || 0) + 1; });
    const mostCode = Object.keys(typeCount).reduce((a, b) => typeCount[a] >= typeCount[b] ? a : b);
    const mostInfo = CONSTITUTIONS.find(c => c.code === mostCode) || {};

    summaryEl.innerHTML = `
      <div class="summary-card">
        <div class="summary-label">测试次数</div>
        <div class="summary-value">${records.length} 次</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">最近体质</div>
        <div class="summary-value">${latest.primary.icon} ${latest.primary.name}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">最常体质</div>
        <div class="summary-value">${mostInfo.icon || ''} ${mostInfo.name || '-'}</div>
      </div>
    `;

    // 趋势图
    this.drawTrend(trendCanvas, records);

    // 列表
    listEl.innerHTML = records.map(r => `
      <div class="history-item">
        <div class="hi-icon">${r.primary.icon}</div>
        <div class="hi-main">
          <div class="hi-name">${r.primary.name} · ${r.primary.level === '是' ? '明显' : (r.primary.level === '倾向是' ? '倾向' : '轻度')}</div>
          <div class="hi-date">${r.dateStr}</div>
        </div>
        <div class="hi-score">转化分 ${r.primary.transform}</div>
        <div class="hi-actions">
          <button class="btn btn-outline" onclick="History.viewDetail('${r.id}')">查看</button>
        </div>
      </div>
    `).join('');
  },

  drawTrend(canvas, records) {
    if (typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');
    // Chart 不重复创建，查找已有实例
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    // 倒序：旧→新
    const sorted = [...records].reverse();
    const labels = sorted.map((r, i) => `第${i + 1}次`);

    // 每种体质一条折线（数据量太大只画主要体质 + 偏颇最高的几条）
    // 为清晰，画所有9条但用淡色
    const datasets = CONSTITUTIONS.map(c => ({
      label: c.name,
      data: sorted.map(r => {
        const item = r.all.find(a => a.code === c.code);
        return item ? item.transform : 0;
      }),
      borderColor: c.color,
      backgroundColor: c.color + '20',
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2
    }));

    new Chart(canvas, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              afterLabel: (ctx) => {
                const r = sorted[ctx.dataIndex];
                return `主导: ${r.primary.icon} ${r.primary.name}`;
              }
            }
          }
        },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { stepSize: 25 } }
        },
        elements: { line: { borderWidth: 2 } }
      }
    });
  },

  // 查看历史详情
  viewDetail(id) {
    const record = this.list().find(r => r.id === id);
    if (!record) return;
    // 构造 resultData 格式
    const resultData = {
      primary: record.primary,
      all: record.all
    };
    App.showResult(resultData, true);
  },

  // 导出 PDF 报告
  exportPDF() {
    const target = document.getElementById('resultContent');
    if (!target) { App.toast('未找到结果内容'); return; }
    App.toast('正在生成报告...');

    html2canvas(target, {
      scale: 2,
      backgroundColor: '#f7faf8',
      useCORS: true,
      logging: false
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableW = pageW - margin * 2;
      const imgH = (canvas.height * usableW) / canvas.width;

      // 标题
      pdf.setFillColor(247, 250, 248);
      pdf.rect(0, 0, pageW, pageH, 'F');
      pdf.setTextColor(35, 120, 4);
      pdf.setFontSize(18);
      pdf.text('Constitution Self-Assessment Report', margin, 20);
      pdf.setFontSize(11);
      pdf.setTextColor(90, 107, 99);
      pdf.text(`Date: ${new Date().toLocaleString('zh-CN')}`, margin, 28);

      // 图片，分页
      let heightLeft = imgH;
      let position = 32;
      pdf.addImage(imgData, 'PNG', margin, position, usableW, imgH);
      heightLeft -= (pageH - position);
      while (heightLeft > 0) {
        position = margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position - (imgH - heightLeft), usableW, imgH);
        heightLeft -= (pageH - margin * 2);
      }
      pdf.save(`constitution-report-${Date.now()}.pdf`);
      App.toast('报告已导出');
    }).catch(err => {
      console.error(err);
      App.toast('导出失败，请重试');
    });
  },

  // 分享结果（复制文字到剪贴板 + 提示）
  shareResult() {
    const rd = window._currentResult;
    if (!rd) { App.toast('暂无可分享结果'); return; }
    const primary = rd.primary;
    const all = rd.all;
    const top3 = [...all].sort((a, b) => b.transform - a.transform).slice(0, 3);
    const text = `【中医体质自测结果】
我的体质：${primary.icon} ${primary.name}（转化分 ${primary.transform}）
${primary.name === '平和质' ? '健康体质，继续保持！' : '需要注意调养'}

前三项：
${top3.map(r => `${r.icon} ${r.name}：${r.transform}分（${r.level}）`).join('\n')}

来测测你的体质吧！`;

    if (navigator.share) {
      navigator.share({ title: '我的体质自测结果', text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => App.toast('结果已复制，可粘贴分享'));
    } else {
      // 兜底：创建临时 textarea
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); App.toast('结果已复制，可粘贴分享'); }
      catch (e) { App.toast('复制失败，请手动截图'); }
      document.body.removeChild(ta);
    }
  }
};

window.History = History;
