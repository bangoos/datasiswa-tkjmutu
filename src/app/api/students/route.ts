import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'

// GET /api/students - Get all students (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const kelas = searchParams.get('kelas')
    const search = searchParams.get('search')

    const where: any = {}

    if (kelas) {
      where.kelas = kelas
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } }
      ]
    }

    const students = await db.student.findMany({
      where,
      orderBy: {
        nama: 'asc'
      }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/students - Create new student (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const student = await db.student.create({
      data: {
        ...body,
        password: body.nis // Default password is NIS
      }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
