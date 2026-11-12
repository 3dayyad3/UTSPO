const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const db = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'rahasia-uts-devops-2026',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/home');
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, user) => {
        if (err) return res.status(500).send("Database error");

        if (user) {
            req.session.user = user;
            res.redirect('/home');
        } else {
            res.render('login', { error: 'Email atau password salah!' });
        }
    });
});


app.get('/home', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    db.all("SELECT * FROM books", [], (err, books) => {
        if (err) return res.status(500).send("Database error");

        res.render('home', {
            user: req.session.user,
            books: books
        });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/cart', (req, res) => {
    if (!req.session.user) return res.redirect('/');

    const { bookId, qty } = req.body;
    const quantity = parseInt(qty);

    db.get("SELECT * FROM books WHERE id = ?", [bookId], (err, book) => {
        if (err || !book) return res.status(404).send("Buku tidak ditemukan");

        if (quantity > book.amount || quantity <= 0) {
            return res.send("Jumlah tidak valid atau melebihi stok!");
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingItem = req.session.cart.find(item => item.bookId === book.id);

        if (existingItem) {
            if (existingItem.qty + quantity > book.amount) {
                return res.send("Total jumlah di keranjang melebihi stok!");
            }
            existingItem.qty += quantity;
        } else {
            req.session.cart.push({
                bookId: book.id,
                title: book.title,
                price: book.price,
                qty: quantity
            });
        }

        res.redirect('/payment');
    });
});

app.get('/payment', (req, res) => {
    if (!req.session.user) return res.redirect('/');

    const cart = req.session.cart || [];
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
    });

    res.render('payment', {
        user: req.session.user,
        cart: cart,
        total: total
    });
});

app.post('/checkout', (req, res) => {
    if (!req.session.user) return res.redirect('/');

    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/payment');

    const userEmail = req.session.user.email;

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        let errorOccurred = false;

        cart.forEach(item => {
            db.run("UPDATE books SET amount = amount - ? WHERE id = ?", [item.qty, item.bookId], function (err) {
                if (err) errorOccurred = true;
            });

            const totalItem = item.price * item.qty;
            db.run("INSERT INTO payments (bookId, amount, userEmail, total, status) VALUES (?, ?, ?, ?, ?)",
                [item.bookId, item.qty, userEmail, totalItem, 'done'],
                function (err) {
                    if (err) errorOccurred = true;
                }
            );
        });

        if (errorOccurred) {
            db.run("ROLLBACK");
            res.send("Terjadi kesalahan saat memproses pembayaran.");
        } else {
            db.run("COMMIT");
            req.session.cart = [];
res.render('success', { user: req.session.user });        }
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
