'use strict';

/* ================= constants ================= */

const KINDS = {
  pain:   { label: 'כאב',          color: '#e5484d' },
  numb:   { label: 'חוסר תחושה',   color: '#3b82f6' },
  tingle: { label: 'נימול / עקצוץ', color: '#9b59d0' },
};
const NATURES = { muscle: 'שריר', nerve: 'עצבי', unsure: 'לא בטוח' };
const TRIGGERS = ['ישיבה ממושכת', 'הרמה', 'התכופפות', 'קימה בבוקר', 'הליכה', 'עמידה ממושכת',
  'נהיגה', 'ספורט', 'שיעול / עיטוש', 'תנועה חדה', 'בלי סיבה ברורה'];

const REGIONS = {
  // back (posterior view)
  'thor-l': 'גב עליון – צד שמאל', 'thor-c': 'גב עליון – עמוד השדרה', 'thor-r': 'גב עליון – צד ימין',
  'lum-l': 'גב תחתון – צד שמאל', 'lum-c': 'גב תחתון – עמוד השדרה', 'lum-r': 'גב תחתון – צד ימין',
  'sacrum': 'עצה (סקרום)', 'glute-l': 'ישבן שמאל', 'glute-r': 'ישבן ימין',
  // left leg
  'ham': 'ירך אחורית', 'knee-b': 'שקע הברך', 'calf': 'שוק אחורית (תאומים)', 'achilles': 'גיד אכילס',
  'quad': 'ירך קדמית', 'thigh-lat': 'ירך – צד חיצוני', 'knee-f': 'ברך', 'shin': 'שוק קדמית', 'shin-lat': 'שוק – צד חיצוני',
  // left foot
  'toe-big': 'בוהן גדולה (מלמעלה)', 'toes': 'אצבעות (מלמעלה)', 'dorsum': 'גב כף הרגל', 'ankle-f': 'קרסול – קדמי',
  'mall-med': 'קרסול – עצם פנימית', 'mall-lat': 'קרסול – עצם חיצונית',
  'sole-big': 'בוהן גדולה (מלמטה)', 'sole-toes': 'אצבעות (מלמטה)', 'ball': 'כרית כף הרגל', 'arch': 'קשת כף הרגל',
  'sole-lat': 'סוליה – צד חיצוני', 'heel': 'עקב',
};
const REGION_ORDER = Object.keys(REGIONS);
const PANEL_OF = {};

const PANELS = [
  { id: 'back', label: 'גב', svg: `
<svg viewBox="0 0 220 290" class="body">
  <circle class="deco" cx="110" cy="22" r="17"/>
  <rect class="deco" x="100" y="36" width="20" height="14" rx="4"/>
  <path class="deco" d="M40,58 Q28,62 25,80 L17,168 Q16,180 26,180 L33,174 L46,100 Z"/>
  <path class="deco" d="M180,58 Q192,62 195,80 L203,168 Q204,180 194,180 L187,174 L174,100 Z"/>
  <path class="deco" d="M54,250 Q56,280 66,290 L98,290 L104,252 Z"/>
  <path class="deco" d="M166,250 Q164,280 154,290 L122,290 L116,252 Z"/>
  <path class="rg" data-r="thor-l" d="M40,60 Q45,50 70,48 L100,48 L100,140 L58,140 Q50,100 40,60 Z"/>
  <rect class="rg" data-r="thor-c" x="100" y="48" width="20" height="92"/>
  <path class="rg" data-r="thor-r" d="M180,60 Q175,50 150,48 L120,48 L120,140 L162,140 Q170,100 180,60 Z"/>
  <path class="rg" data-r="lum-l" d="M58,140 L100,140 L100,200 L56,200 Q52,170 58,140 Z"/>
  <rect class="rg" data-r="lum-c" x="100" y="140" width="20" height="60"/>
  <path class="rg" data-r="lum-r" d="M162,140 L120,140 L120,200 L164,200 Q168,170 162,140 Z"/>
  <path class="rg" data-r="glute-l" d="M56,200 L92,200 L102,240 Q100,265 78,268 Q55,265 52,240 Q52,215 56,200 Z"/>
  <path class="rg" data-r="glute-r" d="M164,200 L128,200 L118,240 Q120,265 142,268 Q165,265 168,240 Q168,215 164,200 Z"/>
  <path class="rg" data-r="sacrum" d="M92,200 L128,200 L118,242 L102,242 Z"/>
  <text class="cap" x="28" y="26">שמאל</text>
  <text class="cap" x="192" y="26">ימין</text>
  <text class="cap" x="110" y="286">מבט מאחור</text>
</svg>` },
  { id: 'leg', label: 'רגל שמאל', svg: `
<svg viewBox="0 0 240 322" class="body">
  <ellipse class="deco" cx="68" cy="306" rx="13" ry="6"/>
  <path class="deco" d="M166,292 L188,292 L196,306 L160,306 Z"/>
  <path class="rg" data-r="ham" d="M40,24 Q66,14 92,24 L86,140 L48,140 Z"/>
  <path class="rg" data-r="knee-b" d="M48,140 L86,140 L84,172 L50,172 Z"/>
  <path class="rg" data-r="calf" d="M50,172 L84,172 Q92,212 80,260 L56,260 Q42,212 50,172 Z"/>
  <path class="rg" data-r="achilles" d="M56,260 L80,260 L76,298 L60,298 Z"/>
  <path class="rg" data-r="quad" d="M150,24 Q170,16 188,20 L184,140 L156,140 Z"/>
  <path class="rg" data-r="thigh-lat" d="M188,20 Q200,22 205,30 L196,140 L184,140 Z"/>
  <path class="rg" data-r="knee-f" d="M156,140 L196,140 L193,172 L159,172 Z"/>
  <path class="rg" data-r="shin" d="M159,172 L180,172 L177,292 L166,292 Q160,230 159,172 Z"/>
  <path class="rg" data-r="shin-lat" d="M180,172 L193,172 Q198,220 188,292 L177,292 Z"/>
  <text class="cap" x="24" y="90">חוץ</text>
  <text class="cap" x="220" y="90">חוץ</text>
  <text class="cap" x="66" y="320">מאחור</text>
  <text class="cap" x="176" y="320">מלפנים</text>
</svg>` },
  { id: 'foot', label: 'כף רגל', svg: `
<svg viewBox="0 0 240 300" class="body">
  <rect class="deco" x="50" y="240" width="36" height="36" rx="6"/>
  <g class="rg" data-r="toes">
    <ellipse cx="40" cy="104" rx="6" ry="8"/><ellipse cx="51" cy="95" rx="6.5" ry="9"/>
    <ellipse cx="62" cy="89" rx="7" ry="10"/><ellipse cx="73" cy="86" rx="7" ry="10"/>
  </g>
  <ellipse class="rg" data-r="toe-big" cx="88" cy="86" rx="10" ry="15"/>
  <path class="rg" data-r="dorsum" d="M34,114 Q60,98 98,104 L94,200 Q66,206 42,200 Z"/>
  <path class="rg" data-r="ankle-f" d="M42,200 Q66,206 94,200 L90,242 L46,242 Z"/>
  <circle class="rg" data-r="mall-med" cx="96" cy="228" r="9"/>
  <circle class="rg" data-r="mall-lat" cx="40" cy="232" r="9"/>
  <ellipse class="rg" data-r="sole-big" cx="152" cy="86" rx="10" ry="15"/>
  <g class="rg" data-r="sole-toes">
    <ellipse cx="167" cy="86" rx="7" ry="10"/><ellipse cx="178" cy="89" rx="7" ry="10"/>
    <ellipse cx="189" cy="95" rx="6.5" ry="9"/><ellipse cx="200" cy="104" rx="6" ry="8"/>
  </g>
  <path class="rg" data-r="ball" d="M142,104 Q180,98 206,114 L202,150 L146,150 Z"/>
  <path class="rg" data-r="arch" d="M146,150 L170,150 L168,222 L152,222 Q140,186 146,150 Z"/>
  <path class="rg" data-r="sole-lat" d="M170,150 L202,150 Q206,186 196,222 L168,222 Z"/>
  <path class="rg" data-r="heel" d="M152,222 L196,222 Q200,272 174,274 Q148,272 152,222 Z"/>
  <text class="cap" x="22" y="70">חוץ</text><text class="cap" x="108" y="70">פנים</text>
  <text class="cap" x="137" y="70">פנים</text><text class="cap" x="220" y="70">חוץ</text>
  <text class="cap" x="68" y="294">מלמעלה</text>
  <text class="cap" x="176" y="294">סוליה</text>
</svg>` },
];
for (const p of PANELS) for (const m of p.svg.matchAll(/data-r="([^"]+)"/g)) PANEL_OF[m[1]] = p.id;

