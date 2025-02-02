import pool from "@/lib/db";
import dayjs from "dayjs"; // ✅ ต้อง import dayjs

// ✅ API ดึงข้อมูล Users
export async function POST(request) {
  const connection = await pool.getConnection();
  const body = await request.json();
  const { startDate, endDate } = body;
  const olddate = dayjs(startDate).format("YYYY-MM-DD");
  const lastdate = dayjs(endDate).format("YYYY-MM-DD");
  try {
    const [icd10_10_all] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_all
        FROM ovstdiag od
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%' 
        )`,
      [olddate, lastdate]
    );
    const [icd10_10_all_mara] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_all_mara
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        JOIN opitemrece p ON od.vn = p.vn
        JOIN drugitems d ON p.icode = d.icode
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%'
        )
        AND d.icode IN ('1580018')`,
      [olddate, lastdate]
    );
    const [icd10_10_all_thc] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_all_thc
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        JOIN opitemrece p ON od.vn = p.vn
        JOIN drugitems d ON p.icode = d.icode
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%' 
        )
        AND d.icode IN ('thc')`,
      [olddate, lastdate]
    );

    const [icd10_10_01] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_01
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%' 
        )
        AND doc.provider_type_code IN ('01')`,
      [olddate, lastdate]
    );
    const [icd10_10_01_mara] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_01_mara
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        JOIN opitemrece p ON od.vn = p.vn
        JOIN drugitems d ON p.icode = d.icode
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%' 
        )
        AND doc.provider_type_code IN ('01')
        AND d.icode IN ('1580018')`,
      [olddate, lastdate]
    );
    const [icd10_10_01_thc] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_01_thc
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        JOIN opitemrece p ON od.vn = p.vn
        JOIN drugitems d ON p.icode = d.icode
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%' 
        )
        AND doc.provider_type_code IN ('01')
        AND d.icode IN ('thc')`,
      [olddate, lastdate]
    );

    const [icd10_10_081] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_081
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%' 
        )
        AND doc.provider_type_code IN ('081','084')`,
      [olddate, lastdate]
    );
    const [icd10_10_081_mara] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_081_mara
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        JOIN opitemrece p ON od.vn = p.vn
        JOIN drugitems d ON p.icode = d.icode
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%' 
        )
        AND doc.provider_type_code IN ('081','084')
        AND d.icode IN ('1580018')`,
      [olddate, lastdate]
    );
    const [icd10_10_081_thc] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_081_thc
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        JOIN opitemrece p ON od.vn = p.vn
        JOIN drugitems d ON p.icode = d.icode
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%' 
        )
        AND doc.provider_type_code IN ('081','084')
        AND d.icode IN ('thc')`,
      [olddate, lastdate]
    );

    const [icd10_10_099] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_099
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%'
        )
        AND (doc.provider_type_code NOT IN ('01','081','084') OR doc.provider_type_code IS NULL)`,
      [olddate, lastdate]
    );
    const [icd10_10_099_mara] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_099_mara
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        JOIN opitemrece p ON od.vn = p.vn
        JOIN drugitems d ON p.icode = d.icode
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%'
        )
        AND (doc.provider_type_code NOT IN ('01','081','084') OR doc.provider_type_code IS NULL)
        AND d.icode IN ('1580018')`,
      [olddate, lastdate]
    );
    const [icd10_10_099_thc] = await connection.query(
      `SELECT COUNT(*) AS icd10_10_099_thc
        FROM ovstdiag od
        JOIN doctor doc ON od.doctor = doc.code
        JOIN opitemrece p ON od.vn = p.vn
        JOIN drugitems d ON p.icode = d.icode
        WHERE od.vstdate BETWEEN ? AND ?
        AND (
          od.icd10 LIKE 'R630%'
        )
        AND (doc.provider_type_code NOT IN ('01','081','084') OR doc.provider_type_code IS NULL)
        AND d.icode IN ('thc')`,
      [olddate, lastdate]
    );

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