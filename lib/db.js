const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Menggunakan Environment Variable (Syarat UTS) dengan fallback ke folder db
const dbPath = process.env.DB_PATH || path.join(__dirname, '../db/toko.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log(`Connected to SQLite database at ${dbPath}`);
        
        db.serialize(() => {
            // 1. Buat Tabel Users
            db.run(`CREATE TABLE IF NOT EXISTS users (
                email TEXT PRIMARY KEY,
                name TEXT,
                password TEXT
            )`);

            // 2. Buat Tabel Books
            db.run(`CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                author TEXT,
                price INTEGER,
                amount INTEGER
            )`);

            // 3. Buat Tabel Payments
            db.run(`CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bookId INTEGER,
                amount INTEGER,
                userEmail TEXT,
                total INTEGER,
                status TEXT,
                FOREIGN KEY(bookId) REFERENCES books(id),
                FOREIGN KEY(userEmail) REFERENCES users(email)
            )`);

            // 4. Isi Data Dummy (Hanya jika tabel kosong)
            db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
                if (row.count === 0) {
                    // Dummy User
                    db.run(`INSERT INTO users (email, name, password) VALUES ('admin@test.com', 'Admin Ganteng', 'password123')`);
                    
                    // Dummy Buku
                    db.run(`INSERT INTO books (title, author, price, amount) VALUES 
                        ('Buku Belajar DevOps', 'Budi Santoso', 50000, 10),
                        ('Buku Master Node.js', 'Andi Wijaya', 75000, 5),
                        ('Buku Podman untuk Pemula', 'Citra Lestari', 60000, 0)`); // 0 untuk tes stok habis
                    console.log("Dummy data inserted!");
                }
            });
        });
    }
});

module.exports = db;