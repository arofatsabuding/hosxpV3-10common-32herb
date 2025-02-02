import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "data.json");
const defaultFilePath = path.join(process.cwd(), "src", "data", "data.default.json");

export async function GET() {
  try {
    let filePathToUse = dataFilePath;

    // ✅ ตรวจสอบว่าไฟล์ data.json มีอยู่จริงหรือไม่
    try {
      await fs.access(dataFilePath);
    } catch {
      filePathToUse = defaultFilePath; // ❌ ถ้าไม่มี data.json ให้ใช้ data.default.json แทน
    }

    const jsonData = await fs.readFile(filePathToUse, "utf-8"); // อ่านไฟล์ JSON
    const data = JSON.parse(jsonData); // แปลงเป็น Object

    return Response.json(data); // ส่งข้อมูลกลับไป
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    let filePathToUse = dataFilePath;

    // ✅ ตรวจสอบว่าไฟล์ data.json มีอยู่จริงหรือไม่
    try {
      await fs.access(dataFilePath);
    } catch {
      filePathToUse = defaultFilePath; // ❌ ถ้าไม่มี data.json ให้ใช้ data.default.json แทน
    }

    const jsonData = await fs.readFile(filePathToUse, "utf-8"); // อ่านไฟล์ JSON ปัจจุบัน
    let data = JSON.parse(jsonData); // แปลงเป็น Object

    // ✅ รายการ key ที่ไม่ต้องแปลงเป็น array (เป็น string, number หรือ object ปกติ)
    const keysToKeepAsIs = ["mainDep", "oic_n", "oic_c", "oic_o", "oic_l", "otc_o", "otc_l", "pcodeA2", "pcodeUC", "pcodeA7"];

    Object.keys(body).forEach((key) => {
      if (data.hasOwnProperty(key)) {
        if (!keysToKeepAsIs.includes(key) && typeof body[key] === "string") {
          // ✅ ถ้า key ไม่อยู่ในรายการ keysToKeepAsIs และเป็น string -> แปลงเป็น array
          data[key] = body[key].split(",").map((item) => item.trim());
        } else {
          // ✅ ถ้า key ต้องคงค่าเดิม หรือ ไม่ใช่ string ให้ใช้ค่าปกติ
          data[key] = body[key];
        }
      }
    });

    // ✅ เขียนกลับไปที่ไฟล์ JSON (เฉพาะ data.json เท่านั้น)
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf-8");

    return Response.json({ message: "Data updated successfully", updatedData: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
