'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, GraduationCap, Upload, LogOut, Search, RefreshCw, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Student {
  id: number
  nama: string
  nis: string
  kelas: string
  jk: string
  email: string
  noHp: string
}

interface Stats {
  totalStudents: number
  studentsByClass: { kelas: string; count: number }[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterKelas, setFilterKelas] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/siswa')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchStats()
      fetchStudents()
    }
  }, [status, session])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/students/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchStudents = async () => {
    setLoading(true)
    try {
      let url = '/api/students'
      const params = new URLSearchParams()

      if (filterKelas !== 'all') {
        params.append('kelas', filterKelas)
      }

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data siswa'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Pilih file terlebih dahulu'
      })
      return
    }

    setImporting(true)
    const formData = new FormData()
    formData.append('file', importFile)

    try {
      const res = await fetch('/api/students/import', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        toast({
          title: 'Berhasil',
          description: `${data.count} siswa berhasil diimpor`
        })
        fetchStudents()
        fetchStats()
        setImportFile(null)
      } else {
        throw new Error('Import failed')
      }
    } catch (error) {
      console.error('Error importing:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal mengimpor data siswa'
      })
    } finally {
      setImporting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) return

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({
          title: 'Berhasil',
          description: 'Data siswa berhasil dihapus'
        })
        fetchStudents()
        fetchStats()
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menghapus data siswa'
      })
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">TKJ MUTU Cikampek</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-400">
              {session?.user?.nama}
            </span>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Admin
            </Badge>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Total Siswa</CardDescription>
              <CardTitle className="text-3xl text-white">{stats?.totalStudents || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-emerald-400">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">Siswa terdaftar</span>
              </div>
            </CardContent>
          </Card>

          {stats?.studentsByClass.slice(0, 3).map((item) => (
            <Card key={item.kelas} className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">Kelas {item.kelas}</CardDescription>
                <CardTitle className="text-3xl text-white">{item.count}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-teal-400">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  <span className="text-sm">Siswa aktif</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Actions */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <Input
                  placeholder="Cari berdasarkan nama atau NIS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchStudents()}
                  className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger className="w-full md:w-48 bg-slate-950 border-slate-800 text-white">
                  <SelectValue placeholder="Filter Kelas" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-800">
                  <SelectItem value="all">Semua Kelas</SelectItem>
                  <SelectItem value="X">Kelas X</SelectItem>
                  <SelectItem value="XI">Kelas XI</SelectItem>
                  <SelectItem value="XII">Kelas XII</SelectItem>
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Import Data Siswa</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Upload file Excel atau CSV berisi data siswa
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">File (Excel/CSV)</label>
                      <Input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>
                    <Button
                      onClick={handleImport}
                      disabled={!importFile || importing}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      {importing ? 'Mengimpor...' : 'Import'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={fetchStudents} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Data Siswa</CardTitle>
            <CardDescription className="text-slate-400">
              Menampilkan {students.length} siswa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">NIS</TableHead>
                    <TableHead className="text-slate-300">Nama</TableHead>
                    <TableHead className="text-slate-300">Kelas</TableHead>
                    <TableHead className="text-slate-300">Jenis Kelamin</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">No. HP</TableHead>
                    <TableHead className="text-slate-300 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                        Tidak ada data siswa
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id} className="border-slate-800">
                        <TableCell className="text-slate-300">{student.nis}</TableCell>
                        <TableCell className="text-white font-medium">{student.nama}</TableCell>
                        <TableCell>
                          <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20">
                            {student.kelas}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{student.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                        <TableCell className="text-slate-300">{student.email}</TableCell>
                        <TableCell className="text-slate-300">{student.noHp}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleDelete(student.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-600 py-4">
          <p>© 2024 TKJ MUTU Cikampek - Sistem Data Siswa</p>
        </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  )
}
