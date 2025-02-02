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
  const icd10List073 = ['S109%','S208%','S309%','S409%','S509%','S609%','S709%','S809%','S909%']
  const mangosteenCodes = ['mangosteen']

  try {
    const likeConditions = icd10List073.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List073];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const mangosteenPlaceholders = mangosteenCodes.map(() => "?").join(", ");
    const paramsmangosteen = [...params, ...mangosteenCodes];

    const sqlQuery_073_all = `
      SELECT COUNT(*) AS icd10_073_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_073_all_mangosteen = `
      SELECT COUNT(*) AS icd10_073_all_mangosteen
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${mangosteenPlaceholders})
    `;

    const sqlQuery_073_01 = `
      SELECT COUNT(*) AS icd10_073_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_073_01_mangosteen = `
      SELECT COUNT(*) AS icd10_073_01_mangosteen
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${mangosteenPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_073_081 = `
      SELECT COUNT(*) AS icd10_073_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_073_081_mangosteen = `
      SELECT COUNT(*) AS icd10_073_081_mangosteen
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${mangosteenPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_073_099 = `
      SELECT COUNT(*) AS icd10_073_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_073_099_mangosteen = `
      SELECT COUNT(*) AS icd10_073_099_mangosteen
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${mangosteenPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_073_all] = await connection.query(sqlQuery_073_all, params);
    const [icd10_073_all_mangosteen] = await connection.query(sqlQuery_073_all_mangosteen, paramsmangosteen);
    const [icd10_073_01] = await connection.query(sqlQuery_073_01, [...params, ...providerCodes01]);
    const [icd10_073_01_mangosteen] = await connection.query(sqlQuery_073_01_mangosteen, [...paramsmangosteen, ...providerCodes01]);
    const [icd10_073_081] = await connection.query(sqlQuery_073_081, [...params, ...providerCodes081]);
    const [icd10_073_081_mangosteen] = await connection.query(sqlQuery_073_081_mangosteen, [...paramsmangosteen, ...providerCodes081]);
    const [icd10_073_099] = await connection.query(sqlQuery_073_099, [...params, ...providerCodes099]);
    const [icd10_073_099_mangosteen] = await connection.query(sqlQuery_073_099_mangosteen, [...paramsmangosteen, ...providerCodes099]);

    const response = {
      icd10_073_all: icd10_073_all[0].icd10_073_all,
      icd10_073_all_mangosteen: icd10_073_all_mangosteen[0].icd10_073_all_mangosteen,
      icd10_073_01: icd10_073_01[0].icd10_073_01,
      icd10_073_01_mangosteen: icd10_073_01_mangosteen[0].icd10_073_01_mangosteen,
      icd10_073_081: icd10_073_081[0].icd10_073_081,
      icd10_073_081_mangosteen: icd10_073_081_mangosteen[0].icd10_073_081_mangosteen,
      icd10_073_099: icd10_073_099[0].icd10_073_099,
      icd10_073_099_mangosteen: icd10_073_099_mangosteen[0].icd10_073_099_mangosteen,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}