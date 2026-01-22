import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'

// GET /api/students/[id] - Get student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Students can only view their own data, admins can view all
    if (session.user?.role !== 'ADMIN' && session.user?.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const student = await db.student.findUnique({
      where: { id: parseInt(id) }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/students/[id] - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Students can only update their own data (excluding role and nis)
    // Admins can update all data
    if (session.user?.role !== 'ADMIN' && session.user?.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const student = await db.student.findUnique({
      where: { id: parseInt(id) }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // If student, restrict what can be updated
    const updateData: any = { ...body }

    if (session.user?.role !== 'ADMIN') {
      // Students cannot update these fields
      delete updateData.nis
      delete updateData.role
      delete updateData.password
    }

    const updatedStudent = await db.student.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/students/[id] - Delete student (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await db.student.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
