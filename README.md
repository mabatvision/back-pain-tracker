# מעקב גב

אפליקציה אישית (PWA) לאייפון לתיעוד כאבי גב, רגל שמאל וכף רגל שמאל, כדי להגיע למטפל עם תמונה מדויקת.

- **הכל נשמר רק בטלפון** (localStorage). אין שרת ואין ענן. גיבוי ידני לקובץ JSON ממסך "גיבוי".
- עובד גם בלי אינטרנט אחרי הפתיחה הראשונה (service worker).
- בלי build ובלי תלויות: HTML/CSS/JS בלבד.

## קבצים
| קובץ | תפקיד |
|---|---|
| `index.html` | שלד הדף + סרגל לשוניות |
| `app.js` | כל הלוגיקה: איורי הגוף (SVG), מסכים, סיכום, גיבוי |
| `styles.css` | עיצוב (כולל מצב כהה והדפסה) |
| `sw.js` | מטמון לעבודה offline. **להעלות את `VERSION` בכל שינוי** |
| `manifest.webmanifest`, `icons/` | התקנה למסך הבית |
| `make_icons.py` | יוצר את האייקונים מחדש (Pillow) |

## הרצה מקומית
```
python -m http.server 8765
```
ואז לפתוח http://localhost:8765

## התקנה באייפון
1. לפתוח את כתובת האתר ב-**Safari**.
2. שיתוף ← "הוסף למסך הבית".
3. לפתוח מהאייקון. הנתונים שמורים באפליקציה שבמסך הבית (לא ב-Safari הרגיל).

## מודל נתונים
```js
{ entries: [{ id, ts, regions: { [regionId]: { kind: 'pain'|'numb'|'tingle', level: 1-10, nature: 'muscle'|'nerve'|'unsure' } },
              episode: bool /* הגב נתפס */, triggers: [string], notes }],
  visits: [ts] /* ביקורים אצל מטפל */, lastBackup: ts }
```
