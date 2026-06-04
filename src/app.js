/* ============================================================
   Thai HEAVEN — Prototype router & interactions
   ============================================================ */
(function () {
  const screenNames = {
    splash: '01 · SPLASH / 18+',
    onboarding: '02 · ONBOARDING',
    'home-map': '03 · HOME · MAP',
    search: '05 · SEARCH',
    category: '06 · CATEGORY',
    filter: '07 · FILTER',
    'venue-overview': '08 · VENUE',
    'venue-roster': '09 · ROSTER',
    'venue-reviews': '10 · REVIEWS',
    line: '11 · LINE HANDOFF',
    my: '12 · MY · SAVED',
  };
  const phaseOf = {
    splash: 1, onboarding: 1, 'home-map': 2, search: 2, category: 2, filter: 2,
    'venue-overview': 3, 'venue-roster': 3, 'venue-reviews': 3, line: 3, my: 3,
  };
  let history = ['splash'];
  const views = {};
  let curName = 'splash';
  const selectedGirls = new Set();
  let toastT;
  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $all(s, ctx) { return Array.from((ctx || document).querySelectorAll(s)); }
  function setHint() {
    const el = $('#hintCur');
    if (el) el.innerHTML = '画面 <b>' + (screenNames[curName] || curName) + '</b>';
    $all('.flow-rail .fr').forEach((fr) => fr.classList.toggle('on', +fr.dataset.phase === phaseOf[curName]));
  }
  function show(name, opts) {
    opts = opts || {};
    const next = views[name];
    if (!next) return;
    const cur = views[curName];
    if (cur && cur !== next && !opts.modalReturn) cur.classList.remove('active');
    next.classList.add('active');
    curName = name;
    setHint();
    $all('[data-scroll]', next).forEach((s) => { s.scrollTop = 0; });
  }
  function go(name) {
    if (name === curName) return;
    if (views[name] && views[name].classList.contains('is-modal')) {
      views[name].classList.add('active');
      curName = name;
      setHint();
      return;
    }
    if (views[curName] && views[curName].classList.contains('is-modal')) views[curName].classList.remove('active');
    history.push(name);
    show(name);
  }
  function back() {
    if (views[curName] && views[curName].classList.contains('is-modal')) {
      views[curName].classList.remove('active');
      curName = history[history.length - 1] || 'home-map';
      setHint();
      return;
    }
    if (history.length > 1) {
      history.pop();
      const prev = history[history.length - 1];
      views[curName].classList.remove('active');
      const goingTo = views[prev];
      if (goingTo) { goingTo.classList.add('active'); curName = prev; setHint(); $all('[data-scroll]', goingTo).forEach((s) => { s.scrollTop = 0; }); }
    }
  }
  function reset() {
    history = ['splash'];
    Object.values(views).forEach((v) => v.classList.remove('active'));
    show('splash');
    selectedGirls.clear();
    updateRosterCta();
  }
  function toast(html) {
    const t = $('#toast');
    if (!t) return;
    t.innerHTML = html;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 1900);
  }
  function updateRosterCta() {
    const btn = $('#rosterCtaBtn');
    const sub = $('#rosterCtaSub');
    if (!btn) return;
    const n = selectedGirls.size;
    btn.textContent = n > 0 ? '▶ ' + n + ' 名で LINE' : '▶ 嬢を選択';
    if (sub) sub.textContent = n > 0 ? '選択中: ' + Array.from(selectedGirls).join(' / ') : '嬢を選んで送信';
  }
  function gotoVenueTab(tab) {
    const map = { overview: 'venue-overview', roster: 'venue-roster', reviews: 'venue-reviews' };
    const target = map[tab];
    if (target) go(target);
  }
  document.addEventListener('DOMContentLoaded', init);
  function init() {
    $all('.vw').forEach((v) => { views[v.dataset.view] = v; });
    show('splash');
    document.addEventListener('click', (e) => {
      const navEl = e.target.closest('[data-go]');
      if (navEl) { e.preventDefault(); go(navEl.dataset.go); return; }
      const backEl = e.target.closest('[data-back]');
      if (backEl) { e.preventDefault(); back(); return; }
      const exitEl = e.target.closest('[data-exit]');
      if (exitEl) { toast('OS ホームへ戻ります（デモ）'); return; }
      const cat = e.target.closest('.onb .cat');
      if (cat) { cat.classList.toggle('on'); return; }
      const area = e.target.closest('.area-grid .ar');
      if (area) { area.classList.toggle('on'); return; }
      const tog = e.target.closest('.toggle');
      if (tog) { tog.classList.toggle('on'); return; }
      const onbNext = e.target.closest('[data-onb-next]');
      if (onbNext) { onbStep(+onbNext.dataset.onbNext); return; }
      const nav = e.target.closest('.mbottom .item[data-nav]');
      if (nav) { e.preventDefault(); go(nav.dataset.nav); return; }
      const handle = e.target.closest('[data-sheet-toggle]');
      if (handle) { $('#mapSheet').classList.toggle('expanded'); return; }
      const vtab = e.target.closest('.v-tabs .tb[data-vtab]');
      if (vtab) { gotoVenueTab(vtab.dataset.vtab); return; }
      const heart = e.target.closest('[data-save-toggle]');
      if (heart) { heart.classList.toggle('saved'); toast(heart.classList.contains('saved') ? '保存しました ♥' : '保存を解除'); return; }
      const girl = e.target.closest('.roster-grid .g[data-girl]');
      if (girl) {
        const nm = girl.dataset.girl;
        if (selectedGirls.has(nm)) { selectedGirls.delete(nm); girl.classList.remove('sel'); }
        else { selectedGirls.add(nm); girl.classList.add('sel'); }
        updateRosterCta();
        return;
      }
      const chip = e.target.closest('[data-chip]');
      if (chip) { chip.classList.toggle('on'); return; }
      const qc = e.target.closest('.quick-chips .q');
      if (qc) { addLineReply(qc.textContent.trim()); return; }
      const demo = e.target.closest('[data-demo]');
      if (demo) { toast(demo.dataset.demo); return; }
      const mtab = e.target.closest('.my-tabs .tb');
      if (mtab) { $all('.my-tabs .tb').forEach((t) => t.classList.remove('on')); mtab.classList.add('on'); }
    });
    updateRosterCta();
    setHint();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !/input|textarea/i.test(e.target.tagName)) { e.preventDefault(); back(); }
      if (e.key === 'r' || e.key === 'R') reset();
    });
    $('#resetBtn').addEventListener('click', reset);
  }
  function onbStep(step) {
    if (step > 3) { go('home-map'); return; }
    $all('[data-onb-step]').forEach((s) => { s.style.display = +s.dataset.onbStep === step ? 'flex' : 'none'; });
    $all('.onb-prog .seg').forEach((seg, i) => seg.classList.toggle('on', i < step));
  }
  window.__onbStep = onbStep;
  function addLineReply(text) {
    const chat = $('#lineChat');
    if (!chat) return;
    const b = document.createElement('div');
    b.className = 'bubble me';
    b.textContent = text;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
    setTimeout(() => {
      const r = document.createElement('div');
      r.className = 'bubble';
      r.textContent = autoReply(text);
      chat.appendChild(r);
      chat.scrollTop = chat.scrollHeight;
    }, 700);
  }
  function autoReply(t) {
    if (t.includes('空席')) return '本日 21:00 以降でしたら個室の空きがございます ♪';
    if (t.includes('日本語')) return '日本語対応スタッフ在籍店をご案内します。少々お待ちください。';
    if (t.includes('送迎')) return 'ホテルまでの送迎、手配可能です。ご滞在先を教えてください。';
    if (t.includes('領収書')) return '領収書発行できます。宛名のご希望はございますか？';
    return '承知しました。担当より折り返しご案内します ♪';
  }
  window.ThaiHeaven = { go, back, reset, routes: Object.keys(screenNames) };
}());
