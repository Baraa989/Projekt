const express = require('express');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// API: Get all categories
app.get('/api/categories', (req, res) => {
    try {
        const categories = db.prepare('SELECT * FROM Categories').all();
        res.json(categories);
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
