const db = require('./db');

const sql = `
DROP TABLE IF EXISTS Spots;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Hero;
DROP TABLE IF EXISTS Categories;

CREATE TABLE Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
CREATE TABLE Products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, brand TEXT, description TEXT, price INTEGER, image_url TEXT, slug TEXT UNIQUE, category_id INTEGER, FOREIGN KEY (category_id) REFERENCES Categories(id));
CREATE TABLE Hero (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, image_url TEXT);
CREATE TABLE Spots (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, image_url TEXT, link_url TEXT);

INSERT INTO Categories (name) VALUES ('Nyheter'), ('Bästsäljare'), ('Kvinnor'), ('Män');

INSERT INTO Hero (title, description, image_url) 
VALUES ('Vårkollektionen 2026', 'Upptäck säsongens nyheter med fokus på hållbarhet och stil.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200');

INSERT INTO Products (name, brand, price, image_url, slug, description) VALUES
('Svart T-shirt', 'Levis', 199, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'svart-t-shirt', 'En klassisk svart t-shirt i 100% bomull.'),
('Blå Jeans', 'Diesel', 899, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'bla-jeans', 'Slitstarka jeans med perfekt passform.'),
('Vit Skjorta', 'Ralph Lauren', 599, 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500', 'vit-skjorta', 'Elegant skjorta för alla tillfällen.'),
('Grå Hoodie', 'Nike', 499, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 'gra-hoodie', 'Mjuk och skön hoodie.'),
('Läderväska', 'Gucci', 2499, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', 'ladervaska', 'Exklusiv handväska i äkta läder.'),
('Solglasögon', 'Ray-Ban', 1299, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 'solglasogon', 'Klassiska aviator solglasögon.'),
('Vinterjacka', 'North Face', 2999, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', 'vinterjacka', 'Varm och vattentät jacka.'),
('Sneakers', 'Adidas', 799, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'sneakers', 'Snygga och bekväma sneakers.');

INSERT INTO Spots (title, image_url, link_url) VALUES 
('Sommarens Favoriter', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400', '#'),
('Skor & Väskor', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', '#'),
('Accessoarer', 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cf4?w=400', '#');
`;

db.exec(sql);
console.log("Databasen är nu fixad och fylld med produkter!");
