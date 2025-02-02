import pool from "@/lib/db";
import dayjs from "dayjs"; // ✅ ต้อง import dayjs

// ✅ API ดึงข้อมูล Users
export async function POST(request) {
  const connection = await pool.getConnection();
  const body = await request.json();
  const { startDate, endDate, providerCodes01, providerCodes081, icd10List05, nawakotCodes, intjakCodes, khingCodes } = body;
  const olddate = dayjs(startDate).format("YYYY-MM-DD");
  const lastdate = dayjs(endDate).format("YYYY-MM-DD");
  const providerCodes099 = [...providerCodes01, ...providerCodes081]

  try {
    const likeConditions = icd10List05.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List05];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const nawakotPlaceholders = nawakotCodes.map(() => "?").join(", ");
    const intjakPlaceholders = intjakCodes.map(() => "?").join(", ");
    const khingPlaceholders = khingCodes.map(() => "?").join(", ");
    const paramsnawakot = [...params, ...nawakotCodes];
    const paramsintjak = [...params, ...intjakCodes];
    const paramskhing = [...params, ...khingCodes];

    const sqlQuery_05_all = `
      SELECT COUNT(*) AS icd10_05_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_05_all_nawakot = `
      SELECT COUNT(*) AS icd10_05_all_nawakot
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${nawakotPlaceholders})
    `;

    const sqlQuery_05_all_intjak = `
      SELECT COUNT(*) AS icd10_05_all_intjak
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${intjakPlaceholders})
    `;

    const sqlQuery_05_all_khing = `
      SELECT COUNT(*) AS icd10_05_all_khing
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${khingPlaceholders})
    `;

    const sqlQuery_05_01 = `
      SELECT COUNT(*) AS icd10_05_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_05_01_nawakot = `
      SELECT COUNT(*) AS icd10_05_01_nawakot
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${nawakotPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_05_01_intjak = `
      SELECT COUNT(*) AS icd10_05_01_intjak
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${intjakPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_05_01_khing = `
      SELECT COUNT(*) AS icd10_05_01_khing
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${khingPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_05_081 = `
      SELECT COUNT(*) AS icd10_05_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_05_081_nawakot = `
      SELECT COUNT(*) AS icd10_05_081_nawakot
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${nawakotPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_05_081_intjak = `
      SELECT COUNT(*) AS icd10_05_081_intjak
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${intjakPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_05_081_khing = `
      SELECT COUNT(*) AS icd10_05_081_khing
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${khingPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_05_099 = `
      SELECT COUNT(*) AS icd10_05_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_05_099_nawakot = `
      SELECT COUNT(*) AS icd10_05_099_nawakot
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${nawakotPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_05_099_intjak = `
      SELECT COUNT(*) AS icd10_05_099_intjak
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${intjakPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_05_099_khing = `
      SELECT COUNT(*) AS icd10_05_099_khing
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${khingPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_05_all] = await connection.query(sqlQuery_05_all, params);
    const [icd10_05_all_nawakot] = await connection.query(sqlQuery_05_all_nawakot, paramsnawakot);
    const [icd10_05_all_intjak] = await connection.query(sqlQuery_05_all_intjak, paramsintjak);
    const [icd10_05_all_khing] = await connection.query(sqlQuery_05_all_khing, paramskhing);
    const [icd10_05_01] = await connection.query(sqlQuery_05_01, [...params, ...providerCodes01]);
    const [icd10_05_01_nawakot] = await connection.query(sqlQuery_05_01_nawakot, [...paramsnawakot, ...providerCodes01]);
    const [icd10_05_01_intjak] = await connection.query(sqlQuery_05_01_intjak, [...paramsintjak, ...providerCodes01]);
    const [icd10_05_01_khing] = await connection.query(sqlQuery_05_01_khing, [...paramskhing, ...providerCodes01]);
    const [icd10_05_081] = await connection.query(sqlQuery_05_081, [...params, ...providerCodes081]);
    const [icd10_05_081_nawakot] = await connection.query(sqlQuery_05_081_nawakot, [...paramsnawakot, ...providerCodes081]);
    const [icd10_05_081_intjak] = await connection.query(sqlQuery_05_081_intjak, [...paramsintjak, ...providerCodes081]);
    const [icd10_05_081_khing] = await connection.query(sqlQuery_05_081_khing, [...paramskhing, ...providerCodes081]);
    const [icd10_05_099] = await connection.query(sqlQuery_05_099, [...params, ...providerCodes099]);
    const [icd10_05_099_nawakot] = await connection.query(sqlQuery_05_099_nawakot, [...paramsnawakot, ...providerCodes099]);
    const [icd10_05_099_intjak] = await connection.query(sqlQuery_05_099_intjak, [...paramsintjak, ...providerCodes099]);
    const [icd10_05_099_khing] = await connection.query(sqlQuery_05_099_khing, [...paramskhing, ...providerCodes099]);

    const response = {
      icd10_05_all: icd10_05_all[0].icd10_05_all,
      icd10_05_all_nawakot: icd10_05_all_nawakot[0].icd10_05_all_nawakot,
      icd10_05_all_intjak: icd10_05_all_intjak[0].icd10_05_all_intjak,
      icd10_05_all_khing: icd10_05_all_khing[0].icd10_05_all_khing,
      icd10_05_01: icd10_05_01[0].icd10_05_01,
      icd10_05_01_nawakot: icd10_05_01_nawakot[0].icd10_05_01_nawakot,
      icd10_05_01_intjak: icd10_05_01_intjak[0].icd10_05_01_intjak,
      icd10_05_01_khing: icd10_05_01_khing[0].icd10_05_01_khing,
      icd10_05_081: icd10_05_081[0].icd10_05_081,
      icd10_05_081_nawakot: icd10_05_081_nawakot[0].icd10_05_081_nawakot,
      icd10_05_081_intjak: icd10_05_081_intjak[0].icd10_05_081_intjak,
      icd10_05_081_khing: icd10_05_081_khing[0].icd10_05_081_khing,
      icd10_05_099: icd10_05_099[0].icd10_05_099,
      icd10_05_099_nawakot: icd10_05_099_nawakot[0].icd10_05_099_nawakot,
      icd10_05_099_intjak: icd10_05_099_intjak[0].icd10_05_099_intjak,
      icd10_05_099_khing: icd10_05_099_khing[0].icd10_05_099_khing,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}