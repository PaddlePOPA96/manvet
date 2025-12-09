-- =====================================================
-- DATABASE RESET AND SEEDING SCRIPT
-- =====================================================
-- WARNING: This will DELETE ALL DATA in the database!
-- Run this script in Supabase SQL Editor

-- =====================================================
-- STEP 1: DROP ALL TABLES
-- =====================================================

DROP TABLE IF EXISTS "PackageItem" CASCADE;
DROP TABLE IF EXISTS "Package" CASCADE;
DROP TABLE IF EXISTS "PromotionProduct" CASCADE;
DROP TABLE IF EXISTS "Promotion" CASCADE;
DROP TABLE IF EXISTS "StockMutation" CASCADE;
DROP TABLE IF EXISTS "TransactionItem" CASCADE;
DROP TABLE IF EXISTS "Transaction" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Role" CASCADE;

-- =====================================================
-- STEP 2: CREATE TABLES
-- =====================================================

-- Create Role table
CREATE TABLE "Role" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create User table
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("roleId") REFERENCES "Role"(id)
);

-- Create Category table
CREATE TABLE "Category" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Product table
CREATE TABLE "Product" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    "photoUrl" TEXT,
    "packageInfo" TEXT,
    "categoryId" INTEGER,
    unit TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("categoryId") REFERENCES "Category"(id)
);

-- Create Transaction table
CREATE TABLE "Transaction" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    "totalAmount" DECIMAL(10,2) DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id)
);

-- Create TransactionItem table
CREATE TABLE "TransactionItem" (
    id SERIAL PRIMARY KEY,
    "transactionId" INTEGER NOT NULL,
    "productId" INTEGER,
    "packageId" INTEGER,
    type VARCHAR(50) DEFAULT 'ITEM',
    qty INTEGER DEFAULT 1,
    "basePrice" DECIMAL(10,2) DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    "discountPerUnit" DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY ("transactionId") REFERENCES "Transaction"(id) ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product"(id)
);

-- Create StockMutation table
CREATE TABLE "StockMutation" (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL,
    type VARCHAR(10) NOT NULL,
    condition VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    reseller TEXT,
    "productionDate" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("productId") REFERENCES "Product"(id)
);

-- Create Promotion table
CREATE TABLE "Promotion" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    active BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PromotionProduct junction table
CREATE TABLE "PromotionProduct" (
    id SERIAL PRIMARY KEY,
    "promotionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "eventPrice" DECIMAL(10,2) NOT NULL,
    FOREIGN KEY ("promotionId") REFERENCES "Promotion"(id) ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE,
    UNIQUE ("promotionId", "productId")
);

-- Create Package table
CREATE TABLE "Package" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PackageItem junction table
CREATE TABLE "PackageItem" (
    id SERIAL PRIMARY KEY,
    "packageId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY ("packageId") REFERENCES "Package"(id) ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE
);

-- =====================================================
-- STEP 3: SEED DATA
-- =====================================================

-- Insert Roles
INSERT INTO "Role" (name) VALUES 
('admin'),
('superadmin'),
('user'),
('guest');

