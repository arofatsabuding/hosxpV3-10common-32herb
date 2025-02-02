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
  const icd10List042 = ['K590%']
  const kotCodes = ['1540022']

  try {
    const likeConditions = icd10List042.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List042];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const kotPlaceholders = kotCodes.map(() => "?").join(", ");
    const paramskot = [...params, ...kotCodes];

    const sqlQuery_042_all = `
      SELECT COUNT(*) AS icd10_042_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_042_all_kot = `
      SELECT COUNT(*) AS icd10_042_all_kot
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${kotPlaceholders})
    `;

    const sqlQuery_042_01 = `
      SELECT COUNT(*) AS icd10_042_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_042_01_kot = `
      SELECT COUNT(*) AS icd10_042_01_kot
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${kotPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_042_081 = `
      SELECT COUNT(*) AS icd10_042_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_042_081_kot = `
      SELECT COUNT(*) AS icd10_042_081_kot
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${kotPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_042_099 = `
      SELECT COUNT(*) AS icd10_042_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_042_099_kot = `
      SELECT COUNT(*) AS icd10_042_099_kot
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${kotPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_042_all] = await connection.query(sqlQuery_042_all, params);
    const [icd10_042_all_kot] = await connection.query(sqlQuery_042_all_kot, paramskot);
    const [icd10_042_01] = await connection.query(sqlQuery_042_01, [...params, ...providerCodes01]);
    const [icd10_042_01_kot] = await connection.query(sqlQuery_042_01_kot, [...paramskot, ...providerCodes01]);
    const [icd10_042_081] = await connection.query(sqlQuery_042_081, [...params, ...providerCodes081]);
    const [icd10_042_081_kot] = await connection.query(sqlQuery_042_081_kot, [...paramskot, ...providerCodes081]);
    const [icd10_042_099] = await connection.query(sqlQuery_042_099, [...params, ...providerCodes099]);
    const [icd10_042_099_kot] = await connection.query(sqlQuery_042_099_kot, [...paramskot, ...providerCodes099]);

    const response = {
      icd10_042_all: icd10_042_all[0].icd10_042_all,
      icd10_042_all_kot: icd10_042_all_kot[0].icd10_042_all_kot,
      icd10_042_01: icd10_042_01[0].icd10_042_01,
      icd10_042_01_kot: icd10_042_01_kot[0].icd10_042_01_kot,
      icd10_042_081: icd10_042_081[0].icd10_042_081,
      icd10_042_081_kot: icd10_042_081_kot[0].icd10_042_081_kot,
      icd10_042_099: icd10_042_099[0].icd10_042_099,
      icd10_042_099_kot: icd10_042_099_kot[0].icd10_042_099_kot,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}