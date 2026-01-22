import { NextResponse } from "next/server";
import { ensureDatabaseSeeded } from "@/lib/seed";

// GET /api/init - Auto-seed database (safe to call multiple times)
export async function GET() {
  try {
    await ensureDatabaseSeeded();

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database initialization failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
