# Naranjo ADR Probability Scale - Layout Fix

ไฟล์นี้แก้เฉพาะ `styles.css` เพื่อจัดรูปแบบข้อความคำถามและเกณฑ์ให้อยู่ในกรอบ card สวยงามขึ้น

## แก้ไขหลัก

- แก้ layout ของ `fieldset` + `legend` ไม่ให้หัวข้อคำถามลอยบนขอบ card
- จัดหัวข้อคำถามเป็น grid: หมายเลขข้อ / ข้อความคำถาม / ปุ่มซ่อนเกณฑ์
- ปรับกล่องเกณฑ์ให้เป็นระเบียบ อ่านง่าย และตัดบรรทัดภาษาไทย/อังกฤษได้ดีขึ้น
- ปรับปุ่มคำตอบและปุ่มเพิ่มหมายเหตุให้ aligned กับกล่องเกณฑ์
- ปรับ mobile responsive ให้ label และข้อความอยู่ในกรอบ ไม่ล้น

## วิธีใช้

แทนที่ไฟล์เดิม:

```text
styles.css
```

แล้ว commit/push ไปยัง GitHub Pages

```bash
git add styles.css
git commit -m "Improve question card layout"
git push
```

หลัง deploy ให้กด hard refresh: `Ctrl + F5`
