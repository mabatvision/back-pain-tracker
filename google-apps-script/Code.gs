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
    const entries = getSheet(ss, 'תיעודים', ENTRY_HEAD);
    const visits = getSheet(ss, 'ביקורים', VISIT_HEAD);
    (req.ops || []).forEach(op => apply(entries, visits, op));
    return out({ ok: true, entries: readData(entries), visits: readVisits(visits) });
  } finally {
    lock.releaseLock();
  }
}

function apply(entries, visits, op) {
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

function readData(sh) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const col = ENTRY_HEAD.length;
  return sh.getRange(2, col, n, 1).getValues()
    .map(r => { try { return JSON.parse(r[0]); } catch (e) { return null; } })
    .filter(Boolean);
}

function readVisits(sh) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, 1).getValues().map(r => Number(r[0])).filter(Boolean);
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
