# THAIMED-KPI - คู่มือการติดตั้งและใช้งาน

## ✨ เตรียมความพร้อมก่อนติดตั้ง
### 1️⃣ ติดตั้ง **Node.js** และ **NPM**
ตรวจสอบว่าเครื่องของคุณมี Node.js และ NPM ติดตั้งแล้ว:
```sh
node -v
npm -v
```
หากยังไม่มี สามารถดาวน์โหลดและติดตั้งได้จาก [Node.js Official Website](https://nodejs.org/)

---

## ⚙️ **ขั้นตอนการติดตั้งบนคอมพิวเตอร์ / Server**
### 1️⃣ ดาวน์โหลดโปรเจคลงเครื่อง

### 2️⃣ กำหนดค่าต่าง ๆ สำหรับเชื่อมต่อกับ Server  
   1. เปลี่ยนชื่อไฟล์ **`.env.example`** เป็น **`.env.local`**  
   2. เปิดไฟล์ **`.env.local`** และกำหนดค่าต่าง ๆ ให้ตรงกับเซิร์ฟเวอร์ของคุณ  
   3. เปิด **Command Prompt (CMD)** หรือ **Terminal**  
   4. ใช้คำสั่ง `cd` เพื่อเข้าไปยังโฟลเดอร์โปรเจคที่ดาวน์โหลดมา

### 3️⃣ ติดตั้ง Dependencies
```sh
npm install
```

### 4️⃣ Build โปรเจคเพื่อใช้งาน
```sh
npm run build
```

### 5️⃣ รันโปรแกรมด้วย PM2
```sh
PORT=3001 pm2 start npm --name "THAIMED-KPI" -- start
```
📌 **หมายเหตุ:** เปลี่ยน `3001` เป็น PORT ตามที่ต้องการ

### 6️⃣ ตั้งให้ PM2 รันอัตโนมัติหลังจากรีบูต
```sh
pm2 startup
pm2 save
```

---

## 🔧 **ขั้นตอนการตั้งค่าโปรแกรมเพื่อ Map ตัวแปร**
1. เมื่อติดตั้งโปรแกรมแล้วให้เข้าใช้งานผ่าน:
   ```
   http://<your-server-ip>:PORT
   ```
2. เข้าเมนู **Setting** ที่มุมขวาบน และกำหนดตัวแปรต่าง ๆ ให้ตรงกันกับข้อมูลใน Server Hosxp:
   - **2.1** รหัสแผนก (**mainDep**)
   - **2.2** รหัสหัตถการนวด: `11`
   - **2.3** รหัสหัตถการประคบ: `20`
   - **2.4** รหัสหัตถการอบสมุนไพร: `00`
   - **2.5** รหัสหัตถการทับหม้อเกลือ: `12`
   - **2.6** รหัสประเภทการบำบัด: `2`
   - **2.7** รหัสประเภทการส่งเสริม: `1`
   - **2.8** pcode สิทธิจ่ายตรง: `A2`
   - **2.9** pcode สิทธิ UC: `UC`
   - **2.10** pcode สิทธิประกันสังคม: `A7`
   - **2.11** รหัสประเภทแพทย์แผนปัจจุบัน: `01` (ตามมาตรฐาน 43 แฟ้ม แฟ้ม PROVIDER)
   - **2.12** รหัสประเภทแพทย์แผนไทย: `081` (ตามมาตรฐาน 43 แฟ้ม แฟ้ม PROVIDER)
   - **2.13** **ICD10 ตามกลุ่มอาการ**: กำหนดค่าตามหนังสือตัวชี้วัด โดยใช้ `%` ลงท้าย และคั่นด้วย `,`
   - **2.14** **icode**: รหัสยาสมุนไพรใน HOSXP (สามารถดูได้ที่ `ระบบห้องจ่ายยา > ทะเบียนเวชภัณฑ์ยา > รหัสเวชภัณฑ์`)
     📌 **หมายเหตุ:** หากไม่มีรหัสยา ให้ใส่ค่า Default หรือตัวอักษรที่ไม่ใช่ตัวเลข (**ห้ามเว้นว่างเด็ดขาด**)

3. เมื่อกำหนดตัวแปรต่าง ๆ เรียบร้อยแล้ว ให้เลือกช่วงเวลาที่ต้องการค้นหา และกด **ค้นหาข้อมูล**
4. เสร็จสิ้นการตั้งค่าโปรแกรม ✅

---

## 🔍 **แนวทางการตรวจสอบการใช้งาน PM2**
### ℹ️ คำสั่งสำหรับดูรายละเอียด
```sh
pm2 list
pm2 logs THAIMED-KPI
```

### ⏳ รีสตาร์ท / หยุด / ลบ โปรแกรมที่รันด้วย PM2
```sh
pm2 restart THAIMED-KPI
pm2 stop THAIMED-KPI
pm2 delete THAIMED-KPI
```

---

## 💪 THANK YOU
**PROJECT BY:** Arofat Sabuding  
หากมีข้อสงสัย หรือพบปัญหา สามารถติดต่อทีมพัฒนาได้ที่ **<arofat.sa@gmail.com>**

