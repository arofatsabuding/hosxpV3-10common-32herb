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
  const icd10List10 = ["R630%"]
  const maraCodes = ['1580018']
  const thcCodes = ["thc"]

  try {
    const likeConditions = icd10List10.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List10];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const maraPlaceholders = maraCodes.map(() => "?").join(", ");
    const thcPlaceholders = thcCodes.map(() => "?").join(", ");
    const paramsmara = [...params, ...maraCodes];
    const paramsthc = [...params, ...thcCodes];

    const sqlQuery_10_all = `
      SELECT COUNT(*) AS icd10_10_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_10_all_mara = `
      SELECT COUNT(*) AS icd10_10_all_mara
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${maraPlaceholders})
    `;

    const sqlQuery_10_all_thc = `
      SELECT COUNT(*) AS icd10_10_all_thc
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thcPlaceholders})
    `;

    const sqlQuery_10_01 = `
      SELECT COUNT(*) AS icd10_10_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_10_01_mara = `
      SELECT COUNT(*) AS icd10_10_01_mara
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${maraPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_10_01_thc = `
      SELECT COUNT(*) AS icd10_10_01_thc
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thcPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_10_081 = `
      SELECT COUNT(*) AS icd10_10_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_10_081_mara = `
      SELECT COUNT(*) AS icd10_10_081_mara
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${maraPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_10_081_thc = `
      SELECT COUNT(*) AS icd10_10_081_thc
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thcPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_10_099 = `
      SELECT COUNT(*) AS icd10_10_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_10_099_mara = `
      SELECT COUNT(*) AS icd10_10_099_mara
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${maraPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_10_099_thc = `
      SELECT COUNT(*) AS icd10_10_099_thc
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thcPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_10_all] = await connection.query(sqlQuery_10_all, params);
    const [icd10_10_all_mara] = await connection.query(sqlQuery_10_all_mara, paramsmara);
    const [icd10_10_all_thc] = await connection.query(sqlQuery_10_all_thc, paramsthc);
    const [icd10_10_01] = await connection.query(sqlQuery_10_01, [...params, ...providerCodes01]);
    const [icd10_10_01_mara] = await connection.query(sqlQuery_10_01_mara, [...paramsmara, ...providerCodes01]);
    const [icd10_10_01_thc] = await connection.query(sqlQuery_10_01_thc, [...paramsthc, ...providerCodes01]);
    const [icd10_10_081] = await connection.query(sqlQuery_10_081, [...params, ...providerCodes081]);
    const [icd10_10_081_mara] = await connection.query(sqlQuery_10_081_mara, [...paramsmara, ...providerCodes081]);
    const [icd10_10_081_thc] = await connection.query(sqlQuery_10_081_thc, [...paramsthc, ...providerCodes081]);
    const [icd10_10_099] = await connection.query(sqlQuery_10_099, [...params, ...providerCodes099]);
    const [icd10_10_099_mara] = await connection.query(sqlQuery_10_099_mara, [...paramsmara, ...providerCodes099]);
    const [icd10_10_099_thc] = await connection.query(sqlQuery_10_099_thc, [...paramsthc, ...providerCodes099]);

    const response = {
      icd10_10_all: icd10_10_all[0].icd10_10_all,
      icd10_10_all_mara: icd10_10_all_mara[0].icd10_10_all_mara,
      icd10_10_all_thc: icd10_10_all_thc[0].icd10_10_all_thc,
      icd10_10_01: icd10_10_01[0].icd10_10_01,
      icd10_10_01_mara: icd10_10_01_mara[0].icd10_10_01_mara,
      icd10_10_01_thc: icd10_10_01_thc[0].icd10_10_01_thc,
      icd10_10_081: icd10_10_081[0].icd10_10_081,
      icd10_10_081_mara: icd10_10_081_mara[0].icd10_10_081_mara,
      icd10_10_081_thc: icd10_10_081_thc[0].icd10_10_081_thc,
      icd10_10_099: icd10_10_099[0].icd10_10_099,
      icd10_10_099_mara: icd10_10_099_mara[0].icd10_10_099_mara,
      icd10_10_099_thc: icd10_10_099_thc[0].icd10_10_099_thc,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}