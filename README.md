# 📚 Aplikasi Toko Buku - UTS Pengembangan dan Operasi

Proyek ini dibuat untuk memenuhi Ujian Tengah Semester (UTS) mata kuliah Pengembangan dan Operasi. Aplikasi ini adalah sebuah website toko buku sederhana yang mendemonstrasikan implementasi aplikasi web *monolithic* yang di-*containerize* menggunakan **Podman**.

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
   Data pengguna, buku, dan pembayaran disimpan dalam file SQLite di folder `db/`. Agar data tidak hilang saat container dimatikan, kita menggunakan fitur **Volume** pada Podman untuk menghubungkan folder `db` di komputer lokal dengan folder di dalam container.
3. **Environment Variable & Logging**:
   Aplikasi menggunakan Environment Variable (`PORT` dan `DB_PATH`) dan menghasilkan log setiap kali menerima *request* menggunakan middleware `morgan`.

### 🛠️ Teknologi yang Digunakan
- **Runtime**: Node.js (v20)
- **Framework**: Express.js
- **Template Engine**: EJS
- **Database**: SQLite3
- **Container Engine**: Podman
- **Registry**: Docker Hub

---

## 🚀 2. Cara Menjalankan Aplikasi

### Prasyarat
- Node.js terinstal di komputer.
- Podman terinstal (dan `podman machine start` sudah dijalankan jika menggunakan Windows/Mac).

### Opsi A: Menjalankan Secara Lokal (Development)
1. Buka terminal dan masuk ke direktori proyek.
2. Instal semua dependensi:
   ```bash
   npm install

### Opsi B: Membuat Container Image dan Jalankan
1. Buka terminal dan masuk ke direktori proyek.
2. Membuat Image:
   ```bash
   podman build -t utspo:<tag> .
3. Menjalankan Image:
   ```bash
   podman run -p <host_port>:3000 utspo:<tag>
