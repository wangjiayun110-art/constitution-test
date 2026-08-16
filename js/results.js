/**
 * 结果渲染模块 - 雷达图、分数条、体质详情、调养建议
 */
const Results = {
  radarChart: null,

  // 根据 code 获取体质完整定义
  getInfo(code) {
    return CONSTITUTIONS.find(c => c.code === code) || {};
  },

  // 渲染完整结果
  render(container, resultData) {
    const primary = resultData.primary;
    const info = this.getInfo(primary.code);
    const all = resultData.all;

    const levelText = {
      '是': primary.code === 'ph' ? '判定为平和质' : '明显偏颇',
      '倾向是': '倾向于此体质',
      '否': '轻度倾向'
    }[primary.level] || '';

    // 主要体质判定徽章颜色
    const badgeStyle = primary.level === '是'
      ? 'background:#fff1f0;color:#cf1322'
      : (primary.code === 'ph' ? 'background:#f6ffed;color:#389e0d' : 'background:#fff7e6;color:#d46b08');

    let html = `
      <div class="result-hero" id="resultHero">
        <div class="primary-icon">${primary.icon}</div>
        <div class="primary-label">您的体质判定结果</div>
        <div class="primary-name">${primary.name}</div>
        <div class="primary-brief">${info.brief || ''}</div>
        <span class="primary-badge" style="${badgeStyle}">${levelText} · 转化分 ${primary.transform}</span>
      </div>

      <div class="result-block">
        <h3><span class="block-icon">📊</span>九种体质分布</h3>
        <div class="chart-wrap"><canvas id="radarChart" height="220"></canvas></div>
        <div class="score-bars" style="margin-top:20px">
          ${this.renderScoreBars(all)}
        </div>
      </div>

      <div class="result-block">
        <h3><span class="block-icon">${primary.icon}</span>${primary.name} · 体质特征</h3>
        <div class="feature-list">
          ${(info.features || []).map(f => `<span class="feature-tag">${f}</span>`).join('')}
        </div>
        <div class="meta-row" style="margin-top:16px">
          <div class="meta-label">形成原因</div><div>${info.causes || '-'}</div>
          <div class="meta-label">易患疾病</div><div>${info.risks || '-'}</div>
        </div>
      </div>

      <div class="result-block">
        <h3><span class="block-icon">💡</span>调养建议</h3>
        <div class="advice-grid">
          ${this.renderAdvice(info.advice)}
        </div>
      </div>

      <div class="result-block">
        <h3><span class="block-icon">🍎</span>饮食推荐</h3>
        <div class="foods-section">
          <h4>✓ 宜食</h4>
          <div class="foods-list">
            ${(info.foodsGood || []).map(f => `<span class="food-tag good">${f}</span>`).join('')}
          </div>
        </div>
        <div class="foods-section">
          <h4>✗ 少食</h4>
          <div class="foods-list">
            ${(info.foodsBad || []).map(f => `<span class="food-tag bad">${f}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
    container.innerHTML = html;

    // 绘制雷达图
    setTimeout(() => this.drawRadar(all), 50);
  },

  renderScoreBars(all) {
    return all.map(r => {
      const isPrimary = r.code === window._currentPrimary;
      const weight = isPrimary ? 'font-weight:700' : '';
      return `
        <div class="score-bar-row" style="${weight}">
          <div class="score-bar-name">${r.icon} ${r.name}</div>
          <div class="score-bar-track">
            <div class="score-bar-fill" style="width:${r.transform}%;background:${r.color}"></div>
          </div>
          <div class="score-bar-value">${r.transform}</div>
        </div>
      `;
    }).join('');
  },

  renderAdvice(advice) {
    if (!advice) return '<div class="advice-item">暂无建议</div>';
    const items = [
      { icon: '🍚', title: '饮食', text: advice.diet },
      { icon: '🏠', title: '起居', text: advice.lifestyle },
      { icon: '🏃', title: '运动', text: advice.exercise },
      { icon: '😌', title: '情志', text: advice.emotion }
    ];
    return items.map(i => `
      <div class="advice-item">
        <div class="advice-title">${i.icon} ${i.title}</div>
        <div class="advice-text">${i.text}</div>
      </div>
    `).join('');
  },

  // 绘制雷达图
  drawRadar(all) {
    const canvas = document.getElementById('radarChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.radarChart) {
      this.radarChart.destroy();
      this.radarChart = null;
    }

    const labels = all.map(r => r.name);
    const data = all.map(r => r.transform);
    const colors = all.map(r => r.color);

    this.radarChart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: '转化分',
          data: data,
          backgroundColor: 'rgba(82, 196, 26, 0.15)',
          borderColor: '#52c41a',
          borderWidth: 2,
          pointBackgroundColor: colors,
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const r = all[ctx.dataIndex];
                return `${r.name}: ${r.transform}分 (${r.level})`;
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20, color: '#8a9b93', backdropColor: 'transparent', font: { size: 10 } },
            grid: { color: '#e8f0eb' },
            angleLines: { color: '#e8f0eb' },
            pointLabels: { color: '#5a6b63', font: { size: 12 } }
          }
        }
      }
    });
  }
};

window.Results = Results;
