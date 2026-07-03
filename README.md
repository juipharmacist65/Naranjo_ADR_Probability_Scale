# Naranjo ADR Probability Scale

Static web app สำหรับประเมินความน่าจะเป็นของอาการไม่พึงประสงค์จากยา โดยใช้ Naranjo ADR Probability Scale

## ไฟล์ในชุดนี้

- `index.html` — ไฟล์หลักสำหรับ deploy บน GitHub Pages
- `.nojekyll` — ป้องกัน GitHub Pages ประมวลผลผ่าน Jekyll โดยไม่จำเป็น

## วิธี Deploy บน GitHub Pages แบบง่าย

1. สร้าง repository ใหม่บน GitHub
2. อัปโหลด `index.html` และ `.nojekyll` ไปที่ root ของ repository
3. ไปที่ **Settings → Pages**
4. ที่ **Build and deployment** เลือก **Deploy from a branch**
5. เลือก branch เช่น `main` และ folder เป็น `/ (root)`
6. กด Save แล้วรอ GitHub Pages publish เว็บไซต์

> GitHub Pages ใช้ `index.html` เป็น entry file ของ static site ได้โดยตรง

## สิ่งที่ปรับปรุงในเวอร์ชันนี้

- แก้ bug การแสดงคำตอบที่มีคะแนน `-1`
- แก้ช่วงคะแนน Doubtful เป็น `≤ 0`
- เพิ่ม progress bar ตอบครบ 10 ข้อ
- เพิ่ม accessibility: `fieldset`, `legend`, `aria-expanded`, `aria-live`, focus result
- เพิ่มปุ่มแสดง/ซ่อนเกณฑ์ทั้งหมด
- เพิ่มช่องข้อมูลเคส ยาที่สงสัย ผู้ประเมิน และวันที่ประเมิน
- เพิ่มหมายเหตุต่อข้อ
- เพิ่ม copy result และ print / save PDF
- ลดการใช้ `innerHTML` กับข้อมูล dynamic เพื่อลดความเสี่ยง XSS
- ทำเป็นไฟล์ static พร้อม deploy โดยไม่ต้อง build

## หมายเหตุทางคลินิก

เครื่องมือนี้เป็นเพียงตัวช่วยประเมินเชิงระบบ ควรใช้ร่วมกับข้อมูลทางคลินิก การประเมินโดยแพทย์/เภสัชกร และบริบทของผู้ป่วยแต่ละราย
