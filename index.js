// -----------------------------------------------------------------------------
//  SERVER  –  Express + EJS + Flash + Method‑Override
// -----------------------------------------------------------------------------
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

const {
    getAPI,
    addData,
    findData,
    updateData,
    deleteData,
} = require('./utils/goRest');

const app = express();
const hostname = 'localhost';
const port = 3000;

// ── View engine ───────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.use(expressLayouts);

// ── Middleware dasar ─────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));   // parse form x‑www‑form‑urlencoded
app.use(methodOverride('_method'));                // baca input _method=PUT/DELETE
app.use(cookieParser('keyboard cat'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}));

app.use(flash());

// ── ROUTES ────────────────────────────────────────────────────────────────────

// Beranda – tampilkan semua user
app.get('/', async (req, res) => {
    const data = await getAPI();
    res.render('index', {
        title: 'Index',
        layout: 'layouts/main',
        getAPI: data,
        msg: req.flash('msg'),
    });
});

// Form tambah
app.get('/add_Data', (req, res) => {
    res.render('addData', {
        title: 'Add Data',
        layout: 'layouts/main',
        msg: req.flash('msg'),
    });
});

// Proses tambah (POST)
app.post('/add_Data', async (req, res) => {
    await addData(req.body);
    req.flash('msg', 'Data berhasil ditambahkan');
    res.redirect('/');
});

// Detail
app.get('/detail_data/:id', async (req, res) => {
    const id = Number(req.params.id);
    const goRestData = await findData(id);

    res.render('detailData', {
        title: 'Detail Data',
        layout: 'layouts/main',
        goRestData,
        msg: req.flash('msg'),
    });
});

// Form update
app.get('/update_data/:id', async (req, res) => {
    const id = Number(req.params.id);
    const goRestData = await findData(id);

    res.render('updateData', {
        title: 'Update Data',
        layout: 'layouts/main',
        goRestData,
        msg: req.flash('msg'),
    });
});

app.put('/update_data/:id', async (req, res) => {
    const id = Number(req.params.id);               // ① pastikan ada id

    await updateData(id, req.body);                 // ② kirim PUT ke GoRest

    req.flash('msg', 'Data berhasil diupdate');
    res.redirect('/');             // ③ tutup respons
});

app.delete('/delete_data/:id', async (req, res) => {
    const id = Number(req.params.id);               

    const user = await findData(id);
    if (!user) {
        req.flash('msg', `Data tidak ditemukan`);
        return res.redirect('/');
    }

    const result = await deleteData(id);

    if (result.ok) {
        req.flash('msg', `Data dengan nama ${user.name} berhasil dihapus`);
        return res.redirect('/');
    }

    // gagal – tampilkan error GoRest
    req.flash('msg', `Gagal hapus (${result.status})`);
    res.redirect('/detail_data/' + id);
});

// Catch‑all 404
app.use((req, res) => {
    console.log('404 →', req.method, req.originalUrl);
    res.status(404).render('404', {
        title: 'Error Page',
        layout: '404',
    });
});
// app.use((req,res)=>{ console.log('404', req.method, req.originalUrl); })
// ── Start server ──────────────────────────────────────────────────────────────
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