/* ================= storage ================= */
// The Google Sheet is the only real store. The phone keeps just the connection settings
// and changes that haven't reached the sheet yet (e.g. logged without reception).

const CFG_KEY = 'backtracker.cloud', QUEUE_KEY = 'backtracker.queue', LEGACY_KEY = 'backtracker.v1';
const ls = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('שגיאה בשמירה!'); } },
};
let cfg = ls.get(CFG_KEY, { url: '', secret: '' });
let queue = ls.get(QUEUE_KEY, []);          // pending ops, oldest first
let server = { entries: [], visits: [] };   // last copy received from the sheet (memory only)
let db = { entries: [], visits: [] };       // what the screens show = server + pending ops
let loaded = false;                         // got data from the sheet at least once this session
let syncState = 'off';

function applyOp(d, op) {
  if (op.op === 'upsert') d.entries = d.entries.filter(e => e.id !== op.entry.id).concat(op.entry);
  else if (op.op === 'delete') d.entries = d.entries.filter(e => e.id !== op.id);
  else if (op.op === 'addVisit') { if (!d.visits.includes(op.ts)) d.visits = d.visits.concat(op.ts); }
  else if (op.op === 'delVisit') d.visits = d.visits.filter(v => v !== op.ts);
}
function rebuild() {
  const d = { entries: [...server.entries], visits: [...server.visits] };
  queue.forEach(op => applyOp(d, op));
  db = d;
}
function change(...ops) {
  queue.push(...ops); ls.set(QUEUE_KEY, queue);
  rebuild(); syncNow();
}

// readable columns for the sheet; the full entry also goes along as JSON
function upsertOp(e) {
  const regions = regionList(e.regions || {}).map(r => {
    const v = e.regions[r];
    return `${REGIONS[r]}: ${KINDS[v.kind].label} ${v.level}${v.nature !== 'unsure' ? ' ' + NATURES[v.nature] : ''}`;
  }).join('; ');
  return { op: 'upsert', entry: e, cells: [fmtDate(e.ts), fmtTime(e.ts), entryMax(e) || '', e.episode ? 'כן' : '',
    regions, (e.triggers || []).join(', '), e.notes || ''] };
}
const visitOp = ts => ({ op: 'addVisit', ts, label: fmtDate(ts) });

// one-time move of data from the first (phone-only) version into the queue
function migrateLegacy() {
  const old = ls.get(LEGACY_KEY, null);
  if (!old || !Array.isArray(old.entries)) return;
  queue.push(...old.entries.map(upsertOp), ...(old.visits || []).map(visitOp));
  ls.set(QUEUE_KEY, queue);
  try { localStorage.removeItem(LEGACY_KEY); } catch (e) { /* ignore */ }
}

