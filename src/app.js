const ROUTES = ['splash','onboarding','home-map','search','category','filters','venue','venue-roster','profile','line','booking','confirmation'];
const state = { screen: 'splash', history: [], selected: ['mai', 'ploy'], tab: 'overview', hot: '#ff2fb2' };
const venues = [
  { name: 'Lotus Noir', type: 'Go-Go Bar', area: 'Nana Plaza', score: '4.8', dist: '0.4 km', tags: ['Open now', 'English OK'] },
  { name: 'Siam Velvet', type: 'Gentlemen Club', area: 'Thonglor', score: '4.7', dist: '2.1 km', tags: ['Reservation', 'Bottle set'] },
  { name: 'Mango Muse', type: 'Beer Bar', area: 'Soi Cowboy', score: '4.6', dist: '1.2 km', tags: ['Walk-in', 'Live DJ'] },
];
const roster = [
  { id: 'mai', name: 'Mai', age: 24, style: 'Playful host', lang: 'TH / EN', rate: 'VIP', accent: '#ff4fd8' },
  { id: 'ploy', name: 'Ploy', age: 26, style: 'Elegant talker', lang: 'TH / JP', rate: 'Popular', accent: '#ffb000' },
  { id: 'nana', name: 'Nana', age: 23, style: 'Dance floor', lang: 'TH / EN', rate: 'New', accent: '#28e0ff' },
  { id: 'fah', name: 'Fah', age: 27, style: 'VIP room', lang: 'TH / CN', rate: 'Top', accent: '#8a5cff' },
];
const categories = [
  ['Go-Go', 'High energy stages', '18 venues'], ['Karaoke', 'Private rooms', '12 venues'], ['Clubs', 'Bottle service', '9 venues'],
  ['Massage', 'After-hours relax', '22 venues'], ['Beer Bars', 'Casual walk-ins', '31 venues'], ['VIP Lounges', 'Discreet premium', '6 venues'],
];
const labels = { onboarding: 'Quick setup', 'home-map': 'Bangkok tonight', search: 'Search', category: 'Explore by vibe', filters: 'Filters', venue: 'Lotus Noir', 'venue-roster': 'Choose hosts', profile: 'Host card', line: 'LINE handoff', booking: 'Reserve', confirmation: 'Confirmed' };

const icon = (name) => `<span class="ico" aria-hidden="true">${name}</span>`;
const chosen = () => roster.filter((girl) => state.selected.includes(girl.id));
const go = (screen) => { state.history.push(state.screen); state.screen = screen; render(); };
const back = () => { state.screen = state.history.pop() || 'home-map'; render(); };
const toggle = (id) => { state.selected = state.selected.includes(id) ? state.selected.filter((item) => item !== id) : [...state.selected, id]; render(); };
const setTab = (tab) => { state.tab = tab; render(); };
const setHot = (hot) => { state.hot = hot; render(); };

function shell(content) {
  const topbar = state.screen === 'splash' ? '' : `<header class="topbar"><button class="icon-btn" data-back aria-label="Go back">←</button><div><p class="eyebrow">Thai Heaven</p><h1>${labels[state.screen]}</h1></div><button class="icon-btn" data-go="home-map" aria-label="Home">⌂</button></header>`;
  const bottom = ['home-map', 'search', 'category', 'filters'].includes(state.screen) ? bottomNav() : '';
  return `<div class="phone-shell"><div class="status"><span>21:08</span><span class="notch"></span><span>5G 84%</span></div>${topbar}<div class="screen">${content}</div>${bottom}</div>`;
}

