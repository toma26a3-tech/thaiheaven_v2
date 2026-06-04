const ROUTES = ['splash','onboarding','home-map','search','search-input','category','filter','venue-overview','venue-roster','venue-reviews','line','my'];
const state = {
  ageVerified: false,
  interests: ['gogo', 'karaoke'],
  areas: ['Nana'],
  notifyPrefs: { editorPick: true, nearby: false },
  currentView: 'splash',
  history: [],
  onbStep: 1,
  savedVenues: ['lotus'],
  venueTab: 'overview',
  mapSheetExpanded: false,
  selectedGirls: new Set(['mai', 'ploy']),
  lineThread: [
    { who: 'shop', text: 'Thai Heaven編集部です。店舗へ送る内容を確認してください。' },
    { who: 'me', text: '店舗: Lotus Noir\n日時: 今夜 22:00\n人数: 2名\n指名: Mai, Ploy\n予算: ฿฿฿\n備考: 日本語スタッフ希望' },
  ],
  searchQuery: 'Soi Cow',
  filters: { area: ['Nana', 'Soi Cowboy'], features: ['日本語OK', '出勤中'], priceRange: '฿฿-฿฿฿', minRating: 4.0 },
};

const venues = [
  { id: 'lotus', name: 'Lotus Noir', category: 'Go-Go Bar', area: 'Nana Plaza', rating: 4.6, price: '฿฿฿', girls: 38, tags: ['編集部ピック', '日本語OK', 'LINE可'], hours: '19:00-03:00', budget: '฿2,000〜', barFine: '確認制', pay: 'Cash / Card' },
  { id: 'velvet', name: 'Siam Velvet', category: 'Member Parlor', area: 'Thonglor', rating: 4.4, price: '฿฿฿฿', girls: 24, tags: ['PR', '送迎相談', '個室'], hours: '20:00-02:00', budget: '฿4,000〜', barFine: '店舗相談', pay: 'Cash' },
  { id: 'mango', name: 'Mango Muse', category: 'Karaoke', area: 'Soi Cowboy', rating: 4.2, price: '฿฿', girls: 31, tags: ['明朗会計', '初心者向け'], hours: '18:00-02:30', budget: '฿1,500〜', barFine: 'なし', pay: 'Cash / QR' },
];
const girls = [
  { id: 'mai', name: 'Mai', age: 24, height: 158, lang: 'JP/EN', badge: '出勤中', tone: 'v1' },
  { id: 'ploy', name: 'Ploy', age: 26, height: 162, lang: 'JP/TH', badge: '新人', tone: 'v2' },
  { id: 'nana', name: 'Nana', age: 23, height: 155, lang: 'EN', badge: '出勤中', tone: 'v3' },
  { id: 'fah', name: 'Fah', age: 27, height: 164, lang: 'TH', badge: '人気', tone: 'v1' },
  { id: 'yui', name: 'Yui', age: 22, height: 156, lang: 'JP', badge: '出勤中', tone: 'v2' },
  { id: 'dao', name: 'Dao', age: 25, height: 160, lang: 'EN/TH', badge: '本日休', tone: 'v3' },
];
const genreCards = [['gogo','ゴーゴー'], ['massage','マッサージ'], ['parlor','置屋'], ['karaoke','カラオケ'], ['member','メンバーP'], ['club','クラブ']];
const areaCards = ['Nana', 'Soi Cowboy', 'Thonglor', 'Patpong'];
const categories = [['ゴーゴーバー', '18件', 'ステージ・短時間'], ['マッサージ', '22件', '深夜リラックス'], ['置屋', '9件', '編集部確認済み'], ['カラオケ', '12件', '個室・団体'], ['メンバーP', '6件', '高級ライン'], ['PR枠', '広告', '店舗プロモーション']];

const app = document.getElementById('app');
const selectedNames = () => girls.filter((girl) => state.selectedGirls.has(girl.id)).map((girl) => girl.name);
const route = (view, push = true) => {
  if (!ROUTES.includes(view)) return toast(`未定義ビュー: ${view}`);
  if (push) state.history.push(state.currentView);
  state.currentView = view;
  state.venueTab = view.replace('venue-', '') || state.venueTab;
  render();
};
const back = () => route(state.history.pop() || 'home-map', false);
const reset = () => { state.currentView = 'splash'; state.history = []; state.onbStep = 1; state.mapSheetExpanded = false; render(); };
const toggleIn = (list, value) => list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
const toast = (html) => { const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = html; app.append(el); setTimeout(() => el.remove(), 1900); };