let syncing = null, retryTimer = null;
async function syncNow() {
  if (!cfg.url || !cfg.secret) return setSync('off');
  if (syncing) { syncing.again = true; return syncing.done; }
  let finish;
  syncing = { again: false, done: new Promise(r => (finish = r)) };
  const sent = queue.slice();
  setSync('busy');
  try {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 25000);
    const res = await fetch(cfg.url, {
      method: 'POST', signal: ctl.signal,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // "simple" request: no CORS preflight
      body: JSON.stringify({ secret: cfg.secret, ops: sent }),
    });
    clearTimeout(timer);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    queue = queue.slice(sent.length); ls.set(QUEUE_KEY, queue); // ops are idempotent, so a resend is harmless
    server = { entries: data.entries || [], visits: data.visits || [] };
    loaded = true; rebuild();
    setSync(queue.length ? 'pending' : 'ok');
    if (['home', 'history', 'summary'].includes(view)) render();
  } catch (err) {
    setSync(err.message === 'unauthorized' ? 'auth' : navigator.onLine === false ? 'offline' : 'error');
  }
  const again = syncing.again;
  syncing = null; finish();
  clearTimeout(retryTimer);
  if (again) return syncNow();
  if (syncState !== 'auth' && (queue.length || !loaded)) retryTimer = setTimeout(syncNow, 30000);
}

const SYNC_TEXT = {
  off: 'לא מחובר לענן – להגדרה',
  busy: 'מסנכרן…',
  ok: 'מסונכרן ✓',
  pending: 'יש שינויים שממתינים לשליחה',
  offline: 'אין אינטרנט – יישלח כשיחזור החיבור',
  auth: 'הקוד הסודי לא תואם לסקריפט',
  error: 'אין חיבור לגיליון – ננסה שוב',
};
function setSync(state) {
  syncState = state;
  const el = $('#syncbar'), n = queue.length;
  el.className = 's-' + state;
  el.textContent = SYNC_TEXT[state] + (n && !['ok', 'off', 'busy'].includes(state) ? ` (${n})` : '');
  el.dataset.act = state === 'off' || state === 'auth' ? 'go' : 'sync';
  el.dataset.v = 'settings';
}

/* ================= helpers ================= */

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const DAY = 86400000;
const pad2 = n => String(n).padStart(2, '0');
const fmtShort = ts => { const d = new Date(ts); return `${d.getDate()}/${d.getMonth() + 1}`; };
const fmtDate = ts => { const d = new Date(ts); return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`; };
const fmtTime = ts => { const d = new Date(ts); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const WD = new Intl.DateTimeFormat('he-IL', { weekday: 'long' });
const fmtDay = ts => {
  const today = startOfDay(Date.now()), d = startOfDay(ts);
  if (d === today) return 'היום';
  if (d === startOfDay(today - DAY / 2)) return 'אתמול';
  return `${WD.format(ts)}, ${fmtDate(ts)}`;
};
function startOfDay(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
const dayKey = ts => { const d = new Date(ts); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const toLocalInput = ts => { const d = new Date(ts); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const daysAgoStart = n => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (n - 1)); return d.getTime(); };

function levelColor(l) {
  if (!l) return '#9aa0a6';
  return `hsl(${Math.round(130 - (l - 1) * (130 / 9))} 70% 44%)`;
}
const levelWord = l => l <= 3 ? 'קל' : l <= 6 ? 'בינוני' : l <= 8 ? 'חזק' : 'קשה מאוד';
const entryMax = e => Object.values(e.regions || {}).reduce((m, r) => Math.max(m, r.level || 0), 0);
const sortedEntries = () => [...db.entries].sort((a, b) => b.ts - a.ts);
const regionList = regs => REGION_ORDER.filter(r => regs[r]);
const dominant = obj => Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0];

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.h); toast.h = setTimeout(() => (t.hidden = true), 2200);
}

/* ================= body maps ================= */

// fills: { regionId: { color, opacity, label } }
function bodySvg(panelId, fills = {}, interactive = false) {
  let svg = PANELS.find(p => p.id === panelId).svg;
  if (interactive) svg = svg.replace('class="body"', 'class="body interactive"');
  return svg.replace(/class="rg" data-r="([^"]+)"/g, (m, r) => {
    const f = fills[r];
    const style = f ? ` style="fill:${f.color};fill-opacity:${f.opacity}"` : '';
    return `class="rg" data-r="${r}"${interactive ? ' data-act="region"' : ''}${style}`;
  });
}

// put labels (numbers) on top of filled regions, after the svg is in the DOM
function labelRegions(root, fills) {
  root.querySelectorAll('svg.body .rg[data-r]').forEach(el => {
    const f = fills[el.dataset.r];
    if (!f || f.label == null) return;
    const bb = el.getBBox();
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('class', 'rlabel');
    t.setAttribute('x', bb.x + bb.width / 2);
    t.setAttribute('y', bb.y + bb.height / 2);
    t.textContent = f.label;
    el.ownerSVGElement.appendChild(t);
  });
}

function draftFills() {
  const f = {};
  for (const [r, v] of Object.entries(draft.regions))
    f[r] = { color: KINDS[v.kind].color, opacity: (0.35 + 0.065 * v.level).toFixed(2), label: v.level };
  return f;
}

function aggregate(entries) {
  const regs = {}, trig = {};
  for (const e of entries) {
    for (const [r, v] of Object.entries(e.regions || {})) {
      const a = regs[r] || (regs[r] = { count: 0, sum: 0, max: 0, kinds: {}, natures: {} });
      a.count++; a.sum += v.level; a.max = Math.max(a.max, v.level);
      a.kinds[v.kind] = (a.kinds[v.kind] || 0) + 1;
      a.natures[v.nature] = (a.natures[v.nature] || 0) + 1;
    }
    for (const t of e.triggers || []) trig[t] = (trig[t] || 0) + 1;
  }
  for (const a of Object.values(regs)) a.avg = a.sum / a.count;
  return { regs, trig };
}

function heatFills(regs) {
  const f = {};
  for (const [r, a] of Object.entries(regs))
    f[r] = { color: KINDS[dominant(a.kinds)].color, opacity: (0.25 + 0.075 * a.avg).toFixed(2), label: a.count };
  return f;
}

const LEGEND = `<div class="legend">${Object.values(KINDS).map(k => `<span><i style="background:${k.color}"></i>${k.label}</span>`).join('')}</div>`;

/* ================= chart ================= */

function chartSvg(entries, fromTs) {
  const today = startOfDay(Date.now());
  const days = [];
  for (const d = new Date(startOfDay(fromTs)); d.getTime() <= today; d.setDate(d.getDate() + 1))
    days.push({ ts: d.getTime(), key: dayKey(d.getTime()), max: 0, ep: false, any: false });
  const idx = Object.fromEntries(days.map((d, i) => [d.key, i]));
  for (const e of entries) {
    const i = idx[dayKey(e.ts)];
    if (i == null) continue;
    const d = days[i];
    d.any = true; d.max = Math.max(d.max, entryMax(e)); if (e.episode) d.ep = true;
  }
  const W = 340, H = 150, L = 22, R = 6, T = 16, B = 22, n = days.length;
  const cw = (W - L - R) / n, bw = Math.max(1.5, Math.min(18, cw * 0.72)), ph = H - T - B;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="chart" direction="ltr">`;
  for (const v of [0, 5, 10]) {
    const y = T + ph * (1 - v / 10);
    s += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" class="grid"/><text x="${L - 5}" y="${y + 3}" class="ax" text-anchor="end">${v}</text>`;
  }
  days.forEach((d, i) => {
    const x = L + i * cw + (cw - bw) / 2;
    if (d.any) {
      const h = Math.max(2, ph * d.max / 10);
      s += `<rect x="${x}" y="${H - B - h}" width="${bw}" height="${h}" rx="${Math.min(3, bw / 2)}" fill="${levelColor(d.max)}"/>`;
    }
    if (d.ep) s += `<circle cx="${x + bw / 2}" cy="${T - 8}" r="3.5" class="ep"/>`;
  });
  [...new Set([0, Math.floor((n - 1) / 2), n - 1])].forEach(i => {
    const anchor = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle';
    const x = i === 0 ? L : i === n - 1 ? W - R : L + i * cw + cw / 2;
    s += `<text x="${x}" y="${H - 6}" class="ax" text-anchor="${anchor}">${fmtShort(days[i].ts)}</text>`;
  });
  return s + '</svg>';
}
const CHART_NOTE = `<div class="legend"><span><i style="background:var(--danger);border-radius:50%"></i>נתפס הגב</span><span>גובה העמודה = הכאב החזק ביותר באותו יום</span></div>`;

