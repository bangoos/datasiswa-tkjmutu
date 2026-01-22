'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { User, GraduationCap, Mail, Phone, LogOut, Save, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface StudentData {
  id: number
  nama: string
  nis: string
  jk: string
  tempatLahir: string
  tanggalLahir: string
  nik: string
  agama: string
  alamat: string
  noHp: string
  email: string
  noHpOrtu: string
  namaBapak: string
  pekerjaanBapak: string
  namaIbu: string
  kelas: string
  asalSekolah: string
  tb: number
  bb: number
}

export default function StudentProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<StudentData | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.push('/admin')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'STUDENT') {
      fetchStudentData()
    }
  }, [status, session])

  const fetchStudentData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/students/${session?.user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setStudentData(data)
        setFormData(data)
      } else {
        throw new Error('Failed to fetch student data')
      }
    } catch (error) {
      console.error('Error fetching student data:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data siswa'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof StudentData, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value })
    }
  }

  const handleSave = async () => {
    if (!formData) return

    setSaving(true)
    try {
      const res = await fetch(`/api/students/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const data = await res.json()
        setStudentData(data)
        setFormData(data)
        toast({
          title: 'Berhasil',
          description: 'Data berhasil diperbarui'
        })
      } else {
        throw new Error('Failed to update student data')
      }
    } catch (error) {
      console.error('Error updating student data:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memperbarui data siswa'
      })
    } finally {
      setSaving(false)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Profil Siswa</h1>
              <p className="text-sm text-slate-400">TKJ MUTU Cikampek</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-400">
              {studentData?.nama || session?.user?.nama}
            </span>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Siswa
            </Badge>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        {formData && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Info Card */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Data Pribadi</CardTitle>
                <CardDescription className="text-slate-400">
                  Kelola data diri Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Row 1: Identitas Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Nama Lengkap</Label>
                    <Input
                      value={formData.nama}
                      onChange={(e) => handleInputChange('nama', e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">NIS</Label>
                    <Input
                      value={formData.nis}
                      disabled
                      className="bg-slate-950/50 border-slate-800 text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Jenis Kelamin</Label>
                    <Select
                      value={formData.jk}
                      onValueChange={(value) => handleInputChange('jk', value)}
                    >
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-slate-800">
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Tempat Lahir</Label>
                    <Input
                      value={formData.tempatLahir}
                      onChange={(e) => handleInputChange('tempatLahir', e.target.value)}
                      placeholder="Jakarta"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Tanggal Lahir</Label>
                    <Input
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) => handleInputChange('tanggalLahir', e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">NIK</Label>
                    <Input
                      value={formData.nik}
                      onChange={(e) => handleInputChange('nik', e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Agama</Label>
                    <Select
                      value={formData.agama}
                      onValueChange={(value) => handleInputChange('agama', value)}
                    >
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-slate-800">
                        <SelectItem value="Islam">Islam</SelectItem>
                        <SelectItem value="Kristen">Kristen</SelectItem>
                        <SelectItem value="Katolik">Katolik</SelectItem>
                        <SelectItem value="Hindu">Hindu</SelectItem>
                        <SelectItem value="Buddha">Buddha</SelectItem>
                        <SelectItem value="Konghucu">Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Kontak */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-emerald-400" />
                    Kontak
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">No. HP</Label>
                      <Input
                        value={formData.noHp}
                        onChange={(e) => handleInputChange('noHp', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">No. HP Orang Tua</Label>
                      <Input
                        value={formData.noHpOrtu}
                        onChange={(e) => handleInputChange('noHpOrtu', e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Alamat</Label>
                      <Input
                        value={formData.alamat}
                        onChange={(e) => handleInputChange('alamat', e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Orang Tua */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-teal-400" />
                    Data Orang Tua
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Nama Bapak</Label>
                      <Input
                        value={formData.namaBapak}
                        onChange={(e) => handleInputChange('namaBapak', e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Nama Ibu</Label>
                      <Input
                        value={formData.namaIbu}
                        onChange={(e) => handleInputChange('namaIbu', e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Pekerjaan Bapak</Label>
                      <Input
                        value={formData.pekerjaanBapak}
                        onChange={(e) => handleInputChange('pekerjaanBapak', e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Pendidikan */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-emerald-400" />
                    Pendidikan
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Kelas</Label>
                      <Input
                        value={formData.kelas}
                        disabled
                        className="bg-slate-950/50 border-slate-800 text-slate-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Asal Sekolah</Label>
                      <Input
                        value={formData.asalSekolah}
                        onChange={(e) => handleInputChange('asalSekolah', e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">NIS</Label>
                      <Input
                        value={formData.nis}
                        disabled
                        className="bg-slate-950/50 border-slate-800 text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 5: Fisik */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-emerald-400" />
                    Data Fisik
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Tinggi Badan (cm)</Label>
                      <Input
                        type="number"
                        value={formData.tb}
                        onChange={(e) => handleInputChange('tb', parseInt(e.target.value))}
                        min="0"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Berat Badan (kg)</Label>
                      <Input
                        type="number"
                        value={formData.bb}
                        onChange={(e) => handleInputChange('bb', parseInt(e.target.value))}
                        min="0"
                        className="bg-slate-950 border-slate-800 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-800">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={fetchStudentData}
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-600 py-4 mt-auto">
        <p>© 2024 TKJ MUTU Cikampek - Sistem Data Siswa</p>
      </footer>
    </div>
  )
}