function frame(content, modal = '') {
  const nav = ['home-map', 'category', 'my'].includes(state.currentView) ? bottomNav() : '';
  return `<div class="device"><div class="safe"><div class="status"><span>21:08</span><b>Thai Heaven</b><span>5G</span></div>${content}${nav}${modal}</div></div>`;
}
function view(id, label, body, extra = '') { return `<section class="vw ${extra}" data-view="${id}" data-screen-label="${id}" aria-label="${label}">${body}</section>`; }
function top(title, sub = '編集部キュレーション') { return `<header class="top"><button class="stamp mini" data-back>⌫</button><div><p class="mono">${sub}</p><h1>${title}</h1></div><button class="stamp mini" data-demo="共有しました">↗</button></header>`; }
function ph(tone = 'v1', text = '') { return `<div class="ph ${tone}"><span>${text}</span></div>`; }

function splash() {
  return view('splash', '01 splash', `<div class="splash-art"><div class="seal">天</div><p class="mono">BANGKOK NIGHTLIFE GUIDE</p><h1>Thai<br>Heaven</h1></div><div class="gate"><p class="kicker">18+ AGE GATE</p><h2>成人向けナイトライフ情報を表示します</h2><p>各国法令・店舗ルールを確認し、自己責任で利用してください。</p><button class="cta" data-age>同意して入る</button><button class="ghost" data-exit>退出</button></div>`, 'splash');
}
function onboarding() {
  const step = state.onbStep;
  const body = `<div class="onb-head"><p class="mono">STEP ${step}/3</p><div class="segments">${[1,2,3].map((n) => `<i class="seg ${n <= step ? 'on' : ''}"></i>`).join('')}</div></div>${step === 1 ? onbGenres() : step === 2 ? onbAreas() : onbNotify()}<footer class="onb-actions"><button class="ghost" data-onb="${step === 1 ? 'skip' : 'prev'}">${step === 1 ? 'スキップ' : '戻る'}</button><button class="cta" data-onb="${step === 3 ? 'finish' : 'next'}">${step === 3 ? 'はじめる' : '次へ'}</button></footer>`;
  return view('onboarding', '02 onboarding', body);
}
function onbGenres() { return `<h1>関心ジャンル</h1><p class="lead">複数選択できます。選択チップは朱地+チェックで反映します。</p><div class="card-grid">${genreCards.map(([id, label]) => `<button class="pick ${state.interests.includes(id) ? 'sel' : ''}" data-chip="interest:${id}"><b>${label}</b><span>${state.interests.includes(id) ? '✓' : '+'}</span></button>`).join('')}</div>`; }
function onbAreas() { return `<h1>行きたいエリア</h1><p class="lead">エリア選択はtealで強調します。</p><div class="card-grid">${areaCards.map((area) => `<button class="pick area ${state.areas.includes(area) ? 'sel' : ''}" data-chip="area:${area}"><b>${area}</b><span>${state.areas.includes(area) ? '✓' : '+'}</span></button>`).join('')}</div>`; }
function onbNotify() { return `<h1>通知設定</h1><p class="lead">編集部ピックと近くのおすすめだけを通知します。</p>${[['editorPick','編集部ピック速報'], ['nearby','近くのおすすめ']].map(([key,label]) => `<label class="switch-row"><span>${label}</span><input type="checkbox" data-notify="${key}" ${state.notifyPrefs[key] ? 'checked' : ''}></label>`).join('')}`; }

