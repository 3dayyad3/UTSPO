const express = require('express');
const session = require('express-session');
const morgan = require('morgan'); // Syarat UTS: Logging
const path = require('path');
const db = require('./lib/db'); // Import file database yang tadi dibuat

const app = express();
const PORT = process.env.PORT || 3000; // Syarat UTS: Environment Variable

// --- MIDDLEWARE ---
app.use(morgan('dev')); // Menghasilkan log di terminal setiap ada request masuk
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Session untuk Login
app.use(session({
    secret: 'rahasia-uts-devops-2026',
    resave: false,
    saveUninitialized: true
}));

// Setup EJS untuk Tampilan
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// --- ROUTING ---

// 1. Route Halaman Login (GET)
app.get('/', (req, res) => {
    // Jika sudah login, langsung lempar ke home
    if (req.session.user) return res.redirect('/home');
    res.render('login', { error: null });
});

// 2. Route Proses Login (POST)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, user) => {
        if (err) return res.status(500).send("Database error");
        
        if (user) {
            req.session.user = user; // Simpan data user di session
            res.redirect('/home');
        } else {
            res.render('login', { error: 'Email atau password salah!' });
        }
    });
});

// 3. Route Halaman Home (GET)
app.get('/home', (req, res) => {
    // Proteksi: Jika belum login, tendang ke halaman login
    if (!req.session.user) return res.redirect('/');
    
    // Ambil semua data buku dari database
    db.all("SELECT * FROM books", [], (err, books) => {
        if (err) return res.status(500).send("Database error");
        
        // Render file view/home.ejs dan kirim data user & books
        res.render('home', { 
            user: req.session.user, 
            books: books 
        });
    });
});

// 4. Route Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// --- ROUTING KERANJANG & PAYMENT ---

// 1. Route untuk Menambah Buku ke Keranjang (POST)
app.post('/cart', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    
    const { bookId, qty } = req.body;
    const quantity = parseInt(qty);

    // Cari data buku di database
    db.get("SELECT * FROM books WHERE id = ?", [bookId], (err, book) => {
        if (err || !book) return res.status(404).send("Buku tidak ditemukan");
        
        // Validasi stok
        if (quantity > book.amount || quantity <= 0) {
            return res.send("Jumlah tidak valid atau melebihi stok!");
        }

        // Inisialisasi keranjang di session jika belum ada
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Cek apakah buku sudah ada di keranjang
        const existingItem = req.session.cart.find(item => item.bookId === book.id);
        
        if (existingItem) {
            // Jika sudah ada, tambahkan quantity-nya (pastikan tidak melebihi stok)
            if (existingItem.qty + quantity > book.amount) {
                return res.send("Total jumlah di keranjang melebihi stok!");
            }
            existingItem.qty += quantity;
        } else {
            // Jika belum ada, masukkan sebagai item baru
            req.session.cart.push({
                bookId: book.id,
                title: book.title,
                price: book.price,
                qty: quantity
            });
        }

        res.redirect('/payment'); // Langsung arahkan ke halaman payment
    });
});

// 2. Route untuk Menampilkan Halaman Payment (GET)
app.get('/payment', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    
    const cart = req.session.cart || [];
    let total = 0;
    
    // Hitung total harga
    cart.forEach(item => {
        total += item.price * item.qty;
    });

    res.render('payment', { 
        user: req.session.user, 
        cart: cart, 
        total: total 
    });
});

// 3. Route untuk Memproses Pembayaran (POST)
app.post('/checkout', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/payment');

    const userEmail = req.session.user.email;

    // Proses setiap item di keranjang
    db.serialize(() => {
        db.run("BEGIN TRANSACTION"); // Mulai transaksi database

        let errorOccurred = false;

        cart.forEach(item => {
            // 1. Kurangi stok buku
            db.run("UPDATE books SET amount = amount - ? WHERE id = ?", [item.qty, item.bookId], function(err) {
                if (err) errorOccurred = true;
            });

            // 2. Catat ke tabel payments
            const totalItem = item.price * item.qty;
            db.run("INSERT INTO payments (bookId, amount, userEmail, total, status) VALUES (?, ?, ?, ?, ?)", 
                [item.bookId, item.qty, userEmail, totalItem, 'done'], 
                function(err) {
                    if (err) errorOccurred = true;
                }
            );
        });

        if (errorOccurred) {
            db.run("ROLLBACK"); // Batalkan jika ada error
            res.send("Terjadi kesalahan saat memproses pembayaran.");
        } else {
            db.run("COMMIT"); // Simpan perubahan
            req.session.cart = []; // Kosongkan keranjang
            res.send("<h1>Pembayaran Berhasil!</h1><p>Stok buku telah dikurangi.</p><a href='/home'>Kembali ke Home</a>");
        }
    });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});