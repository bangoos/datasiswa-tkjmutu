# Sistem Data Siswa TKJ MUTU Cikampek

Sistem manajemen data siswa modern untuk TKJ MUTU Cikampek menggunakan Next.js 14+, SQLite, dan NextAuth.js.

## 🚀 Fitur Utama

### 1. **Login System (Admin & Siswa)**
- Autentikasi berbasis NIS (Nomor Induk Siswa)
- Password default adalah NIS
- Role-based access control (Admin/Student)
- Modern dark mode UI

### 2. **Admin Dashboard**
- Statistik jumlah siswa per kelas (X, XI, XII)
- Tabel list siswa dengan filter pencarian
- Filter berdasarkan kelas
- Import data siswa dari file Excel/CSV
- Delete siswa
- Sticky header dan footer

### 3. **Student Profile**
- Siswa dapat melihat dan mengedit data diri
- Tidak dapat mengubah NIS dan role
- Form lengkap: biodata, kontak, orang tua, pendidikan, data fisik

## 📋 Persyaratan Teknologi

- **Framework**: Next.js 16 dengan App Router
- **Language**: TypeScript 5
- **Database**: SQLite dengan Prisma ORM
- **Styling**: Tailwind CSS 4 dengan shadcn/ui
- **Authentication**: NextAuth.js v4
- **Icons**: Lucide React

## 🛠️ Instalasi & Setup

### 1. Clone Repository
```bash
cd /home/z/my-project
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Setup Database
```bash
# Push schema ke database
bun run db:push

# Seed database dengan admin dan data tes
curl -X POST http://localhost:3000/api/students/seed
```

### 4. Jalankan Development Server
```bash
bun run dev
```

Server akan berjalan di `http://localhost:3000`

## 👥 Akun Default

### Admin
- **NIS**: `ADMIN`
- **Password**: `ADMIN`
- **Akses**: Full access ke semua fitur admin

### Siswa (Data Tes)
| NIS | Password | Nama | Kelas |
|-----|----------|------|-------|
| 1001 | 1001 | Ahmad Fauzi | X |
| 1002 | 1002 | Siti Nurhaliza | XI |
| 1003 | 1003 | Rudi Hartono | XII |

## 📁 Struktur Project

```
src/
├── app/
│   ├── admin/              # Admin Dashboard
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── students/
│   │       ├── route.ts           # GET/POST all students
│   │       ├── [id]/route.ts     # GET/PUT/DELETE student by ID
│   │       ├── stats/route.ts     # GET statistics
│   │       ├── import/route.ts    # POST import from Excel/CSV
│   │       └── seed/route.ts      # POST seed database
│   ├── siswa/              # Student Profile
│   │   └── page.tsx
│   ├── page.tsx            # Login Page
│   ├── layout.tsx          # Root Layout
│   └── globals.css         # Global Styles
├── components/
│   ├── providers.tsx        # SessionProvider wrapper
│   └── ui/                 # shadcn/ui components
├── hooks/
│   └── use-toast.ts        # Toast hook
├── lib/
│   └── db.ts               # Prisma Client
├── types/
│   └── next-auth.d.ts      # NextAuth type definitions
└── prisma/
    └── schema.prisma       # Database Schema
```

## 🗄️ Database Schema

```prisma
model Student {
  id             Int      @id @default(autoincrement())
  nama           String
  nis            String   @unique
  jk             String
  ttl            String
  nik            String
  agama          String
  alamat         String
  noHp           String   @map("no_hp")
  email          String
  noHpOrtu       String   @map("no_hp_ortu")
  namaBapak      String   @map("nama_bapak")
  namaIbu        String   @map("nama_ibu")
  pekerjaanOrtu  String   @map("pekerjaan_ortu")
  statusAnak     String   @map("status_anak")
  anakKe         Int      @map("anak_ke")
  kelas          String
  asalSmp        String   @map("asal_smp")
  tb             Int
  bb             Int
  role           String
  password       String
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
}
```

## 📤 Format File Import

