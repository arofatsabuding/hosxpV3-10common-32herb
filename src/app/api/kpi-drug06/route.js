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
  const icd10List06 = ["G81%"]
  const lomCodes = ['1650004']
  const tamlaiCodes = ["tamlai"]

  try {
    const likeConditions = icd10List06.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List06];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const lomPlaceholders = lomCodes.map(() => "?").join(", ");
    const tamlaiPlaceholders = tamlaiCodes.map(() => "?").join(", ");
    const paramslom = [...params, ...lomCodes];
    const paramstamlai = [...params, ...tamlaiCodes];

    const sqlQuery_06_all = `
      SELECT COUNT(*) AS icd10_06_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_06_all_lom = `
      SELECT COUNT(*) AS icd10_06_all_lom
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${lomPlaceholders})
    `;

    const sqlQuery_06_all_tamlai = `
      SELECT COUNT(*) AS icd10_06_all_tamlai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${tamlaiPlaceholders})
    `;

    const sqlQuery_06_01 = `
      SELECT COUNT(*) AS icd10_06_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_06_01_lom = `
      SELECT COUNT(*) AS icd10_06_01_lom
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${lomPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_06_01_tamlai = `
      SELECT COUNT(*) AS icd10_06_01_tamlai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${tamlaiPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_06_081 = `
      SELECT COUNT(*) AS icd10_06_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_06_081_lom = `
      SELECT COUNT(*) AS icd10_06_081_lom
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${lomPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_06_081_tamlai = `
      SELECT COUNT(*) AS icd10_06_081_tamlai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${tamlaiPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_06_099 = `
      SELECT COUNT(*) AS icd10_06_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_06_099_lom = `
      SELECT COUNT(*) AS icd10_06_099_lom
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${lomPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_06_099_tamlai = `
      SELECT COUNT(*) AS icd10_06_099_tamlai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${tamlaiPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_06_all] = await connection.query(sqlQuery_06_all, params);
    const [icd10_06_all_lom] = await connection.query(sqlQuery_06_all_lom, paramslom);
    const [icd10_06_all_tamlai] = await connection.query(sqlQuery_06_all_tamlai, paramstamlai);
    const [icd10_06_01] = await connection.query(sqlQuery_06_01, [...params, ...providerCodes01]);
    const [icd10_06_01_lom] = await connection.query(sqlQuery_06_01_lom, [...paramslom, ...providerCodes01]);
    const [icd10_06_01_tamlai] = await connection.query(sqlQuery_06_01_tamlai, [...paramstamlai, ...providerCodes01]);
    const [icd10_06_081] = await connection.query(sqlQuery_06_081, [...params, ...providerCodes081]);
    const [icd10_06_081_lom] = await connection.query(sqlQuery_06_081_lom, [...paramslom, ...providerCodes081]);
    const [icd10_06_081_tamlai] = await connection.query(sqlQuery_06_081_tamlai, [...paramstamlai, ...providerCodes081]);
    const [icd10_06_099] = await connection.query(sqlQuery_06_099, [...params, ...providerCodes099]);
    const [icd10_06_099_lom] = await connection.query(sqlQuery_06_099_lom, [...paramslom, ...providerCodes099]);
    const [icd10_06_099_tamlai] = await connection.query(sqlQuery_06_099_tamlai, [...paramstamlai, ...providerCodes099]);

    const response = {
      icd10_06_all: icd10_06_all[0].icd10_06_all,
      icd10_06_all_lom: icd10_06_all_lom[0].icd10_06_all_lom,
      icd10_06_all_tamlai: icd10_06_all_tamlai[0].icd10_06_all_tamlai,
      icd10_06_01: icd10_06_01[0].icd10_06_01,
      icd10_06_01_lom: icd10_06_01_lom[0].icd10_06_01_lom,
      icd10_06_01_tamlai: icd10_06_01_tamlai[0].icd10_06_01_tamlai,
      icd10_06_081: icd10_06_081[0].icd10_06_081,
      icd10_06_081_lom: icd10_06_081_lom[0].icd10_06_081_lom,
      icd10_06_081_tamlai: icd10_06_081_tamlai[0].icd10_06_081_tamlai,
      icd10_06_099: icd10_06_099[0].icd10_06_099,
      icd10_06_099_lom: icd10_06_099_lom[0].icd10_06_099_lom,
      icd10_06_099_tamlai: icd10_06_099_tamlai[0].icd10_06_099_tamlai,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}