/* ================= views ================= */

let heatLabels = null; // fills of the heat map rendered by the current view
let view = 'home', draft = null, panel = 'back', heatPanel = 'back', histRange = 30, sumRange = null, sheet = null;

function entryRow(e) {
  const max = entryMax(e);
  const names = regionList(e.regions || {}).map(r => REGIONS[r]).join(', ');
  return `<button class="entry" data-act="edit" data-id="${e.id}">
    <div class="lvl" style="background:${levelColor(max)}">${max || '–'}</div>
    <div class="info">
      <div class="t">${fmtDay(e.ts)} · ${fmtTime(e.ts)}${e.episode ? '<span class="tag">נתפס הגב</span>' : ''}</div>
      <div class="r">${esc(names || e.notes || 'ללא אזורים מסומנים')}</div>
    </div></button>`;
}

// shown above data screens until the sheet has answered at least once
function cloudNote() {
  if (!cfg.url) return `<section class="card"><b>האפליקציה עוד לא מחוברת לגיליון.</b>
    <div class="muted">תיעודים חדשים נשמרים בינתיים בטלפון ויישלחו אחרי החיבור.</div>
    <button class="secondary" style="margin-top:10px" data-act="go" data-v="settings">לחיבור</button></section>`;
  if (loaded) return '';
  return `<section class="card muted">${syncState === 'busy' ? 'טוען נתונים מהגיליון…' : 'אין חיבור לגיליון – הנתונים יוצגו כשיחזור החיבור.'}</section>`;
}

