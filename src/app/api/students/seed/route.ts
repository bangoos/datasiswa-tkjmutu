import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/students/seed - Seed database with admin and test data
export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.student.findUnique({
      where: { nis: 'ADMIN' }
    })

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin already exists' })
    }

    // Create admin
    await db.student.create({
      data: {
        nama: 'Administrator',
        nis: 'ADMIN',
        jk: 'L',
        ttl: '-',
        nik: '-',
        agama: '-',
        alamat: '-',
        noHp: '-',
        email: 'admin@tkjm.sch.id',
        noHpOrtu: '-',
        namaBapak: '-',
        namaIbu: '-',
        pekerjaanOrtu: '-',
        statusAnak: '-',
        anakKe: 0,
        kelas: 'X',
        asalSmp: '-',
        tb: 0,
        bb: 0,
        role: 'ADMIN',
        password: 'ADMIN'
      }
    })

    // Create some test students
    const testStudents = [
      {
        nama: 'Ahmad Fauzi',
        nis: '1001',
        jk: 'L',
        ttl: 'Jakarta, 01-01-2006',
        nik: '1234567890123456',
        agama: 'Islam',
        alamat: 'Jl. Merdeka No. 10',
        noHp: '081234567890',
        email: 'ahmad@student.sch.id',
        noHpOrtu: '081234567891',
        namaBapak: 'Budi Santoso',
        namaIbu: 'Siti Aminah',
        pekerjaanOrtu: 'Wiraswasta',
        statusAnak: 'Anak Kandung',
        anakKe: 1,
        kelas: 'X',
        asalSmp: 'SMP Negeri 1 Cikampek',
        tb: 170,
        bb: 60,
        role: 'STUDENT',
        password: '1001'
      },
      {
        nama: 'Siti Nurhaliza',
        nis: '1002',
        jk: 'P',
        ttl: 'Bandung, 02-02-2006',
        nik: '1234567890123457',
        agama: 'Islam',
        alamat: 'Jl. Sudirman No. 20',
        noHp: '082345678901',
        email: 'siti@student.sch.id',
        noHpOrtu: '082345678902',
        namaBapak: 'Hendra Wijaya',
        namaIbu: 'Dewi Sartika',
        pekerjaanOrtu: 'PNS',
        statusAnak: 'Anak Kandung',
        anakKe: 1,
        kelas: 'XI',
        asalSmp: 'SMP Negeri 2 Cikampek',
        tb: 165,
        bb: 55,
        role: 'STUDENT',
        password: '1002'
      },
      {
        nama: 'Rudi Hartono',
        nis: '1003',
        jk: 'L',
        ttl: 'Bekasi, 03-03-2006',
        nik: '1234567890123458',
        agama: 'Islam',
        alamat: 'Jl. Gatot Subroto No. 30',
        noHp: '083456789012',
        email: 'rudi@student.sch.id',
        noHpOrtu: '083456789013',
        namaBapak: 'Joko Anwar',
        namaIbu: 'Rina Nose',
        pekerjaanOrtu: 'Pedagang',
        statusAnak: 'Anak Kandung',
        anakKe: 2,
        kelas: 'XII',
        asalSmp: 'SMP Negeri 3 Cikampek',
        tb: 175,
        bb: 65,
        role: 'STUDENT',
        password: '1003'
      }
    ]

    await db.student.createMany({
      data: testStudents
    })

    return NextResponse.json({
      message: 'Database seeded successfully',
      count: testStudents.length + 1
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
