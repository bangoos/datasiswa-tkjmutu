import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { readFileSync } from 'fs'
import * as XLSX from 'xlsx'

// POST /api/students/import - Import students from Excel/CSV (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })

    // Get first sheet
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet)

    // Map Excel columns to database fields
    const students = data.map((row: any) => ({
      nama: row.nama || row.Nama || '',
      nis: String(row.nis || row.NIS || ''),
      jk: String(row.jk || row.JK || row.jenis_kelamin || ''),
      ttl: String(row.ttl || row.TTL || ''),
      nik: String(row.nik || row.NIK || ''),
      agama: String(row.agama || row.Agama || ''),
      alamat: String(row.alamat || row.Alamat || ''),
      noHp: String(row.no_hp || row.No_HP || row.nohp || ''),
      email: String(row.email || row.Email || ''),
      noHpOrtu: String(row.no_hp_ortu || row.No_HP_Ortu || ''),
      namaBapak: String(row.nama_bapak || row.Nama_Bapak || ''),
      namaIbu: String(row.nama_ibu || row.Nama_Ibu || ''),
      pekerjaanOrtu: String(row.pekerjaan_ortu || row.Pekerjaan_Ortu || ''),
      statusAnak: String(row.status_anak || row.Status_Anak || ''),
      anakKe: parseInt(row.anak_ke || row.Anak_Ke || '0'),
      kelas: String(row.kelas || row.Kelas || ''),
      asalSmp: String(row.asal_smp || row.Asal_SMP || ''),
      tb: parseInt(row.tb || row.TB || '0'),
      bb: parseInt(row.bb || row.BB || '0'),
      role: 'STUDENT',
      password: String(row.nis || row.NIS || '') // Default password is NIS
    }))

    // Insert students in batch
    const result = await db.student.createMany({
      data: students,
      skipDuplicates: true
    })

    return NextResponse.json({
      message: 'Students imported successfully',
      count: result.count
    })
  } catch (error) {
    console.error('Error importing students:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
