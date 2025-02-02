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
  const icd10List071 = ['B009%','B029%']
  const payayoCodes = ['payayo']

  try {
    const likeConditions = icd10List071.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List071];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const payayoPlaceholders = payayoCodes.map(() => "?").join(", ");
    const paramspayayo = [...params, ...payayoCodes];

    const sqlQuery_071_all = `
      SELECT COUNT(*) AS icd10_071_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_071_all_payayo = `
      SELECT COUNT(*) AS icd10_071_all_payayo
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${payayoPlaceholders})
    `;

    const sqlQuery_071_01 = `
      SELECT COUNT(*) AS icd10_071_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_071_01_payayo = `
      SELECT COUNT(*) AS icd10_071_01_payayo
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${payayoPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_071_081 = `
      SELECT COUNT(*) AS icd10_071_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_071_081_payayo = `
      SELECT COUNT(*) AS icd10_071_081_payayo
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${payayoPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_071_099 = `
      SELECT COUNT(*) AS icd10_071_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_071_099_payayo = `
      SELECT COUNT(*) AS icd10_071_099_payayo
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${payayoPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_071_all] = await connection.query(sqlQuery_071_all, params);
    const [icd10_071_all_payayo] = await connection.query(sqlQuery_071_all_payayo, paramspayayo);
    const [icd10_071_01] = await connection.query(sqlQuery_071_01, [...params, ...providerCodes01]);
    const [icd10_071_01_payayo] = await connection.query(sqlQuery_071_01_payayo, [...paramspayayo, ...providerCodes01]);
    const [icd10_071_081] = await connection.query(sqlQuery_071_081, [...params, ...providerCodes081]);
    const [icd10_071_081_payayo] = await connection.query(sqlQuery_071_081_payayo, [...paramspayayo, ...providerCodes081]);
    const [icd10_071_099] = await connection.query(sqlQuery_071_099, [...params, ...providerCodes099]);
    const [icd10_071_099_payayo] = await connection.query(sqlQuery_071_099_payayo, [...paramspayayo, ...providerCodes099]);

    const response = {
      icd10_071_all: icd10_071_all[0].icd10_071_all,
      icd10_071_all_payayo: icd10_071_all_payayo[0].icd10_071_all_payayo,
      icd10_071_01: icd10_071_01[0].icd10_071_01,
      icd10_071_01_payayo: icd10_071_01_payayo[0].icd10_071_01_payayo,
      icd10_071_081: icd10_071_081[0].icd10_071_081,
      icd10_071_081_payayo: icd10_071_081_payayo[0].icd10_071_081_payayo,
      icd10_071_099: icd10_071_099[0].icd10_071_099,
      icd10_071_099_payayo: icd10_071_099_payayo[0].icd10_071_099_payayo,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}