const VIEWS = {
  home() {
    const all = sortedEntries();
    const lastEp = all.find(e => e.episode);
    const week = all.filter(e => e.ts >= daysAgoStart(7));
    const wMax = week.reduce((m, e) => Math.max(m, entryMax(e)), 0);
    const wAvg = week.length ? (week.reduce((s, e) => s + entryMax(e), 0) / week.length).toFixed(1) : '–';
    const hero = lastEp
      ? `<div class="big">${Math.floor((startOfDay(Date.now()) - startOfDay(lastEp.ts)) / DAY + 0.5)}</div>
         <div class="lbl">ימים מאז שהגב נתפס לאחרונה</div><div class="muted">${fmtDay(lastEp.ts)}</div>`
      : `<div class="lbl">עוד לא תועד מצב שהגב נתפס</div><div class="muted">כשזה קורה – סמן "נתפס הגב" בתיעוד</div>`;
    return `
      <header class="top"><h1>מעקב גב</h1><div class="sub">${fmtDay(Date.now())}</div></header>
      <button class="primary huge" data-act="new">＋ כואב לי עכשיו – לתעד</button>
      ${cloudNote()}
      <section class="card hero">${hero}</section>
      <section class="card"><h2>7 הימים האחרונים</h2>
        <div class="stats">
          <div class="stat"><b>${week.length}</b><span>תיעודים</span></div>
          <div class="stat"><b>${wMax || '–'}</b><span>כאב מרבי</span></div>
          <div class="stat"><b>${wAvg}</b><span>ממוצע</span></div>
        </div>
      </section>
      <section class="card"><h2>תיעוד אחרון</h2>${all[0] ? entryRow(all[0]) : '<div class="empty">אין עדיין תיעודים</div>'}</section>`;
  },

  editor() {
    const counts = {};
    for (const r of Object.keys(draft.regions)) counts[PANEL_OF[r]] = (counts[PANEL_OF[r]] || 0) + 1;
    const marked = regionList(draft.regions).map(r => {
      const v = draft.regions[r];
      return `<button class="chip region" data-act="region" data-r="${r}"><i style="background:${KINDS[v.kind].color}"></i>${REGIONS[r]} · ${v.level}${v.nature !== 'unsure' ? ' · ' + NATURES[v.nature] : ''}</button>`;
    }).join('');
    return `
      <header class="top bar"><button class="link" data-act="cancel">ביטול</button>
        <h1>${draft.isNew ? 'תיעוד חדש' : 'עריכת תיעוד'}</h1>
        <button class="link strong" data-act="save">שמירה</button></header>
      <section class="card">
        <h2>איפה מרגישים?</h2>
        <div class="muted">הקש על אזור באיור כדי לסמן כאב / חוסר תחושה</div>
        <div class="seg">${PANELS.map(p => `<button class="${p.id === panel ? 'on' : ''}" data-act="panel" data-p="${p.id}">${p.label}${counts[p.id] ? `<span class="badge">${counts[p.id]}</span>` : ''}</button>`).join('')}</div>
        <div class="map" id="editMap">${bodySvg(panel, draftFills(), true)}</div>
        ${LEGEND}
        ${marked ? `<div class="chips">${marked}</div>` : ''}
      </section>
      <section class="card">
        <label class="toggle"><span>הגב "נתפס"<small>התקף חד / תפיסה</small></span>
          <input type="checkbox" class="switch" data-field="episode" ${draft.episode ? 'checked' : ''}></label>
      </section>
      <section class="card"><h2>מה עשיתי / מה גרם לזה?</h2>
        <div class="chips">${TRIGGERS.map(t => `<button class="chip ${draft.triggers.includes(t) ? 'on' : ''}" data-act="trig" data-t="${esc(t)}">${t}</button>`).join('')}</div>
      </section>
      <section class="card"><label class="fl">מתי</label>
        <input type="datetime-local" data-field="ts" value="${toLocalInput(draft.ts)}"></section>
      <section class="card"><label class="fl">הערות</label>
        <textarea data-field="notes" placeholder="מה עזר, תרופות, איך זה התפתח...">${esc(draft.notes)}</textarea></section>
      <button class="primary huge" data-act="save">שמירה</button>
      ${draft.isNew ? '' : '<button class="danger" data-act="delete">מחיקת התיעוד</button>'}`;
  },

  history() {
    const from = histRange === 'all'
      ? Math.min(daysAgoStart(14), ...db.entries.map(e => e.ts))
      : daysAgoStart(histRange);
    const list = sortedEntries().filter(e => e.ts >= from);
    const { regs } = aggregate(list);
    heatLabels = heatFills(regs);
    let groups = '', lastDay = null;
    for (const e of list) {
      const k = dayKey(e.ts);
      if (k !== lastDay) { groups += `<div class="day-h">${fmtDay(e.ts)}</div>`; lastDay = k; }
      groups += entryRow(e);
    }
    return `
      <header class="top"><h1>היסטוריה</h1></header>${cloudNote()}
      <div class="seg page-seg">${[[7, 'שבוע'], [30, 'חודש'], [90, '3 חודשים'], ['all', 'הכל']].map(([v, l]) =>
        `<button class="${histRange === v ? 'on' : ''}" data-act="hrange" data-v="${v}">${l}</button>`).join('')}</div>
      <section class="card"><h2>עוצמת כאב לאורך זמן</h2>${chartSvg(list, from)}${CHART_NOTE}</section>
      <section class="card"><h2>איפה הרגשתי בתקופה הזו</h2>
        <div class="muted">המספר = כמה פעמים סומן האזור · צבע כהה יותר = עוצמה ממוצעת גבוהה יותר</div>
        <div class="seg">${PANELS.map(p => `<button class="${p.id === heatPanel ? 'on' : ''}" data-act="hpanel" data-p="${p.id}">${p.label}</button>`).join('')}</div>
        <div class="map small" data-heat>${bodySvg(heatPanel, heatLabels)}</div>${LEGEND}
      </section>
      ${groups || '<div class="card empty">אין תיעודים בתקופה הזו</div>'}`;
  },

  summary() {
    const lastVisit = db.visits.length ? Math.max(...db.visits) : null;
    if (sumRange == null) sumRange = lastVisit ? 'visit' : 30;
    const from = sumRange === 'visit' && lastVisit ? lastVisit
      : sumRange === 'all' ? Math.min(daysAgoStart(14), ...db.entries.map(e => e.ts))
      : daysAgoStart(sumRange === 'visit' ? 30 : sumRange);
    const list = sortedEntries().filter(e => e.ts >= from);
    const { regs, trig } = aggregate(list);
    const fills = heatLabels = heatFills(regs);
    const eps = list.filter(e => e.episode);
    const daysWith = new Set(list.map(e => dayKey(e.ts))).size;
    const max = list.reduce((m, e) => Math.max(m, entryMax(e)), 0);
    const rows = Object.entries(regs).sort((a, b) => b[1].count - a[1].count || b[1].avg - a[1].avg).map(([r, a]) => `
      <tr><td>${REGIONS[r]}<div class="k">${Object.entries(a.kinds).map(([k, c]) => KINDS[k].label + (Object.keys(a.kinds).length > 1 ? ` ×${c}` : '')).join(', ')}${natureText(a.natures)}</div></td>
      <td class="n">${a.count}</td><td class="n">${a.avg.toFixed(1)}</td><td class="n">${a.max}</td></tr>`).join('');
    const notes = list.filter(e => e.notes && e.notes.trim());
    const ranges = [[14, 'שבועיים'], [30, 'חודש'], [90, '3 חודשים'], ['all', 'הכל']];
    if (lastVisit) ranges.unshift(['visit', 'מביקור אחרון']);
    const usedMaps = PANELS.filter(p => Object.keys(regs).some(r => PANEL_OF[r] === p.id));

    return `
      <header class="top"><h1>סיכום למטפל</h1></header>${cloudNote()}
      <div class="seg page-seg no-print">${ranges.map(([v, l]) => `<button class="${sumRange === v ? 'on' : ''}" data-act="srange" data-v="${v}">${l}</button>`).join('')}</div>
      <section class="card">
        <h2>${fmtDate(from)} – ${fmtDate(Date.now())}${sumRange === 'visit' && lastVisit ? ' <span class="muted">(מאז הביקור האחרון)</span>' : ''}</h2>
        <div class="stats">
          <div class="stat"><b>${list.length}</b><span>תיעודים</span></div>
          <div class="stat"><b>${daysWith}</b><span>ימים עם תסמינים</span></div>
          <div class="stat"><b>${eps.length}</b><span>פעמים נתפס</span></div>
          <div class="stat"><b>${max || '–'}</b><span>כאב מרבי</span></div>
        </div>
        ${eps.length ? `<p class="muted">הגב נתפס: ${eps.map(e => fmtDate(e.ts)).reverse().join(' · ')}</p>` : ''}
      </section>
      ${list.length ? `
      <section class="card"><h2>אזורים</h2>
        <table class="rt"><thead><tr><th>אזור</th><th>פעמים</th><th>ממוצע</th><th>מקס׳</th></tr></thead><tbody>${rows}</tbody></table>
      </section>
      ${usedMaps.length ? `<section class="card"><h2>מפת כאב</h2><div class="maps-grid" data-heat>${usedMaps.map(p => `<div class="map small">${bodySvg(p.id, fills)}</div>`).join('')}</div>${LEGEND}</section>` : ''}
      <section class="card"><h2>עוצמה לאורך התקופה</h2>${chartSvg(list, from)}${CHART_NOTE}</section>
      ${Object.keys(trig).length ? `<section class="card"><h2>מה גרם / מה עשיתי</h2><div class="chips">${Object.entries(trig).sort((a, b) => b[1] - a[1]).map(([t, c]) => `<span class="chip">${esc(t)} ×${c}</span>`).join('')}</div></section>` : ''}
      ${notes.length ? `<section class="card"><h2>הערות</h2><ul class="notes-list">${notes.map(e => `<li><span class="d">${fmtDate(e.ts)} ${fmtTime(e.ts)}</span>${esc(e.notes)}</li>`).join('')}</ul></section>` : ''}
      ` : '<div class="card empty">אין תיעודים בתקופה הזו</div>'}
      <div class="btn-col no-print">
        <button class="primary" data-act="share">שיתוף כטקסט</button>
        <button class="secondary" data-act="print">הדפסה / שמירה כ-PDF</button>
        <button class="secondary" data-act="visit">היום הייתי אצל המטפל ✓</button>
      </div>
      ${lastVisit ? `<p class="muted no-print">ביקור אחרון שנרשם: ${fmtDate(lastVisit)}</p>` : ''}`;
  },

  settings() {
    const visits = [...db.visits].sort((a, b) => b - a);
    const connected = cfg.url && cfg.secret;
    return `
      <header class="top"><h1>ענן והגדרות</h1></header>
      <section class="card">
        <h2>חיבור ל-Google Sheets</h2>
        <p class="muted">כל התיעודים נשמרים בגיליון בחשבון Google שלך. בטלפון נשמרים רק תיעודים שעוד לא נשלחו (למשל כשאין קליטה).</p>
        <label class="fl">1. הקוד הסודי – זהה לקוד שבשורה SECRET בסקריפט</label>
        <div class="secret-row"><input id="cfgSecret" dir="ltr" autocapitalize="off" autocorrect="off" spellcheck="false" value="${esc(cfg.secret)}"><button class="secondary" data-act="copy-secret">העתקה</button></div>
        <label class="fl" style="margin-top:14px">2. כתובת הסקריפט (Web app URL)</label>
        <input type="url" id="cfgUrl" dir="ltr" placeholder="https://script.google.com/macros/s/…/exec" value="${esc(cfg.url)}">
        <div class="btn-col" style="margin-top:10px">
          <button class="primary" data-act="connect">${connected ? 'שמירה וסנכרון' : 'התחברות'}</button>
        </div>
        ${connected ? `<p class="muted">מצב: ${SYNC_TEXT[syncState]} · ${db.entries.length} תיעודים</p>` : ''}
        <div style="display:flex;justify-content:space-between">
          <button class="link" data-act="new-secret">קוד סודי חדש</button>
          ${connected ? '<button class="link" data-act="disconnect">ניתוק מהגיליון</button>' : ''}
        </div>
      </section>
      <section class="card">
        <h2>ביקורים אצל מטפל</h2>
        ${visits.length ? `<ul class="notes-list">${visits.map(v => `<li style="display:flex;justify-content:space-between;align-items:center">${fmtDay(v)}<button class="link" data-act="delvisit" data-v="${v}">הסרה</button></li>`).join('')}</ul>` : '<div class="muted">עוד לא נרשמו ביקורים. אפשר לרשום ממסך "למטפל".</div>'}
      </section>
      <section class="card">
        <h2>קובץ גיבוי (רשות)</h2>
        <p class="muted">הגיליון הוא הגיבוי. אפשר בנוסף לשמור עותק כקובץ, או לטעון קובץ גיבוי.</p>
        <div class="btn-col">
          <button class="secondary" data-act="export">ייצוא לקובץ</button>
          <button class="secondary" data-act="import">טעינה מקובץ</button>
        </div>
      </section>
      <p class="muted" style="text-align:center">מעקב גב · גרסה 2.0</p>`;
  },
};

