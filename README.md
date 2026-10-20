# מעגב

אפליקציה אישית (PWA) לאייפון לתיעוד כאבי גב, רגל שמאל וכף רגל שמאל, כדי להגיע למטפל עם תמונה מדויקת.

- **הנתונים נשמרים ב-Google Sheet** בחשבון Google שלך, דרך סקריפט קטן (`google-apps-script/Code.gs`) שיכול לגשת רק לגיליון הזה.
- בטלפון נשמרים רק: כתובת הסקריפט, הקוד הסודי, ותיעודים שעוד לא נשלחו (כשאין קליטה). הם נשלחים אוטומטית כשהחיבור חוזר.
- בלי build ובלי תלויות: HTML/CSS/JS בלבד. כתובת: https://mabatvision.github.io/back-pain-tracker/

## חיבור ל-Google Sheets (פעם אחת)
1. ב-[sheets.new](https://sheets.new) ליצור גיליון חדש, ולתת לו שם (למשל "מעגב").
2. בתפריט: **Extensions → Apps Script** (הרחבות ← Apps Script).
3. למחוק את כל מה שיש בעורך, ולהדביק את כל התוכן של [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. לבחור קוד סודי (או להעתיק את הקוד שהאפליקציה מציעה בלשונית **ענן**) ולהדביק אותו בסקריפט בין המירכאות בשורה `const SECRET = '';`, ולשמור (Ctrl+S). את אותו קוד מזינים בכל מכשיר שמתחבר.
5. **Deploy → New deployment** ← גלגל השיניים ← **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy**
6. Google יבקש הרשאה: Authorize access ← לבחור את החשבון ← "Google hasn't verified this app" ← **Advanced** ← **Go to … (unsafe)** ← **Allow**.
   ההרשאה צריכה להיות רק לגיליונות שהסקריפט מותקן בהם. אם מופיעה בקשה רחבה יותר – לא לאשר.
7. להעתיק את ה-**Web app URL** (מסתיים ב-`/exec`), ולהדביק באפליקציה בלשונית **ענן** ← "התחברות".

בגיליון ייווצרו שלוש לשוניות: **תיעודים** (שורה לכל תיעוד, בעמודות קריאות + עמודת `data` שהאפליקציה משתמשת בה – לא לערוך אותה), **ביקורים**, **תוכנית תרגול** (התרגילים שהמטפל נתן) ו-**תרגולים** (שורה לכל פעם שסומן ביצוע).

**עדכון הסקריפט בעתיד:** אחרי עריכה – Deploy → Manage deployments ← עיפרון ← Version: **New version** ← Deploy. כך הכתובת נשארת אותה כתובת.

## קבצים
| קובץ | תפקיד |
|---|---|
| `index.html` | שלד הדף + סרגל לשוניות |
| `app.js` | כל הלוגיקה: איורי הגוף (SVG), מסכים, סיכום, סנכרון לגיליון |
| `styles.css` | עיצוב (כולל מצב כהה והדפסה) |
| `sw.js` | מטמון לעבודה offline. **להעלות את `VERSION` בכל שינוי** |
| `google-apps-script/Code.gs` | הצד של Google: שומר ומחזיר את הנתונים מהגיליון |
| `dev/mock-apps-script.js` | מריץ את `Code.gs` מקומית מול גיליון מדומה, לבדיקות |
| `manifest.webmanifest`, `icons/`, `make_icons.py` | התקנה למסך הבית |

## פיתוח מקומי
```
python -m http.server 8765
node dev/mock-apps-script.js 8766 test-secret
```
ובקונסול של הדפדפן:
`localStorage.setItem('backtracker.cloud', JSON.stringify({url:'http://localhost:8766/exec', secret:'test-secret'}))`

## פרוטוקול
כל בקשה היא `POST` לכתובת הסקריפט עם גוף `text/plain` (כדי להימנע מ-CORS preflight):
`{ secret, ops: [{op:'upsert', entry, cells} | {op:'delete', id} | {op:'addVisit', ts, label} | {op:'delVisit', ts} | {op:'addEx', ts, ex, name, date, time} | {op:'delEx', ts} | {op:'upsertPlan', item, cells} | {op:'delPlan', id}] }`
והתשובה: `{ ok, entries, visits, exercises, plan }` – כל הנתונים אחרי ביצוע הפעולות. כל הפעולות אידמפוטנטיות, כך ששליחה חוזרת אחרי תקלת רשת לא מזיקה.

## מודל נתונים
```js
entry = { id, ts, regions: { [regionId]: { kind: 'pain'|'numb'|'tingle', level: 1-10, nature: 'muscle'|'nerve'|'unsure' } },
          episode: bool /* הגב נתפס */, triggers: [string], notes }
visits = [ts]
plan = [{ id, name, details, perDay /* 0 = לא נקבע */, start, end /* null = עדיין בתוכנית */ }]
exercises = [{ ts, ex /* plan id, או '' לתרגול כללי */ }]
```