function splash() { return `<section class="splash"><div class="halo"></div><div class="brand-mark">TH</div><p class="eyebrow">mobile nightlife concierge</p><h2>Thai Heaven</h2><p class="lede">Find verified venues, compare vibes, select your companions, and move the plan to LINE in seconds.</p><button class="primary pulse" data-go="onboarding">Enter Bangkok ${icon('›')}</button></section>`; }
function onboarding() { return `<section class="content"><div class="poster">${icon('✦')}<h2>Choose your night mode</h2><p>Safety-first recommendations with zine-style neon energy and one-hand mobile controls.</p></div><div class="chips"><button class="chip active">First time in Bangkok</button><button class="chip">VIP focused</button><button class="chip">Budget walk-in</button></div><div class="card"><p class="label">Accent color token</p><div class="swatches">${['#ff2fb2','#ff3b30','#ffc400','#24d6ff'].map(c => `<button class="swatch" style="background:${c};outline:${state.hot === c ? '2px solid white' : '0'}" data-hot="${c}" aria-label="Set accent ${c}"></button>`).join('')}</div></div><button class="primary" data-go="home-map">Show map ${icon('⌖')}</button></section>`; }
function homeMap() { return `<section class="content map-page"><div class="map"><div class="grid"></div>${[1,2,3].map(i => `<button class="pin pin-${i}" data-go="venue">⌖</button>`).join('')}<div class="map-card"><p class="eyebrow">Live district heat</p><h2>Nana → Cowboy → Thonglor</h2><p>12 verified spots are hot now. Tap a marker or refine the route.</p></div></div><div class="action-row"><button class="secondary" data-go="search">${icon('⌕')}Search</button><button class="secondary" data-go="filters">${icon('≛')}Filters</button></div>${venueList()}</section>`; }
function venueList() { return `<div class="stack">${venues.map(v => `<button class="venue-card" data-go="venue"><div class="thumb gradient"><span>${v.name.slice(0,2)}</span></div><div class="venue-info"><div class="spread"><h3>${v.name}</h3><span class="rating">★ ${v.score}</span></div><p>${v.type} · ${v.area} · ${v.dist}</p><div class="mini-tags">${v.tags.map(t => `<span>${t}</span>`).join('')}</div></div></button>`).join('')}</div>`; }
function search() { return `<section class="content"><label class="search-box">${icon('⌕')}<input value="Nana premium VIP" aria-label="Search nightlife" /></label><div class="quick-grid">${['Open now','English OK','No pressure','Private room'].map(x => `<button class="quick">${x}</button>`).join('')}</div>${venueList()}</section>`; }
function category() { return `<section class="content"><div class="hero-strip">${icon('◈')}<h2>Pick by category</h2><p>Each lane keeps the same tokenized neon accent and hard-shadow zine cards.</p></div><div class="category-grid">${categories.map(([name, desc, count]) => `<button data-go="venue"><h3>${name}</h3><p>${desc}</p><span>${count}</span></button>`).join('')}</div></section>`; }
function filters() { return `<section class="content"><div class="filter-card">${icon('≛')}<h2>Night filters</h2>${['Verified venues only','Open after midnight','LINE booking available','Multiple host request','Japanese / English support'].map((x, i) => `<label class="toggle"><span>${x}</span><input type="checkbox" ${i < 3 ? 'checked' : ''}/></label>`).join('')}</div><div class="range"><span>Budget</span><strong>฿฿ — ฿฿฿฿</strong><div class="rangebar"><i></i></div></div><button class="primary" data-go="venue">Apply filters ${icon('›')}</button></section>`; }
function venue() { return `<section class="content venue-page"><div class="venue-hero"><div><p class="eyebrow">Verified tonight</p><h2>Lotus Noir</h2><p>Nana Plaza · neon stage club · 0.4 km</p></div><span class="score">★ 4.8</span></div><div class="tabs">${['overview','menu','reviews'].map(tab => `<button class="${state.tab === tab ? 'active' : ''}" data-tab="${tab}">${tab}</button>`).join('')}</div>${venueTab()}<button class="primary sticky" data-go="venue-roster">Choose companions ${icon('♚')}</button></section>`; }
function venueTab() { if (state.tab === 'menu') return `<div class="stack"><div class="menu-row"><span>Lady drink</span><b>฿220+</b></div><div class="menu-row"><span>VIP sofa set</span><b>฿3,900</b></div><div class="menu-row"><span>Airport pickup add-on</span><b>Quote</b></div></div>`; if (state.tab === 'reviews') return `<div class="stack">${['Smooth LINE booking and no surprise fees.','Best lighting and music near Nana.','Staff helped translate everything politely.'].map((r, i) => `<div class="review"><b>${'★'.repeat(5 - i % 2)}</b><p>${r}</p></div>`).join('')}</div>`; return `<div class="stack"><div class="card"><h3>Tonight brief</h3><p>High-energy stage, attentive mamasan desk, and VIP sofa availability. Best for guests who want a guided first stop.</p></div><div class="metrics"><span>◷ Open until 03:00</span><span>✓ ID checked</span><span>▣ Cards OK</span></div><button class="secondary full" data-go="line">${icon('◌')}Ask venue on LINE</button></div>`; }
function rosterScreen() { return `<section class="content"><div class="roster-head"><h2>Multi-select hosts</h2><p>${state.selected.length} selected · request exact lineup or nearest available match.</p></div><div class="roster-grid">${roster.map(hostCard).join('')}</div><div class="action-row"><button class="secondary" data-go="profile">View profile</button><button class="primary" data-go="line">Continue ${icon('›')}</button></div></section>`; }
function hostCard(girl) { const selected = state.selected.includes(girl.id); return `<button class="host ${selected ? 'selected' : ''}" data-toggle="${girl.id}"><div class="portrait" style="--a:${girl.accent}"><span>${girl.name[0]}</span>${selected ? '<i>✓</i>' : ''}</div><h3>${girl.name}, ${girl.age}</h3><p>${girl.style}</p><span>${girl.lang} · ${girl.rate}</span></button>`; }
function profile() { const girl = roster[0]; return `<section class="content"><div class="profile-poster"><div class="portrait large" style="--a:${girl.accent}"><span>${girl.name[0]}</span></div><h2>${girl.name}</h2><p>Playful host · Thai / English · available from 21:30</p></div><div class="card"><h3>Guest notes</h3><p>Enjoys upbeat pop, easy conversation, and helps first-time visitors understand venue etiquette.</p></div><button class="secondary full" data-toggle="${girl.id}">${state.selected.includes(girl.id) ? 'Remove from lineup' : 'Add to lineup'}</button><button class="primary" data-go="line">Request on LINE ${icon('◌')}</button></section>`; }
function line() { const names = chosen().map(c => c.name).join(', ') || 'staff recommendation'; return `<section class="content"><div class="line-card">${icon('◌')}<h2>LINE request ready</h2><p>We generated a clean message with venue, time, selected hosts, and budget guardrails.</p><div class="message">Hi Lotus Noir, I’d like to visit tonight around 22:00. Requested hosts: ${names}. Please confirm availability and total estimate.</div></div><button class="primary" data-go="booking">Reserve inside app ${icon('◷')}</button><button class="secondary full">Open LINE placeholder</button></section>`; }
function booking() { return `<section class="content"><div class="card"><h2>Reservation details</h2>${[['Date','Tonight'],['Arrival','22:00'],['Guests','2 guests'],['Lineup', chosen().map(c => c.name).join(', ')]].map(([k,v]) => `<label class="field">${k}<input value="${v}" ${k === 'Lineup' ? 'readonly' : ''}/></label>`).join('')}</div><div class="notice">${icon('!')}No payment captured. Venue confirms on LINE before arrival.</div><button class="primary" data-go="confirmation">Send request ${icon('›')}</button></section>`; }
function confirmation() { const names = chosen().map(c => c.name).join(', ') || 'venue recommendation'; return `<section class="content confirm"><div class="success">${icon('✓')}<h2>Request sent</h2><p>Lotus Noir received your preferred lineup: ${names}.</p></div><div class="card"><h3>Next steps</h3><p>Watch LINE for final availability, meet at the mamasan desk, and keep the quote in chat.</p></div><button class="primary" data-go="home-map">Back to map ${icon('⌖')}</button></section>`; }
function bottomNav() { const items = [['home-map','⌖','Map'],['search','⌕','Search'],['category','✦','Vibes'],['filters','≛','Filter']]; return `<nav class="bottom-nav">${items.map(([id, ic, label]) => `<button class="${state.screen === id ? 'active' : ''}" data-go="${id}"><span>${ic}</span><span>${label}</span></button>`).join('')}</nav>`; }

const screens = { splash, onboarding, 'home-map': homeMap, search, category, filters, venue, 'venue-roster': rosterScreen, profile, line, booking, confirmation };
function render() {
  document.documentElement.style.setProperty('--hot', state.hot);
  document.getElementById('app').innerHTML = shell(screens[state.screen]());
  document.querySelectorAll('[data-go]').forEach((el) => el.addEventListener('click', () => go(el.dataset.go)));
  document.querySelectorAll('[data-back]').forEach((el) => el.addEventListener('click', back));
  document.querySelectorAll('[data-toggle]').forEach((el) => el.addEventListener('click', () => toggle(el.dataset.toggle)));
  document.querySelectorAll('[data-tab]').forEach((el) => el.addEventListener('click', () => setTab(el.dataset.tab)));
  document.querySelectorAll('[data-hot]').forEach((el) => el.addEventListener('click', () => setHot(el.dataset.hot)));
}

render();
window.ThaiHeaven = { ROUTES, go, state };
