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
  const icd10List09 = ['A099%']
  const fahCodes = ['1470012','1640036','1640050','1650019']
  const bananaCodes = ["banana"]
  const yellowCodes = ["yellow"]

  try {
    const likeConditions = icd10List09.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List09];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const fahPlaceholders = fahCodes.map(() => "?").join(", ");
    const bananaPlaceholders = bananaCodes.map(() => "?").join(", ");
    const yellowPlaceholders = yellowCodes.map(() => "?").join(", ");
    const paramsfah = [...params, ...fahCodes];
    const paramsbanana = [...params, ...bananaCodes];
    const paramsyellow = [...params, ...yellowCodes];

    const sqlQuery_09_all = `
      SELECT COUNT(*) AS icd10_09_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_09_all_fah = `
      SELECT COUNT(*) AS icd10_09_all_fah
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${fahPlaceholders})
    `;

    const sqlQuery_09_all_banana = `
      SELECT COUNT(*) AS icd10_09_all_banana
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${bananaPlaceholders})
    `;

    const sqlQuery_09_all_yellow = `
      SELECT COUNT(*) AS icd10_09_all_yellow
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${yellowPlaceholders})
    `;

    const sqlQuery_09_01 = `
      SELECT COUNT(*) AS icd10_09_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_09_01_fah = `
      SELECT COUNT(*) AS icd10_09_01_fah
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${fahPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_09_01_banana = `
      SELECT COUNT(*) AS icd10_09_01_banana
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${bananaPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_09_01_yellow = `
      SELECT COUNT(*) AS icd10_09_01_yellow
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${yellowPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_09_081 = `
      SELECT COUNT(*) AS icd10_09_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_09_081_fah = `
      SELECT COUNT(*) AS icd10_09_081_fah
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${fahPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_09_081_banana = `
      SELECT COUNT(*) AS icd10_09_081_banana
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${bananaPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_09_081_yellow = `
      SELECT COUNT(*) AS icd10_09_081_yellow
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${yellowPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_09_099 = `
      SELECT COUNT(*) AS icd10_09_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_09_099_fah = `
      SELECT COUNT(*) AS icd10_09_099_fah
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${fahPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_09_099_banana = `
      SELECT COUNT(*) AS icd10_09_099_banana
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${bananaPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_09_099_yellow = `
      SELECT COUNT(*) AS icd10_09_099_yellow
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${yellowPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_09_all] = await connection.query(sqlQuery_09_all, params);
    const [icd10_09_all_fah] = await connection.query(sqlQuery_09_all_fah, paramsfah);
    const [icd10_09_all_banana] = await connection.query(sqlQuery_09_all_banana, paramsbanana);
    const [icd10_09_all_yellow] = await connection.query(sqlQuery_09_all_yellow, paramsyellow);
    const [icd10_09_01] = await connection.query(sqlQuery_09_01, [...params, ...providerCodes01]);
    const [icd10_09_01_fah] = await connection.query(sqlQuery_09_01_fah, [...paramsfah, ...providerCodes01]);
    const [icd10_09_01_banana] = await connection.query(sqlQuery_09_01_banana, [...paramsbanana, ...providerCodes01]);
    const [icd10_09_01_yellow] = await connection.query(sqlQuery_09_01_yellow, [...paramsyellow, ...providerCodes01]);
    const [icd10_09_081] = await connection.query(sqlQuery_09_081, [...params, ...providerCodes081]);
    const [icd10_09_081_fah] = await connection.query(sqlQuery_09_081_fah, [...paramsfah, ...providerCodes081]);
    const [icd10_09_081_banana] = await connection.query(sqlQuery_09_081_banana, [...paramsbanana, ...providerCodes081]);
    const [icd10_09_081_yellow] = await connection.query(sqlQuery_09_081_yellow, [...paramsyellow, ...providerCodes081]);
    const [icd10_09_099] = await connection.query(sqlQuery_09_099, [...params, ...providerCodes099]);
    const [icd10_09_099_fah] = await connection.query(sqlQuery_09_099_fah, [...paramsfah, ...providerCodes099]);
    const [icd10_09_099_banana] = await connection.query(sqlQuery_09_099_banana, [...paramsbanana, ...providerCodes099]);
    const [icd10_09_099_yellow] = await connection.query(sqlQuery_09_099_yellow, [...paramsyellow, ...providerCodes099]);

    const response = {
      icd10_09_all: icd10_09_all[0].icd10_09_all,
      icd10_09_all_fah: icd10_09_all_fah[0].icd10_09_all_fah,
      icd10_09_all_banana: icd10_09_all_banana[0].icd10_09_all_banana,
      icd10_09_all_yellow: icd10_09_all_yellow[0].icd10_09_all_yellow,
      icd10_09_01: icd10_09_01[0].icd10_09_01,
      icd10_09_01_fah: icd10_09_01_fah[0].icd10_09_01_fah,
      icd10_09_01_banana: icd10_09_01_banana[0].icd10_09_01_banana,
      icd10_09_01_yellow: icd10_09_01_yellow[0].icd10_09_01_yellow,
      icd10_09_081: icd10_09_081[0].icd10_09_081,
      icd10_09_081_fah: icd10_09_081_fah[0].icd10_09_081_fah,
      icd10_09_081_banana: icd10_09_081_banana[0].icd10_09_081_banana,
      icd10_09_081_yellow: icd10_09_081_yellow[0].icd10_09_081_yellow,
      icd10_09_099: icd10_09_099[0].icd10_09_099,
      icd10_09_099_fah: icd10_09_099_fah[0].icd10_09_099_fah,
      icd10_09_099_banana: icd10_09_099_banana[0].icd10_09_099_banana,
      icd10_09_099_yellow: icd10_09_099_yellow[0].icd10_09_099_yellow,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}