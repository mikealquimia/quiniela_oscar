// ─── Firebase config ───────────────────────────────────────────────────────
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
// Instrucciones en README.md
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCxcTUny4yJoFYi2mn1STXwquzzYmoCI2I",
  authDomain: "quiniela-oscar.firebaseapp.com",
  projectId: "quiniela-oscar",
  storageBucket: "quiniela-oscar.firebasestorage.app",
  messagingSenderId: "514920301872",
  appId: "1:514920301872:web:3eeb5e05dd98b8fdd8f4f5"
};


// ─── API-Football config ─────────────────────────────────────────────────────
// Registrate gratis en https://dashboard.api-football.com/register
// y pega tu API key aqui:
const API_FOOTBALL_KEY = "9999ebd705992251ae7de01915a6deac"; // <-- pega tu key aqui

// ─── State ──────────────────────────────────────────────────────────────────
let db;
let state = {
  users: [],
  matches: [],
  picks: {},
  points: { exact: 5, result: 2 },
  currentUser: null,
  editingAs: null
};

const COLORS = ['#3B6D11','#185FA5','#A32D2D','#854F0B','#993556','#3C3489','#0F6E56','#993C1D'];

// ─── Banderas de países (emoji via código ISO 3166-1 alpha-2) ────────────────
const COUNTRY_FLAGS = {
  // Grupo A-Z y equipos del Mundial 2026
  'Mexico': 'MX', 'México': 'MX',
  'USA': 'US', 'United States': 'US', 'Estados Unidos': 'US',
  'Canada': 'CA', 'Canadá': 'CA',
  'Brazil': 'BR', 'Brasil': 'BR',
  'Argentina': 'AR',
  'Colombia': 'CO',
  'Ecuador': 'EC',
  'Uruguay': 'UY',
  'Chile': 'CL',
  'Paraguay': 'PY',
  'Peru': 'PE', 'Perú': 'PE',
  'Bolivia': 'BO',
  'Venezuela': 'VE',
  'Spain': 'ES', 'España': 'ES',
  'France': 'FR', 'Francia': 'FR',
  'Germany': 'DE', 'Alemania': 'DE',
  'England': 'GB', 'Inglaterra': 'GB',
  'Portugal': 'PT',
  'Netherlands': 'NL', 'Países Bajos': 'NL', 'Holanda': 'NL',
  'Belgium': 'BE', 'Bélgica': 'BE',
  'Italy': 'IT', 'Italia': 'IT',
  'Croatia': 'HR', 'Croacia': 'HR',
  'Denmark': 'DK', 'Dinamarca': 'DK',
  'Switzerland': 'CH', 'Suiza': 'CH',
  'Austria': 'AT',
  'Serbia': 'RS',
  'Poland': 'PL', 'Polonia': 'PL',
  'Ukraine': 'UA', 'Ucrania': 'UA',
  'Hungary': 'HU', 'Hungría': 'HU',
  'Slovakia': 'SK', 'Eslovaquia': 'SK',
  'Slovenia': 'SI', 'Eslovenia': 'SI',
  'Romania': 'RO', 'Rumanía': 'RO',
  'Czechia': 'CZ', 'Czech Republic': 'CZ', 'República Checa': 'CZ',
  'Scotland': 'GB', 'Escocia': 'GB',
  'Wales': 'GB', 'Gales': 'GB',
  'Turkey': 'TR', 'Turquía': 'TR',
  'Greece': 'GR', 'Grecia': 'GR',
  'Morocco': 'MA', 'Marruecos': 'MA',
  'Senegal': 'SN',
  'Nigeria': 'NG',
  'Ghana': 'GH',
  'Ivory Coast': 'CI', 'Côte d\'Ivoire': 'CI', 'Costa de Marfil': 'CI',
  'Egypt': 'EG', 'Egipto': 'EG',
  'Cameroon': 'CM', 'Camerún': 'CM',
  'Tunisia': 'TN', 'Túnez': 'TN',
  'Algeria': 'DZ', 'Argelia': 'DZ',
  'Mali': 'ML',
  'South Africa': 'ZA', 'Sudáfrica': 'ZA',
  'DR Congo': 'CD', 'Congo': 'CD',
  'Japan': 'JP', 'Japón': 'JP',
  'South Korea': 'KR', 'Corea del Sur': 'KR', 'Korea Republic': 'KR',
  'Australia': 'AU',
  'Iran': 'IR', 'Irán': 'IR',
  'Saudi Arabia': 'SA', 'Arabia Saudita': 'SA',
  'Qatar': 'QA',
  'Iraq': 'IQ',
  'Jordan': 'JO', 'Jordania': 'JO',
  'Uzbekistan': 'UZ', 'Uzbekistán': 'UZ',
  'China': 'CN',
  'Indonesia': 'ID',
  'New Zealand': 'NZ', 'Nueva Zelanda': 'NZ',
  'Costa Rica': 'CR',
  'Panama': 'PA', 'Panamá': 'PA',
  'Honduras': 'HN',
  'Guatemala': 'GT',
  'Jamaica': 'JM',
  'Trinidad and Tobago': 'TT',
  'Cuba': 'CU',
  'Haiti': 'HT', 'Haití': 'HT',
  'El Salvador': 'SV',
  'Nicaragua': 'NI',
};

function countryFlag(teamName) {
  if (!teamName) return '';
  // Buscar directamente
  const iso = COUNTRY_FLAGS[teamName];
  if (iso) {
    // Convertir código ISO a emoji de bandera
    return iso.toUpperCase().split('').map(c => String.fromCodePoint(0x1F1E0 + c.charCodeAt(0) - 65)).join('');
  }
  // Buscar ignorando mayúsculas/minúsculas y coincidencias parciales
  const key = Object.keys(COUNTRY_FLAGS).find(k =>
    k.toLowerCase() === teamName.toLowerCase() ||
    teamName.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(teamName.toLowerCase())
  );
  if (key) {
    const iso2 = COUNTRY_FLAGS[key];
    return iso2.toUpperCase().split('').map(c => String.fromCodePoint(0x1F1E0 + c.charCodeAt(0) - 65)).join('');
  }
  return '';
}

// ─── Banderas (imagen, estilo Villasol) ───────────────────────────────────────
// Nombres tal como vienen de openfootball → código ISO para flagcdn.com
const TEAM_FLAGS = {
  'Algeria':'dz','Argentina':'ar','Australia':'au','Austria':'at','Belgium':'be',
  'Bosnia & Herzegovina':'ba','Brazil':'br','Canada':'ca','Cape Verde':'cv',
  'Colombia':'co','Croatia':'hr','Curaçao':'cw','Czech Republic':'cz',
  'DR Congo':'cd','Ecuador':'ec','Egypt':'eg','England':'gb-eng','France':'fr',
  'Germany':'de','Ghana':'gh','Haiti':'ht','Iran':'ir','Iraq':'iq',
  'Ivory Coast':'ci','Japan':'jp','Jordan':'jo','Mexico':'mx','Morocco':'ma',
  'Netherlands':'nl','New Zealand':'nz','Norway':'no','Panama':'pa',
  'Paraguay':'py','Portugal':'pt','Qatar':'qa','Saudi Arabia':'sa',
  'Scotland':'gb-sct','Senegal':'sn','South Africa':'za','South Korea':'kr',
  'Spain':'es','Sweden':'se','Switzerland':'ch','Tunisia':'tn','Turkey':'tr',
  'USA':'us','Uruguay':'uy','Uzbekistan':'uz'
};
function flagImg(team, cls = 'flag') {
  const c = TEAM_FLAGS[team];
  const w = cls === 'flag' ? 'w40' : 'w80';
  return c
    ? `<img class="${cls}" src="https://flagcdn.com/${w}/${c}.png" alt="" loading="lazy">`
    : `<span class="${cls} flag-tbd"><i class="ti ti-star"></i></span>`;
}

function colorFor(name) {
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) % COLORS.length;
  return COLORS[h];
}
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Firebase init ──────────────────────────────────────────────────────────
async function initFirebase() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const { getFirestore, doc, getDoc, setDoc, onSnapshot, collection } =
    await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

  const app = initializeApp(FIREBASE_CONFIG);
  db = getFirestore(app);

  // Live listener — actualiza la UI cuando cambia algo en Firestore
  onSnapshot(doc(db, 'quiniela', 'data'), (snap) => {
    if (snap.exists()) {
      const d = snap.data();
      state.users   = d.users   || [];
      state.matches = d.matches || [];
      state.picks   = d.picks   || {};
      state.points  = d.points  || { exact: 5, result: 2 };
      // Compatibilidad con datos guardados anteriormente
      if (state.points.result === undefined) state.points.result = 2;
      if (state.currentUser) {
        // Refresh current user object in case admin status changed
        state.currentUser = state.users.find(u => u.id === state.currentUser.id) || state.currentUser;
        if (!state.editingAs || state.editingAs.id === state.currentUser.id) {
          state.editingAs = state.currentUser;
        }
        refreshAll();
      }
    }
    renderLogin();
  });
}

async function saveState() {
  const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  await setDoc(doc(db, 'quiniela', 'data'), {
    users:   state.users,
    matches: state.matches,
    picks:   state.picks,
    points:  state.points
  });
}

// ─── Login / Logout ──────────────────────────────────────────────────────────
function renderLogin() {
  const sel = document.getElementById('login-select');
  const current = sel.value;
  sel.innerHTML = '<option value="">— Selecciona tu nombre —</option>';
  state.users.forEach(u => {
    const o = document.createElement('option');
    o.value = u.id;
    o.textContent = u.name + (u.isAdmin ? ' (admin)' : '');
    sel.appendChild(o);
  });
  if (current) sel.value = current;
}

