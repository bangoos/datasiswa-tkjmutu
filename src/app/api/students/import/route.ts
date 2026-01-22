import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getDb } from "@/lib/db";
import * as XLSX from "xlsx";

// POST /api/students/import - Import students from Excel/CSV (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Map Excel columns to database fields
    const students = data.map((row: any) => ({
      nama: row.nama || row.Nama || "",
      nis: String(row.nis || row.NIS || ""),
      jk: String(row.jk || row.JK || row.jenis_kelamin || ""),
      tempatLahir: String(row.tempat_lahir || row["Tempat-Lahir"] || row["Tempat Lahir"] || ""),
      tanggalLahir: String(row.tanggal_lahir || row["Tanggal-Lahir"] || row["Tanggal Lahir"] || ""),
      nik: String(row.nik || row.NIK || ""),
      agama: String(row.agama || row.Agama || ""),
      alamat: String(row.alamat || row.Alamat || ""),
      noHp: String(row.no_hp || row["No-HP"] || row["No HP"] || row.nohp || ""),
      email: String(row.email || row.Email || ""),
      noHpOrtu: String(row.no_hp_ortu || row["NOHP-Ortu"] || row["No HP Ortu"] || ""),
      namaBapak: String(row.nama_bapak || row["Nama-Bapak"] || row["Nama Bapak"] || ""),
      pekerjaanBapak: String(row.pekerjaan_bapak || row["Pekerjaan-Bapak"] || row["Pekerjaan Bapak"] || ""),
      namaIbu: String(row.nama_ibu || row["Nama-Ibu"] || row["Nama Ibu"] || ""),
      kelas: String(row.kelas || row.Kelas || ""),
      asalSekolah: String(row.asal_sekolah || row["Asal-Sekolah"] || row["Asal Sekolah"] || row.asal_smp || ""),
      tb: parseInt(row.tb || row.TB || "0"),
      bb: parseInt(row.bb || row.BB || "0"),
      role: "STUDENT",
      password: String(row.nis || row.NIS || ""), // Default password is NIS
    }));

    // Insert students in batch
    const result = await getDb().student.createMany({
      data: students,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: "Students imported successfully",
      count: result.count,
    });
  } catch (error) {
    console.error("Error importing students:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