Untuk import data siswa dari Excel/CSV, gunakan format kolom berikut:

| Kolom | Format |
|-------|--------|
| nama / Nama | String |
| nis / NIS | String (Unique) |
| jk / JK / jenis_kelamin | L/P |
| ttl / TTL | String (contoh: "Jakarta, 01-01-2006") |
| nik / NIK | String |
| agama / Agama | String |
| alamat / Alamat | String |
| no_hp / No_HP / nohp | String |
| email / Email | String |
| no_hp_ortu / No_HP_Ortu | String |
| nama_bapak / Nama_Bapak | String |
| nama_ibu / Nama_Ibu | String |
| pekerjaan_ortu / Pekerjaan_Ortu | String |
| status_anak / Status_Anak | String |
| anak_ke / Anak_Ke | Integer |
| kelas / Kelas | X/XI/XII |
| asal_smp / Asal_SMP | String |
| tb / TB | Integer |
| bb / BB | Integer |

Password default untuk siswa yang diimport adalah NIS mereka.

## 🔐 API Endpoints

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth authentication

### Students
- `GET /api/students` - Get all students (admin only, supports query params: `kelas`, `search`)
- `POST /api/students` - Create new student (admin only)
- `GET /api/students/[id]` - Get student by ID
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student (admin only)
- `GET /api/students/stats` - Get statistics (admin only)
- `POST /api/students/import` - Import from Excel/CSV (admin only)
- `POST /api/students/seed` - Seed database with test data

## 🎨 UI Features

- **Full Dark Mode**: Tampilan gelap yang modern dan nyaman di mata
- **Responsive Design**: Optimal untuk mobile dan desktop
- **shadcn/ui Components**: Komponen UI yang konsisten dan accessible
- **Gradient Effects**: Efek gradient yang elegan
- **Loading States**: Indikator loading untuk user experience yang lebih baik
- **Toast Notifications**: Feedback visual untuk user actions
- **Sticky Header/Footer**: Navigasi yang tetap terlihat saat scroll
- **Custom Scrollbar**: Scrollbar yang styled dan user-friendly

## 🔧 Perintah Tersedia

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint

# Database
bun run db:push      # Push schema changes to database
bun run db:generate  # Generate Prisma Client
bun run db:migrate   # Run database migrations
bun run db:reset     # Reset database
```

## 📝 Catatan Penting

### Security
- Password disimpan dalam format plain text (untuk development purposes)
- Untuk production, gunakan password hashing dengan bcrypt
- Validasi input tambahan disarankan untuk production

### Deployment
- Untuk deployment di Vercel, gunakan Turso SQLite atau database lain untuk persistence data
- File `.db` lokal tidak akan persisten di Vercel
- Pastikan environment variables `DATABASE_URL` dan `NEXTAUTH_SECRET` terkonfigurasi

## 🤝 Contributing

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

Copyright © 2024 TKJ MUTU Cikampek

## 💡 Tips Penggunaan

### Untuk Admin
1. Login dengan NIS `ADMIN` dan password `ADMIN`
2. Dashboard menampilkan statistik siswa per kelas
3. Gunakan filter untuk mencari atau memfilter berdasarkan kelas
4. Import data siswa dari file Excel/CSV untuk bulk insert
5. Hapus siswa yang tidak diperlukan dengan tombol delete

### Untuk Siswa
1. Login dengan NIS dan password (default: NIS)
2. Lihat dan edit data diri di halaman profil
3. Simpan perubahan dengan tombol "Simpan Perubahan"
4. Reset form jika ingin kembali ke data semula

## 🐛 Troubleshooting

### Database Error
```bash
# Reset dan seed ulang database
bun run db:reset
curl -X POST http://localhost:3000/api/students/seed
```

### Module Not Found
```bash
# Install ulang dependencies
rm -rf node_modules bun.lockb
bun install
```

### Build Error
```bash
# Clear Next.js cache
rm -rf .next
bun run dev
```

---

**Dibuat dengan ❤️ untuk TKJ MUTU Cikampek**
