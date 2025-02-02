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
  const icd10List074 = ['B360%','B353%' ,'B354%','B356%']
  const thongCodes = ['thong']

  try {
    const likeConditions = icd10List074.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List074];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const thongPlaceholders = thongCodes.map(() => "?").join(", ");
    const paramsthong = [...params, ...thongCodes];

    const sqlQuery_074_all = `
      SELECT COUNT(*) AS icd10_074_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_074_all_thong = `
      SELECT COUNT(*) AS icd10_074_all_thong
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thongPlaceholders})
    `;

    const sqlQuery_074_01 = `
      SELECT COUNT(*) AS icd10_074_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_074_01_thong = `
      SELECT COUNT(*) AS icd10_074_01_thong
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thongPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_074_081 = `
      SELECT COUNT(*) AS icd10_074_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_074_081_thong = `
      SELECT COUNT(*) AS icd10_074_081_thong
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thongPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_074_099 = `
      SELECT COUNT(*) AS icd10_074_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_074_099_thong = `
      SELECT COUNT(*) AS icd10_074_099_thong
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${thongPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_074_all] = await connection.query(sqlQuery_074_all, params);
    const [icd10_074_all_thong] = await connection.query(sqlQuery_074_all_thong, paramsthong);
    const [icd10_074_01] = await connection.query(sqlQuery_074_01, [...params, ...providerCodes01]);
    const [icd10_074_01_thong] = await connection.query(sqlQuery_074_01_thong, [...paramsthong, ...providerCodes01]);
    const [icd10_074_081] = await connection.query(sqlQuery_074_081, [...params, ...providerCodes081]);
    const [icd10_074_081_thong] = await connection.query(sqlQuery_074_081_thong, [...paramsthong, ...providerCodes081]);
    const [icd10_074_099] = await connection.query(sqlQuery_074_099, [...params, ...providerCodes099]);
    const [icd10_074_099_thong] = await connection.query(sqlQuery_074_099_thong, [...paramsthong, ...providerCodes099]);

    const response = {
      icd10_074_all: icd10_074_all[0].icd10_074_all,
      icd10_074_all_thong: icd10_074_all_thong[0].icd10_074_all_thong,
      icd10_074_01: icd10_074_01[0].icd10_074_01,
      icd10_074_01_thong: icd10_074_01_thong[0].icd10_074_01_thong,
      icd10_074_081: icd10_074_081[0].icd10_074_081,
      icd10_074_081_thong: icd10_074_081_thong[0].icd10_074_081_thong,
      icd10_074_099: icd10_074_099[0].icd10_074_099,
      icd10_074_099_thong: icd10_074_099_thong[0].icd10_074_099_thong,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}