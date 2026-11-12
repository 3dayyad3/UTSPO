# 📚 Aplikasi Toko Buku - UTS Pengembangan dan Operasi

Proyek ini dibuat untuk memenuhi Ujian Tengah Semester (UTS) mata kuliah Pengembangan dan Operasi. Aplikasi ini adalah sebuah website toko buku sederhana yang mendemonstrasikan implementasi aplikasi web *monolithic* yang di-*containerize* menggunakan **Docker**.

## 👥 Anggota Kelompok
1. Day Ren Meinhard - 241111754
2. Gerald Wonder Nitehe Harefa - 241112781
3. Edy Berkat Waruwu - 241111891
4. Arlen Otnielvi Bu'ulolo - 241112312

---

## 🏗️ 1. Analisis dan Diagram Arsitektur
Aplikasi ini menggunakan arsitektur **Monolithic** (satu kesatuan aplikasi) dengan pembagian state sebagai berikut:
1. **Stateless (Aplikasi Node.js/Express)**:
   Kode aplikasi bersifat *stateless* (tidak menyimpan data permanen di memori). Jika container dimatikan dan dinyalakan kembali, aplikasi tetap berfungsi normal. Sesi login dikelola menggunakan `express-session`.
2. **Stateful (Database SQLite)**:
   Data pengguna, buku, dan pembayaran disimpan dalam file SQLite di folder `db/`. Agar data tidak hilang saat container dimatikan, kita menggunakan fitur **Volume** pada Docker untuk menghubungkan folder `db` di komputer lokal dengan folder di dalam container.
3. **Environment Variable & Logging**:
   Aplikasi menggunakan Environment Variable (`PORT` dan `DB_PATH`) dan menghasilkan log setiap kali menerima *request* menggunakan middleware `morgan`.

### 🛠️ Teknologi yang Digunakan
- **Runtime**: Node.js (v20)
- **Framework**: Express.js
- **Template Engine**: EJS
- **Database**: SQLite3
- **Container Engine**: Docker
- **Registry**: Docker Hub

---

## 🚀 2. Cara Menjalankan Aplikasi

### Prasyarat
- Node.js terinstal di komputer (untuk mode *development*).
- Docker Desktop terinstal dan dalam keadaan menyala (ikon paus hijau di *system tray*).

### Opsi A: Menjalankan Secara Lokal (Development)
1. Buka terminal dan masuk ke direktori proyek.
2. Instal semua dependensi:
   ```bash
   npm install
3. Jalankan server:
   ```bash
   node main.js
4. Buka browser dan akses http://localhost:3000.

### Opsi B: Membuat Container Image dan Menjalankannya (Production)
Pastikan Docker Desktop sudah menyala.
1. Build Image:
Jalankan perintah berikut untuk membuat image dari Dockerfile.
   ```bash
   docker build -t toko-buku:v1 .
2. Jalankan Container dengan Volume:
Karena aplikasi menggunakan database SQLite (Stateful), kita wajib me-mount folder db agar data tidak hilang saat container mati.
   ```bash
   docker run -d --name app-toko -p 3000:3000 -e PORT=3000 -v "${PWD}/db:/app/db" toko-buku:v1
3. Akses Aplikasi:
   ```bash
   Buka browser dan akses http://localhost:3000.

---

## 🐳 3. Cara Push dan Pull dari Container Registry (Docker Hub)
Berikut adalah langkah-langkah untuk mengunggah (push) dan mengunduh (pull) image tersebut.
### Cara Push ke Docker Hub:
1. Login ke Docker Hub melalui terminal:
   ```bash
   docker login
2. Beri tag pada image lokal (ganti [USERNAME_DOCKERHUB] dengan username Docker Hub):
   ```bash
   docker tag toko-buku:v1 [USERNAME_DOCKERHUB]/toko-buku:v1
3. Push image ke registry:
   ```bash
   docker push [USERNAME_DOCKERHUB]/toko-buku:v1

---

## 🕵️ 4. Perintah Docker(Demonstrasi Video)
perintah-perintah yang digunakan untuk memonitor dan mengelola container 
### Cara Push ke Docker Hub:
1. Melihat Log Aplikasi:
   ```bash
   docker logs app-toko
2. Melihat Inspect (Env Var & Port):
   ```bash
   docker inspect app-toko
3. Masuk ke dalam Container (Cek Keamanan Non-Root):
   ```bash
   docker exec -it app-toko sh
   # Ketik 'whoami' di dalam container (output harus: appuser)
   # Ketik 'exit' untuk keluar
4. Menghentikan Container:
   ```bash
   docker stop app-toko
5. Menyalakan Container yang sudah mati:
   ```bash
   docker start app-toko

---
   
## 🔐 5. Akun Demo
Gunakan akun berikut untuk masuk ke dalam aplikasi (data dummy otomatis dibuat saat database pertama kali dijalankan):
1. Email: admin@test.com

2. Password: password123

---

## 📂 6. Struktur Direktori Proyek
   ```text
   📁 UTSPO
   ┣ 📁 db             # Menyimpan file database SQLite (toko.db)
   ┣ 📁 doc            # Dokumentasi tambahan (Penjelasan.md)
   ┣ 📁 lib            # File JavaScript (koneksi database, dll)
   ┣ 📁 report         # Laporan proyek
   ┣ 📁 view           # File template EJS (login, home, payment, success)
   ┣ 📄 Dockerfile     # Konfigurasi build image Docker
   ┣ 📄 .dockerignore  # File/folder yang diabaikan saat build
   ┣ 📄 main.js        # Entry point aplikasi Express
   ┣ 📄 package.json   # Dependensi Node.js
   ┗ 📄 README.md      # Dokumentasi proyek (File ini)  
   ```
---
   
## 📖 7. Penjelasan Proyek Lebih Detail
Penjelasan Proyek lebih detail dapat dilihat di [Penjelasan.md](/doc/Penjelasan.md)

---