-- Insert Admin User (password: "admin123")
-- Bcrypt hash for "admin123"
INSERT INTO "User" (email, password, "roleId") VALUES 
('admin@vetpicurean.com', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRwwX.QqUPY/5VMYPQ7NC/H16efpe', 1);

-- Insert Categories
INSERT INTO "Category" (name) VALUES 
('Makanan Kucing'),
('Makanan Anjing'),
('Suplemen'),
('Grooming'),
('Obat');

-- Insert Products (20 products)
-- Category IDs: 1=Makanan Kucing, 2=Makanan Anjing, 3=Suplemen, 4=Grooming, 5=Obat
INSERT INTO "Product" (name, price, cost, "categoryId", unit) VALUES 
('CG Basic', 55000, 35000, 1, 'Pack'),
('CG MOM', 60000, 40000, 1, 'Pack'),
('CG ESSENTIALS', 65000, 45000, 1, 'Pack'),
('CG Collaberry', 70000, 50000, 1, 'Pack'),
('CG TUMMY', 65000, 45000, 1, 'Pack'),
('CG Urigoel', 75000, 55000, 1, 'Pack'),
('Chubby Balme Fungee', 45000, 25000, 3, 'Botol'),
('GOAT UP 30 Pouch', 35000, 20000, 3, 'Pouch'),
('GOAT UP 90g JAR', 85000, 60000, 3, 'Jar'),
('FP Milk Cleanser 60ml', 40000, 25000, 4, 'Botol'),
('FP Milk Cleanser', 65000, 45000, 4, 'Botol'),
('FP Powder - 25g', 30000, 15000, 4, 'Pack'),
('Nyang-Nyang Spray', 50000, 30000, 4, 'Botol'),
('BD Basic', 55000, 35000, 2, 'Pack'),
('BD Essential', 65000, 45000, 2, 'Pack'),
('BD Collaberry', 70000, 50000, 2, 'Pack'),
('BD Tummy', 65000, 45000, 2, 'Pack'),
('BD Urigoel', 75000, 55000, 2, 'Pack'),
('Hairball Hero 50G', 90000, 65000, 3, 'Pack'),
('Hairball Hero 100G', 160000, 110000, 3, 'Pack');

-- Insert Sample Stock Mutations (Barang Masuk)
INSERT INTO "StockMutation" ("productId", type, condition, quantity, date) VALUES 
(1, 'IN', 'Barang Diterima dari Produksi', 100, '2025-12-01 10:00:00'),
(2, 'IN', 'Barang Diterima dari Produksi', 80, '2025-12-01 10:00:00'),
(3, 'IN', 'Barang Diterima dari Produksi', 90, '2025-12-01 10:00:00'),
(4, 'IN', 'Barang Diterima dari Produksi', 70, '2025-12-01 10:00:00'),
(5, 'IN', 'Barang Diterima dari Produksi', 85, '2025-12-01 10:00:00'),
(6, 'IN', 'Barang Diterima dari Produksi', 60, '2025-12-01 10:00:00'),
(7, 'IN', 'Barang Diterima dari Produksi', 120, '2025-12-01 10:00:00'),
(8, 'IN', 'Barang Diterima dari Produksi', 150, '2025-12-01 10:00:00'),
(9, 'IN', 'Barang Diterima dari Produksi', 50, '2025-12-01 10:00:00'),
(10, 'IN', 'Barang Diterima dari Produksi', 100, '2025-12-01 10:00:00');

-- Insert Sample Transactions (POS Sales)
INSERT INTO "Transaction" ("userId", date, "totalAmount") VALUES 
(1, '2025-12-05 14:30:00', 220000),
(1, '2025-12-06 11:15:00', 130000),
(1, '2025-12-07 16:45:00', 195000);

-- Insert Transaction Items
INSERT INTO "TransactionItem" ("transactionId", "productId", type, qty, "basePrice", price, cost, "discountPerUnit") VALUES 
(1, 1, 'ITEM', 2, 55000, 55000, 35000, 0),
(1, 3, 'ITEM', 2, 65000, 55000, 45000, 10000),
(2, 7, 'ITEM', 1, 45000, 45000, 25000, 0),
(2, 9, 'ITEM', 1, 85000, 85000, 60000, 0),
(3, 2, 'ITEM', 1, 60000, 60000, 40000, 0),
(3, 4, 'ITEM', 1, 70000, 65000, 50000, 5000),
(3, 6, 'ITEM', 1, 75000, 70000, 55000, 5000);

-- Insert Sample Promotions
INSERT INTO "Promotion" (name, "startDate", "endDate", active) VALUES 
('Promo Akhir Tahun 2025', '2025-12-01 00:00:00', '2025-12-31 23:59:59', true),
('Flash Sale Weekend', '2025-12-14 00:00:00', '2025-12-15 23:59:59', true);

-- Insert Promotion Products (discounted items)
INSERT INTO "PromotionProduct" ("promotionId", "productId", "eventPrice") VALUES 
(1, 1, 45000),  -- CG Basic: 55000 -> 45000
(1, 2, 50000),  -- CG MOM: 60000 -> 50000
(1, 7, 35000),  -- Chubby Balme Fungee: 45000 -> 35000
(2, 9, 70000),  -- GOAT UP 90g JAR: 85000 -> 70000 (flash sale)
(2, 19, 75000); -- Hairball Hero 50G: 90000 -> 75000

-- Insert Sample Packages
INSERT INTO "Package" (name, price) VALUES 
('Paket Starter Kucing', 150000),
('Paket Grooming Lengkap', 120000),
('Paket Suplemen Premium', 200000);

-- Insert Package Items
INSERT INTO "PackageItem" ("packageId", "productId", quantity) VALUES 
(1, 1, 2),   -- Paket Starter: 2x CG Basic
(1, 7, 1),   -- Paket Starter: 1x Chubby Balme Fungee
(2, 10, 1),  -- Paket Grooming: 1x FP Milk Cleanser 60ml
(2, 12, 1),  -- Paket Grooming: 1x FP Powder
(2, 13, 1),  -- Paket Grooming: 1x Nyang-Nyang Spray
(3, 9, 1),   -- Paket Suplemen: 1x GOAT UP 90g JAR
(3, 19, 1),  -- Paket Suplemen: 1x Hairball Hero 50G
(3, 20, 1);  -- Paket Suplemen: 1x Hairball Hero 100G

-- =====================================================
-- STEP 4: VERIFY DATA
-- =====================================================

SELECT 'Roles' as table_name, COUNT(*) as count FROM "Role"
UNION ALL SELECT 'Users', COUNT(*) FROM "User"
UNION ALL SELECT 'Categories', COUNT(*) FROM "Category"
UNION ALL SELECT 'Products', COUNT(*) FROM "Product"
UNION ALL SELECT 'StockMutations', COUNT(*) FROM "StockMutation"
UNION ALL SELECT 'Transactions', COUNT(*) FROM "Transaction"
UNION ALL SELECT 'TransactionItems', COUNT(*) FROM "TransactionItem"
UNION ALL SELECT 'Promotions', COUNT(*) FROM "Promotion"
UNION ALL SELECT 'PromotionProducts', COUNT(*) FROM "PromotionProduct"
UNION ALL SELECT 'Packages', COUNT(*) FROM "Package"
UNION ALL SELECT 'PackageItems', COUNT(*) FROM "PackageItem";

-- Show sample data
SELECT 'Sample Products:' as info;
SELECT p.id, p.name, p.price, p.cost, c.name as category, p.unit 
FROM "Product" p 
LEFT JOIN "Category" c ON p."categoryId" = c.id 
LIMIT 5;

SELECT 'Sample Stock Mutations:' as info;
SELECT sm.id, p.name as product, sm.type, sm.condition, sm.quantity, sm.date 
FROM "StockMutation" sm 
JOIN "Product" p ON sm."productId" = p.id 
LIMIT 5;

SELECT 'Sample Promotions:' as info;
SELECT pr.id, pr.name, pr."startDate", pr."endDate", pr.active,
       COUNT(pp.id) as product_count
FROM "Promotion" pr
LEFT JOIN "PromotionProduct" pp ON pr.id = pp."promotionId"
GROUP BY pr.id, pr.name, pr."startDate", pr."endDate", pr.active;

SELECT 'Sample Promotion Products:' as info;
SELECT pr.name as promotion, p.name as product, 
       p.price as original_price, pp."eventPrice" as promo_price,
       (p.price - pp."eventPrice") as discount
FROM "PromotionProduct" pp
JOIN "Promotion" pr ON pp."promotionId" = pr.id
JOIN "Product" p ON pp."productId" = p.id
LIMIT 5;

SELECT 'Sample Packages:' as info;
SELECT pkg.id, pkg.name, pkg.price,
       COUNT(pi.id) as item_count
FROM "Package" pkg
LEFT JOIN "PackageItem" pi ON pkg.id = pi."packageId"
GROUP BY pkg.id, pkg.name, pkg.price;

SELECT 'Sample Package Items:' as info;
SELECT pkg.name as package, p.name as product, pi.quantity
FROM "PackageItem" pi
JOIN "Package" pkg ON pi."packageId" = pkg.id
JOIN "Product" p ON pi."productId" = p.id
LIMIT 8;

SELECT 'Admin User:' as info;
SELECT u.email, r.name as role FROM "User" u JOIN "Role" r ON u."roleId" = r.id;
