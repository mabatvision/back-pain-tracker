/**
 * מעגב – שרת קטן שרץ בתוך Google Sheets.
 * הסקריפט יכול לגשת רק לגיליון שהוא מחובר אליו (בזכות השורה @OnlyCurrentDoc).
 *
 * @OnlyCurrentDoc
 */

// הדבק כאן את הקוד הסודי שמופיע באפליקציה (מסך "ענן"), בין המירכאות.
const SECRET = '';

const ENTRY_HEAD = ['id', 'ts', 'תאריך', 'שעה', 'כאב מרבי', 'נתפס הגב', 'אזורים', 'גורמים', 'הערות', 'data'];
const VISIT_HEAD = ['ts', 'תאריך'];
const EX_HEAD = ['ts', 'תאריך', 'שעה', 'תרגיל', 'exId'];
const PLAN_HEAD = ['id', 'תרגיל', 'פירוט', 'פעמים ביום', 'מתאריך', 'עד תאריך', 'data'];

// בדיקה מהדפדפן: פתיחת כתובת הסקריפט מציגה רק שהוא פעיל, בלי שום מידע.
function doGet() {
  return out({ ok: true, app: 'back-tracker' });
}

// כל בקשה מהאפליקציה: מבצעת את השינויים שנשלחו (אם יש) ומחזירה את כל הנתונים.
function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out({ error: 'bad-request' }); }
  if (!SECRET || req.secret !== SECRET) return out({ error: 'unauthorized' });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = {
      entries: getSheet(ss, 'תיעודים', ENTRY_HEAD),
      visits: getSheet(ss, 'ביקורים', VISIT_HEAD),
      exercises: getSheet(ss, 'תרגולים', EX_HEAD),
      plan: getSheet(ss, 'תוכנית תרגול', PLAN_HEAD),
    };
    (req.ops || []).forEach(op => apply(sh, op));
    return out({ ok: true, entries: readData(sh.entries, ENTRY_HEAD), visits: readTimes(sh.visits),
      exercises: readLog(sh.exercises), plan: readData(sh.plan, PLAN_HEAD) });
  } finally {
    lock.releaseLock();
  }
}

function apply(sh, op) {
  const { entries, visits, exercises, plan } = sh;
  if (op.op === 'upsert') {
    const e = op.entry;
    const cells = (op.cells || []).slice(0, 7); // תאריך, שעה, כאב מרבי, נתפס, אזורים, גורמים, הערות
    while (cells.length < 7) cells.push('');
    const row = [e.id, String(e.ts)].concat(cells, [JSON.stringify(e)]);
    const r = findRow(entries, e.id);
    if (r) entries.getRange(r, 1, 1, row.length).setValues([row]);
    else entries.appendRow(row);
  } else if (op.op === 'delete') {
    const r = findRow(entries, op.id);
    if (r) entries.deleteRow(r);
  } else if (op.op === 'addVisit') {
    if (!findRow(visits, op.ts)) visits.appendRow([op.ts, op.label || '']);
  } else if (op.op === 'delVisit') {
    const r = findRow(visits, op.ts);
    if (r) visits.deleteRow(r);
  } else if (op.op === 'addEx') {
    if (!findRow(exercises, op.ts)) exercises.appendRow([op.ts, op.date || '', op.time || '', op.name || '', op.ex || '']);
  } else if (op.op === 'delEx') {
    const r = findRow(exercises, op.ts);
    if (r) exercises.deleteRow(r);
  } else if (op.op === 'upsertPlan') {
    const p = op.item;
    const cells = (op.cells || []).slice(0, 5); // תרגיל, פירוט, פעמים ביום, מתאריך, עד תאריך
    while (cells.length < 5) cells.push('');
    const row = [p.id].concat(cells, [JSON.stringify(p)]);
    const r = findRow(plan, p.id);
    if (r) plan.getRange(r, 1, 1, row.length).setValues([row]);
    else plan.appendRow(row);
  } else if (op.op === 'delPlan') {
    // the exercise and everything marked for it
    const r = findRow(plan, op.id);
    if (r) plan.deleteRow(r);
    const n = exercises.getLastRow() - 1;
    if (n < 1) return;
    const ids = exercises.getRange(2, 5, n, 1).getValues();
    for (let i = n - 1; i >= 0; i--) if (String(ids[i][0]) === String(op.id)) exercises.deleteRow(i + 2);
  }
}

function getSheet(ss, name, head) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    sh.getRange('A:Z').setNumberFormat('@'); // לשמור הכל כטקסט, בלי המרות אוטומטיות
    sh.setFrozenRows(1);
    sh.setRightToLeft(true);
  }
  return sh;
}

// מספר השורה שבה העמודה הראשונה שווה ל-key (או 0 אם לא נמצא)
function findRow(sh, key) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  const ids = sh.getRange(2, 1, n, 1).getValues();
  for (let i = 0; i < n; i++) if (String(ids[i][0]) === String(key)) return i + 2;
  return 0;
}

// the objects stored as JSON in the last column (data)
function readData(sh, head) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const col = head.length;
  return sh.getRange(2, col, n, 1).getValues()
    .map(r => { try { return JSON.parse(r[0]); } catch (e) { return null; } })
    .filter(Boolean);
}

// the ts column (first) of a sheet, as numbers
function readTimes(sh) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, 1).getValues().map(r => Number(r[0])).filter(Boolean);
}

// exercises done: [{ ts, ex }] where ex is the plan item's id
function readLog(sh) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, EX_HEAD.length).getValues()
    .map(r => ({ ts: Number(r[0]), ex: String(r[4] || '') })).filter(x => x.ts);
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