function natureText(n) {
  const known = Object.entries(n).filter(([k]) => k !== 'unsure');
  if (!known.length) return '';
  return ' · ' + known.sort((a, b) => b[1] - a[1]).map(([k, c]) => NATURES[k] + (known.length > 1 ? ` ×${c}` : '')).join(', ');
}

function render() {
  document.body.classList.toggle('editing', view === 'editor');
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === view));
  heatLabels = null;
  $('#app').innerHTML = VIEWS[view]();
  if (view === 'editor') labelRegions($('#editMap'), draftFills());
  if (heatLabels) document.querySelectorAll('[data-heat]').forEach(el => labelRegions(el, heatLabels));
}

function go(v) { view = v; render(); window.scrollTo(0, 0); }

/* ================= region sheet ================= */

function openSheet(r) {
  const cur = draft.regions[r];
  sheet = { r, exists: !!cur, ...(cur || { kind: 'pain', level: 5, nature: 'unsure' }) };
  renderSheet();
}
function renderSheet() {
  const el = $('#sheet');
  if (!sheet) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  el.innerHTML = `
    <div class="sheet-bg" data-act="s-close"></div>
    <div class="sheet">
      <div class="grab"></div>
      <h2>${REGIONS[sheet.r]}</h2>
      <div class="lab">מה מרגישים?</div>
      <div class="seg">${Object.entries(KINDS).map(([k, v]) => `<button class="${sheet.kind === k ? 'on' : ''}" data-act="s-kind" data-k="${k}">${v.label}</button>`).join('')}</div>
      <div class="lab">כמה חזק? <b>${sheet.level}</b> – ${levelWord(sheet.level)}</div>
      <div class="levels">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => `<button class="${sheet.level === l ? 'on' : ''}" style="background:${levelColor(l)}" data-act="s-level" data-l="${l}">${l}</button>`).join('')}</div>
      <div class="lab">סוג</div>
      <div class="seg">${Object.entries(NATURES).map(([k, v]) => `<button class="${sheet.nature === k ? 'on' : ''}" data-act="s-nature" data-k="${k}">${v}</button>`).join('')}</div>
      <div class="muted">עצבי: שורף, דוקר, "זרם", מקרין לאורך הרגל, נימול · שריר: תפוס, עמום, כואב במגע או בתנועה</div>
      <div class="row">
        ${sheet.exists ? '<button class="danger" data-act="s-remove">הסרה</button>' : ''}
        <button class="primary" data-act="s-ok">אישור</button>
      </div>
    </div>`;
}
function closeSheet() { sheet = null; renderSheet(); }

