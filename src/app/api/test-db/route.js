import pool from "@/lib/db";

export async function GET(request) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT NOW() AS time");
    return Response.json({ success: true, message: "Database connected!", time: rows[0].time });
  } catch (error) {
    return Response.json({ success: false, message: "Database connection failed", error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
