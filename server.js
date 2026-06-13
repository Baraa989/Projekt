const express = require('express');
const db = require('./db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.url.includes('products') ? 'public/images/products' : 'public/images/categories';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Admin HTML Routes
app.get('/admin/products', (req, res) => res.sendFile(path.join(__dirname, 'admin-products.html')));
app.get('/admin/products/new', (req, res) => res.sendFile(path.join(__dirname, 'admin-new-product.html')));
app.get('/admin/categories', (req, res) => res.sendFile(path.join(__dirname, 'admin-categories.html')));
app.get('/admin/categories/new', (req, res) => res.sendFile(path.join(__dirname, 'admin-new-category.html')));

// API: Get all categories
app.get('/api/categories', (req, res) => {
    try {
        const categories = db.prepare('SELECT * FROM Categories').all();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Create category
app.post('/api/categories', upload.single('image'), (req, res) => {
    const { name } = req.body;
    const imageUrl = req.file ? `/public/images/categories/${req.file.filename}` : '';
    try {
        db.prepare('INSERT INTO Categories (name, image_url) VALUES (?, ?)').run(name, imageUrl);
        res.redirect('/admin/categories');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API: Create product
app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, brand, description, price, sku, category_id } = req.body;
    const imageUrl = req.file ? `/public/images/products/${req.file.filename}` : '';
    const slug = name.toLowerCase().replace(/ /g, '-');
    try {
        db.prepare('INSERT INTO Products (name, brand, description, price, sku, image_url, slug, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
          .run(name, brand, description, price, sku, imageUrl, slug, category_id);
        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API: Get all products (admin version)
app.get('/api/admin/products', (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM Products').all();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get hero data
app.get('/api/hero', (req, res) => {
    try {
        const hero = db.prepare('SELECT * FROM Hero LIMIT 1').get();
        res.json(hero);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get spots
app.get('/api/spots', (req, res) => {
    try {
        const spots = db.prepare('SELECT * FROM Spots').all();
        res.json(spots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get products (with optional limit and search)
app.get('/api/products', (req, res) => {
    const { limit, q } = req.query;
    try {
        let query = 'SELECT * FROM Products';
        const params = [];

        if (q) {
            query += ' WHERE name LIKE ?';
            params.push(`%${q}%`);
        }

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const products = db.prepare(query).all(...params);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get single product by slug
app.get('/api/products/:slug', (req, res) => {
    try {
        const product = db.prepare('SELECT * FROM Products WHERE slug = ?').get(req.params.slug);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get random similar products
app.get('/api/products-similar/:excludeId', (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM Products WHERE id != ? ORDER BY RANDOM() LIMIT 3').all(req.params.excludeId);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
