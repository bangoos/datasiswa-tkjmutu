const { createClient } = require("@libsql/client");

// Database connection
const db = createClient({
    url: process.env.DATABASE_URL ||
        "libsql://datasiswa-tkjmutu-bangoos.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNDQ2NDAsImlkIjoiZjVlNjYwZmUtZGJkZi00YzkyLWJlZjktMjMzNTk5NDg1ZGI4IiwicmlkIjoiMzEzNTAxMzItOGY0My00MmIxLWFiNzEtN2E1OWYxY2UyNWQ0In0.cXqa0DEJrHPFtp9Y5uZKThGjLkzp0d0rL-efbfj7l8sR1qa1RCQ3-eA6WnOOxashrDO8QnHx4azivZeVidjqBA",
});

async function seedDatabase() {
    try {
        console.log("🌱 Seeding Turso database...");

        // Create table if not exists
        await db.execute(`
      CREATE TABLE IF NOT EXISTS Student (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        nis TEXT NOT NULL UNIQUE,
        jk TEXT NOT NULL,
        tempat_lahir TEXT NOT NULL,
        tanggal_lahir TEXT NOT NULL,
        nik TEXT NOT NULL,
        agama TEXT NOT NULL,
        alamat TEXT NOT NULL,
        no_hp TEXT NOT NULL,
        email TEXT NOT NULL,
        no_hp_ortu TEXT NOT NULL,
        nama_bapak TEXT NOT NULL,
        pekerjaan_bapak TEXT NOT NULL,
        nama_ibu TEXT NOT NULL,
        kelas TEXT NOT NULL,
        asal_sekolah TEXT NOT NULL,
        tb INTEGER NOT NULL,
        bb INTEGER NOT NULL,
        role TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Check if admin exists
        const adminExists = await db.execute("SELECT COUNT(*) as count FROM Student WHERE nis = ?", ["ADMIN"]);

        if (adminExists.rows[0].count === 0) {
            console.log("Creating admin user...");

            // Insert admin
            await db.execute(
                `
        INSERT INTO Student (
          nama, nis, jk, tempat_lahir, tanggal_lahir, nik, agama, alamat, 
          no_hp, email, no_hp_ortu, nama_bapak, pekerjaan_bapak, nama_ibu, 
          kelas, asal_sekolah, tb, bb, role, password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, ["Administrator", "ADMIN", "L", "-", "-", "-", "-", "-", "-", "admin@tkjm.sch.id", "-", "-", "-", "-", "X", "-", 0, 0, "ADMIN", "ADMIN"],
            );

            // Insert test students
            const students = [
                [
                    "Ahmad Fauzi",
                    "1001",
                    "L",
                    "Jakarta",
                    "2006-01-01",
                    "1234567890123456",
                    "Islam",
                    "Jl. Merdeka No. 10",
                    "081234567890",
                    "ahmad@student.sch.id",
                    "081234567891",
                    "Budi Santoso",
                    "Wiraswasta",
                    "Siti Aminah",
                    "X",
                    "SMP Negeri 1 Cikampek",
                    170,
                    60,
                    "STUDENT",
                    "1001",
                ],
                [
                    "Siti Nurhaliza",
                    "1002",
                    "P",
                    "Bandung",
                    "2006-02-02",
                    "1234567890123457",
                    "Islam",
                    "Jl. Sudirman No. 20",
                    "082345678901",
                    "siti@student.sch.id",
                    "082345678902",
                    "Hendra Wijaya",
                    "PNS",
                    "Dewi Sartika",
                    "XI",
                    "SMP Negeri 2 Cikampek",
                    165,
                    55,
                    "STUDENT",
                    "1002",
                ],
                [
                    "Rudi Hartono",
                    "1003",
                    "L",
                    "Bekasi",
                    "2006-03-03",
                    "1234567890123458",
                    "Islam",
                    "Jl. Gatot Subroto No. 30",
                    "083456789012",
                    "rudi@student.sch.id",
                    "083456789013",
                    "Joko Anwar",
                    "Pedagang",
                    "Rina Nose",
                    "XII",
                    "SMP Negeri 3 Cikampek",
                    175,
                    65,
                    "STUDENT",
                    "1003",
                ],
            ];

            for (const student of students) {
                await db.execute(
                    `
          INSERT INTO Student (
            nama, nis, jk, tempat_lahir, tanggal_lahir, nik, agama, alamat, 
            no_hp, email, no_hp_ortu, nama_bapak, pekerjaan_bapak, nama_ibu, 
            kelas, asal_sekolah, tb, bb, role, password
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
                    student,
                );
            }

            console.log("✅ Database seeded successfully with 4 records!");
        } else {
            console.log("✅ Database already seeded");
        }
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        process.exit(0);
    }
}

seedDatabase();