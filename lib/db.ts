import { Pool } from "pg";

// Pastikan DATABASE_URL tersedia
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set in .env.local");
}

// Buat pool koneksi
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Listener error (jangan langsung exit, cukup log)
pool.on("error", (err) => {
  console.error("⚠️ Unexpected error on idle PostgreSQL client:", err);
});