function homeMap() {
  const sheetClass = state.mapSheetExpanded ? 'expanded' : '';
  return view('home-map', '03 home-map', `<div class="map-top"><button class="search-pill" data-go="search">⌕ Soi Cow</button><button class="stamp" data-go="filter">絞</button></div><div class="chips"><button>出勤中</button><button>日本語OK</button><button>฿฿</button><button>編集部</button></div><div class="map-canvas"><span class="city nana">NANA</span><span class="city cowboy">SOI COWBOY</span><span class="city thonglor">THONGLOR</span><button class="pin hot" data-go="venue-overview">天</button><button class="pin teal" data-go="venue-overview">酒</button><button class="pin gold" data-go="venue-overview">PR</button><i class="me"></i></div><section id="mapSheet" class="map-sheet ${sheetClass}"><button class="handle" data-sheet><span></span><b>編集部推薦 12件</b></button><div class="sheet-more"><div class="stats"><b>4.6★<small>平均</small></b><b>38<small>在籍</small></b><b>03:00<small>深夜</small></b></div><div class="toolbar"><span>近い順</span><button data-go="filter">＋条件</button></div>${venueList()}</div></section>`);
}
function venueList() { return `<div class="venue-list">${venues.map((venue, index) => `<button class="venue-row" data-go="venue-overview">${ph(index === 1 ? 'v2' : index === 2 ? 'v3' : 'v1', venue.name[0])}<div><p class="mono">${venue.area} / ${venue.category}</p><h3>${venue.name}</h3><span>★${venue.rating} · ${venue.price} · ${venue.tags.join(' / ')}</span></div></button>`).join('')}</div>`; }
function search() { return view('search', '05 search', `${top('検索', 'SEARCH')}<button class="searchbar active" data-go="search-input">⌕ <span>${state.searchQuery}</span><i></i></button><h2>店舗候補</h2>${venueList()}<h2>エリア候補</h2><div class="chips big">${areaCards.map((area) => `<button data-go="category">${area}</button>`).join('')}</div><h2>最近の検索</h2><div class="chips big"><button>日本語OK</button><button>明朗会計</button><button>送迎</button></div>`); }
function searchInput() { return view('search-input', '04 search-input', `${top('検索入力中', 'MODAL-LIKE')}<label class="searchbar input">⌕ <input value="${state.searchQuery}" autofocus></label><p class="lead">入力中の候補を即時表示する想定です。</p>${venueList()}`); }
function category() { return view('category', '06 category', `${top('カテゴリ一覧', 'CATEGORY')}<div class="cat-hero"><p class="mono">GO-GO / MASSAGE / KARAOKE</p><h1>夜の目的から探す</h1><span>適用中: ${state.filters.area.join('・')} <button data-go="filter">＋</button></span></div><div class="filter-tags">${state.filters.features.map((tag) => `<button data-filter-remove="${tag}">${tag} ×</button>`).join('')}</div><div class="cat-list">${categories.map(([name,count,desc], i) => i === 4 ? `<article class="ad-inline"><p>PR</p><b>Siam Velvet</b><span>編集部タイアップ枠 / 条件確認済み</span></article><button class="cat-row" data-go="venue-overview"><b>${name}</b><span>${count}</span><small>${desc}</small></button>` : `<button class="cat-row" data-go="venue-overview"><b>${name}</b><span>${count}</span><small>${desc}</small></button>`).join('')}</div>`); }
function filterModal() { return view('filter', '07 filter', `${top('絞り込み', 'FILTER')}<div class="filter-sheet"><h2>エリア</h2><div class="chips big">${areaCards.map((area) => `<button class="${state.filters.area.includes(area) ? 'on' : ''}" data-filter-area="${area}">${area}</button>`).join('')}</div><h2>特徴</h2><div class="chips big">${['日本語OK','出勤中','明朗会計','送迎','カード可'].map((item) => `<button class="${state.filters.features.includes(item) ? 'on' : ''}" data-filter-feature="${item}">${item}</button>`).join('')}</div><h2>価格</h2><div class="price-slider"><i></i><b></b><b></b></div><h2>評価</h2><div class="chips big"><button class="on">4.0+</button><button>4.3+</button><button>4.5+</button></div><button class="cta" data-back>12件で絞り込む</button><button class="ghost" data-reset-filter>リセット</button></div>`, 'modal'); }

