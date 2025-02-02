import pool from "@/lib/db";
import dayjs from "dayjs"; // ✅ ต้อง import dayjs

// ✅ API ดึงข้อมูล Users
export async function POST(request) {
  const connection = await pool.getConnection();
  const body = await request.json();
  const { startDate, endDate,providerCodes01, providerCodes081, icd10List03, cuminCodes, tardCodes, khingCodes } = body;
  const olddate = dayjs(startDate).format("YYYY-MM-DD");
  const lastdate = dayjs(endDate).format("YYYY-MM-DD");
  const providerCodes099 = [...providerCodes01, ...providerCodes081]

  try {
    const likeConditions = icd10List03.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List03];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const cuminPlaceholders = cuminCodes.map(() => "?").join(", ");
    const tardPlaceholders = tardCodes.map(() => "?").join(", ");
    const khingPlaceholders = khingCodes.map(() => "?").join(", ");
    const paramscumin = [...params, ...cuminCodes];
    const paramstard = [...params, ...tardCodes];
    const paramskhing = [...params, ...khingCodes];

    const sqlQuery_03_all = `
      SELECT COUNT(*) AS icd10_03_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_03_all_cumin = `
      SELECT COUNT(*) AS icd10_03_all_cumin
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${cuminPlaceholders})
    `;

    const sqlQuery_03_all_tard = `
      SELECT COUNT(*) AS icd10_03_all_tard
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${tardPlaceholders})
    `;

    const sqlQuery_03_all_khing = `
      SELECT COUNT(*) AS icd10_03_all_khing
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${khingPlaceholders})
    `;

    const sqlQuery_03_01 = `
      SELECT COUNT(*) AS icd10_03_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_03_01_cumin = `
      SELECT COUNT(*) AS icd10_03_01_cumin
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${cuminPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_03_01_tard = `
      SELECT COUNT(*) AS icd10_03_01_tard
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${tardPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_03_01_khing = `
      SELECT COUNT(*) AS icd10_03_01_khing
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${khingPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_03_081 = `
      SELECT COUNT(*) AS icd10_03_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_03_081_cumin = `
      SELECT COUNT(*) AS icd10_03_081_cumin
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${cuminPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_03_081_tard = `
      SELECT COUNT(*) AS icd10_03_081_tard
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${tardPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_03_081_khing = `
      SELECT COUNT(*) AS icd10_03_081_khing
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${khingPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_03_099 = `
      SELECT COUNT(*) AS icd10_03_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_03_099_cumin = `
      SELECT COUNT(*) AS icd10_03_099_cumin
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${cuminPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_03_099_tard = `
      SELECT COUNT(*) AS icd10_03_099_tard
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${tardPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_03_099_khing = `
      SELECT COUNT(*) AS icd10_03_099_khing
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${khingPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_03_all] = await connection.query(sqlQuery_03_all, params);
    const [icd10_03_all_cumin] = await connection.query(sqlQuery_03_all_cumin, paramscumin);
    const [icd10_03_all_tard] = await connection.query(sqlQuery_03_all_tard, paramstard);
    const [icd10_03_all_khing] = await connection.query(sqlQuery_03_all_khing, paramskhing);
    const [icd10_03_01] = await connection.query(sqlQuery_03_01, [...params, ...providerCodes01]);
    const [icd10_03_01_cumin] = await connection.query(sqlQuery_03_01_cumin, [...paramscumin, ...providerCodes01]);
    const [icd10_03_01_tard] = await connection.query(sqlQuery_03_01_tard, [...paramstard, ...providerCodes01]);
    const [icd10_03_01_khing] = await connection.query(sqlQuery_03_01_khing, [...paramskhing, ...providerCodes01]);
    const [icd10_03_081] = await connection.query(sqlQuery_03_081, [...params, ...providerCodes081]);
    const [icd10_03_081_cumin] = await connection.query(sqlQuery_03_081_cumin, [...paramscumin, ...providerCodes081]);
    const [icd10_03_081_tard] = await connection.query(sqlQuery_03_081_tard, [...paramstard, ...providerCodes081]);
    const [icd10_03_081_khing] = await connection.query(sqlQuery_03_081_khing, [...paramskhing, ...providerCodes081]);
    const [icd10_03_099] = await connection.query(sqlQuery_03_099, [...params, ...providerCodes099]);
    const [icd10_03_099_cumin] = await connection.query(sqlQuery_03_099_cumin, [...paramscumin, ...providerCodes099]);
    const [icd10_03_099_tard] = await connection.query(sqlQuery_03_099_tard, [...paramstard, ...providerCodes099]);
    const [icd10_03_099_khing] = await connection.query(sqlQuery_03_099_khing, [...paramskhing, ...providerCodes099]);

    const response = {
      icd10_03_all: icd10_03_all[0].icd10_03_all,
      icd10_03_all_cumin: icd10_03_all_cumin[0].icd10_03_all_cumin,
      icd10_03_all_tard: icd10_03_all_tard[0].icd10_03_all_tard,
      icd10_03_all_khing: icd10_03_all_khing[0].icd10_03_all_khing,
      icd10_03_01: icd10_03_01[0].icd10_03_01,
      icd10_03_01_cumin: icd10_03_01_cumin[0].icd10_03_01_cumin,
      icd10_03_01_tard: icd10_03_01_tard[0].icd10_03_01_tard,
      icd10_03_01_khing: icd10_03_01_khing[0].icd10_03_01_khing,
      icd10_03_081: icd10_03_081[0].icd10_03_081,
      icd10_03_081_cumin: icd10_03_081_cumin[0].icd10_03_081_cumin,
      icd10_03_081_tard: icd10_03_081_tard[0].icd10_03_081_tard,
      icd10_03_081_khing: icd10_03_081_khing[0].icd10_03_081_khing,
      icd10_03_099: icd10_03_099[0].icd10_03_099,
      icd10_03_099_cumin: icd10_03_099_cumin[0].icd10_03_099_cumin,
      icd10_03_099_tard: icd10_03_099_tard[0].icd10_03_099_tard,
      icd10_03_099_khing: icd10_03_099_khing[0].icd10_03_099_khing,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}