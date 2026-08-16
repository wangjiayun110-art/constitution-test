/**
 * 主应用逻辑 - 路由、答题流程
 */
const App = {
  currentView: 'home',
  quizState: { index: 0, answers: {} },

  init() {
    this.bindEvents();
    this.renderHomeGrid();
    this.renderAboutGrid();
    this.switchView('home');
  },

  bindEvents() {
    // 导航
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchView(tab.dataset.view));
    });
    document.getElementById('logoHome').addEventListener('click', () => this.switchView('home'));

    // 首页按钮
    document.getElementById('btnStart').addEventListener('click', () => this.startQuiz());
    document.getElementById('btnAbout').addEventListener('click', () => this.switchView('about'));

    // 答题导航
    document.getElementById('btnPrev').addEventListener('click', () => this.prevQuestion());
    document.getElementById('btnNext').addEventListener('click', () => this.nextQuestion());

    // 结果页按钮
    document.getElementById('btnRetry').addEventListener('click', () => this.startQuiz());
    document.getElementById('btnBackHome').addEventListener('click', () => this.switchView('home'));
    document.getElementById('btnViewHistory').addEventListener('click', () => this.switchView('history'));
    document.getElementById('btnExport').addEventListener('click', () => History.exportPDF());
    document.getElementById('btnShare').addEventListener('click', () => History.shareResult());

    // 历史
    document.getElementById('btnClearHistory').addEventListener('click', () => this.confirmClearHistory());

    // 键盘支持：左右键导航
    document.addEventListener('keydown', (e) => {
      if (this.currentView !== 'quiz') return;
      if (e.key === 'ArrowLeft') this.prevQuestion();
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        const btn = document.getElementById('btnNext');
        if (!btn.disabled) this.nextQuestion();
      }
      // 数字键 1-5 选择
      if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key) - 1;
        const opts = document.querySelectorAll('.quiz-option');
        if (opts[idx]) opts[idx].click();
      }
    });
  },

  switchView(name) {
    this.currentView = name;
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById('view-' + name).classList.remove('hidden');
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === name);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (name === 'history') History.renderPage();
  },

  // 首页九体质网格
  renderHomeGrid() {
    const grid = document.getElementById('constitutionGrid');
    grid.innerHTML = CONSTITUTIONS.map(c => `
      <div class="const-chip">
        <div class="chip-icon">${c.icon}</div>
        <div class="chip-name">${c.name}</div>
      </div>
    `).join('');
  },

  // 关于页九体质说明
  renderAboutGrid() {
    const grid = document.getElementById('aboutGrid');
    grid.innerHTML = CONSTITUTIONS.map(c => `
      <div class="about-item">
        <div class="about-name">${c.icon} ${c.name}</div>
        <div class="about-desc">${c.brief}</div>
      </div>
    `).join('');
  },

  // ===== 答题流程 =====
  startQuiz() {
    this.quizState = { index: 0, answers: {} };
    document.getElementById('qTotal').textContent = QUESTIONS.length;
    this.renderQuestion();
    this.switchView('quiz');
  },

  renderQuestion() {
    const idx = this.quizState.index;
    const q = QUESTIONS[idx];
    const card = document.getElementById('quizCard');
    const selected = this.quizState.answers[q.id];

    card.innerHTML = `
      <div class="quiz-q-num">第 ${idx + 1} 题</div>
      <div class="quiz-q-text">${q.text}</div>
      <div class="quiz-options">
        ${OPTIONS.map((opt, i) => `
          <button class="quiz-option ${selected === opt.value ? 'selected' : ''}" data-value="${opt.value}">
            <span class="radio-dot"></span>
            <span class="option-label">${opt.label}</span>
            <span class="option-desc">${opt.desc}</span>
          </button>
        `).join('')}
      </div>
    `;

    // 绑定选项
    card.querySelectorAll('.quiz-option').forEach(el => {
      el.addEventListener('click', () => {
        const v = parseInt(el.dataset.value);
        this.quizState.answers[q.id] = v;
        card.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        document.getElementById('btnNext').disabled = false;
      });
    });

    // 进度
    const progress = ((idx + 1) / QUESTIONS.length * 100).toFixed(0);
    document.getElementById('qCurrent').textContent = idx + 1;
    document.getElementById('qPercent').textContent = progress + '%';
    document.getElementById('progressFill').style.width = progress + '%';

    // 按钮状态
    document.getElementById('btnPrev').disabled = idx === 0;
    const btnNext = document.getElementById('btnNext');
    btnNext.disabled = selected === undefined;
    btnNext.textContent = idx === QUESTIONS.length - 1 ? '查看结果' : '下一题';
  },

  prevQuestion() {
    if (this.quizState.index > 0) {
      this.quizState.index--;
      this.renderQuestion();
    }
  },

  nextQuestion() {
    if (this.quizState.index < QUESTIONS.length - 1) {
      this.quizState.index++;
      this.renderQuestion();
    } else {
      // 完成
      this.finishQuiz();
    }
  },

  finishQuiz() {
    const resultData = calcScores(this.quizState.answers);
    // 保存历史
    History.save(resultData);
    this.showResult(resultData, false);
  },

  // 显示结果（isHistory 标记是否来自历史查看）
  showResult(resultData, isHistory) {
    window._currentResult = resultData;
    window._currentPrimary = resultData.primary.code;
    const container = document.getElementById('resultContent');
    Results.render(container, resultData);

    // 历史查看时隐藏导出/分享，仅显示返回
    document.getElementById('btnExport').style.display = isHistory ? 'none' : '';
    document.getElementById('btnShare').style.display = isHistory ? 'none' : '';

    this.switchView('result');
  },

  confirmClearHistory() {
    if (History.list().length === 0) { this.toast('暂无记录'); return; }
    // 自定义确认（避免使用 confirm）
    if (this._pendingClear) {
      clearTimeout(this._pendingClear);
      this._pendingClear = null;
      History.clear();
      History.renderPage();
      this.toast('历史记录已清空');
      return;
    }
    this._pendingClear = setTimeout(() => {
      this._pendingClear = null;
    }, 3000);
    this.toast('再次点击"清空记录"以确认');
  },

  // Toast 提示
  toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }
};

// 启动
document.addEventListener('DOMContentLoaded', () => App.init());

window.App = App;