function venueShell(inner, active = 'overview') {
  return `${top('Lotus Noir', 'NANA PLAZA')}<div class="hero">${ph('v1', '天')}<div class="badge">編集部ピック</div><button class="save ${state.savedVenues.includes('lotus') ? 'on' : ''}" data-save-toggle>♥</button><button class="share" data-demo="共有しました">↗</button><span class="counter">1/8</span></div><div class="venue-title"><h1>Lotus Noir</h1><p>Nana Plaza · ★4.6 · ${venues[0].price}</p></div><nav class="venue-tabs">${[['overview','概要','venue-overview'],['roster','在籍','venue-roster'],['reviews','口コミ','venue-reviews'],['map','地図','home-map']].map(([id,label,viewId]) => `<button class="${active === id ? 'on' : ''}" data-vtab="${viewId}" data-go="${viewId}">${label}</button>`).join('')}</nav>${inner}<button class="line-cta" data-go="line">LINEで店舗に送る</button>`;
}
function venueOverview() { const venue = venues[0]; return view('venue-overview', '08 venue-overview', venueShell(`<div class="specs">${[['営業',venue.hours],['在籍',`${venue.girls}名`],['予算',venue.budget],['バーF',venue.barFine],['言語','日本語/英語'],['支払',venue.pay]].map(([k,v]) => `<span><b>${k}</b><em>${v}</em></span>`).join('')}</div><article class="note"><p class="kicker">編集部ノート</p><h2>初回でも迷いにくい、王道の一軒。</h2><p>入口で希望を伝えやすく、料金確認もLINEテンプレで残せる。週末は22時前の連絡推奨。</p></article>`, 'overview')); }
function venueRoster() { return view('venue-roster', '09 venue-roster', venueShell(`<div class="chips"><button>全員</button><button>出勤中</button><button>日本語</button><button>年齢</button></div><div class="girl-grid">${girls.map((girl) => `<button class="girl ${state.selectedGirls.has(girl.id) ? 'sel' : ''}" data-girl="${girl.id}">${ph(girl.tone, girl.name[0])}<span class="badge2">${girl.badge}</span><b>${girl.name} / ${girl.age}</b><small>${girl.height}cm · ${girl.lang}</small><i>${state.selectedGirls.has(girl.id) ? '✓' : '+'}</i></button>`).join('')}</div><button class="roster-cta" data-go="line">▶ ${state.selectedGirls.size}名でLINE <small>${selectedNames().join(' / ') || '未選択'}</small></button>`, 'roster')); }
function venueReviews() { return view('venue-reviews', '10 venue-reviews', venueShell(`<div class="review-summary"><b>4.6</b>${['接客','明朗会計','嬢のレベル','コスパ'].map((label, i) => `<span>${label}<i style="width:${88 - i * 9}%"></i></span>`).join('')}</div>${['初訪問でも説明が明確で安心。', '指名の確認がLINEに残るのが便利。'].map((text, i) => `<article class="review"><div class="avatar">${i + 1}</div><div><p><b>${i ? 'Bangkok 3回目' : '初タイ旅行'}</b> · ★★★★★</p><p>${text}</p><small>編集部返信: 料金確認は必ず入店前に。</small></div></article>`).join('')}<button class="ghost full" data-demo="口コミ投稿はデモです">＋書く</button>`, 'reviews')); }
function line() { return view('line', '11 line', `${top('LINE 引き継ぎ', 'ONLINE')}<div class="line-ui"><div class="line-head"><b>Thai Heaven 編集部</b><span>online</span></div><div class="bubbles">${state.lineThread.map((msg) => `<p class="bubble ${msg.who}">${msg.text.replaceAll('\n','<br>')}</p>`).join('')}</div><div class="quick-replies">${['空席確認','日本語スタッフ','送迎','領収書'].map((text) => `<button data-line-chip="${text}">${text}</button>`).join('')}</div></div>`); }
function my() { return view('my', '12 my', `${top('マイ', 'SAVED / HISTORY')}<div class="profile"><div class="avatar">天</div><div><h1>Guest Editor</h1><p>保存 ${state.savedVenues.length} · 予約 2 · 口コミ 1</p></div></div><div class="my-tabs"><button class="on">保存</button><button>履歴</button><button>口コミ</button><button>設定</button></div><h2>行く予定</h2>${venueList()}<h2>気になる</h2><button class="venue-row" data-go="venue-overview">${ph('v2', '酒')}<div><p class="mono">Thonglor / Member Parlor</p><h3>Siam Velvet</h3><span>PR · 送迎相談</span></div></button>`); }
function bottomNav() { return `<nav class="bottom-nav"><button class="${state.currentView === 'home-map' ? 'on' : ''}" data-nav="home-map">地図</button><button class="${state.currentView === 'category' ? 'on' : ''}" data-nav="category">カテゴリ</button><button data-demo="保存リストを表示">保存</button><button class="${state.currentView === 'my' ? 'on' : ''}" data-nav="my">マイ</button></nav>`; }

