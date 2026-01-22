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
        tempatLahir: '-',
        tanggalLahir: '-',
        nik: '-',
        agama: '-',
        alamat: '-',
        noHp: '-',
        email: 'admin@tkjm.sch.id',
        noHpOrtu: '-',
        namaBapak: '-',
        pekerjaanBapak: '-',
        namaIbu: '-',
        kelas: 'X',
        asalSekolah: '-',
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
        tempatLahir: 'Jakarta',
        tanggalLahir: '2006-01-01',
        nik: '1234567890123456',
        agama: 'Islam',
        alamat: 'Jl. Merdeka No. 10',
        noHp: '081234567890',
        email: 'ahmad@student.sch.id',
        noHpOrtu: '081234567891',
        namaBapak: 'Budi Santoso',
        pekerjaanBapak: 'Wiraswasta',
        namaIbu: 'Siti Aminah',
        kelas: 'X',
        asalSekolah: 'SMP Negeri 1 Cikampek',
        tb: 170,
        bb: 60,
        role: 'STUDENT',
        password: '1001'
      },
      {
        nama: 'Siti Nurhaliza',
        nis: '1002',
        jk: 'P',
        tempatLahir: 'Bandung',
        tanggalLahir: '2006-02-02',
        nik: '1234567890123457',
        agama: 'Islam',
        alamat: 'Jl. Sudirman No. 20',
        noHp: '082345678901',
        email: 'siti@student.sch.id',
        noHpOrtu: '082345678902',
        namaBapak: 'Hendra Wijaya',
        pekerjaanBapak: 'PNS',
        namaIbu: 'Dewi Sartika',
        kelas: 'XI',
        asalSekolah: 'SMP Negeri 2 Cikampek',
        tb: 165,
        bb: 55,
        role: 'STUDENT',
        password: '1002'
      },
      {
        nama: 'Rudi Hartono',
        nis: '1003',
        jk: 'L',
        tempatLahir: 'Bekasi',
        tanggalLahir: '2006-03-03',
        nik: '1234567890123458',
        agama: 'Islam',
        alamat: 'Jl. Gatot Subroto No. 30',
        noHp: '083456789012',
        email: 'rudi@student.sch.id',
        noHpOrtu: '083456789013',
        namaBapak: 'Joko Anwar',
        pekerjaanBapak: 'Pedagang',
        namaIbu: 'Rina Nose',
        kelas: 'XII',
        asalSekolah: 'SMP Negeri 3 Cikampek',
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
