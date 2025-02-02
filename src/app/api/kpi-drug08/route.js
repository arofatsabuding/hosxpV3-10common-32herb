import pool from "@/lib/db";
import dayjs from "dayjs"; // ✅ ต้อง import dayjs

// ✅ API ดึงข้อมูล Users
export async function POST(request) {
  const connection = await pool.getConnection();
  const body = await request.json();
  const { startDate, endDate, providerCodes01, providerCodes081, icd10List08, suksaiCodes, jitCodes, thcCodes } = body;
  const olddate = dayjs(startDate).format("YYYY-MM-DD");
  const lastdate = dayjs(endDate).format("YYYY-MM-DD");
  const providerCodes099 = [...providerCodes01, ...providerCodes081]

  try {
    const likeConditions = icd10List08.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List08];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const suksaiPlaceholders = suksaiCodes.map(() => "?").join(", ");
    const jitPlaceholders = jitCodes.map(() => "?").join(", ");
    const thcPlaceholders = thcCodes.map(() => "?").join(", ");
    const paramssuksai = [...params, ...suksaiCodes];
    const paramsjit = [...params, ...jitCodes];
    const paramsthc = [...params, ...thcCodes];

    const sqlQuery_08_all = `
      SELECT COUNT(*) AS icd10_08_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_08_all_suksai = `
      SELECT COUNT(*) AS icd10_08_all_suksai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${suksaiPlaceholders})
    `;

    const sqlQuery_08_all_jit = `
      SELECT COUNT(*) AS icd10_08_all_jit
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${jitPlaceholders})
    `;

    const sqlQuery_08_all_thc = `
      SELECT COUNT(*) AS icd10_08_all_thc
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thcPlaceholders})
    `;

    const sqlQuery_08_01 = `
      SELECT COUNT(*) AS icd10_08_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_08_01_suksai = `
      SELECT COUNT(*) AS icd10_08_01_suksai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${suksaiPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_08_01_jit = `
      SELECT COUNT(*) AS icd10_08_01_jit
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${jitPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_08_01_thc = `
      SELECT COUNT(*) AS icd10_08_01_thc
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thcPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_08_081 = `
      SELECT COUNT(*) AS icd10_08_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_08_081_suksai = `
      SELECT COUNT(*) AS icd10_08_081_suksai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${suksaiPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_08_081_jit = `
      SELECT COUNT(*) AS icd10_08_081_jit
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${jitPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_08_081_thc = `
      SELECT COUNT(*) AS icd10_08_081_thc
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thcPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_08_099 = `
      SELECT COUNT(*) AS icd10_08_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_08_099_suksai = `
      SELECT COUNT(*) AS icd10_08_099_suksai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${suksaiPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_08_099_jit = `
      SELECT COUNT(*) AS icd10_08_099_jit
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${jitPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_08_099_thc = `
      SELECT COUNT(*) AS icd10_08_099_thc
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thcPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_08_all] = await connection.query(sqlQuery_08_all, params);
    const [icd10_08_all_suksai] = await connection.query(sqlQuery_08_all_suksai, paramssuksai);
    const [icd10_08_all_jit] = await connection.query(sqlQuery_08_all_jit, paramsjit);
    const [icd10_08_all_thc] = await connection.query(sqlQuery_08_all_thc, paramsthc);
    const [icd10_08_01] = await connection.query(sqlQuery_08_01, [...params, ...providerCodes01]);
    const [icd10_08_01_suksai] = await connection.query(sqlQuery_08_01_suksai, [...paramssuksai, ...providerCodes01]);
    const [icd10_08_01_jit] = await connection.query(sqlQuery_08_01_jit, [...paramsjit, ...providerCodes01]);
    const [icd10_08_01_thc] = await connection.query(sqlQuery_08_01_thc, [...paramsthc, ...providerCodes01]);
    const [icd10_08_081] = await connection.query(sqlQuery_08_081, [...params, ...providerCodes081]);
    const [icd10_08_081_suksai] = await connection.query(sqlQuery_08_081_suksai, [...paramssuksai, ...providerCodes081]);
    const [icd10_08_081_jit] = await connection.query(sqlQuery_08_081_jit, [...paramsjit, ...providerCodes081]);
    const [icd10_08_081_thc] = await connection.query(sqlQuery_08_081_thc, [...paramsthc, ...providerCodes081]);
    const [icd10_08_099] = await connection.query(sqlQuery_08_099, [...params, ...providerCodes099]);
    const [icd10_08_099_suksai] = await connection.query(sqlQuery_08_099_suksai, [...paramssuksai, ...providerCodes099]);
    const [icd10_08_099_jit] = await connection.query(sqlQuery_08_099_jit, [...paramsjit, ...providerCodes099]);
    const [icd10_08_099_thc] = await connection.query(sqlQuery_08_099_thc, [...paramsthc, ...providerCodes099]);

    const response = {
      icd10_08_all: icd10_08_all[0].icd10_08_all,
      icd10_08_all_suksai: icd10_08_all_suksai[0].icd10_08_all_suksai,
      icd10_08_all_jit: icd10_08_all_jit[0].icd10_08_all_jit,
      icd10_08_all_thc: icd10_08_all_thc[0].icd10_08_all_thc,
      icd10_08_01: icd10_08_01[0].icd10_08_01,
      icd10_08_01_suksai: icd10_08_01_suksai[0].icd10_08_01_suksai,
      icd10_08_01_jit: icd10_08_01_jit[0].icd10_08_01_jit,
      icd10_08_01_thc: icd10_08_01_thc[0].icd10_08_01_thc,
      icd10_08_081: icd10_08_081[0].icd10_08_081,
      icd10_08_081_suksai: icd10_08_081_suksai[0].icd10_08_081_suksai,
      icd10_08_081_jit: icd10_08_081_jit[0].icd10_08_081_jit,
      icd10_08_081_thc: icd10_08_081_thc[0].icd10_08_081_thc,
      icd10_08_099: icd10_08_099[0].icd10_08_099,
      icd10_08_099_suksai: icd10_08_099_suksai[0].icd10_08_099_suksai,
      icd10_08_099_jit: icd10_08_099_jit[0].icd10_08_099_jit,
      icd10_08_099_thc: icd10_08_099_thc[0].icd10_08_099_thc,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}