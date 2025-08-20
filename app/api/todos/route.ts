// app/api/todos/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

// --- Pool Singleton ---
declare global {
  // biar tidak bentrok saat HMR di Next.js
  var pgPool: Pool | undefined;
}

const pool =
  global.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Supabase butuh SSL
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

// --- Helper untuk response error ---
function handleError(label: string, err: any) {
  console.error(`${label} ERROR:`, err);
  return NextResponse.json(
    { error: err?.message || "Internal server error" },
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

// --- GET todos ---
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id DESC"
    );
    return NextResponse.json(result.rows, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return handleError("GET /api/todos", err);
  }
}

// --- POST todo ---
export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await pool.query(
      `INSERT INTO todos (title, completed, created_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [title.trim(), false]
    );

    return NextResponse.json(result.rows[0], {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return handleError("POST /api/todos", err);
  }
}

// --- DELETE todo ---
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid ID is required" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await pool.query("DELETE FROM todos WHERE id = $1", [id]);

    return NextResponse.json({ success: true }, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return handleError("DELETE /api/todos", err);
  }
}