const renderers = { splash, onboarding, 'home-map': homeMap, search, 'search-input': searchInput, category, filter: filterModal, 'venue-overview': venueOverview, 'venue-roster': venueRoster, 'venue-reviews': venueReviews, line, my };
function render() {
  app.innerHTML = frame(renderers[state.currentView]());
  bind();
}
function bind() {
  document.querySelectorAll('[data-go]').forEach((el) => el.addEventListener('click', () => route(el.dataset.go)));
  document.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', () => route(el.dataset.nav)));
  document.querySelectorAll('[data-back]').forEach((el) => el.addEventListener('click', back));
  document.querySelectorAll('[data-age]').forEach((el) => el.addEventListener('click', () => { state.ageVerified = true; route('onboarding'); }));
  document.querySelectorAll('[data-exit]').forEach((el) => el.addEventListener('click', () => toast('デモ: OSホームへ戻る想定です')));
  document.querySelectorAll('[data-demo]').forEach((el) => el.addEventListener('click', () => toast(el.dataset.demo)));
  document.querySelectorAll('[data-onb]').forEach((el) => el.addEventListener('click', () => { const action = el.dataset.onb; if (action === 'finish' || action === 'skip') return route('home-map'); state.onbStep += action === 'next' ? 1 : -1; render(); }));
  document.querySelectorAll('[data-chip]').forEach((el) => el.addEventListener('click', () => { const [kind, value] = el.dataset.chip.split(':'); state[kind === 'interest' ? 'interests' : 'areas'] = toggleIn(state[kind === 'interest' ? 'interests' : 'areas'], value); render(); }));
  document.querySelectorAll('[data-notify]').forEach((el) => el.addEventListener('change', () => { state.notifyPrefs[el.dataset.notify] = el.checked; }));
  document.querySelectorAll('[data-sheet]').forEach((el) => el.addEventListener('click', () => { state.mapSheetExpanded = !state.mapSheetExpanded; render(); }));
  document.querySelectorAll('[data-girl]').forEach((el) => el.addEventListener('click', () => { const id = el.dataset.girl; state.selectedGirls.has(id) ? state.selectedGirls.delete(id) : state.selectedGirls.add(id); render(); }));
  document.querySelectorAll('[data-save-toggle]').forEach((el) => el.addEventListener('click', () => { state.savedVenues = toggleIn(state.savedVenues, 'lotus'); render(); toast(state.savedVenues.includes('lotus') ? '保存しました' : '保存を解除しました'); }));
  document.querySelectorAll('[data-filter-area]').forEach((el) => el.addEventListener('click', () => { state.filters.area = toggleIn(state.filters.area, el.dataset.filterArea); render(); }));
  document.querySelectorAll('[data-filter-feature]').forEach((el) => el.addEventListener('click', () => { state.filters.features = toggleIn(state.filters.features, el.dataset.filterFeature); render(); }));
  document.querySelectorAll('[data-filter-remove]').forEach((el) => el.addEventListener('click', () => { state.filters.features = state.filters.features.filter((item) => item !== el.dataset.filterRemove); render(); }));
  document.querySelectorAll('[data-reset-filter]').forEach((el) => el.addEventListener('click', () => { state.filters = { area: [], features: [], priceRange: 'any', minRating: 0 }; render(); }));
  document.querySelectorAll('[data-line-chip]').forEach((el) => el.addEventListener('click', () => addLineReply(el.dataset.lineChip)));
}
function addLineReply(text) {
  state.lineThread.push({ who: 'me', text });
  render();
  setTimeout(() => { const replies = { '空席確認': '22:00は2名席あり。指名は入店前に再確認します。', '日本語スタッフ': '日本語スタッフは21:30以降にいます。', '送迎': '送迎はエリア次第で相談可能です。', '領収書': '領収書は店舗名義で発行可否を確認します。' }; state.lineThread.push({ who: 'shop', text: replies[text] || '確認します。' }); render(); }, 700);
}

document.addEventListener('keydown', (event) => { if (event.key === 'Backspace') back(); if (event.key.toLowerCase() === 'r') reset(); });
render();
window.ThaiHeaven = { ROUTES, state, go: route, back, reset };
