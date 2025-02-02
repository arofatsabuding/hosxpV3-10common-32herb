import pool from "@/lib/db";
import dayjs from "dayjs"; // ✅ ต้อง import dayjs

// ✅ API ดึงข้อมูล Users
export async function POST(request) {
  const connection = await pool.getConnection();
  const body = await request.json();
  const { startDate, endDate } = body;
  const olddate = dayjs(startDate).format("YYYY-MM-DD");
  const lastdate = dayjs(endDate).format("YYYY-MM-DD");
  const providerCodes01 = ["01"]
  const providerCodes081 = ["081", "084"]
  const providerCodes099 = [...providerCodes01, ...providerCodes081]
  const icd10List041 = ['K640%','K641%','K642%']
  const petCodes = ['1570004']

  try {
    const likeConditions = icd10List041.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List041];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const petPlaceholders = petCodes.map(() => "?").join(", ");
    const paramspet = [...params, ...petCodes];

    const sqlQuery_041_all = `
      SELECT COUNT(*) AS icd10_041_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_041_all_pet = `
      SELECT COUNT(*) AS icd10_041_all_pet
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${petPlaceholders})
    `;

    const sqlQuery_041_01 = `
      SELECT COUNT(*) AS icd10_041_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_041_01_pet = `
      SELECT COUNT(*) AS icd10_041_01_pet
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${petPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_041_081 = `
      SELECT COUNT(*) AS icd10_041_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_041_081_pet = `
      SELECT COUNT(*) AS icd10_041_081_pet
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${petPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_041_099 = `
      SELECT COUNT(*) AS icd10_041_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_041_099_pet = `
      SELECT COUNT(*) AS icd10_041_099_pet
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${petPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_041_all] = await connection.query(sqlQuery_041_all, params);
    const [icd10_041_all_pet] = await connection.query(sqlQuery_041_all_pet, paramspet);
    const [icd10_041_01] = await connection.query(sqlQuery_041_01, [...params, ...providerCodes01]);
    const [icd10_041_01_pet] = await connection.query(sqlQuery_041_01_pet, [...paramspet, ...providerCodes01]);
    const [icd10_041_081] = await connection.query(sqlQuery_041_081, [...params, ...providerCodes081]);
    const [icd10_041_081_pet] = await connection.query(sqlQuery_041_081_pet, [...paramspet, ...providerCodes081]);
    const [icd10_041_099] = await connection.query(sqlQuery_041_099, [...params, ...providerCodes099]);
    const [icd10_041_099_pet] = await connection.query(sqlQuery_041_099_pet, [...paramspet, ...providerCodes099]);

    const response = {
      icd10_041_all: icd10_041_all[0].icd10_041_all,
      icd10_041_all_pet: icd10_041_all_pet[0].icd10_041_all_pet,
      icd10_041_01: icd10_041_01[0].icd10_041_01,
      icd10_041_01_pet: icd10_041_01_pet[0].icd10_041_01_pet,
      icd10_041_081: icd10_041_081[0].icd10_041_081,
      icd10_041_081_pet: icd10_041_081_pet[0].icd10_041_081_pet,
      icd10_041_099: icd10_041_099[0].icd10_041_099,
      icd10_041_099_pet: icd10_041_099_pet[0].icd10_041_099_pet,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}