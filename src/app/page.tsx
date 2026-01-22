'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, LogIn, User, Shield, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [nis, setNis] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        nis,
        password,
        redirect: false
      })

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Login gagal',
          description: 'NIS atau password tidak valid'
        })
      } else {
        toast({
          title: 'Login berhasil',
          description: 'Selamat datang kembali!'
        })

        // Redirect based on role
        if (nis === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/siswa')
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Terjadi kesalahan',
        description: 'Silakan coba lagi'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">TKJ MUTU Cikampek</h1>
          <p className="text-slate-400">Sistem Data Siswa</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white text-center">Selamat Datang</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Masukkan NIS untuk masuk ke sistem
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nis" className="text-slate-300">NIS</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <Input
                    id="nis"
                    type="text"
                    placeholder="Masukkan NIS"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Memuat...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Masuk
                  </>
                )}
              </Button>

              <div className="text-center space-y-2 text-sm text-slate-400">
                <p>Gunakan NIS sebagai password default Anda</p>
                <div className="flex items-center justify-center space-x-1 text-xs text-slate-500 bg-slate-950/50 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  <p>Admin NIS: ADMIN | Siswa: NIS masing-masing</p>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2 text-emerald-400">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Siswa</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Edit profil pribadi</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2 text-teal-400">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Admin</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Kelola data siswa</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600">
          <p>© 2024 TKJ MUTU Cikampek</p>
        </div>
      </div>
    </div>
  )
}