/* ================= share / export ================= */

function summaryText() {
  const lastVisit = db.visits.length ? Math.max(...db.visits) : null;
  const from = sumRange === 'visit' && lastVisit ? lastVisit
    : sumRange === 'all' ? Math.min(daysAgoStart(14), ...db.entries.map(e => e.ts))
    : daysAgoStart(sumRange === 'visit' ? 30 : sumRange);
  const list = sortedEntries().filter(e => e.ts >= from);
  const { regs, trig } = aggregate(list);
  const eps = list.filter(e => e.episode).map(e => fmtDate(e.ts)).reverse();
  let t = `סיכום כאבי גב ${fmtDate(from)} – ${fmtDate(Date.now())}\n`;
  t += `תיעודים: ${list.length} | ימים עם תסמינים: ${new Set(list.map(e => dayKey(e.ts))).size}\n`;
  t += eps.length ? `הגב נתפס ${eps.length} פעמים: ${eps.join(', ')}\n` : 'הגב לא נתפס בתקופה\n';
  t += '\nאזורים:\n';
  for (const [r, a] of Object.entries(regs).sort((x, y) => y[1].count - x[1].count))
    t += `• ${REGIONS[r]}: ${a.count === 1 ? 'פעם אחת' : a.count + ' פעמים'}, ממוצע ${a.avg.toFixed(1)}, מקס' ${a.max} – ${Object.keys(a.kinds).map(k => KINDS[k].label).join('/')}${natureText(a.natures)}\n`;
  if (Object.keys(trig).length)
    t += '\nגורמים: ' + Object.entries(trig).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ×${c}`).join(', ') + '\n';
  const notes = list.filter(e => e.notes && e.notes.trim());
  if (notes.length) t += '\nהערות:\n' + notes.map(e => `- ${fmtDate(e.ts)} ${fmtTime(e.ts)}: ${e.notes.trim()}`).join('\n') + '\n';
  return t;
}

async function exportBackup() {
  const json = JSON.stringify({ app: 'back-tracker', version: 2, exported: Date.now(), ...db }, null, 1);
  const name = `back-tracker-${dayKey(Date.now())}.json`;
  const file = new File([json], name, { type: 'application/json' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: name });
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file); a.download = name; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }
    toast('הקובץ נשמר');
  } catch (e) {
    if (e.name !== 'AbortError') toast('הייצוא נכשל');
  }
}

$('#importFile').addEventListener('change', async ev => {
  const f = ev.target.files[0];
  ev.target.value = '';
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.entries)) throw new Error('bad');
    change(...d.entries.map(upsertOp), ...(d.visits || []).filter(v => !db.visits.includes(v)).map(visitOp));
    render();
    toast(`נטענו ${d.entries.length} תיעודים`);
  } catch (e) { toast('הקובץ לא תקין'); }
});

/* ================= actions ================= */

const ACTIONS = {
  go: a => go(a.dataset.v),
  new: () => { draft = { isNew: true, id: uid(), ts: Date.now(), regions: {}, episode: false, triggers: [], notes: '' }; panel = 'back'; go('editor'); },
  edit: a => {
    const e = db.entries.find(x => x.id === a.dataset.id);
    if (!e) return;
    draft = JSON.parse(JSON.stringify({ triggers: [], notes: '', ...e })); draft.isNew = false;
    const first = regionList(draft.regions)[0];
    panel = first ? PANEL_OF[first] : 'back';
    go('editor');
  },
  cancel: () => {
    if (draft.isNew && (Object.keys(draft.regions).length || draft.notes) && !confirm('לצאת בלי לשמור?')) return;
    draft = null; go('home');
  },
  save: () => {
    if (!Object.keys(draft.regions).length && !draft.episode && !draft.notes.trim())
      return toast('סמן לפחות אזור אחד באיור');
    const { isNew, ...e } = draft;
    change(upsertOp(e)); draft = null; toast('נשמר ✓'); go(isNew ? 'home' : 'history');
  },
  delete: () => {
    if (!confirm('למחוק את התיעוד הזה?')) return;
    change({ op: 'delete', id: draft.id }); draft = null; go('history');
  },
  panel: a => { panel = a.dataset.p; render(); },
  region: a => openSheet(a.dataset.r),
  trig: a => {
    const t = a.dataset.t, i = draft.triggers.indexOf(t);
    i < 0 ? draft.triggers.push(t) : draft.triggers.splice(i, 1);
    a.classList.toggle('on', i < 0);
  },
  's-close': closeSheet,
  's-kind': a => { sheet.kind = a.dataset.k; renderSheet(); },
  's-level': a => { sheet.level = +a.dataset.l; renderSheet(); },
  's-nature': a => { sheet.nature = a.dataset.k; renderSheet(); },
  's-ok': () => { const { r, kind, level, nature } = sheet; draft.regions[r] = { kind, level, nature }; closeSheet(); render(); },
  's-remove': () => { delete draft.regions[sheet.r]; closeSheet(); render(); },
  hrange: a => { histRange = a.dataset.v === 'all' ? 'all' : +a.dataset.v; render(); },
  hpanel: a => { heatPanel = a.dataset.p; render(); },
  srange: a => { const v = a.dataset.v; sumRange = isNaN(+v) ? v : +v; render(); },
  share: async () => {
    const text = summaryText();
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); toast('הועתק ללוח'); }
    } catch (e) { /* cancelled */ }
  },
  print: () => window.print(),
  visit: () => {
    if (!confirm('לרשום שהיום היית אצל המטפל? הסיכום הבא יתחיל מהיום.')) return;
    change(visitOp(Date.now())); sumRange = 'visit'; render(); toast('נרשם ביקור');
  },
  delvisit: a => { change({ op: 'delVisit', ts: +a.dataset.v }); render(); },
  export: exportBackup,
  import: () => $('#importFile').click(),
  sync: () => syncNow(),
  'copy-secret': async () => {
    try { await navigator.clipboard.writeText($('#cfgSecret').value.trim()); toast('הקוד הועתק'); }
    catch (e) { toast('לא הצלחתי להעתיק – סמן את הקוד והעתק ידנית'); }
  },
  'new-secret': () => {
    if (cfg.url && !confirm('קוד חדש יחייב לעדכן גם את הסקריפט בגיליון. להמשיך?')) return;
    cfg.secret = newSecret(); ls.set(CFG_KEY, cfg); render(); syncNow();
  },
  connect: async () => {
    const url = $('#cfgUrl').value.trim(), secret = $('#cfgSecret').value.trim();
    if (secret.length < 8) return toast('הקוד הסודי קצר מדי');
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url))
      return toast('הכתובת צריכה להיראות כך: https://script.google.com/macros/s/…/exec');
    cfg.url = url; cfg.secret = secret; ls.set(CFG_KEY, cfg); loaded = false;
    await syncNow();
    render();
    toast(loaded ? `מחובר ✓ (${db.entries.length} תיעודים בגיליון)` : SYNC_TEXT[syncState]);
  },
  disconnect: () => {
    if (!confirm('לנתק את האפליקציה מהגיליון? הנתונים נשארים בגיליון.')) return;
    cfg.url = ''; ls.set(CFG_KEY, cfg); server = { entries: [], visits: [] }; loaded = false;
    rebuild(); setSync('off'); render();
  },
};

document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (a && ACTIONS[a.dataset.act]) ACTIONS[a.dataset.act](a, e);
});
document.addEventListener('input', e => {
  const f = e.target.dataset.field;
  if (!f || !draft) return;
  if (f === 'notes') draft.notes = e.target.value;
  if (f === 'episode') draft.episode = e.target.checked;
  if (f === 'ts' && e.target.value) draft.ts = new Date(e.target.value).getTime();
});
document.addEventListener('change', e => {
  if (e.target.dataset.field === 'episode' && draft) draft.episode = e.target.checked;
});

function newSecret() {
  const b = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_');
}
if (!cfg.secret) { cfg.secret = newSecret(); ls.set(CFG_KEY, cfg); }
migrateLegacy();
rebuild();
setSync('off');
render();
syncNow();
window.addEventListener('online', () => syncNow());
document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });

if ('serviceWorker' in navigator && location.protocol !== 'file:')
  navigator.serviceWorker.register('sw.js').catch(() => {});
