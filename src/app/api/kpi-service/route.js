import pool from "@/lib/db";
import dayjs from "dayjs"; // ✅ ต้อง import dayjs

// ✅ API ดึงข้อมูล Users
export async function POST(request) {
  const connection = await pool.getConnection();
  const body = await request.json();
  const {
    startDate,
    endDate,
    main_dep,
    health_med_operation_item_code_n,
    health_med_operation_item_code_c,
    health_med_operation_item_code_o,
    health_med_operation_item_code_l,
    health_med_operation_type_id_o,
    health_med_operation_type_id_l,
    pcodeA2,
    pcodeUC,
    pcodeA7
  } = body;
  const olddate = dayjs(startDate).format("YYYY-MM-DD");
  const lastdate = dayjs(endDate).format("YYYY-MM-DD");

  try {
    const [op_visit] = await connection.query(
      `SELECT COUNT(*) AS op_visit
           FROM vn_stat ov, ovst ovst, patient pt 
           WHERE ov.vn = ovst.vn 
             AND pt.hn = ov.hn 
             AND ov.vstdate BETWEEN ? AND ?`,
      [olddate, lastdate]
    );

    const [op_pt] = await connection.query(
      `SELECT COUNT(distinct ov.hn) AS op_pt
           from vn_stat ov, ovst ovst, patient pt 
            where  ov.vn=ovst.vn and pt.hn=ov.hn and ov.vstdate between ? and  ?`,
      [olddate, lastdate]
    );

    const [ttm_visit] = await connection.query(
      `SELECT COUNT(*) AS ttm_visit
           FROM vn_stat ov, ovst ovst, patient pt 
           WHERE ov.vn = ovst.vn
             AND pt.hn = ov.hn 
             AND ov.vstdate BETWEEN ? AND ? and ovst.main_dep=?`,
      [olddate, lastdate, main_dep]
    );

    const [ttm_pt] = await connection.query(
      `SELECT COUNT(distinct ov.hn) AS ttm_pt
           from vn_stat ov, ovst ovst, patient pt 
            where  ov.vn=ovst.vn and pt.hn=ov.hn and ov.vstdate between ? and  ?  and ovst.main_dep= ?`,
      [olddate, lastdate, main_dep]
    );

    const [ttm_drug_sum_price] = await connection.query(
      `SELECT COALESCE(SUM(op.sum_price), 0) AS ttm_drug_sum_price FROM opitemrece op
          JOIN drugitems d ON op.icode = d.icode
          WHERE op.vstdate BETWEEN ? AND ?
          AND (
              d.did LIKE '41%'
              OR d.did LIKE '42%'  
              )
          ORDER BY op.vstdate`,
      [olddate, lastdate]
    );

    const [ttm_n_all] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_n_all
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_n, health_med_operation_type_id_o, olddate, lastdate]
    );

    const [ttm_n_a2] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_n_a2
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_n, health_med_operation_type_id_o, pcodeA2, olddate, lastdate]
    );

    const [ttm_n_uc] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_n_uc
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_n, health_med_operation_type_id_o, pcodeUC, olddate, lastdate]
    );

    const [ttm_n_a7] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_n_a7
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_n, health_med_operation_type_id_o, pcodeA7, olddate, lastdate]
    );

    const [ttm_n_other] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_n_other
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode NOT IN (?,?,?)
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_n, health_med_operation_type_id_o, pcodeA7, pcodeUC, pcodeA2, olddate, lastdate]
    );

    const [ttm_p_all] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_p_all
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_c, health_med_operation_type_id_o, olddate, lastdate]
    );

    const [ttm_p_a2] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_p_a2
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_c, health_med_operation_type_id_o, pcodeA2, olddate, lastdate]
    );

    const [ttm_p_uc] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_p_uc
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_c, health_med_operation_type_id_o, pcodeUC, olddate, lastdate]
    );

    const [ttm_p_a7] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_p_a7
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_c, health_med_operation_type_id_o, pcodeA7, olddate, lastdate]
    );

    const [ttm_p_other] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_p_other
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode NOT IN (?,?,?)
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_c, health_med_operation_type_id_o, pcodeA7, pcodeUC, pcodeA2, olddate, lastdate]
    );

    const [ttm_o_all] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_o_all
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_o, health_med_operation_type_id_o, olddate, lastdate]
    );

    const [ttm_o_a2] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_o_a2
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_o, health_med_operation_type_id_o, pcodeA2, olddate, lastdate]
    );

    const [ttm_o_uc] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_o_uc
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_o, health_med_operation_type_id_o, pcodeUC, olddate, lastdate]
    );

    const [ttm_o_a7] = await connection.query(
      `SELECT COUNT(*) AS ttm_o_a7
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_o, health_med_operation_type_id_o, pcodeA7, olddate, lastdate]
    );

    const [ttm_o_other] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_o_other
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode NOT IN (?,?,?)
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_o, health_med_operation_type_id_o, pcodeA7, pcodeUC, pcodeA2, olddate, lastdate]
    );

    const [ttm_np_all] = await connection.query(
      `SELECT COUNT(*) AS ttm_np_all
            FROM (
              SELECT ov.vn
              FROM vn_stat ov
              JOIN ovst ON ov.vn = ovst.vn
              JOIN health_med_service hm ON ov.vn = hm.vn
              JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
              JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
              JOIN patient pt ON pt.hn = ov.hn
              WHERE hop.health_med_operation_item_code IN (?, ?)
                AND hop.health_med_operation_type_id = ?
                AND ov.vstdate BETWEEN ? AND ?
              GROUP BY ov.vn
              HAVING 
                COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0 
                AND COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0
            ) AS subquery`,
      [health_med_operation_item_code_n, health_med_operation_item_code_c, health_med_operation_type_id_o, olddate, lastdate, health_med_operation_item_code_n, health_med_operation_item_code_c]
    );

    const [ttm_np_a2] = await connection.query(
      `SELECT COUNT(*) AS ttm_np_a2
            FROM (
              SELECT ov.vn
              FROM vn_stat ov
              JOIN ovst ON ov.vn = ovst.vn
              JOIN health_med_service hm ON ov.vn = hm.vn
              JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
              JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
              JOIN patient pt ON pt.hn = ov.hn
              WHERE hop.health_med_operation_item_code IN (?, ?)
                AND hop.health_med_operation_type_id = ? and ov.pcode = ?
                AND ov.vstdate BETWEEN ? AND ?
              GROUP BY ov.vn
              HAVING 
                COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0 
                AND COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0
            ) AS subquery`,
      [health_med_operation_item_code_n, health_med_operation_item_code_c, health_med_operation_type_id_o, pcodeA2, olddate, lastdate, health_med_operation_item_code_n, health_med_operation_item_code_c]
    );

    const [ttm_np_uc] = await connection.query(
      `SELECT COUNT(*) AS ttm_np_uc
            FROM (
              SELECT ov.vn
              FROM vn_stat ov
              JOIN ovst ON ov.vn = ovst.vn
              JOIN health_med_service hm ON ov.vn = hm.vn
              JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
              JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
              JOIN patient pt ON pt.hn = ov.hn
              WHERE hop.health_med_operation_item_code IN (?, ?)
                AND hop.health_med_operation_type_id = ? and ov.pcode = ?
                AND ov.vstdate BETWEEN ? AND ?
              GROUP BY ov.vn
              HAVING 
                COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0 
                AND COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0
            ) AS subquery`,
      [health_med_operation_item_code_n, health_med_operation_item_code_c, health_med_operation_type_id_o, pcodeUC, olddate, lastdate, health_med_operation_item_code_n, health_med_operation_item_code_c]
    );

    const [ttm_np_a7] = await connection.query(
      `SELECT COUNT(*) AS ttm_np_a7
            FROM (
              SELECT ov.vn
              FROM vn_stat ov
              JOIN ovst ON ov.vn = ovst.vn
              JOIN health_med_service hm ON ov.vn = hm.vn
              JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
              JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
              JOIN patient pt ON pt.hn = ov.hn
              WHERE hop.health_med_operation_item_code IN (?, ?)
                AND hop.health_med_operation_type_id = ? and ov.pcode = ?
                AND ov.vstdate BETWEEN ? AND ?
              GROUP BY ov.vn
              HAVING 
                COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0 
                AND COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0
            ) AS subquery`,
      [health_med_operation_item_code_n, health_med_operation_item_code_c, health_med_operation_type_id_o, pcodeA7, olddate, lastdate, health_med_operation_item_code_n, health_med_operation_item_code_c]
    );

    const [ttm_np_other] = await connection.query(
      `SELECT COUNT(*) AS ttm_np_other
            FROM (
              SELECT ov.vn
              FROM vn_stat ov
              JOIN ovst ON ov.vn = ovst.vn
              JOIN health_med_service hm ON ov.vn = hm.vn
              JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
              JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
              JOIN patient pt ON pt.hn = ov.hn
              WHERE hop.health_med_operation_item_code IN (?, ?)
                AND hop.health_med_operation_type_id = ? and ov.pcode NOT IN (?,?,?)
                AND ov.vstdate BETWEEN ? AND ?
              GROUP BY ov.vn
              HAVING 
                COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0 
                AND COUNT(DISTINCT CASE WHEN hop.health_med_operation_item_code = ? THEN 1 END) > 0
            ) AS subquery`,
      [health_med_operation_item_code_n, health_med_operation_item_code_c, health_med_operation_type_id_o, pcodeA7, pcodeUC, pcodeA2, olddate, lastdate, health_med_operation_item_code_n, health_med_operation_item_code_c]
    );

    const [ttm_labor_all] = await connection.query(
      `SELECT COUNT(*) AS ttm_labor_all
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_l, health_med_operation_type_id_l, olddate, lastdate]
    );

    const [ttm_labor_a2] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_labor_a2
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_l, health_med_operation_type_id_l, pcodeA2, olddate, lastdate]
    );

    const [ttm_labor_uc] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_labor_uc
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_l, health_med_operation_type_id_l, pcodeUC, olddate, lastdate]
    );

    const [ttm_labor_a7] = await connection.query(
      `SELECT COUNT(*) AS ttm_labor_a7
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode = ?
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_l, health_med_operation_type_id_l, pcodeA7, olddate, lastdate]
    );

    const [ttm_labor_other] = await connection.query(
      `SELECT COUNT(ov.hn) AS ttm_labor_other
          FROM vn_stat ov
          JOIN ovst ON ov.vn = ovst.vn
          JOIN health_med_service hm ON ov.vn = hm.vn
          JOIN health_med_service_operation ho ON hm.health_med_service_id = ho.health_med_service_id
          JOIN health_med_operation_item hop ON ho.health_med_operation_item_id = hop.health_med_operation_item_id
          JOIN patient pt ON pt.hn = ov.hn
          WHERE hop.health_med_operation_item_code = ? and hop.health_med_operation_type_id = ? and ov.pcode NOT IN ('A7','UC','A2')
            AND ov.vstdate BETWEEN ? AND ?`,
      [health_med_operation_item_code_l, health_med_operation_type_id_l, pcodeA7, pcodeUC, pcodeA2, olddate, lastdate]
    );

    const response = {
      op_visit: op_visit[0].op_visit, // แปลงเป็น string ตามรูปแบบที่ต้องการ
      op_pt: op_pt[0].op_pt,
      ttm_visit: ttm_visit[0].ttm_visit,
      ttm_pt: ttm_pt[0].ttm_pt,
      ttm_drug_sum_price: ttm_drug_sum_price[0].ttm_drug_sum_price,
      ttm_n_all: ttm_n_all[0].ttm_n_all,
      ttm_n_a2: ttm_n_a2[0].ttm_n_a2,
      ttm_n_uc: ttm_n_uc[0].ttm_n_uc,
      ttm_n_a7: ttm_n_a7[0].ttm_n_a7,
      ttm_n_other: ttm_n_other[0].ttm_n_other,
      ttm_p_all: ttm_p_all[0].ttm_p_all,
      ttm_p_a2: ttm_p_a2[0].ttm_p_a2,
      ttm_p_uc: ttm_p_uc[0].ttm_p_uc,
      ttm_p_a7: ttm_p_a7[0].ttm_p_a7,
      ttm_p_other: ttm_p_other[0].ttm_p_other,
      ttm_np_all: ttm_np_all[0].ttm_np_all,
      ttm_np_a2: ttm_np_a2[0].ttm_np_a2,
      ttm_np_uc: ttm_np_uc[0].ttm_np_uc,
      ttm_np_a7: ttm_np_a7[0].ttm_np_a7,
      ttm_np_other: ttm_np_other[0].ttm_np_other,
      ttm_o_all: ttm_o_all[0].ttm_o_all,
      ttm_o_a2: ttm_o_a2[0].ttm_o_a2,
      ttm_o_uc: ttm_o_uc[0].ttm_o_uc,
      ttm_o_a7: ttm_o_a7[0].ttm_o_a7,
      ttm_o_other: ttm_o_other[0].ttm_o_other,
      ttm_labor_all: ttm_labor_all[0].ttm_labor_all,
      ttm_labor_a2: ttm_labor_a2[0].ttm_labor_a2,
      ttm_labor_uc: ttm_labor_uc[0].ttm_labor_uc,
      ttm_labor_a7: ttm_labor_a7[0].ttm_labor_a7,
      ttm_labor_other: ttm_labor_other[0].ttm_labor_other
    };
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release(); // คืน Connection กลับไปที่ Pool
  }
}