// Local stand-in for the Google Apps Script web app, for testing without a Google account.
// Runs the real google-apps-script/Code.gs against an in-memory fake spreadsheet.
//   node dev/mock-apps-script.js [port] [secret]
// Then in the app's console: localStorage.setItem('backtracker.cloud', JSON.stringify({url:'http://localhost:8766/exec', secret:'test-secret'}))
const http = require('http'), fs = require('fs'), path = require('path'), vm = require('vm');

const PORT = +process.argv[2] || 8766;
const SECRET = process.argv[3] || 'test-secret';

class FakeSheet {
  constructor(name) { this.name = name; this.rows = []; }
  getLastRow() { return this.rows.length; }
  appendRow(r) { this.rows.push(r.map(String)); }
  deleteRow(i) { this.rows.splice(i - 1, 1); }
  getRange(row, col, nr = 1, nc = 1) {
    const sh = this;
    if (typeof row === 'string') return { setNumberFormat() { return this; } };
    return {
      getValues: () => Array.from({ length: nr }, (_, i) =>
        Array.from({ length: nc }, (_, j) => (sh.rows[row - 1 + i] || [])[col - 1 + j] ?? '')),
      setValues(v) {
        v.forEach((r, i) => { const t = sh.rows[row - 1 + i] || (sh.rows[row - 1 + i] = []); r.forEach((x, j) => (t[col - 1 + j] = String(x))); });
        return this;
      },
      setFontWeight() { return this; },
      setNumberFormat() { return this; },
    };
  }
  setFrozenRows() {}
  setRightToLeft() {}
}
const sheets = {};
const ctx = vm.createContext({
  JSON, String, Number, Boolean,
  SpreadsheetApp: { getActiveSpreadsheet: () => ({
    getSheetByName: n => sheets[n] || null,
    insertSheet: n => (sheets[n] = new FakeSheet(n)),
  }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ContentService: {
    MimeType: { JSON: 'json' },
    createTextOutput: content => ({ content, setMimeType() { return this; } }),
  },
});
const code = fs.readFileSync(path.join(__dirname, '..', 'google-apps-script', 'Code.gs'), 'utf8')
  .replace("const SECRET = '';", `const SECRET = ${JSON.stringify(SECRET)};`);
vm.runInContext(code, ctx);

http.createServer((req, res) => {
  let body = '';
  req.on('data', c => (body += c));
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    if (req.url === '/dump') return res.end(JSON.stringify(sheets, null, 1)); // inspect the fake sheet
    const out = req.method === 'POST' ? ctx.doPost({ postData: { contents: body } }) : ctx.doGet();
    res.end(out.content);
    if (req.method === 'POST') console.log('POST', body.length, 'bytes ->', Object.fromEntries(Object.entries(sheets).map(([n, s]) => [n, s.rows.length - 1])));
  });
}).listen(PORT, () => console.log(`mock Apps Script on http://localhost:${PORT}/exec (secret: ${SECRET})`));
