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
  const icd10List01 = ["M791%", "M626%", "M5496%", "M179%"]
  const plaiCodes = ["1550015"]
  const praCodes = ["1570021"]
  const priangCodes = ["1570019"]
  const taraCodes = ["1590003"]
  const prikCodes = ["1580022"]
  try {
    const likeConditions = icd10List01.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List01];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const plaiPlaceholders = plaiCodes.map(() => "?").join(", ");
    const praPlaceholders = praCodes.map(() => "?").join(", ");
    const priangPlaceholders = priangCodes.map(() => "?").join(", ");
    const taraPlaceholders = taraCodes.map(() => "?").join(", ");
    const prikPlaceholders = prikCodes.map(() => "?").join(", ");
    const paramsPlai = [...params, ...plaiCodes];
    const paramsPra = [...params, ...praCodes];
    const paramsPriang = [...params, ...priangCodes];
    const paramsTara = [...params, ...taraCodes];
    const paramsPrik = [...params, ...prikCodes];

    const sqlQuery_01_all = `
      SELECT COUNT(*) AS icd10_01_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_01_all_plai = `
      SELECT COUNT(*) AS icd10_01_all_plai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${plaiPlaceholders})
    `;

    const sqlQuery_01_all_pra = `
      SELECT COUNT(*) AS icd10_01_all_pra
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${praPlaceholders})
    `;

    const sqlQuery_01_all_priang = `
      SELECT COUNT(*) AS icd10_01_all_priang
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${priangPlaceholders})
    `;

    const sqlQuery_01_all_tara = `
      SELECT COUNT(*) AS icd10_01_all_tara
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${taraPlaceholders})
    `;

    const sqlQuery_01_all_prik = `
      SELECT COUNT(*) AS icd10_01_all_prik
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${prikPlaceholders})
    `;

    const sqlQuery_01_all_01 = `
      SELECT COUNT(*) AS icd10_01_all_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_01_all_01_plai = `
      SELECT COUNT(*) AS icd10_01_all_01_plai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${plaiPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_01_all_01_pra = `
      SELECT COUNT(*) AS icd10_01_all_01_pra
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${praPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_01_all_01_priang = `
      SELECT COUNT(*) AS icd10_01_all_01_priang
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${priangPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_01_all_01_tara = `
      SELECT COUNT(*) AS icd10_01_all_01_tara
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${taraPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_01_all_01_prik = `
      SELECT COUNT(*) AS icd10_01_all_01_prik
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${prikPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_01_all_081 = `
      SELECT COUNT(*) AS icd10_01_all_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_01_all_081_plai = `
      SELECT COUNT(*) AS icd10_01_all_081_plai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${plaiPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_01_all_081_pra = `
      SELECT COUNT(*) AS icd10_01_all_081_pra
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${praPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_01_all_081_priang = `
      SELECT COUNT(*) AS icd10_01_all_081_priang
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${priangPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_01_all_081_tara = `
      SELECT COUNT(*) AS icd10_01_all_081_tara
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${taraPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_01_all_081_prik = `
      SELECT COUNT(*) AS icd10_01_all_081_prik
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${prikPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_01_all_099 = `
      SELECT COUNT(*) AS icd10_01_all_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_01_all_099_plai = `
      SELECT COUNT(*) AS icd10_01_all_099_plai
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${plaiPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_01_all_099_pra = `
      SELECT COUNT(*) AS icd10_01_all_099_pra
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${praPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_01_all_099_priang = `
      SELECT COUNT(*) AS icd10_01_all_099_priang
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${priangPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_01_all_099_tara = `
      SELECT COUNT(*) AS icd10_01_all_099_tara
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${taraPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_01_all_099_prik = `
      SELECT COUNT(*) AS icd10_01_all_099_prik
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${prikPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_01_all] = await connection.query(sqlQuery_01_all, params);
    const [icd10_01_all_plai] = await connection.query(sqlQuery_01_all_plai, paramsPlai);
    const [icd10_01_all_pra] = await connection.query(sqlQuery_01_all_pra, paramsPra);
    const [icd10_01_all_priang] = await connection.query(sqlQuery_01_all_priang, paramsPriang);
    const [icd10_01_all_tara] = await connection.query(sqlQuery_01_all_tara, paramsTara);
    const [icd10_01_all_prik] = await connection.query(sqlQuery_01_all_prik, paramsPrik);
    const [icd10_01_all_01] = await connection.query(sqlQuery_01_all_01, [...params, ...providerCodes01]);
    const [icd10_01_all_01_plai] = await connection.query(sqlQuery_01_all_01_plai, [...paramsPlai, ...providerCodes01]);
    const [icd10_01_all_01_pra] = await connection.query(sqlQuery_01_all_01_pra, [...paramsPra, ...providerCodes01]);
    const [icd10_01_all_01_priang] = await connection.query(sqlQuery_01_all_01_priang, [...paramsPriang, ...providerCodes01]);
    const [icd10_01_all_01_tara] = await connection.query(sqlQuery_01_all_01_tara, [...paramsTara, ...providerCodes01]);
    const [icd10_01_all_01_prik] = await connection.query(sqlQuery_01_all_01_prik, [...paramsPrik, ...providerCodes01]);
    const [icd10_01_all_081] = await connection.query(sqlQuery_01_all_081, [...params, ...providerCodes081]);
    const [icd10_01_all_081_plai] = await connection.query(sqlQuery_01_all_081_plai, [...paramsPlai, ...providerCodes081]);
    const [icd10_01_all_081_pra] = await connection.query(sqlQuery_01_all_081_pra, [...paramsPra, ...providerCodes081]);
    const [icd10_01_all_081_priang] = await connection.query(sqlQuery_01_all_081_priang, [...paramsPriang, ...providerCodes081]);
    const [icd10_01_all_081_tara] = await connection.query(sqlQuery_01_all_081_tara, [...paramsTara, ...providerCodes081]);
    const [icd10_01_all_081_prik] = await connection.query(sqlQuery_01_all_081_prik, [...paramsPrik, ...providerCodes081]);
    const [icd10_01_all_099] = await connection.query(sqlQuery_01_all_099, [...params, ...providerCodes099]);
    const [icd10_01_all_099_plai] = await connection.query(sqlQuery_01_all_099_plai, [...paramsPlai, ...providerCodes099]);
    const [icd10_01_all_099_pra] = await connection.query(sqlQuery_01_all_099_pra, [...paramsPra, ...providerCodes099]);
    const [icd10_01_all_099_priang] = await connection.query(sqlQuery_01_all_099_priang, [...paramsPriang, ...providerCodes099]);
    const [icd10_01_all_099_tara] = await connection.query(sqlQuery_01_all_099_tara, [...paramsTara, ...providerCodes099]);
    const [icd10_01_all_099_prik] = await connection.query(sqlQuery_01_all_099_prik, [...paramsPrik, ...providerCodes099]);

    const response = {
      icd10_01_all: icd10_01_all[0].icd10_01_all,
      icd10_01_all_plai: icd10_01_all_plai[0].icd10_01_all_plai,
      icd10_01_all_pra: icd10_01_all_pra[0].icd10_01_all_pra,
      icd10_01_all_priang: icd10_01_all_priang[0].icd10_01_all_priang,
      icd10_01_all_tara: icd10_01_all_tara[0].icd10_01_all_tara,
      icd10_01_all_prik: icd10_01_all_prik[0].icd10_01_all_prik,
      icd10_01_all_01: icd10_01_all_01[0].icd10_01_all_01,
      icd10_01_all_01_plai: icd10_01_all_01_plai[0].icd10_01_all_01_plai,
      icd10_01_all_01_pra: icd10_01_all_01_pra[0].icd10_01_all_01_pra,
      icd10_01_all_01_priang: icd10_01_all_01_priang[0].icd10_01_all_01_priang,
      icd10_01_all_01_tara: icd10_01_all_01_tara[0].icd10_01_all_01_tara,
      icd10_01_all_01_prik: icd10_01_all_01_prik[0].icd10_01_all_01_prik,
      icd10_01_all_081: icd10_01_all_081[0].icd10_01_all_081,
      icd10_01_all_081_plai: icd10_01_all_081_plai[0].icd10_01_all_081_plai,
      icd10_01_all_081_pra: icd10_01_all_081_pra[0].icd10_01_all_081_pra,
      icd10_01_all_081_priang:
        icd10_01_all_081_priang[0].icd10_01_all_081_priang,
      icd10_01_all_081_tara: icd10_01_all_081_tara[0].icd10_01_all_081_tara,
      icd10_01_all_081_prik: icd10_01_all_081_prik[0].icd10_01_all_081_prik,
      icd10_01_all_099: icd10_01_all_099[0].icd10_01_all_099,
      icd10_01_all_099_plai: icd10_01_all_099_plai[0].icd10_01_all_099_plai,
      icd10_01_all_099_pra: icd10_01_all_099_pra[0].icd10_01_all_099_pra,
      icd10_01_all_099_priang:
        icd10_01_all_099_priang[0].icd10_01_all_099_priang,
      icd10_01_all_099_tara: icd10_01_all_099_tara[0].icd10_01_all_099_tara,
      icd10_01_all_099_prik: icd10_01_all_099_prik[0].icd10_01_all_099_prik,
    };

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}