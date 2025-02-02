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
  const icd10List02 = ["J00%","U071%","U072%"]
  const fahCodes = ['1640036','1640050','1650019']
  const maweangCodes = ["1570018"]
  const pomCodes = ['1550002','1660019']
  const treeplaCodes = ["1580014"]
  const prapCodes = ["1630047"]

  try {
    const likeConditions = icd10List02.map(() => "od.icd10 LIKE ?").join(" OR ");
    const params = [olddate, lastdate, ...icd10List02];

    const providerPlaceholders01 = providerCodes01.map(() => "?").join(", ");
    const providerPlaceholders081 = providerCodes081.map(() => "?").join(", ");
    const providerPlaceholders099 = providerCodes099.map(() => "?").join(", ");

    // ✅ สร้างเงื่อนไข IN (?) สำหรับ d.icode
    const fahPlaceholders = fahCodes.map(() => "?").join(", ");
    const maweangPlaceholders = maweangCodes.map(() => "?").join(", ");
    const pomPlaceholders = pomCodes.map(() => "?").join(", ");
    const treeplaPlaceholders = treeplaCodes.map(() => "?").join(", ");
    const prapPlaceholders = prapCodes.map(() => "?").join(", ");
    const paramsfah = [...params, ...fahCodes];
    const paramsmaweang = [...params, ...maweangCodes];
    const paramspom = [...params, ...pomCodes];
    const paramstreepla = [...params, ...treeplaCodes];
    const paramsprap = [...params, ...prapCodes];

    const sqlQuery_02_all = `
      SELECT COUNT(*) AS icd10_02_all
      FROM ovstdiag od
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
    `;

    const sqlQuery_02_all_fah = `
      SELECT COUNT(*) AS icd10_02_all_fah
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${fahPlaceholders})
    `;

    const sqlQuery_02_all_maweang = `
      SELECT COUNT(*) AS icd10_02_all_maweang
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${maweangPlaceholders})
    `;

    const sqlQuery_02_all_pom = `
      SELECT COUNT(*) AS icd10_02_all_pom
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${pomPlaceholders})
    `;

    const sqlQuery_02_all_treepla = `
      SELECT COUNT(*) AS icd10_02_all_treepla
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${treeplaPlaceholders})
    `;

    const sqlQuery_02_all_prap = `
      SELECT COUNT(*) AS icd10_02_all_prap
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${prapPlaceholders})
    `;

    const sqlQuery_02_01 = `
      SELECT COUNT(*) AS icd10_02_01
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_02_01_fah = `
      SELECT COUNT(*) AS icd10_02_01_fah
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${fahPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_02_01_maweang = `
      SELECT COUNT(*) AS icd10_02_01_maweang
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${maweangPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_02_01_pom = `
      SELECT COUNT(*) AS icd10_02_01_pom
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${pomPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_02_01_treepla = `
      SELECT COUNT(*) AS icd10_02_01_treepla
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${treeplaPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_02_01_prap = `
      SELECT COUNT(*) AS icd10_02_01_prap
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${prapPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders01})
    `;

    const sqlQuery_02_081 = `
      SELECT COUNT(*) AS icd10_02_081
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_02_081_fah = `
      SELECT COUNT(*) AS icd10_02_081_fah
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${fahPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_02_081_maweang = `
      SELECT COUNT(*) AS icd10_02_081_maweang
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${maweangPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_02_081_pom = `
      SELECT COUNT(*) AS icd10_02_081_pom
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${pomPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_02_081_treepla = `
      SELECT COUNT(*) AS icd10_02_081_treepla
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${treeplaPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_02_081_prap = `
      SELECT COUNT(*) AS icd10_02_081_prap
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${prapPlaceholders})
      AND doc.provider_type_code IN (${providerPlaceholders081})
    `;

    const sqlQuery_02_099 = `
      SELECT COUNT(*) AS icd10_02_099
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_02_099_fah = `
      SELECT COUNT(*) AS icd10_02_099_fah
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${fahPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_02_099_maweang = `
      SELECT COUNT(*) AS icd10_02_099_maweang
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${maweangPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_02_099_pom = `
      SELECT COUNT(*) AS icd10_02_099_pom
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${pomPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_02_099_treepla = `
      SELECT COUNT(*) AS icd10_02_099_treepla
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${treeplaPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const sqlQuery_02_099_prap = `
      SELECT COUNT(*) AS icd10_02_099_prap
      FROM ovstdiag od
      JOIN doctor doc ON od.doctor = doc.code
      JOIN opitemrece p ON od.vn = p.vn
      JOIN drugitems d ON p.icode = d.icode
      WHERE od.vstdate BETWEEN ? AND ?
      AND (${likeConditions})
      AND d.icode IN (${prapPlaceholders})
      AND (doc.provider_type_code NOT IN (${providerPlaceholders099}) OR doc.provider_type_code IS NULL)
    `;

    const [icd10_02_all] = await connection.query(sqlQuery_02_all, params);
    const [icd10_02_all_fah] = await connection.query(sqlQuery_02_all_fah, paramsfah);
    const [icd10_02_all_maweang] = await connection.query(sqlQuery_02_all_maweang, paramsmaweang);
    const [icd10_02_all_pom] = await connection.query(sqlQuery_02_all_pom, paramspom);
    const [icd10_02_all_treepla] = await connection.query(sqlQuery_02_all_treepla, paramstreepla);
    const [icd10_02_all_prap] = await connection.query(sqlQuery_02_all_prap, paramsprap);
    const [icd10_02_01] = await connection.query(sqlQuery_02_01, [...params, ...providerCodes01]);
    const [icd10_02_01_fah] = await connection.query(sqlQuery_02_01_fah, [...paramsfah, ...providerCodes01]);
    const [icd10_02_01_maweang] = await connection.query(sqlQuery_02_01_maweang, [...paramsmaweang, ...providerCodes01]);
    const [icd10_02_01_pom] = await connection.query(sqlQuery_02_01_pom, [...paramspom, ...providerCodes01]);
    const [icd10_02_01_treepla] = await connection.query(sqlQuery_02_01_treepla, [...paramstreepla, ...providerCodes01]);
    const [icd10_02_01_prap] = await connection.query(sqlQuery_02_01_prap, [...paramsprap, ...providerCodes01]);
    const [icd10_02_081] = await connection.query(sqlQuery_02_081, [...params, ...providerCodes081]);
    const [icd10_02_081_fah] = await connection.query(sqlQuery_02_081_fah, [...paramsfah, ...providerCodes081]);
    const [icd10_02_081_maweang] = await connection.query(sqlQuery_02_081_maweang, [...paramsmaweang, ...providerCodes081]);
    const [icd10_02_081_pom] = await connection.query(sqlQuery_02_081_pom, [...paramspom, ...providerCodes081]);
    const [icd10_02_081_treepla] = await connection.query(sqlQuery_02_081_treepla, [...paramstreepla, ...providerCodes081]);
    const [icd10_02_081_prap] = await connection.query(sqlQuery_02_081_prap, [...paramsprap, ...providerCodes081]);
    const [icd10_02_099] = await connection.query(sqlQuery_02_099, [...params, ...providerCodes099]);
    const [icd10_02_099_fah] = await connection.query(sqlQuery_02_099_fah, [...paramsfah, ...providerCodes099]);
    const [icd10_02_099_maweang] = await connection.query(sqlQuery_02_099_maweang, [...paramsmaweang, ...providerCodes099]);
    const [icd10_02_099_pom] = await connection.query(sqlQuery_02_099_pom, [...paramspom, ...providerCodes099]);
    const [icd10_02_099_treepla] = await connection.query(sqlQuery_02_099_treepla, [...paramstreepla, ...providerCodes099]);
    const [icd10_02_099_prap] = await connection.query(sqlQuery_02_099_prap, [...paramsprap, ...providerCodes099]);

    const response = {
      icd10_02_all: icd10_02_all[0].icd10_02_all,
      icd10_02_all_fah: icd10_02_all_fah[0].icd10_02_all_fah,
      icd10_02_all_maweang: icd10_02_all_maweang[0].icd10_02_all_maweang,
      icd10_02_all_pom: icd10_02_all_pom[0].icd10_02_all_pom,
      icd10_02_all_treepla: icd10_02_all_treepla[0].icd10_02_all_treepla,
      icd10_02_all_prap: icd10_02_all_prap[0].icd10_02_all_prap,
      icd10_02_01: icd10_02_01[0].icd10_02_01,
      icd10_02_01_fah: icd10_02_01_fah[0].icd10_02_01_fah,
      icd10_02_01_maweang: icd10_02_01_maweang[0].icd10_02_01_maweang,
      icd10_02_01_pom: icd10_02_01_pom[0].icd10_02_01_pom,
      icd10_02_01_treepla: icd10_02_01_treepla[0].icd10_02_01_treepla,
      icd10_02_01_prap: icd10_02_01_prap[0].icd10_02_01_prap,
      icd10_02_081: icd10_02_081[0].icd10_02_081,
      icd10_02_081_fah: icd10_02_081_fah[0].icd10_02_081_fah,
      icd10_02_081_maweang: icd10_02_081_maweang[0].icd10_02_081_maweang,
      icd10_02_081_pom: icd10_02_081_pom[0].icd10_02_081_pom,
      icd10_02_081_treepla: icd10_02_081_treepla[0].icd10_02_081_treepla,
      icd10_02_081_prap: icd10_02_081_prap[0].icd10_02_081_prap,
      icd10_02_099: icd10_02_099[0].icd10_02_099,
      icd10_02_099_fah: icd10_02_099_fah[0].icd10_02_099_fah,
      icd10_02_099_maweang: icd10_02_099_maweang[0].icd10_02_099_maweang,
      icd10_02_099_pom: icd10_02_099_pom[0].icd10_02_099_pom,
      icd10_02_099_treepla: icd10_02_099_treepla[0].icd10_02_099_treepla,
      icd10_02_099_prap: icd10_02_099_prap[0].icd10_02_099_prap,
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}