function pinNext(el, nextIdx) {
  if (el.value.length === 1 && nextIdx !== null) {
    document.getElementById("pin-" + nextIdx).focus();
  }
}
function pinBack(e, el, prevIdx) {
  if (e.key === "Backspace" && el.value === "" && prevIdx !== null) {
    document.getElementById("pin-" + prevIdx).focus();
  }
}
function getPin() {
  return [0,1,2,3].map(i => document.getElementById("pin-"+i).value).join("");
}
function clearPin() {
  [0,1,2,3].forEach(i => { document.getElementById("pin-"+i).value = ""; });
  document.getElementById("pin-0").focus();
}

function doLogin() {
  const id = document.getElementById('login-select').value;
  if (!id) { alert('Selecciona tu nombre'); return; }
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  const pin = getPin();
  if (pin.length < 4) { alert('Ingresa tu PIN de 4 digitos'); return; }
  if (user.pin && user.pin !== pin) {
    document.getElementById('pin-error').classList.remove('hidden');
    [0,1,2,3].forEach(i => document.getElementById('pin-'+i).classList.add('error'));
    clearPin();
    return;
  }
  document.getElementById('pin-error').classList.add('hidden');
  [0,1,2,3].forEach(i => document.getElementById('pin-'+i).classList.remove('error'));

  state.currentUser = user;
  state.editingAs = user;
  document.getElementById('screen-login').classList.add('hidden');
  document.getElementById('screen-main').classList.remove('hidden');

  const av = document.getElementById('user-avatar');
  av.textContent = initials(user.name);
  av.style.background = colorFor(user.name) + '30';
  av.style.color = colorFor(user.name);
  document.getElementById('user-name-display').textContent = user.name;

  const adminBadge = document.getElementById('admin-badge');
  const adminTab   = document.getElementById('tab-admin-btn');
  if (user.isAdmin) {
    adminBadge.classList.remove('hidden');
    adminTab.classList.remove('hidden');
  } else {
    adminBadge.classList.add('hidden');
    adminTab.classList.add('hidden');
  }

  const elExact2  = document.getElementById('pts-exact');
  const elResult2 = document.getElementById('pts-result');
  if (elExact2)  elExact2.value  = state.points.exact;
  if (elResult2) elResult2.value = state.points.result;
  refreshAll();
}

function doLogout() {
  state.currentUser = null;
  state.editingAs = null;
  clearPin();
  document.getElementById('screen-login').classList.remove('hidden');
  document.getElementById('screen-main').classList.add('hidden');
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  ['tab-quiniela','tab-tabla','tab-stats','tab-admin'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('hidden', i !== 0);
  });
}

function refreshAll() {
  renderMyStats();
  renderMatches();
  renderTabla();
  renderStats();
  renderComparar();
  renderAdminMatches();
  renderAdminUsers();
  renderBracket();
  const elExact  = document.getElementById('pts-exact');
  const elResult = document.getElementById('pts-result');
  if (elExact)  elExact.value  = state.points.exact;
  if (elResult) elResult.value = state.points.result;
}

