/* ============================================================
   Thai HEAVEN — Prototype router & interactions
   Productionized from the supplied design prototype:
   - builds all JS-routed `.vw` views once
   - toggles `.active` instead of re-rendering whole screens
   - keeps `tweaks.js` / `#tweaks` out of production
   ============================================================ */
(function () {
  const screenNames = {
    splash: '01 · SPLASH / 18+',
    onboarding: '02 · ONBOARDING',
    'home-map': '03 · HOME · MAP',
    'search-input': '04 · SEARCH INPUT',
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
    splash: 1, onboarding: 1,
    'home-map': 2, search: 2, 'search-input': 2, category: 2, filter: 2,
    'venue-overview': 3, 'venue-roster': 3, 'venue-reviews': 3, line: 3, my: 3,
  };
  const routes = Object.keys(screenNames);
  const venues = [
    { id: 'lotus', rank: '1', name: 'Lotus Noir', area: 'Nana Plaza', type: 'Go-Go', rating: '4.6', price: '฿฿฿', tags: ['編集部', '日本語', 'LINE'], tone: '' },
    { id: 'velvet', rank: '2', name: 'Siam Velvet', area: 'Thonglor', type: 'Member P', rating: '4.4', price: '฿฿฿฿', tags: ['PR', '送迎', '個室'], tone: 'v2' },
    { id: 'mango', rank: '3', name: 'Mango Muse', area: 'Soi Cowboy', type: 'Karaoke', rating: '4.2', price: '฿฿', tags: ['明朗', '初心者'], tone: 'v3' },
  ];
  const girls = [
    ['Mai', 24, 158, 'JP/EN', '出勤中', ''],
    ['Ploy', 26, 162, 'JP/TH', '新人', 'v2'],
    ['Nana', 23, 155, 'EN', '出勤中', 'v3'],
    ['Fah', 27, 164, 'TH', '人気', 'v4'],
    ['Yui', 22, 156, 'JP', '出勤中', 'v2'],
    ['Dao', 25, 160, 'EN/TH', '本日休', 'v3'],
  ];

  let history = ['splash'];
  const views = {};
  let curName = 'splash';
  const selectedGirls = new Set();
  let toastT;

  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $all(s, ctx) { return Array.from((ctx || document).querySelectorAll(s)); }

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    buildApp();
    $all('.vw').forEach((v) => { views[v.dataset.view] = v; });
    show('splash');
    wireDelegatedEvents();
    updateRosterCta();
    setHint();
    const resetBtn = $('#resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', reset);
  }

  function buildApp() {
    const app = $('#app');
    app.innerHTML = `
      <div class="brand-tag"><div class="seal">天</div><div class="wm">Thai<em>HEAVEN</em></div></div>
      <div class="proto-label">MOBILE <b>APP</b></div>
      <div class="flow-rail">
        <div class="fr" data-phase="1"><div class="n">01</div><div><div class="lbl">ENTRY</div><div class="sub">gate / prefs</div></div></div>
        <div class="fr" data-phase="2"><div class="n">02</div><div><div class="lbl">EXPLORE</div><div class="sub">map / search</div></div></div>
        <div class="fr" data-phase="3"><div class="n">03</div><div><div class="lbl">COMMIT</div><div class="sub">venue / line</div></div></div>
      </div>
      <div class="device-wrap">
        <div class="phone"><div class="screen"><div class="viewport">
          ${splashView()}
          ${onboardingView()}
          ${homeMapView()}
          ${searchView('search')}
          ${searchView('search-input')}
          ${categoryView()}
          ${filterView()}
          ${venueOverviewView()}
          ${venueRosterView()}
          ${venueReviewsView()}
          ${lineView()}
          ${myView()}
        </div><div id="toast" class="toast"></div></div></div>
        <div class="hint"><span id="hintCur" class="cur">画面 <b>01 · SPLASH / 18+</b></span><button data-back>BACK</button><button id="resetBtn">RESET</button></div>
      </div>`;
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
      show(prev, { modalReturn: true });
    }
  }

  function reset() {
    history = ['splash'];
    Object.values(views).forEach((v) => v.classList.remove('active'));
    selectedGirls.clear();
    $all('.roster-grid .g.sel').forEach((g) => g.classList.remove('sel'));
    $('#mapSheet')?.classList.remove('expanded');
    onbStep(1);
    updateRosterCta();
    show('splash');
  }

  function setHint() {
    const el = $('#hintCur');
    if (el) el.innerHTML = '画面 <b>' + (screenNames[curName] || curName) + '</b>';
    $all('.flow-rail .fr').forEach((fr) => fr.classList.toggle('on', +fr.dataset.phase === phaseOf[curName]));
  }

  function wireDelegatedEvents() {
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !/input|textarea/i.test(e.target.tagName)) { e.preventDefault(); back(); }
      if (e.key === 'r' || e.key === 'R') reset();
    });
  }

  function onbStep(step) {
    if (step > 3) { go('home-map'); return; }
    $all('[data-onb-step]').forEach((s) => { s.style.display = +s.dataset.onbStep === step ? 'flex' : 'none'; });
    $all('.onb-prog .seg').forEach((seg, i) => seg.classList.toggle('on', i < step));
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
    const map = { overview: 'venue-overview', roster: 'venue-roster', reviews: 'venue-reviews', map: 'home-map' };
    if (map[tab]) go(map[tab]);
  }

  function toast(html) {
    const t = $('#toast');
    if (!t) return;
    t.innerHTML = html;
    t.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('show'), 1900);
  }

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

  function splashView() {
    return `<section class="vw" data-view="splash" data-screen-label="splash">${stb(true)}<div class="splash"><div class="seal-big">天</div><div class="wordmark">Thai<em>HEAVEN</em></div><div class="tag">BANGKOK NIGHTLIFE GUIDE</div><div class="gate"><h4>成人向け情報です</h4><p>タイのナイトライフ店舗を編集部キュレーションで案内します。18歳以上のみ入場してください。</p><div class="btns"><button class="btn yes" data-go="onboarding">ENTER</button><button class="btn no" data-exit>EXIT</button></div></div><div class="splash-foot">EDITORIAL ROUTE TO LINE</div></div></section>`;
  }

  function onboardingView() {
    return `<section class="vw" data-view="onboarding" data-screen-label="onboarding">${stb()}${mh(false)}<div class="onb" data-scroll><div class="onb-prog"><span class="seg on"></span><span class="seg"></span><span class="seg"></span></div>${onbGenreStep()}${onbAreaStep()}${onbNotifyStep()}<div class="onb-foot"><button class="next-btn" data-onb-next="2">NEXT →</button><button class="skip" data-go="home-map">スキップ</button></div></div></section>`;
  }
  function onbGenreStep() {
    const xs = [['ゴーゴー', 'GO-GO', 'ステージ中心'], ['マッサージ', 'MASSAGE', '深夜リラックス'], ['置屋', 'PARLOR', '編集部確認'], ['カラオケ', 'KTV', '個室/団体'], ['メンバーP', 'MEMBER', '高級ライン'], ['クラブ', 'CLUB', '音楽/PR']];
    return `<div data-onb-step="1" style="display:flex;flex-direction:column;gap:12px"><h3>関心ジャンル<em>SELECT</em></h3><p class="sub">複数選択できます。</p><div class="cats">${xs.map((x, i) => `<button class="cat ${i < 2 ? 'on' : ''}"><span class="nm">${x[0]}</span><span class="en">${x[1]}</span><span class="desc">${x[2]}</span><span class="check">✓</span></button>`).join('')}</div><button class="next-btn" data-onb-next="2">NEXT →</button></div>`;
  }
  function onbAreaStep() {
    return `<div data-onb-step="2" style="display:none;flex-direction:column;gap:12px"><h3>エリア<em>AREA</em></h3><p class="sub">よく行くエリアをtealで選択。</p><div class="area-grid">${['Nana', 'Soi Cowboy', 'Thonglor', 'Patpong'].map((a, i) => `<button class="ar ${i === 0 ? 'on' : ''}"><span class="nm">${a}</span><span class="en">ZONE ${i + 1}</span><span class="ct">${12 + i * 3} venues</span><span class="check">✓</span></button>`).join('')}</div><button class="next-btn" data-onb-next="3">NEXT →</button><button class="skip" data-onb-next="1">戻る</button></div>`;
  }
  function onbNotifyStep() {
    return `<div data-onb-step="3" style="display:none;flex-direction:column;gap:12px"><h3>通知<em>PUSH</em></h3><p class="sub">LINE送客前の新着情報だけ受け取ります。</p><div class="notify-card"><button class="nrow"><div class="txt"><b>編集部ピック速報</b><small>新着PR/限定情報</small></div><span class="toggle on"></span></button><button class="nrow"><div class="txt"><b>近くのおすすめ</b><small>現在地周辺の営業中店舗</small></div><span class="toggle"></span></button></div><button class="next-btn" data-onb-next="4">START →</button><button class="skip" data-onb-next="2">戻る</button></div>`;
  }

  function homeMapView() {
    return `<section class="vw" data-view="home-map" data-screen-label="home-map">${stb()}<div class="mbody"><div class="mmap"><span class="city" style="left:36px;top:116px">NANA</span><span class="city" style="right:28px;top:220px">SOI COWBOY</span><span class="city" style="left:74px;bottom:128px">THONGLOR</span><button class="pin" style="left:150px;top:160px" data-go="venue-overview"><span class="num">1</span></button><button class="pin teal" style="right:60px;bottom:178px" data-go="venue-overview"><span class="num">2</span></button><button class="pin gold" style="left:58px;bottom:210px" data-go="venue-overview"><span class="num">PR</span></button><i class="me" style="left:155px;top:288px"></i><button class="map-search" data-go="search"><span class="ic">⌕</span> Soi Cow</button><div class="map-filters"><button class="ch on">出勤中</button><button class="ch">日本語OK</button><button class="ch">฿฿</button><button class="ch" data-go="filter">＋絞り込み</button></div><section id="mapSheet" class="sheet"><button class="handle" data-sheet-toggle></button><button class="ttl" data-sheet-toggle>編集部推薦 12件 <span class="more">MORE</span></button><div class="stats"><div class="b"><div class="n">4.6</div><div class="l">平均★</div></div><div class="b"><div class="n">38</div><div class="l">在籍</div></div><div class="b"><div class="n">03</div><div class="l">深夜</div></div></div><div class="toolbar"><button class="ch on">近い順</button><button class="ch">評価順</button><span class="right">EDITOR PICKS</span></div><div class="list" data-scroll>${venues.map(sheetItem).join('')}</div></section></div></div>${mbottom('home-map')}</section>`;
  }

  function searchView(name) {
    return `<section class="vw" data-view="${name}" data-screen-label="${name}">${stb()}<div class="search-bar-big"><button class="back" data-back>‹</button><button class="field" data-go="search-input"><span class="ic">⌕</span><span class="typed">Soi Cow</span><span class="cursor"></span></button></div><div class="sresults" data-scroll><div class="sec"><div class="l">VENUE</div>${venues.map((v) => `<button class="sug" data-go="venue-overview"><span class="ic">店</span><span class="nm"><em>${v.name}</em><small>${v.area} / ${v.type}</small></span><span class="ar">›</span></button>`).join('')}</div><div class="sec"><div class="l">AREA</div>${['Nana', 'Soi Cowboy', 'Thonglor'].map((a) => `<button class="sug" data-go="category"><span class="ic">地</span><span class="nm">${a}<small>カテゴリ一覧へ</small></span><span class="ar">›</span></button>`).join('')}</div><div class="sec"><div class="l">RECENT</div><div class="recent"><span class="tg">日本語OK <span class="x">×</span></span><span class="tg">明朗会計 <span class="x">×</span></span></div></div></div></section>`;
  }

  function categoryView() {
    return `<section class="vw" data-view="category" data-screen-label="category">${stb()}<div class="cat-hero-mini"><button class="back" data-back>‹</button><div class="ttl">ゴーゴーバー<em>GO-GO</em></div><div class="meta"><span class="n">18</span>venues</div></div><div class="cat-filters"><button class="ch on" data-chip>Nana <span class="x">×</span></button><button class="ch on" data-chip>日本語OK <span class="x">×</span></button><button class="ch" data-go="filter">＋条件</button></div><div class="lscroll" data-scroll>${vitem(venues[0])}<div class="ad-inline"><span class="label">PR</span><b>SIAM VELVET</b><small>編集部タイアップ枠 / 条件確認済み</small></div>${venues.slice(1).map(vitem).join('')}</div>${mbottom('category')}</section>`;
  }

  function filterView() {
    return `<section class="vw is-modal" data-view="filter" data-screen-label="filter"><div class="scrim" data-back></div><section class="filter-sheet"><div class="handle"></div><div class="hd"><h4>絞り込み</h4><button class="reset" data-demo="リセットしました">リセット</button></div><div class="body" data-scroll><div class="group"><div class="l">AREA</div><div class="pills">${['Nana', 'Soi Cowboy', 'Thonglor', 'Patpong'].map((a, i) => `<button class="ch ${i === 0 ? 'on' : ''}" data-chip>${a}</button>`).join('')}</div></div><div class="group"><div class="l">FEATURE</div><div class="pills">${['日本語OK', '出勤中', '明朗会計', '送迎', 'カード可'].map((f, i) => `<button class="ch ${i < 2 ? 'on' : ''}" data-chip>${f}</button>`).join('')}</div></div><div class="group"><div class="l">PRICE</div><div class="range"><div class="b"><span class="v">฿฿</span><span class="k">MIN</span></div><div class="b"><span class="v">฿฿฿฿</span><span class="k">MAX</span></div></div><div class="slider"><i class="track" style="left:22%;right:24%"></i><i class="knob" style="left:20%"></i><i class="knob" style="right:20%"></i></div></div><div class="group"><div class="l">RATING</div><div class="pills"><button class="ch on" data-chip>4.0+</button><button class="ch" data-chip>4.3+</button><button class="ch" data-chip>4.5+</button></div></div></div><div class="apply"><button class="b" data-back>12件で絞り込む</button></div></section></section>`;
  }

  function venueHeader(active) {
    return `${stb(true)}<div class="v-hero"><button class="back-btn" data-back>‹</button><div class="actions"><button class="a saved" data-save-toggle>♥</button><button class="a" data-demo="共有しました">↗</button></div><div class="badge">編集部<em>PICK</em></div><span class="counter">1/8</span></div><div class="v-info"><div class="area">NANA PLAZA / GO-GO</div><h2>Lotus Noir<em>4.6</em></h2><div class="meta"><span class="star">★★★★★ <b>4.6</b></span><span>฿฿฿</span><span>日本語OK</span></div></div><nav class="v-tabs">${[['overview', '概要'], ['roster', '在籍'], ['reviews', '口コミ'], ['map', '地図']].map(([id, label]) => `<button class="tb ${active === id ? 'on' : ''}" data-vtab="${id}">${label}</button>`).join('')}</nav>`;
  }
  function venueOverviewView() {
    return `<section class="vw" data-view="venue-overview" data-screen-label="venue-overview">${venueHeader('overview')}<div class="v-content" data-scroll><div class="v-spec">${[['営業', '19:00-03:00'], ['在籍', '38名'], ['予算', '฿2,000〜'], ['バーF', '確認制'], ['言語', '日本語/英語'], ['支払', 'Cash / Card']].map(([k, v]) => `<div class="k">${k}</div><div class="v">${v}</div>`).join('')}</div><div class="editors-note"><div class="l">EDITOR NOTE</div>初回でも迷いにくい、王道の一軒。入口で希望を伝えやすく、LINEテンプレで料金確認を残せます。</div></div>${lineCta()}</section>`;
  }
  function venueRosterView() {
    return `<section class="vw" data-view="venue-roster" data-screen-label="venue-roster">${venueHeader('roster')}<div class="roster-filter"><span class="l">FILTER</span><button class="ch on">全員</button><button class="ch">出勤中</button><button class="ch">日本語</button><button class="ch">年齢</button></div><div class="roster-grid" data-scroll>${girls.map((g) => `<button class="g ${g[5]}" data-girl="${g[0]}"><div class="ph"></div><span class="badge">${g[4]}</span><span class="lang">${g[3]}</span><span class="selmark">✓</span><div class="nameplate"><span class="nm">${g[0]} / ${g[1]}</span><span class="meta">${g[2]}cm · ${g[3]}</span></div></button>`).join('')}</div>${lineCta('<span id="rosterCtaBtn">▶ 嬢を選択</span>', '<span id="rosterCtaSub">嬢を選んで送信</span>')}</section>`;
  }
  function venueReviewsView() {
    return `<section class="vw" data-view="venue-reviews" data-screen-label="venue-reviews">${venueHeader('reviews')}<div class="rev-summary"><div class="big"><span class="n">4.6</span><span class="star">★★★★★</span><span class="ct">128 reviews</span></div><div class="bars">${['接客', '明朗会計', '嬢レベル', 'コスパ'].map((k, i) => `<div class="b"><span class="k">${k}</span><span class="bar"><i style="width:${88 - i * 8}%"></i></span><span class="v">${(4.7 - i * .1).toFixed(1)}</span></div>`).join('')}</div></div><div class="rev-list" data-scroll>${['初訪問でも説明が明確で安心。', '指名の確認がLINEに残るのが便利。'].map((t, i) => `<article class="rev-item"><div class="hd"><span class="av">${i + 1}</span><span class="nm">${i ? 'Bangkok 3回目' : '初タイ旅行'}<small>訪問 ${i + 1}回</small></span><span class="stars">★★★★★</span></div><div class="body">${t}</div><div class="footer-r"><span class="ed-reply">EDITOR REPLY</span><span>料金確認は入店前に。</span></div></article>`).join('')}</div>${lineCta('＋書く', '口コミ投稿')}</section>`;
  }

  function lineView() {
    return `<section class="vw" data-view="line" data-screen-label="line">${stb()}<div class="line-screen"><div class="line-hdr"><button class="back" data-back>‹</button><div class="ic-acct">天</div><div class="nm"><b>Thai Heaven 編集部</b><small>online</small></div></div><div id="lineChat" class="line-chat" data-scroll><div class="bubble">Thai Heaven編集部です。店舗へ送るテンプレを確認してください。</div><div class="bubble template"><div class="hd">AUTO TEMPLATE</div><div class="ln"><b>店舗:</b> Lotus Noir<br><b>日時:</b> 今夜 22:00<br><b>人数:</b> 2名<br><b>指名:</b> Mai / Ploy<br><b>予算:</b> ฿฿฿<br><b>備考:</b> 日本語スタッフ希望</div></div></div><div class="quick-chips"><button class="q">空席確認</button><button class="q">日本語スタッフ</button><button class="q">送迎</button><button class="q">領収書</button></div><div class="line-compose"><span class="field">メッセージを入力</span><button class="send">➤</button></div></div></section>`;
  }
  function myView() {
    return `<section class="vw" data-view="my" data-screen-label="my">${stb()}${mh()}<div class="my-head"><div class="avatar">天</div><div class="nm">Guest Editor<em>VIP</em></div><div class="sub">saved / history / reviews</div><div class="stats"><div class="s"><span class="n">1</span><span class="l">保存</span></div><div class="s"><span class="n">2</span><span class="l">予約</span></div><div class="s"><span class="n">1</span><span class="l">口コミ</span></div></div></div><div class="my-tabs"><button class="tb on">保存</button><button class="tb">履歴</button><button class="tb">口コミ</button><button class="tb">設定</button></div><div class="save-list" data-scroll><div class="ttl-grp">行く予定</div>${venues.map(vitem).join('')}</div>${mbottom('my')}</section>`;
  }

  function lineCta(title, sub) {
    return `<div class="v-sticky-cta"><div class="lf"><span class="l">LINE HANDOFF</span><span class="b">${title || 'LINEで店舗に送る'}</span></div><button class="btn" data-go="line">${sub || '自動入力テンプレを確認'}</button></div>`;
  }
  function mbottom(active) {
    return `<nav class="mbottom"><button class="item ${active === 'home-map' ? 'on' : ''}" data-nav="home-map"><span class="ic">地</span>MAP</button><button class="item ${active === 'category' ? 'on' : ''}" data-nav="category"><span class="ic">分</span>CAT</button><button class="item" data-demo="保存リスト"><span class="ic">♡</span>SAVE</button><button class="item ${active === 'my' ? 'on' : ''}" data-nav="my"><span class="ic">我</span>MY</button></nav>`;
  }
  function mh(backBtn = true) {
    return `<div class="mh">${backBtn ? '<button class="ic-btn" data-back>⌫</button>' : ''}<div class="logo"><div class="seal">天</div><div class="name">Thai<em>HEAVEN</em></div></div><div class="right"><button class="ic-btn" data-demo="保存しました">♡</button><button class="ic-btn" data-demo="共有しました">↗</button></div></div>`;
  }
  function stb(dark = false) { return `<div class="stb ${dark ? 'dark' : ''}"><span>21:08</span><span class="right">5G 84%</span></div>`; }
  function ph(v) { return `<div class="ph ${v.tone}"><span class="r r${v.rank}">${v.rank}</span></div>`; }
  function sheetItem(v) { return `<button class="item" data-go="venue-overview">${ph(v)}<div class="info"><b>${v.name}</b><div class="meta">${v.area} · ${v.type}</div><div class="tags">${v.tags.map((t) => `<span class="tg">${t}</span>`).join('')}</div><div class="stars">★★★★★ <b>${v.rating}</b></div></div><span class="cta">LINE</span></button>`; }
  function vitem(v) { return `<button class="vitem" data-go="venue-overview">${ph(v)}<div class="info"><b>${v.name}</b><div class="area">${v.area} / ${v.type}</div><div class="stars">★★★★★ <b>${v.rating}</b></div><div class="tags">${v.tags.map((t) => `<span class="tg">${t}</span>`).join('')}</div></div><div class="price-cta"><div class="p">${v.price}<small>目安</small></div><span class="cta">LINE</span></div></button>`; }

  window.__onbStep = onbStep;
  window.ThaiHeaven = { routes, go, back, reset };
}());
