import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";

// GET /api/students/stats - Get student statistics (admin only)
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalStudents = await getDb().student.count();

    const studentsByClass = await getDb().student.groupBy({
      by: ["kelas"],
      _count: {
        id: true,
      },
      orderBy: {
        kelas: "asc",
      },
    });

    const stats = {
      totalStudents,
      studentsByClass: studentsByClass.map((item) => ({
        kelas: item.kelas,
        count: item._count.id,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching student statistics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