// ─── Tabs ────────────────────────────────────────────────────────────────────
function showTab(id, btn) {
  ['tab-quiniela','tab-tabla','tab-stats','tab-comparar','tab-admin','tab-bracket'].forEach(t => {
    document.getElementById(t).classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (id === 'tab-comparar') renderComparar();
  if (id === 'tab-bracket')  renderBracket();
}
function toggleCmpCard(id)  { document.getElementById('cmpc-' + id)?.classList.toggle('open'); }
function toggleCmpGroup(key) { document.getElementById('cmpg-' + key)?.classList.toggle('open'); }

// Llena el selector de días de Comparar (autoselecciona hoy)
function populateCmpDates() {
  const sel = document.getElementById('cmp-date-filter');
  if (!sel) return;
  const today = getTodayGuatemala();
  const dates = [...new Set(
    state.matches.map(m => m.datetime ? dateInGT(m.datetime) : null).filter(Boolean)
  )].sort();
  const current = sel.value;
  sel.innerHTML = '<option value="all">Todos los partidos</option>';
  dates.forEach(d => {
    const o = document.createElement('option');
    o.value = d;
    o.textContent = (d === today ? '\u{1F4C5} Hoy \u2014 ' : '') + formatDayLabel(d);
    sel.appendChild(o);
  });
  if (current && current !== 'all') sel.value = current;
  else if (dates.includes(today)) sel.value = today;
}
function stepCmpDay(dir) {
  const sel = document.getElementById('cmp-date-filter');
  if (!sel) return;
  const opts = [...sel.options].map(o => o.value);
  const i = Math.max(0, Math.min(opts.length - 1, opts.indexOf(sel.value) + dir));
  sel.value = opts[i];
  renderComparar();
}


// ─── Pick value helpers (0 is a valid score!) ────────────────────────────────
function hasVal(v) { return v !== '' && v !== null && v !== undefined; }
// A pick is "set" if at least one side has a value — the other defaults to 0
function pickSet(pick) {
  if (!pick) return false;
  return hasVal(pick.home) || hasVal(pick.away);
}
// Normalize pick: if one side is empty, treat it as 0
function normPick(pick) {
  if (!pick) return { home: 0, away: 0 };
  return {
    home: hasVal(pick.home) ? pick.home : 0,
    away: hasVal(pick.away) ? pick.away : 0
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isLocked(match) {
  return Date.now() >= new Date(match.datetime).getTime() - 60 * 60 * 1000;
}

// Ganador por penales en un empate: 'H' | 'A' | null
function penWinner(result) {
  if (!result || result.penHome == null || result.penAway == null) return null;
  if (result.penHome === '' || result.penAway === '') return null;
  const ph = parseInt(result.penHome), pa = parseInt(result.penAway);
  if (isNaN(ph) || isNaN(pa) || ph === pa) return null;
  return ph > pa ? 'H' : 'A';
}

function calcPoints(userId, match) {
  if (!match.result || match.result.home === '') return 0;
  const pick = state.picks[userId]?.[match.id];
  if (!pickSet(pick)) return 0;
  const np = normPick(pick);
  const rh = parseInt(match.result.home), ra = parseInt(match.result.away);
  const ph = parseInt(np.home), pa = parseInt(np.away);

  // Marcador exacto de ambos equipos: 5 pts (sin bonos)
  if (ph === rh && pa === ra) return state.points.exact;

  // Ganador correcto: 2 pts base
  // Con penales: quien predijo empate (marcador real) O al ganador de penales, ambos cobran.
  const pen  = penWinner(match.result);
  const pRes = ph > pa ? 'H' : ph < pa ? 'A' : 'D';
  let pts = 0;
  if (pen) {
    if (pRes === 'D' || pRes === pen) pts = state.points.result;
  } else {
    const rRes = rh > ra ? 'H' : rh < ra ? 'A' : 'D';
    if (pRes === rRes) pts = state.points.result;
  }

  // Bonos (solo aplican cuando NO se acertó el marcador exacto)
  // +1 si acertaste la diferencia de goles
  if ((ph - pa) === (rh - ra)) pts += 1;
  // +1 si acertaste el marcador de al menos un equipo
  if (ph === rh || pa === ra) pts += 1;

  return pts;
}

function getTableData() {
  return state.users.map(u => {
    let pts = 0, exact = 0, winner = 0, played = 0;
    state.matches.forEach(m => {
      if (m.result && m.result.home !== '') {
        played++;
        const p = calcPoints(u.id, m);
        pts += p;
        if (p === state.points.exact) exact++;
        else if (p > 0) winner++;
      }
    });
    return { user: u, pts, exact, winner, played };
  }).sort((a, b) => b.pts - a.pts || b.exact - a.exact);
}

function getStreak(userId) {
  const played = state.matches
    .filter(m => m.result && m.result.home !== '')
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  let streak = 0;
  for (const m of played) {
    const pts = calcPoints(userId, m);
    if (streak === 0) { streak = pts > 0 ? 1 : -1; continue; }
    if (streak > 0 && pts > 0) streak++;
    else if (streak < 0 && pts === 0) streak--;
    else break;
  }
  return streak;
}


// ─── Render: My Stats (top of quiniela tab) ──────────────────────────────────
function renderMyStats() {
  const grid = document.getElementById('my-stats-grid');
  if (!grid || !state.currentUser) return;
  const u = state.currentUser;
  let pts = 0, exact = 0, winner = 0, played = 0, pending = 0;
  state.matches.forEach(m => {
    if (m.result && m.result.home !== '') {
      played++;
      const p = calcPoints(u.id, m);
      pts += p;
      if (p === state.points.exact) exact++;
      else if (p > 0) winner++;
    } else {
      pending++;
    }
  });
  const color = colorFor(u.name);
  grid.innerHTML = `
    <div class="stat-card" style="border-left:3px solid ${color}">
      <div class="stat-label">Mis puntos</div>
      <div class="stat-value" style="color:${color}">${pts}</div>
    </div>
    <div class="stat-card" style="border-left:3px solid var(--success-text)">
      <div class="stat-label">Marcador exacto</div>
      <div class="stat-value" style="color:var(--success-text)">${exact}</div>
    </div>
    <div class="stat-card" style="border-left:3px solid var(--info, #3b82f6)">
      <div class="stat-label">Ganador acertado</div>
      <div class="stat-value" style="color:var(--info, #3b82f6)">${winner}</div>
    </div>
    <div class="stat-card" style="border-left:3px solid var(--text-secondary)">
      <div class="stat-label">Por jugar</div>
      <div class="stat-value">${pending}</div>
    </div>
  `;
}

// ─── Date filter helpers ──────────────────────────────────────────────────────

// Zona horaria fija de Guatemala (UTC-6, sin horario de verano)
const GT_TZ = 'America/Guatemala';

// Retorna la fecha "YYYY-MM-DD" de un datetime en zona horaria de Guatemala
function dateInGT(datetime) {
  return new Date(datetime).toLocaleDateString('en-CA', { timeZone: GT_TZ }); // en-CA da formato YYYY-MM-DD
}

// Formatea solo la hora en zona horaria de Guatemala
function fmtTime(datetime) {
  return new Date(datetime).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', timeZone: GT_TZ });
}

// Formatea fecha corta en zona horaria de Guatemala (ej: "12 jun")
function fmtDateShort(datetime) {
  return new Date(datetime).toLocaleDateString('es', { day: 'numeric', month: 'short', timeZone: GT_TZ });
}

// Formatea fecha larga en zona horaria de Guatemala (ej: "viernes, 12 de junio")
function fmtDateLong(datetime, options = {}) {
  return new Date(datetime).toLocaleDateString('es', { timeZone: GT_TZ, ...options });
}

// Retorna la fecha de hoy en zona horaria de Guatemala (UTC-6) como "YYYY-MM-DD"
function getTodayGuatemala() {
  const now = new Date();
  // Guatemala es UTC-6 (sin cambio de horario de verano)
  const offset = -6 * 60; // minutos
  const local = new Date(now.getTime() + (offset - now.getTimezoneOffset()) * 60000);
  return local.toISOString().slice(0, 10);
}

function populateDateFilter() {
  const sel = document.getElementById('date-filter');
  if (!sel) return;
  const current = sel.value;
  const today = getTodayGuatemala();
  // Get unique dates
  const dates = [...new Set(
    state.matches.map(m => m.datetime ? dateInGT(m.datetime) : null).filter(Boolean)
  )].sort();
  sel.innerHTML = '<option value="all">Todos los partidos</option>';
  dates.forEach(d => {
    const dt = new Date(d + 'T12:00:00Z');
    const label = fmtDateLong(dt, { weekday: 'long', day: 'numeric', month: 'long' });
    const o = document.createElement('option');
    o.value = d;
    o.textContent = (d === today ? '📅 Hoy — ' : '') + label.charAt(0).toUpperCase() + label.slice(1);
    sel.appendChild(o);
  });
  // Si el usuario ya eligió una fecha específica, mantenerla; si no, auto-seleccionar hoy
  if (current && current !== 'all') {
    sel.value = current;
  } else if (!current || current === 'all') {
    if (dates.includes(today)) sel.value = today;
  }
}

function formatDayLabel(d) {
  const dt = new Date(d + 'T12:00:00Z');
  const s = fmtDateLong(dt, { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
// Mueve la selección entre días disponibles (‹ ›) en Mi quiniela
function stepDay(dir) {
  const sel = document.getElementById('date-filter');
  if (!sel) return;
  const opts = [...sel.options].map(o => o.value);
  const i = Math.max(0, Math.min(opts.length - 1, opts.indexOf(sel.value) + dir));
  sel.value = opts[i];
  renderMatches();
}

// ─── Render: Matches ─────────────────────────────────────────────────────────
function renderMatches() {
  const container = document.getElementById('matches-list');
  const editUser = state.editingAs;
  if (!editUser) { container.innerHTML = ''; return; }

  renderMyStats();
  populateDateFilter();

  const dateFilter = document.getElementById('date-filter')?.value || 'all';

  if (state.matches.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-secondary)">
      <i class="ti ti-calendar-off" style="font-size:28px;display:block;margin-bottom:10px"></i>
      Aún no hay partidos cargados
    </div>`;
    return;
  }

  let filteredMatches = [...state.matches];
  if (dateFilter !== 'all') {
    filteredMatches = filteredMatches.filter(m => m.datetime && dateInGT(m.datetime) === dateFilter);
  }

  if (filteredMatches.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-secondary);font-size:14px">
      No hay partidos para esta fecha.
    </div>`;
    return;
  }

  const dayLabel = dateFilter === 'all' ? 'Todos los partidos' : formatDayLabel(dateFilter);
  const phases = [...new Set(filteredMatches.map(m => m.phase))];
  let html = '';

  phases.forEach(phase => {
    const ms = filteredMatches.filter(m => m.phase === phase);
    html += `<div class="mq-board">
      <div class="mq-board-head">
        <span class="mq-phase">${phase}</span>
        <span class="mq-day">${dayLabel}</span>
      </div>`;

    ms.forEach(m => {
      const locked = isLocked(m);
      const pick = state.picks[editUser.id]?.[m.id] || { home: '', away: '' };
      const resultKnown = m.result && m.result.home !== '' && m.result.away !== '';
      const np = normPick(pick);

      let statusBadge = '';
      if (resultKnown) {
        const pts = calcPoints(editUser.id, m);
        if (pts === state.points.exact)
          statusBadge = `<span class="badge badge-success">+${pts} exacto ✓</span>`;
        else if (pts > 0)
          statusBadge = `<span class="badge badge-purple">+${pts}</span>`;
        else if (pickSet(pick))
          statusBadge = `<span class="badge badge-gray">+0</span>`;
      }

      const timeStr = fmtTime(m.datetime);

      const center = locked || resultKnown
        ? `<div class="mq-final">${pickSet(pick) ? `${np.home}<span>–</span>${np.away}` : `<span style="opacity:.5">– –</span>`}</div>`
        : `<div class="mq-inputs">
             <input type="number" min="0" max="20" class="score-input" value="${pick.home}" placeholder="0"
               onfocus="this.select()" onchange="setPick('${editUser.id}','${m.id}','home',this.value)">
             <span class="score-sep">–</span>
             <input type="number" min="0" max="20" class="score-input" value="${pick.away}" placeholder="0"
               onfocus="this.select()" onchange="setPick('${editUser.id}','${m.id}','away',this.value)">
           </div>`;

      html += `<div class="mq-card">
        <div class="mq-fixture">
          <div class="mq-team">${flagImg(m.home, 'flag-lg')}<span class="mq-name">${m.home}</span></div>
          ${center}
          <div class="mq-team">${flagImg(m.away, 'flag-lg')}<span class="mq-name">${m.away}</span></div>
        </div>
        <div class="mq-foot">
          <span class="mq-time"><i class="ti ti-clock"></i> ${timeStr}</span>
          ${locked && !resultKnown ? `<span class="badge badge-warning"><i class="ti ti-lock"></i> bloqueado</span>` : ''}
          ${resultKnown ? `<span class="badge badge-gray">Final ${m.result.home}–${m.result.away}</span>` : ''}
          ${statusBadge}
        </div>
      </div>`;
    });

    html += '</div>';
  });

  container.innerHTML = html;
}

async function setPick(userId, matchId, side, val) {
  if (!state.picks[userId]) state.picks[userId] = {};
  if (!state.picks[userId][matchId]) state.picks[userId][matchId] = { home: '', away: '' };
  state.picks[userId][matchId][side] = val === '' ? '' : parseInt(val);
  await saveState();
}

// ─── Render: Tabla ───────────────────────────────────────────────────────────
// Ranking compacto (medallas + puntos). Reutilizable.
function rankingHtml() {
  if (!state.users.length) return '';
  const rows = getTableData().map((d, i) => {
    const color = colorFor(d.user.name);
    const pos = i < 3 ? ['🥇','🥈','🥉'][i] : (i + 1);
    return '<div class="cmp-rank-row">'
      + '<span class="cmp-rank-pos">' + pos + '</span>'
      + '<span class="cmp-avatar" style="background:' + color + '30;color:' + color + '">' + initials(d.user.name) + '</span>'
      + '<span class="cmp-rank-name">' + d.user.name.split(' ')[0] + '</span>'
      + '<span class="cmp-rank-pts">' + d.pts + '<small> pts</small></span>'
      + '</div>';
  }).join('');
  return '<div class="cmp-rank"><div class="cmp-rank-head"><i class="ti ti-trophy"></i> Ranking general</div>' + rows + '</div>';
}

function renderTabla() {
  const rankEl = document.getElementById('tabla-rank');
  if (!rankEl) return;
  const totalPlayed = state.matches.filter(m => m.result && m.result.home !== '').length;

  rankEl.innerHTML = rankingHtml();

  document.getElementById('tabla-stats').innerHTML = `
    <div class="stat-card"><div class="stat-label">Partidos jugados</div><div class="stat-value">${totalPlayed}</div></div>
    <div class="stat-card"><div class="stat-label">Partidos totales</div><div class="stat-value">${state.matches.length}</div></div>
    <div class="stat-card"><div class="stat-label">Participantes</div><div class="stat-value">${state.users.length}</div></div>
    <div class="stat-card"><div class="stat-label">Pts por exacto</div><div class="stat-value">${state.points.exact}</div></div>
    <div class="stat-card"><div class="stat-label">Pts por ganador</div><div class="stat-value">${state.points.result}</div></div>
    <div class="stat-card"><div class="stat-label">Bonos</div><div class="stat-value">+1 +1</div></div>
  `;
}

// ─── Render: Stats ───────────────────────────────────────────────────────────
// Empates predichos por un jugador (sobre todas sus quinielas)
function countDraws(userId) {
  let d = 0;
  state.matches.forEach(m => {
    const pk = state.picks[userId]?.[m.id];
    if (pickSet(pk)) { const np = normPick(pk); if (+np.home === +np.away) d++; }
  });
  return d;
}

function renderStats() {
  if (!document.getElementById('stats-body')) return;
  const data = getTableData();
  const medals = ['🥇', '🥈', '🥉'];

  // Tabla de posiciones
  document.getElementById('tabla-body').innerHTML = data.map((d, i) => {
    const color = colorFor(d.user.name);
    return `<tr>
      <td><span class="pos-num" style="background:${color}22;color:${color}">${medals[i] || i + 1}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="avatar" style="width:28px;height:28px;font-size:11px;background:${color}30;color:${color}">${initials(d.user.name)}</div>
          <span style="font-weight:500">${d.user.name}</span>
          ${d.user.isAdmin ? '<span class="badge badge-gray" style="font-size:10px">admin</span>' : ''}
        </div>
      </td>
      <td class="text-right"><strong style="font-size:16px">${d.pts}</strong></td>
      <td class="text-right"><span class="badge badge-success">${d.exact}</span></td>
      <td class="text-right"><span class="badge badge-purple">${d.winner}</span></td>
      <td class="text-right" style="color:var(--text-secondary)">${d.played}</td>
    </tr>`;
  }).join('');

  // Precisión por participante
  document.getElementById('stats-body').innerHTML = data.map(d => {
    const total = d.played;
    const pctExact = total > 0 ? Math.round(d.exact / total * 100) : 0;
    const pctHits  = total > 0 ? Math.round((d.exact + d.winner) / total * 100) : 0;
    const streak = getStreak(d.user.id);
    const color = colorFor(d.user.name);
    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="avatar" style="width:26px;height:26px;font-size:10px;background:${color}30;color:${color}">${initials(d.user.name)}</div>
          ${d.user.name}
        </div>
      </td>
      <td class="text-right"><strong>${pctExact}%</strong></td>
      <td class="text-right">${pctHits}%</td>
      <td class="text-right">
        ${streak > 0
          ? `<span class="badge badge-success">🔥 ${streak}</span>`
          : streak < 0
          ? `<span class="badge badge-danger">${streak}</span>`
          : `<span class="badge badge-gray">—</span>`}
      </td>
    </tr>`;
  }).join('');

  // Destacados (mejores) — sin sección "De la Verga"
  const arr = data.map(d => ({
    name: d.user.name.split(' ')[0],
    aciertos: d.exact + d.winner,
    draws: countDraws(d.user.id),
    played: d.played,
    pct: d.played > 0 ? Math.round((d.exact + d.winner) / d.played * 100) : 0
  }));
  const playedArr = arr.filter(x => x.played > 0);
  const maxBy = (pool, k) => pool.length ? pool.reduce((b, x) => x[k] > b[k] ? x : b) : null;
  const ifPos = (w, k) => (w && w[k] > 0) ? w : null;
  const statCard = (label, w, fmt) =>
    `<div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value" style="font-size:20px">${w ? w.name : '—'}</div>
      <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">${w ? fmt(w) : 'Aún sin datos'}</div>
    </div>`;
  const hl = document.getElementById('stats-highlights');
  if (hl) hl.innerHTML =
      statCard('Quién acierta más', ifPos(maxBy(playedArr, 'aciertos'), 'aciertos'), w => w.aciertos + ' aciertos')
    + statCard('Rey del empate',    ifPos(maxBy(arr, 'draws'), 'draws'),             w => w.draws + ' empates predichos')
    + statCard('Mejor precisión',   ifPos(maxBy(playedArr, 'pct'), 'pct'),           w => w.pct + '% de aciertos');
}

// ─── Render: Admin Matches ───────────────────────────────────────────────────
function renderAdminMatches() {
  const container = document.getElementById('admin-matches-list');
  if (state.matches.length === 0) {
    container.innerHTML = '<p style="font-size:13px;color:var(--text-secondary)">No hay partidos aún.</p>';
    return;
  }

  // Populate admin date filter
  const adminSel = document.getElementById('admin-date-filter');
  if (adminSel) {
    const currentVal = adminSel.value;
    const dates = [...new Set(
      state.matches.map(m => m.datetime ? dateInGT(m.datetime) : null).filter(Boolean)
    )].sort();
    adminSel.innerHTML = '<option value="all">Todas las fechas</option>';
    dates.forEach(d => {
      const dt = new Date(d + 'T12:00:00Z');
      const label = fmtDateLong(dt, { weekday: 'short', day: 'numeric', month: 'short' });
      const o = document.createElement('option');
      o.value = d; o.textContent = label;
      adminSel.appendChild(o);
    });
    if (currentVal) adminSel.value = currentVal;
  }

  const adminDateFilter = document.getElementById('admin-date-filter')?.value || 'all';
  let matches = adminDateFilter === 'all'
    ? state.matches
    : state.matches.filter(m => m.datetime && dateInGT(m.datetime) === adminDateFilter);

  if (matches.length === 0) {
    container.innerHTML = '<p style="font-size:13px;color:var(--text-secondary)">No hay partidos para esta fecha.</p>';
    return;
  }

  container.innerHTML = matches.map(m => {
    const dtStr = fmtDateShort(m.datetime) + ' ' + fmtTime(m.datetime);
    const hasResult = m.result && m.result.home !== '';
    const isDraw = hasResult && parseInt(m.result.home) === parseInt(m.result.away);
    const hasPen = isDraw && (m.result.penHome != null && m.result.penHome !== '');

    return `<div class="admin-match-row">
      <span style="font-size:13px;flex:1;min-width:160px">
        <strong>${m.home}</strong> vs <strong>${m.away}</strong><br>
        <span style="color:var(--text-secondary);font-size:11px">${dtStr} · ${m.phase}</span>
      </span>
      <input type="number" min="0" max="20" placeholder="L" value="${hasResult ? m.result.home : ''}"
        id="res-h-${m.id}" class="score-input" oninput="togglePenBlock('${m.id}')">
      <span class="score-sep">–</span>
      <input type="number" min="0" max="20" placeholder="V" value="${hasResult ? m.result.away : ''}"
        id="res-a-${m.id}" class="score-input" oninput="togglePenBlock('${m.id}')">
      <div class="pen-block${isDraw ? '' : ' hidden'}" id="pen-block-${m.id}">
        <span class="pen-label">Pen</span>
        <input type="number" min="0" max="20" placeholder="L" value="${hasPen ? m.result.penHome : ''}"
          id="pen-h-${m.id}" class="pen-input">
        <span class="score-sep">–</span>
        <input type="number" min="0" max="20" placeholder="V" value="${hasPen ? m.result.penAway : ''}"
          id="pen-a-${m.id}" class="pen-input">
      </div>
      <button class="btn btn-sm btn-primary" onclick="saveResult('${m.id}')">
        <i class="ti ti-check"></i> Guardar
      </button>
      <button class="btn btn-sm" onclick="openEditModal('${m.id}')" title="Editar partido">
        <i class="ti ti-edit"></i>
      </button>
      <button class="btn btn-sm btn-danger" onclick="openDeleteModal('${m.id}')" title="Eliminar">
        <i class="ti ti-trash"></i>
      </button>
    </div>`;
  }).join('');
}

async function saveResult(matchId) {
  const h = document.getElementById('res-h-' + matchId).value;
  const a = document.getElementById('res-a-' + matchId).value;
  const m = state.matches.find(x => x.id === matchId);
  if (!m) return;
  const isDraw = h !== '' && a !== '' && parseInt(h) === parseInt(a);
  const penH = isDraw ? (document.getElementById('pen-h-' + matchId)?.value ?? '') : '';
  const penA = isDraw ? (document.getElementById('pen-a-' + matchId)?.value ?? '') : '';
  m.result = { home: h, away: a, penHome: penH, penAway: penA };
  await saveState();
}

// Muestra u oculta el bloque de penales según si el marcador es empate
function togglePenBlock(matchId) {
  const h = document.getElementById('res-h-' + matchId)?.value;
  const a = document.getElementById('res-a-' + matchId)?.value;
  const block = document.getElementById('pen-block-' + matchId);
  if (!block) return;
  const isDraw = h !== '' && a !== '' && parseInt(h) === parseInt(a);
  block.classList.toggle('hidden', !isDraw);
}

let _deleteMatchId = null;
function openDeleteModal(matchId) {
  const m = state.matches.find(x => x.id === matchId);
  if (!m) return;
  _deleteMatchId = matchId;
  document.getElementById('delete-confirm-text').textContent =
    '¿Eliminar ' + m.home + ' vs ' + m.away + '? Esta acción no se puede deshacer.';
  document.getElementById('modal-delete-overlay').classList.remove('hidden');
}
function closeDeleteModal() {
  _deleteMatchId = null;
  document.getElementById('modal-delete-overlay').classList.add('hidden');
}
async function confirmDelete() {
  if (!_deleteMatchId) return;
  state.matches = state.matches.filter(m => m.id !== _deleteMatchId);
  closeDeleteModal();
  await saveState();
  renderAdminMatches();
  renderMatches();
}

// Keep old deleteMatch as alias for backwards compat
async function deleteMatch(matchId) { openDeleteModal(matchId); }

let _editMatchId = null;
function openEditModal(matchId) {
  const m = state.matches.find(x => x.id === matchId);
  if (!m) return;
  _editMatchId = matchId;
  document.getElementById('edit-home').value  = m.home;
  document.getElementById('edit-away').value  = m.away;
  const _ed = new Date(m.datetime.endsWith('Z') ? m.datetime : m.datetime + 'Z');
  const _gtOff = -6 * 60, _brOff = _ed.getTimezoneOffset();
  const _edLocal = new Date(_ed.getTime() + (_gtOff - (-_brOff)) * 60000);
  document.getElementById('edit-date').value = _edLocal.toISOString().slice(0,16);
  document.getElementById('edit-phase').value = m.phase;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() {
  _editMatchId = null;
  document.getElementById('modal-overlay').classList.add('hidden');
}
async function saveEdit() {
  if (!_editMatchId) return;
  const m = state.matches.find(x => x.id === _editMatchId);
  if (!m) return;
  m.home     = document.getElementById('edit-home').value.trim()  || m.home;
  m.away     = document.getElementById('edit-away').value.trim()  || m.away;
  const _editVal = document.getElementById('edit-date').value;
  if (_editVal) {
    const _gt = new Date(_editVal);
    const _utc = new Date(_gt.getTime() + (_gt.getTimezoneOffset() - 6*60) * 60000);
    m.datetime = _utc.toISOString().replace('.000Z','Z').slice(0,19) + 'Z';
  }
  m.phase    = document.getElementById('edit-phase').value        || m.phase;
  closeModal();
  await saveState();
  renderAdminMatches();
  renderMatches();
}

async function addMatch() {
  const home = document.getElementById('m-home').value.trim();
  const away = document.getElementById('m-away').value.trim();
  const _rawDate = document.getElementById('m-date').value;
  let datetime = _rawDate;
  if (_rawDate) {
    const _d = new Date(_rawDate);
    const _utc2 = new Date(_d.getTime() + (_d.getTimezoneOffset() - 6*60) * 60000);
    datetime = _utc2.toISOString().replace('.000Z','Z').slice(0,19) + 'Z';
  }
  const phase = document.getElementById('m-phase').value;
  if (!home || !away || !datetime) { alert('Completa todos los campos del partido'); return; }
  state.matches.push({ id: 'm' + Date.now(), home, away, datetime, phase, result: { home: '', away: '' } });
  document.getElementById('m-home').value = '';
  document.getElementById('m-away').value = '';
  document.getElementById('m-date').value = '';
  await saveState();
}

// ─── Render: Admin Users ─────────────────────────────────────────────────────
function renderAdminUsers() {
  document.getElementById('admin-users-body').innerHTML = state.users.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="avatar" style="width:26px;height:26px;font-size:10px;background:${colorFor(u.name)}30;color:${colorFor(u.name)}">${initials(u.name)}</div>
          ${u.name}
        </div>
      </td>
      <td>${u.isAdmin ? '<span class="badge badge-warning">admin</span>' : '<span class="badge badge-gray">jugador</span>'}</td>
      <td style="font-family:monospace;letter-spacing:2px">${u.pin || '—'}</td>
      <td>
        <button class="btn btn-sm" onclick="editPicksFor('${u.id}')">
          <i class="ti ti-edit"></i> Editar
        </button>
      </td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')">
          <i class="ti ti-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

async function addUser() {
  const name = document.getElementById('new-user-name').value.trim();
  const pin  = document.getElementById('new-user-pin').value.trim();
  if (!name) { alert('Escribe el nombre del jugador'); return; }
  if (pin.length !== 4 || isNaN(pin)) { alert('El PIN debe ser de 4 digitos numericos'); return; }
  const isAdmin = document.getElementById('new-user-admin').checked;
  state.users.push({ id: 'u' + Date.now(), name, pin, isAdmin });
  document.getElementById('new-user-name').value = '';
  document.getElementById('new-user-pin').value  = '';
  document.getElementById('new-user-admin').checked = false;
  await saveState();
}

async function deleteUser(userId) {
  if (!confirm('¿Eliminar este usuario?')) return;
  state.users = state.users.filter(u => u.id !== userId);
  await saveState();
}

async function savePoints() {
  state.points.exact   = parseInt(document.getElementById('pts-exact').value)   || 5;
  state.points.result  = parseInt(document.getElementById('pts-result').value)  || 2;
  await saveState();
}

function editPicksFor(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;
  state.editingAs = user;
  document.getElementById('quiniela-info').innerHTML =
    `<i class="ti ti-edit"></i> Editando quiniela de <strong>${user.name}</strong>. 
     <a href="#" onclick="resetEditAs(event)" style="color:inherit;font-weight:500">← Volver a la mía</a>`;
  showTab('tab-quiniela', document.querySelectorAll('.tab')[0]);
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  renderMatches();
}

function resetEditAs(e) {
  if (e) e.preventDefault();
  state.editingAs = state.currentUser;
  document.getElementById('quiniela-info').innerHTML =
    '<i class="ti ti-info-circle"></i> Puedes editar tu quiniela hasta 1 hora antes de cada partido.';
  renderMatches();
}


// ─── Sincronización completa desde openfootball ──────────────────────────────
async function syncAll() {
  const btn = document.getElementById('btn-sync-all');
  const steps = ['Conectando...','Importando partidos...','Corrigiendo horarios y fases...','Limpiando duplicados...','Guardando...'];
  let si = 0;
  const tick = () => { if (btn) btn.textContent = steps[Math.min(si++, steps.length-1)]; };
  tick(); if (btn) btn.disabled = true;

  try {
    tick();
    const res = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json');
    if (!res.ok) throw new Error('No se pudo conectar con openfootball');
    const data = await res.json();
    const ofMatches = data.matches || [];

    const pad = n => String(n).padStart(2,'0');

    function toUTC(dateStr, timeAndTz) {
      const parts = (timeAndTz || '12:00 UTC-6').split(' ');
      const timeStr = parts[0], tzStr = parts[1] || 'UTC-6';
      const [h, min] = timeStr.split(':').map(Number);
      const [yyyy, mm, dd] = dateStr.split('-').map(Number);
      const tzMatch = tzStr.match(/UTC([+-]\d+)/);
      const tzOffset = tzMatch ? parseInt(tzMatch[1]) : -6;
      const utcMs = Date.UTC(yyyy, mm - 1, dd, h, min, 0) - tzOffset * 3600000;
      const u = new Date(utcMs);
      return u.getUTCFullYear() + '-' + pad(u.getUTCMonth()+1) + '-' + pad(u.getUTCDate())
        + 'T' + pad(u.getUTCHours()) + ':' + pad(u.getUTCMinutes()) + ':00Z';
    }

    function roundToPhase(round, group) {
      const r = (round || '').toLowerCase();
      if (r.includes('round of 32'))                     return '16avos de final';
      if (r.includes('round of 16'))                     return 'Octavos de final';
      if (r.includes('quarter'))                         return 'Cuartos de final';
      if (r.includes('semi'))                            return 'Semifinal';
      if (r.includes('third') || r.includes('tercer'))  return 'Tercer lugar';
      if (r === 'final')                                 return 'Final';
      if (group)                                         return 'Fase de grupos - ' + group;
      return 'Fase de grupos';
    }

    function isPlaceholder(name) {
      if (!name) return true;
      if (/^[WL]\d+$/.test(name)) return true;
      if (/^\d+[A-Z](\/[A-Z])*$/.test(name)) return true;
      if (/^\d[A-Z](\/[A-Z\/]+)?$/.test(name)) return true;
      return false;
    }

    tick();
    let added = 0, timeFixed = 0, phaseFixed = 0, resultsFixed = 0;

    ofMatches.forEach(of => {
      const home = of.team1, away = of.team2;
      if (!home || !away || isPlaceholder(home) || isPlaceholder(away)) return;

      const datetime = toUTC(of.date, of.time);
      const phase    = roundToPhase(of.round, of.group);
      const result   = of.score?.ft
        ? {
            home:    String(of.score.ft[0]),
            away:    String(of.score.ft[1]),
            penHome: of.score.p ? String(of.score.p[0]) : '',
            penAway: of.score.p ? String(of.score.p[1]) : '',
          }
        : null;
      const goals1 = (of.goals1 || []).map(g => ({ name: g.name, minute: g.minute }));
      const goals2 = (of.goals2 || []).map(g => ({ name: g.name, minute: g.minute }));

      const existing = state.matches.find(m => m.home === home && m.away === away);
      if (existing) {
        if (existing.datetime !== datetime) { existing.datetime = datetime; timeFixed++; }
        if (existing.phase !== phase)       { existing.phase = phase;       phaseFixed++; }
        if (result && (existing.result?.home !== result.home || existing.result?.away !== result.away)) {
          // Preservar penales manuales si openfootball aún no los publica
          existing.result = {
            home:    result.home,
            away:    result.away,
            penHome: result.penHome !== '' ? result.penHome : (existing.result?.penHome ?? ''),
            penAway: result.penAway !== '' ? result.penAway : (existing.result?.penAway ?? ''),
          };
          resultsFixed++;
        } else if (result && of.score?.p) {
          // Marcador ya coincidía pero pueden llegar penales nuevos
          if (!existing.result?.penHome) {
            existing.result.penHome = result.penHome;
            existing.result.penAway = result.penAway;
            resultsFixed++;
          }
        }
        if (result) { existing.goals1 = goals1; existing.goals2 = goals2; }
      } else {
        state.matches.push({
          id: 'm' + Date.now() + Math.random().toString(36).slice(2,6),
          home, away, datetime, phase,
          result: result || { home: '', away: '' }
        });
        added++;
      }
    });

    tick();
    const beforeCount = state.matches.length;
    state.matches = state.matches.filter(m => !isPlaceholder(m.home) && !isPlaceholder(m.away));
    const seen = new Set();
    state.matches = state.matches.filter(m => {
      const k = m.home + '|' + m.away;
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
    const removed = beforeCount - state.matches.length;

    tick();
    await saveState();
    renderAdminMatches(); renderTabla(); renderStats(); renderMatches(); renderBracket();

    const parts = [];
    if (added > 0)        parts.push(added + ' nuevos');
    if (timeFixed > 0)    parts.push(timeFixed + ' horarios corregidos');
    if (phaseFixed > 0)   parts.push(phaseFixed + ' fases corregidas');
    if (resultsFixed > 0) parts.push(resultsFixed + ' resultados actualizados');
    if (removed > 0)      parts.push(removed + ' eliminados');

    if (btn) {
      btn.textContent = parts.length ? '✓ ' + parts.join(' · ') : '✓ Todo al día';
      setTimeout(() => { btn.textContent = '🔄 Sincronizar'; btn.disabled = false; }, 4000);
    }
  } catch(e) {
    if (btn) { btn.textContent = '✗ Error: ' + e.message; btn.disabled = false; }
    console.error(e);
  }
}

async function importFixtures() { return syncAll(); }
async function syncResults()    { return syncAll(); }

// ─── Render: Comparar ────────────────────────────────────────────────────────
function renderComparar() {
  const listEl = document.getElementById('comparar-list');
  if (!listEl) return;

  // Partidos por día (hoy por defecto)
  populateCmpDates();
  const dayFilter = document.getElementById('cmp-date-filter')?.value || 'all';
  let matches = [...state.matches].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  if (dayFilter !== 'all') matches = matches.filter(m => m.datetime && dateInGT(m.datetime) === dayFilter);

  if (matches.length === 0) {
    listEl.innerHTML = '<div class="cmp-empty">No hay partidos para este día. Usa ‹ › para ver otro día.</div>';
    return;
  }

  // Agrupados por estado: finalizados / en curso / pendientes
  const groups = { done: [], live: [], pend: [] };
  matches.forEach(m => {
    if (m.result && m.result.home !== '') groups.done.push(m);
    else if (isLocked(m)) groups.live.push(m);
    else groups.pend.push(m);
  });

  const meta = {
    done: { label: 'Finalizados', icon: 'ti-circle-check' },
    live: { label: 'En curso',    icon: 'ti-ball-football' },
    pend: { label: 'Pendientes',  icon: 'ti-clock' }
  };
  const order = ['done', 'live', 'pend'];
  const firstVisible = order.find(k => groups[k].length);

  let html = '';
  order.forEach(key => {
    const ms = groups[key];
    if (!ms.length) return;
    const open = key === 'done' || (!groups.done.length && key === firstVisible);
    html += '<div class="cmp-group' + (open ? ' open' : '') + '" id="cmpg-' + key + '">'
      + '<button class="cmp-group-head" onclick="toggleCmpGroup(\'' + key + '\')">'
      + '<i class="ti ' + meta[key].icon + ' cmp-group-icon"></i>'
      + '<span class="cmp-group-title">' + meta[key].label + '</span>'
      + '<span class="cmp-group-count">' + ms.length + '</span>'
      + '<i class="ti ti-chevron-down cmp-chev"></i>'
      + '</button>'
      + '<div class="cmp-group-wrap"><div class="cmp-group-body">'
      + ms.map(cmpCard).join('')
      + '</div></div></div>';
  });

  listEl.innerHTML = html;
}

// Tarjeta colapsable de un partido
function cmpCard(m) {
  const hasResult = m.result && m.result.home !== '';
  const meId = state.currentUser?.id;

  // Clasifica puntos al estilo Pitaya (exacto / acierta ganador+bonos / falla)
  const badgeFor = pts => pts === state.points.exact ? 'badge-success' : pts > 0 ? 'badge-purple' : 'badge-danger';

  // Ganadores (mayor puntuación)
  let winnersHtml = '';
  if (hasResult) {
    const scored = state.users
      .filter(u => pickSet(state.picks[u.id]?.[m.id]))
      .map(u => ({ u, pts: calcPoints(u.id, m) }));
    const max = scored.reduce((mx, s) => Math.max(mx, s.pts), 0);
    const winners = max > 0 ? scored.filter(s => s.pts === max) : [];
    winnersHtml = winners.length
      ? winners.map(s => '<span class="cmp-win">🥇 ' + s.u.name.split(' ')[0]
          + '<span class="badge-win">+' + s.pts + '</span></span>').join('')
      : '<span class="cmp-noone">Nadie acertó este partido</span>';
  }

  // Mi predicción
  const myPick = meId ? state.picks[meId]?.[m.id] : null;
  const myHas = pickSet(myPick);
  const myNp = normPick(myPick);
  const myPts = hasResult && myHas ? calcPoints(meId, m) : null;
  const mineStr = myHas
    ? myNp.home + ' - ' + myNp.away + (myPts !== null ? ' <span class="cmp-mine-pts">(+' + myPts + ')</span>' : '')
    : '<span class="cmp-noone">Sin predicción</span>';

  // Detalle: todas las predicciones, ordenadas por puntos
  const detailHtml = state.users
    .map(u => {
      const pk = state.picks[u.id]?.[m.id];
      const has = pickSet(pk);
      const np = normPick(pk);
      const pts = hasResult && has ? calcPoints(u.id, m) : null;
      return { u, has, np, pts };
    })
    .sort((a, b) => (b.pts ?? -1) - (a.pts ?? -1))
    .map(r => {
      const color = colorFor(r.u.name);
      const pickStr = r.has ? r.np.home + '-' + r.np.away : '–';
      const cls = r.pts !== null ? badgeFor(r.pts) : 'badge-gray';
      return '<div class="cmp-pred' + (r.u.id === meId ? ' me' : '') + '">'
        + '<span class="cmp-avatar" style="background:' + color + '30;color:' + color + '">' + initials(r.u.name) + '</span>'
        + '<span class="cmp-pred-name">' + r.u.name.split(' ')[0] + '</span>'
        + '<span class="cmp-pred-pick">' + pickStr + '</span>'
        + '<span class="badge ' + cls + ' cmp-pred-badge">' + (r.pts !== null ? '+' + r.pts : '·') + '</span>'
        + '</div>';
    }).join('');

  const pen = penWinner(m.result);
  const penStr = pen && hasResult
    ? ' <span style="font-size:11px;font-weight:500;color:var(--text-secondary)">(pen ' + m.result.penHome + '–' + m.result.penAway + ')</span>'
    : '';
  const center = hasResult
    ? '<span class="cmp-score">' + m.result.home + ' - ' + m.result.away + penStr + '</span>'
    : '<span class="cmp-vs">vs</span>';
  const subline = hasResult
    ? 'Resultado final'
    : fmtDateShort(m.datetime) + ' · ' + fmtTime(m.datetime);

  return '<div class="cmp-card" id="cmpc-' + m.id + '">'
    + '<div class="cmp-fixture">'
    +   '<span class="cmp-team home">' + m.home + ' ' + flagImg(m.home) + '</span>'
    +   center
    +   '<span class="cmp-team away">' + flagImg(m.away) + ' ' + m.away + '</span>'
    + '</div>'
    + '<div class="cmp-subline">' + subline + '</div>'
    + (winnersHtml ? '<div class="cmp-winners">' + winnersHtml + '</div>' : '')
    + '<div class="cmp-mine"><span class="cmp-mine-label">⭐ Tu predicción</span>'
    +   '<span class="cmp-mine-val">' + mineStr + '</span></div>'
    + '<button class="cmp-toggle" onclick="toggleCmpCard(\'' + m.id + '\')">'
    +   '<span class="cmp-toggle-label"></span><i class="ti ti-chevron-down cmp-chev"></i>'
    + '</button>'
    + '<div class="cmp-detail-wrap"><div class="cmp-detail">' + detailHtml + '</div></div>'
    + '</div>';
}

// ─── Verificar horarios contra openfootball ──────────────────────────────────
async function verifySchedule() {
  const btn = document.getElementById('btn-verify-schedule');
  const out = document.getElementById('verify-schedule-output');
  btn.disabled = true;
  btn.textContent = 'Verificando...';
  out.innerHTML = '';

  try {
    const res = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json');
    if (!res.ok) throw new Error('No se pudo conectar con openfootball');
    const data = await res.json();
    const matches = data.matches || [];

    // Construir mapa source: "Home|Away" → datetime UTC
    const sourceMap = {};
    matches.forEach(m => {
      if (!m.team1 || !m.team2) return;
      const timeParts = (m.time || '12:00 UTC-6').split(' ');
      const timeStr = timeParts[0];
      const tzStr   = timeParts[1] || 'UTC-6';
      const tzMatch = tzStr.match(/UTC([+-]\d+)/);
      const tzOffset = tzMatch ? parseInt(tzMatch[1]) : -6;
      const [th, tm] = timeStr.split(':').map(Number);
      const [dy, dmo, dd] = m.date.split('-').map(Number);
      const utcMs = Date.UTC(dy, dmo - 1, dd, th, tm, 0) - tzOffset * 60 * 60 * 1000;
      const utcDate = new Date(utcMs);
      const pad = n => String(n).padStart(2,'0');
      const utcISO = utcDate.getUTCFullYear() + '-'
        + pad(utcDate.getUTCMonth()+1) + '-'
        + pad(utcDate.getUTCDate()) + 'T'
        + pad(utcDate.getUTCHours()) + ':'
        + pad(utcDate.getUTCMinutes()) + ':00Z';
      sourceMap[m.team1 + '|' + m.team2] = { utcISO, rawTime: m.time, date: m.date };
    });

    // Comparar contra partidos guardados
    let issues = [];
    let ok = 0;
    state.matches.forEach(m => {
      const key = m.home + '|' + m.away;
      const src = sourceMap[key];
      if (!src) return; // partido no encontrado en source (ok, puede ser manual)
      // Normalizar ambos a minutos UTC para comparar
      const savedDate  = new Date(m.datetime);
      const sourceDate = new Date(src.utcISO);
      const diffMin = Math.abs((savedDate.getTime() - sourceDate.getTime()) / 60000);
      if (diffMin > 1) {
        // Convertir a hora Guatemala para mostrar
        const toGT = dt => {
          const d = new Date(new Date(dt).getTime() - 6*60*60*1000);
          const pad = n => String(n).padStart(2,'0');
          return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
        };
        issues.push({
          match: m,
          savedGT:  toGT(m.datetime),
          correctGT: toGT(src.utcISO),
          correctUTC: src.utcISO,
          diffMin
        });
      } else {
        ok++;
      }
    });

    if (issues.length === 0) {
      out.innerHTML = '<div style="color:var(--success-text);background:var(--success-bg);border-radius:var(--radius);padding:10px 14px;font-size:13px">'
        + '<i class="ti ti-circle-check"></i> ¡Todos los horarios están correctos! (' + ok + ' partidos verificados)</div>';
    } else {
      let html = '<div style="font-size:13px;margin-bottom:10px;color:var(--danger-text)">'
        + '<i class="ti ti-alert-triangle"></i> ' + issues.length + ' partido(s) con horario incorrecto:</div>';
      issues.forEach(issue => {
        html += '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 10px;background:var(--bg-secondary);border-radius:var(--radius);margin-bottom:6px;font-size:13px">'
          + '<span style="font-weight:600;flex:1;min-width:140px">' + issue.match.home + ' vs ' + issue.match.away + '</span>'
          + '<span style="color:var(--danger-text)">Guardado: ' + issue.savedGT + ' GT</span>'
          + '<span style="color:var(--text-secondary)">→</span>'
          + '<span style="color:var(--success-text)">Correcto: ' + issue.correctGT + ' GT</span>'
          + '<button class="btn btn-sm btn-primary" style="font-size:11px;padding:3px 8px" '
          + 'onclick="fixOneSchedule(\'' + issue.match.id + '\',\'' + issue.correctUTC + '\',this)">'
          + '<i class="ti ti-check"></i> Corregir</button>'
          + '</div>';
      });
      out.innerHTML = html;
    }
  } catch(e) {
    out.innerHTML = '<div style="color:var(--danger-text);font-size:13px"><i class="ti ti-alert-circle"></i> Error: ' + e.message + '</div>';
  }
  btn.disabled = false;
  btn.textContent = 'Verificar horarios';
}

async function fixOneSchedule(matchId, correctUTC, btn) {
  const m = state.matches.find(x => x.id === matchId);
  if (!m) return;
  m.datetime = correctUTC;
  btn.disabled = true;
  btn.textContent = '✓ Corregido';
  btn.style.background = 'var(--success-bg)';
  btn.style.color = 'var(--success-text)';
  await saveState();
  renderMatches();
}

// ─── Corrección masiva de horarios ───────────────────────────────────────────
function openFixTimesModal() {
  // Previsualizar partidos afectados
  const fromHour = document.getElementById('fix-from-hour').value.padStart(2,'0') + ':00';
  const toHour   = document.getElementById('fix-to-hour').value.padStart(2,'0')   + ':00';
  const affected = state.matches.filter(m => m.datetime && m.datetime.includes('T' + fromHour + ':'));
  document.getElementById('fix-times-preview').textContent =
    affected.length > 0
      ? `Se cambiarán ${affected.length} partido(s) de ${fromHour} → ${toHour}`
      : `No hay partidos con hora ${fromHour}`;
  document.getElementById('modal-fixtimes-overlay').classList.remove('hidden');
}
function closeFixTimesModal() {
  document.getElementById('modal-fixtimes-overlay').classList.add('hidden');
}
async function confirmFixTimes() {
  const fromHour = document.getElementById('fix-from-hour').value.padStart(2,'0') + ':00';
  const toHour   = document.getElementById('fix-to-hour').value.padStart(2,'0')   + ':00';
  let changed = 0;
  state.matches.forEach(m => {
    if (m.datetime && m.datetime.includes('T' + fromHour + ':')) {
      m.datetime = m.datetime.replace('T' + fromHour + ':', 'T' + toHour + ':');
      changed++;
    }
  });
  closeFixTimesModal();
  await saveState();
  renderAdminMatches();
  renderMatches();
  alert(`✓ ${changed} partido(s) actualizados de ${fromHour} → ${toHour}`);
}

// ─── Borrar todos los partidos ───────────────────────────────────────────────
function openDeleteAllModal() {
  document.getElementById('modal-deleteall-overlay').classList.remove('hidden');
}
function closeDeleteAllModal() {
  document.getElementById('modal-deleteall-overlay').classList.add('hidden');
}
async function confirmDeleteAll() {
  state.matches = [];
  state.picks   = {};
  closeDeleteAllModal();
  await saveState();
  renderAdminMatches();
  renderMyStats();
  renderMatches();
  renderTabla();
  renderStats();
}

// ─── Cambiar PIN ─────────────────────────────────────────────────────────────
function cpNext(prefix, el, nextIdx) {
  if (el.value.length === 1 && nextIdx !== null)
    document.getElementById('cp-' + prefix + '-' + nextIdx).focus();
}
function cpBack(prefix, e, el, prevIdx) {
  if (e.key === 'Backspace' && el.value === '' && prevIdx !== null)
    document.getElementById('cp-' + prefix + '-' + prevIdx).focus();
}
function getCpPin(prefix) {
  return [0,1,2,3].map(i => document.getElementById('cp-' + prefix + '-' + i).value).join('');
}
function clearCpPin(prefix) {
  [0,1,2,3].forEach(i => { document.getElementById('cp-' + prefix + '-' + i).value = ''; });
}

function openChangePinModal() {
  ['cur','new','cfm'].forEach(p => clearCpPin(p));
  document.getElementById('cp-error').classList.add('hidden');
  document.getElementById('cp-success').classList.add('hidden');
  ['cur','new','cfm'].forEach(p =>
    [0,1,2,3].forEach(i => document.getElementById('cp-'+p+'-'+i).classList.remove('error'))
  );
  document.getElementById('modal-changepin-overlay').classList.remove('hidden');
  document.getElementById('cp-cur-0').focus();
}
function closeChangePinModal() {
  document.getElementById('modal-changepin-overlay').classList.add('hidden');
}
async function saveNewPin() {
  const errEl = document.getElementById('cp-error');
  const sucEl = document.getElementById('cp-success');
  errEl.classList.add('hidden');
  sucEl.classList.add('hidden');

  const cur = getCpPin('cur');
  const nw  = getCpPin('new');
  const cfm = getCpPin('cfm');

  const user = state.users.find(u => u.id === state.currentUser.id);

  if (cur.length < 4) { errEl.textContent = 'Ingresa tu PIN actual completo'; errEl.classList.remove('hidden'); return; }
  if (user.pin && user.pin !== cur) {
    errEl.textContent = 'PIN actual incorrecto';
    errEl.classList.remove('hidden');
    clearCpPin('cur');
    document.getElementById('cp-cur-0').focus();
    return;
  }
  if (nw.length < 4) { errEl.textContent = 'El nuevo PIN debe tener 4 dígitos'; errEl.classList.remove('hidden'); return; }
  if (nw !== cfm) {
    errEl.textContent = 'Los PINs nuevos no coinciden';
    errEl.classList.remove('hidden');
    clearCpPin('new'); clearCpPin('cfm');
    document.getElementById('cp-new-0').focus();
    return;
  }

  user.pin = nw;
  state.currentUser = user;
  await saveState();
  sucEl.classList.remove('hidden');
  setTimeout(() => closeChangePinModal(), 1500);
}

// ─── Boot ────────────────────────────────────────────────────────────────────
initFirebase().catch(err => {
  console.error('Firebase error:', err);
  document.body.innerHTML = `<div style="padding:2rem;font-family:sans-serif;color:#a32d2d">
    <h2>Error de configuración</h2>
    <p>Asegúrate de haber reemplazado los valores de Firebase en <code>app.js</code>. Ver <code>README.md</code>.</p>
  </div>`;
});
// ─── Bracket Mundial 2026 ────────────────────────────────────────────────────
const BRACKET_STRUCTURE = {
  r32: [
    { home: 'South Africa', away: 'Canada' },   // 0=M73
    { home: 'Germany',      away: 'Paraguay' },  // 1=M74  ↘ R16[0]
    { home: 'Netherlands',  away: 'Morocco' },   // 2=M75
    { home: 'Brazil',       away: 'Japan' },     // 3=M76  ↘ R16[2]
    { home: 'France',       away: 'Sweden' },    // 4=M77  ↘ R16[0]
    { home: 'Ivory Coast',  away: 'Norway' },    // 5=M78
    { home: 'Mexico',       away: 'Ecuador' },   // 6=M79  ↘ R16[3]
    { home: 'England',      away: 'DR Congo' },  // 7=M80
    { home: 'USA',          away: 'Bosnia & Herzegovina' }, // 8=M81
    { home: 'Belgium',      away: 'Senegal' },              // 9=M82
    { home: 'Portugal',     away: 'Croatia' },              // 10=M83
    { home: 'Spain',        away: 'Austria' },              // 11=M84
    { home: 'Switzerland',  away: 'Algeria' },              // 12=M85
    { home: 'Argentina',    away: 'Cape Verde' },           // 13=M86
    { home: 'Colombia',     away: 'Ghana' },                // 14=M87
    { home: 'Australia',    away: 'Egypt' },                // 15=M88
  ],
  // R16: W74vsW77, W73vsW75, W76vsW78, W79vsW80, W83vsW84, W81vsW82, W86vsW88, W85vsW87
  r16Pairs: [
    [1, 4],   // R16[0]: W74 vs W77
    [0, 2],   // R16[1]: W73 vs W75
    [3, 5],   // R16[2]: W76 vs W78
    [6, 7],   // R16[3]: W79 vs W80
    [10,11],  // R16[4]: W83 vs W84
    [8, 9],   // R16[5]: W81 vs W82
    [13,15],  // R16[6]: W86 vs W88
    [12,14],  // R16[7]: W85 vs W87
  ],
  // QF: W89vsW90=R16[0]vsR16[1], W91vsW92=R16[2]vsR16[3], W93vsW94=R16[4]vsR16[5], W95vsW96=R16[6]vsR16[7]
  qfPairs:  [[0,1],[2,3],[4,5],[6,7]],
  // SF: W97vsW98=QF[0]vsQF[1], W99vsW100=QF[2]vsQF[3]
  sfPairs:  [[0,1],[2,3]],
};

function getWinnerOf(home, away) {
  if (!home || !away) return null;
  const m = state.matches.find(sm =>
    (sm.home === home && sm.away === away) ||
    (sm.home === away && sm.away === home)
  );
  if (!m) return null;
  const rh = m.result?.home, ra = m.result?.away;
  if (rh === '' || rh == null || ra === '' || ra == null) return null;
  const nh = parseInt(rh), na = parseInt(ra);
  if (isNaN(nh) || isNaN(na)) return null;
  if (nh > na) return m.home;
  if (na > nh) return m.away;
  // Empate: desempate por penales
  const pw = penWinner(m.result);
  if (!pw) return null;
  return pw === 'H' ? m.home : m.away;
}

function resolveBracket() {
  const r32 = BRACKET_STRUCTURE.r32;
  const w32 = r32.map(m => getWinnerOf(m.home, m.away));
  const w16 = BRACKET_STRUCTURE.r16Pairs.map(([a,b]) => {
    const ha = w32[a], hb = w32[b];
    return (ha && hb) ? getWinnerOf(ha, hb) : null;
  });
  const wQF = BRACKET_STRUCTURE.qfPairs.map(([a,b]) => {
    const ha = w16[a], hb = w16[b];
    return (ha && hb) ? getWinnerOf(ha, hb) : null;
  });
  const wSF = BRACKET_STRUCTURE.sfPairs.map(([a,b]) => {
    const ha = wQF[a], hb = wQF[b];
    return (ha && hb) ? getWinnerOf(ha, hb) : null;
  });
  // SF losers → 3rd place
  const sfLosers = BRACKET_STRUCTURE.sfPairs.map(([a,b]) => {
    const ha = wQF[a], hb = wQF[b];
    if (!ha || !hb) return null;
    const w = getWinnerOf(ha, hb);
    return w ? (w === ha ? hb : ha) : null;
  });
  const champion = (wSF[0] && wSF[1]) ? getWinnerOf(wSF[0], wSF[1]) : null;
  return { w32, w16, wQF, wSF, sfLosers, champion };
}

// ── Flag-only compact bracket ──
function brFlag(team, isWinner, size) {
  const c = team ? TEAM_FLAGS[team] : null;
  // flagcdn.com only supports specific widths: 20, 40, 80, 160, 320...
  if (c) {
    return `<img src="https://flagcdn.com/w40/${c}.png" alt="${team}" title="${team}" loading="lazy"
      class="brf${isWinner ? ' brf-win' : ''}">`;
  }
  return `<span class="brf brf-tbd"><i class="ti ti-star-filled"></i></span>`;
}

function brMatch(homeTeam, awayTeam, winner, isVertical) {
  const hW = winner && winner === homeTeam;
  const aW = winner && winner === awayTeam;
  return `<div class="brm${isVertical ? ' brm-v' : ''}">
    <div class="brm-team${hW ? ' brm-w' : ''}">${brFlag(homeTeam, hW, 28)}</div>
    <div class="brm-team${aW ? ' brm-w' : ''}">${brFlag(awayTeam, aW, 28)}</div>
  </div>`;
}

function renderBracket() {
  const el = document.getElementById('tab-bracket');
  if (!el || el.classList.contains('hidden')) return;

  const { w32, w16, wQF, wSF, sfLosers, champion } = resolveBracket();
  const r32 = BRACKET_STRUCTURE.r32;
  const r16p = BRACKET_STRUCTURE.r16Pairs;
  const qfp  = BRACKET_STRUCTURE.qfPairs;
  const sfp  = BRACKET_STRUCTURE.sfPairs;

  // Build team pairs for each round
  const r16t = r16p.map(([a,b]) => ({ home: w32[a], away: w32[b] }));
  const qft  = qfp.map(([a,b])  => ({ home: w16[a], away: w16[b] }));
  const sft  = sfp.map(([a,b])  => ({ home: wQF[a], away: wQF[b] }));

  // Left side: indices 0-3 from each round
  // Layout: 8 r32 → 4 r16 → 2 qf → 1 sf → center
  function col(items) {
    return `<div class="brcol">${items.join('')}</div>`;
  }
  function spacer() { return '<div class="brspc"></div>'; }

  // Champion flag
  const champC = champion ? TEAM_FLAGS[champion] : null;
  const champFlag = champC
    ? `<img src="https://flagcdn.com/w80/${champC}.png" alt="${champion}" title="${champion}" class="br-champ-flag">`
    : `<span class="br-champ-tbd"><i class="ti ti-trophy"></i></span>`;

  // 3rd place
  const tp1 = sfLosers[0], tp2 = sfLosers[1];
  const tpW = (tp1 && tp2) ? getWinnerOf(tp1, tp2) : null;

  // Build columns — left side (r32 idx 0-7, r16 idx 0-3, qf idx 0-1, sf idx 0)
  const leftR32 = [
    brMatch(r32[1].home, r32[1].away, w32[1]),
    brMatch(r32[4].home, r32[4].away, w32[4]),
    spacer(),
    brMatch(r32[0].home, r32[0].away, w32[0]),
    brMatch(r32[2].home, r32[2].away, w32[2]),
    spacer(),
    brMatch(r32[3].home, r32[3].away, w32[3]),
    brMatch(r32[5].home, r32[5].away, w32[5]),
    spacer(),
    brMatch(r32[6].home, r32[6].away, w32[6]),
    brMatch(r32[7].home, r32[7].away, w32[7]),
  ];
  const leftR16 = [
    brMatch(r16t[0].home, r16t[0].away, w16[0]),
    spacer(), spacer(),
    brMatch(r16t[1].home, r16t[1].away, w16[1]),
    spacer(), spacer(),
    brMatch(r16t[2].home, r16t[2].away, w16[2]),
    spacer(), spacer(),
    brMatch(r16t[3].home, r16t[3].away, w16[3]),
  ];
  const leftQF = [
    spacer(),
    brMatch(qft[0].home, qft[0].away, wQF[0]),
    spacer(), spacer(), spacer(),
    brMatch(qft[1].home, qft[1].away, wQF[1]),
    spacer(),
  ];
  const leftSF = [
    spacer(), spacer(),
    brMatch(sft[0].home, sft[0].away, wSF[0]),
    spacer(), spacer(),
  ];

  // Right side (mirrored)
  const rightR32 = [
    brMatch(r32[10].home, r32[10].away, w32[10]),
    brMatch(r32[11].home, r32[11].away, w32[11]),
    spacer(),
    brMatch(r32[8].home,  r32[8].away,  w32[8]),
    brMatch(r32[9].home,  r32[9].away,  w32[9]),
    spacer(),
    brMatch(r32[13].home, r32[13].away, w32[13]),
    brMatch(r32[15].home, r32[15].away, w32[15]),
    spacer(),
    brMatch(r32[12].home, r32[12].away, w32[12]),
    brMatch(r32[14].home, r32[14].away, w32[14]),
  ];
  const rightR16 = [
    brMatch(r16t[4].home, r16t[4].away, w16[4]),
    spacer(), spacer(),
    brMatch(r16t[5].home, r16t[5].away, w16[5]),
    spacer(), spacer(),
    brMatch(r16t[6].home, r16t[6].away, w16[6]),
    spacer(), spacer(),
    brMatch(r16t[7].home, r16t[7].away, w16[7]),
  ];
  const rightQF = [
    spacer(),
    brMatch(qft[2].home, qft[2].away, wQF[2]),
    spacer(), spacer(), spacer(),
    brMatch(qft[3].home, qft[3].away, wQF[3]),
    spacer(),
  ];
  const rightSF = [
    spacer(), spacer(),
    brMatch(sft[1].home, sft[1].away, wSF[1]),
    spacer(), spacer(),
  ];

  el.innerHTML = `
  <div class="brwrap">
    <div class="brtitle"><i class="ti ti-trophy"></i> Bracket Mundial 2026</div>
    <div class="brscroll">
      <div class="brgrid">
        <div class="brhdr">16avos</div>
        <div class="brhdr">8vos</div>
        <div class="brhdr">Cuartos</div>
        <div class="brhdr">Semi</div>
        <div class="brhdr"></div>
        <div class="brhdr">Semi</div>
        <div class="brhdr">Cuartos</div>
        <div class="brhdr">8vos</div>
        <div class="brhdr">16avos</div>

        ${col(leftR32)}
        ${col(leftR16)}
        ${col(leftQF)}
        ${col(leftSF)}

        <div class="brcenter">
          <div class="br-champion">
            ${champFlag}
            <div class="br-champ-label">🏆 Campeón</div>
            <div class="br-champ-name">${champion || '?'}</div>
          </div>
          <div class="br-third-wrap">
            <div class="br-third-label">🥉 3er lugar</div>
            <div class="br-third-flags">
              ${brFlag(tp1, tpW===tp1, 32)}
              <span class="br-third-vs">vs</span>
              ${brFlag(tp2, tpW===tp2, 32)}
            </div>
          </div>
        </div>

        ${col(rightSF)}
        ${col(rightQF)}
        ${col(rightR16)}
        ${col(rightR32)}
      </div>
    </div>
    <p class="br-note"><i class="ti ti-info-circle"></i> Se actualiza automáticamente con los resultados oficiales.</p>
  </div>`;
}
