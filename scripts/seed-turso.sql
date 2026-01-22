-- Seed data untuk Turso database
-- Jalankan dengan: turso db shell datasiswa-tkjmutu < scripts/seed-turso.sql

-- Insert Admin user
INSERT INTO Student (nama, nis, jk, tempatLahir, tanggalLahir, nik, agama, alamat, noHp, email, noHpOrtu, namaBapak, pekerjaanBapak, namaIbu, kelas, asalSekolah, tb, bb, role, password)
VALUES 
  ('Administrator', 'ADMIN', 'L', '-', '-', '-', '-', '-', '-', 'admin@tkjm.sch.id', '-', '-', '-', '-', 'X', '-', 0, 0, 'ADMIN', 'ADMIN');

-- Insert Test Students
INSERT INTO Student (nama, nis, jk, tempatLahir, tanggalLahir, nik, agama, alamat, noHp, email, noHpOrtu, namaBapak, pekerjaanBapak, namaIbu, kelas, asalSekolah, tb, bb, role, password)
VALUES 
  ('Ahmad Fauzi', '1001', 'L', 'Jakarta', '2006-01-01', '1234567890123456', 'Islam', 'Jl. Merdeka No. 10', '081234567890', 'ahmad@student.sch.id', '081234567891', 'Budi Santoso', 'Wiraswasta', 'Siti Aminah', 'X', 'SMP Negeri 1 Cikampek', 170, 60, 'STUDENT', '1001'),
  ('Siti Nurhaliza', '1002', 'P', 'Bandung', '2006-02-02', '1234567890123457', 'Islam', 'Jl. Sudirman No. 20', '082345678901', 'siti@student.sch.id', '082345678902', 'Hendra Wijaya', 'PNS', 'Dewi Sartika', 'XI', 'SMP Negeri 2 Cikampek', 165, 55, 'STUDENT', '1002'),
  ('Rudi Hartono', '1003', 'L', 'Bekasi', '2006-03-03', '1234567890123458', 'Islam', 'Jl. Gatot Subroto No. 30', '083456789012', 'rudi@student.sch.id', '083456789013', 'Joko Anwar', 'Pedagang', 'Rina Nose', 'XII', 'SMP Negeri 3 Cikampek', 175, 65, 'STUDENT', '1003');
