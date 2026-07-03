# Naranjo ADR Probability Scale Web App

เว็บแอป Static Frontend สำหรับประเมิน Naranjo ADR Probability Scale สำหรับเภสัชกร รองรับ GitHub Pages โดยไม่ต้องมี Backend

## สิ่งที่ปรับปรุง

- เพิ่มส่วน “สรุป Naranjo” หลังประเมิน
- สรุปเกณฑ์การให้คะแนนที่ตรงกับคำตอบของแต่ละข้อ
- แยกปัจจัยสนับสนุน ปัจจัยที่ลดความเป็นไปได้ และข้อมูลที่ยังไม่ทราบ
- เพิ่มข้อมูลประกอบการประเมิน เช่น ยาที่สงสัย อาการ วันที่เริ่มยา วันที่เกิดอาการ ผู้ประเมิน และหมายเหตุทางคลินิก
- เพิ่มปุ่มคัดลอกสรุป พิมพ์/บันทึก PDF ดาวน์โหลด JSON และแก้ไขคำตอบเดิม
- แยกไฟล์เป็น index.html, styles.css, app.js, data.js
- ใช้ textContent/DOM API เพื่อลดความเสี่ยง XSS ในส่วนข้อมูลที่ผู้ใช้กรอก
- เพิ่ม accessibility ด้วย fieldset/legend, aria-expanded และ aria-live
- แก้การแปลผล Doubtful เป็นคะแนน ≤ 0
- เพิ่มการบันทึก draft ใน localStorage และปุ่ม Reset จะล้างทั้งแบบฟอร์ม ผลลัพธ์ และข้อมูล draft ที่เคยบันทึกไว้

## การใช้งานบน GitHub Pages

1. สร้าง repository ใหม่บน GitHub
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ไปที่ root ของ repository
3. ไปที่ Settings > Pages
4. เลือก Deploy from a branch
5. เลือก branch `main` และ folder `/root`
6. เปิด URL ที่ GitHub Pages สร้างให้

## Privacy

เว็บแอปนี้ประมวลผลในเครื่องผู้ใช้ ไม่มี Backend และไม่มีการส่งข้อมูลผู้ป่วยออกนอกเครื่อง ยกเว้นผู้ใช้เลือกคัดลอก พิมพ์ หรือดาวน์โหลดไฟล์เอง
