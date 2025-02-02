import pool from "@/lib/db";
import dayjs from "dayjs"; // ✅ ต้อง import dayjs

// ✅ API ดึงข้อมูล Users
export async function POST(request) {
  const connection = await pool.getConnection();
  const body = await request.json();
  const { startDate, endDate, providerCodes01, providerCodes081, icd10List072, aloCodes } = body;
  const olddate = dayjs(startDate).format("YYYY-MM-DD");
  const lastdate = dayjs(endDate).format("YYYY-MM-DD");
  const providerCodes099 = [...providerCodes01, ...providerCodes081]

  try {
    const likeConditions = icd10List072.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List072];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const aloPlaceholders = aloCodes.map(() => "?").join(", ");
    const paramsalo = [...params, ...aloCodes];

    const sqlQuery_072_all = `
      SELECT COUNT(*) AS icd10_072_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_072_all_alo = `
      SELECT COUNT(*) AS icd10_072_all_alo
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${aloPlaceholders})
    `;

    const sqlQuery_072_01 = `
      SELECT COUNT(*) AS icd10_072_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_072_01_alo = `
      SELECT COUNT(*) AS icd10_072_01_alo
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${aloPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_072_081 = `
      SELECT COUNT(*) AS icd10_072_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_072_081_alo = `
      SELECT COUNT(*) AS icd10_072_081_alo
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${aloPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_072_099 = `
      SELECT COUNT(*) AS icd10_072_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_072_099_alo = `
      SELECT COUNT(*) AS icd10_072_099_alo
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${aloPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_072_all] = await connection.query(sqlQuery_072_all, params);
    const [icd10_072_all_alo] = await connection.query(sqlQuery_072_all_alo, paramsalo);
    const [icd10_072_01] = await connection.query(sqlQuery_072_01, [...params, ...providerCodes01]);
    const [icd10_072_01_alo] = await connection.query(sqlQuery_072_01_alo, [...paramsalo, ...providerCodes01]);
    const [icd10_072_081] = await connection.query(sqlQuery_072_081, [...params, ...providerCodes081]);
    const [icd10_072_081_alo] = await connection.query(sqlQuery_072_081_alo, [...paramsalo, ...providerCodes081]);
    const [icd10_072_099] = await connection.query(sqlQuery_072_099, [...params, ...providerCodes099]);
    const [icd10_072_099_alo] = await connection.query(sqlQuery_072_099_alo, [...paramsalo, ...providerCodes099]);

    const response = {
      icd10_072_all: icd10_072_all[0].icd10_072_all,
      icd10_072_all_alo: icd10_072_all_alo[0].icd10_072_all_alo,
      icd10_072_01: icd10_072_01[0].icd10_072_01,
      icd10_072_01_alo: icd10_072_01_alo[0].icd10_072_01_alo,
      icd10_072_081: icd10_072_081[0].icd10_072_081,
      icd10_072_081_alo: icd10_072_081_alo[0].icd10_072_081_alo,
      icd10_072_099: icd10_072_099[0].icd10_072_099,
      icd10_072_099_alo: icd10_072_099_alo[0].icd10_072_099_alo,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}