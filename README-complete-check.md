# Naranjo ADR Probability Scale - Complete Fix

ชุดไฟล์นี้แก้ไขจาก repo `juipharmacist65/Naranjo_ADR_Probability_Scale` โดยเน้น 3 จุดหลัก:

1. คืน logo รูปจริงจาก URL เดิม
   - `https://lh5.googleusercontent.com/d/1r7PM1ogHIbxskvcauVIYaQOfSHXWGncO`
   - มี fallback เป็น `ADR` หากโหลดรูปไม่สำเร็จ

2. คืน/เพิ่มฟังก์ชัน "เพิ่มหมายเหตุ/หลักฐานประกอบข้อนี้" รายข้อ
   - มีปุ่มเพิ่มหมายเหตุใต้ตัวเลือกของแต่ละข้อ
   - บันทึกลง draft ใน localStorage
   - restore draft แล้วเปิด note panel อัตโนมัติถ้ามีข้อมูล
   - แสดงในผลลัพธ์, copy summary และ JSON export

3. คงการแก้ปัญหา reset จากรอบก่อนหน้า
   - ล้าง radio แบบ explicit
   - ล้าง defaultChecked และ attribute checked
   - ล้าง text/date/textarea ทุกช่อง รวมถึง note รายข้อ
   - ล้าง localStorage/sessionStorage draft
   - ซ่อน note panels และ reset criteria panels

## วิธีใช้งาน

ให้นำไฟล์เหล่านี้ไปแทนไฟล์เดิมใน root ของ repository:

- `index.html`
- `styles.css`
- `app.js`
- `data.js` ใช้เวอร์ชันเดิมได้ แต่แนบมาให้ครบสำหรับ deploy ใหม่ทั้งชุด

จากนั้น commit/push ขึ้น GitHub แล้วเปิด GitHub Pages ใหม่ หรือ hard refresh ด้วย `Ctrl + F5` / `Cmd + Shift + R`.

## Validation ที่ตรวจแล้ว

- `node --check app.js` ผ่าน
- `node --check data.js` ผ่าน
- ตรวจพบ logo URL ใน `index.html`
- ตรวจพบ CSS class สำหรับ logo จริงและ fallback
- ตรวจพบปุ่ม note รายข้อ
- ตรวจพบ textarea note รายข้อ
- ตรวจพบการ save/restore notes ใน localStorage
- ตรวจพบการ clear radio + note + form fields ใน reset
- ตรวจพบคำถามครบ 10 ข้อใน `data.js`
