-- 1. Create a `users` table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Create a `stocks` table with a foreign key relationship to `users`
CREATE TABLE stocks (
    stock_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    symbol VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    closing_price DECIMAL(10, 2) NOT NULL
);

-- 3. Insert sample data into `users`
INSERT INTO users (username, email)
VALUES 
('john_doe', 'john@example.com'),
('jane_smith', 'jane@example.com');

-- 4. Insert sample data into `stocks`
INSERT INTO stocks (user_id, symbol, date, closing_price)
VALUES 
(1, 'AAPL', '2024-01-01', 150.00),
(1, 'AAPL', '2024-01-02', 152.00),
(1, 'MSFT', '2024-01-01', 250.00),
(1, 'MSFT', '2024-01-02', 255.00),
(2, 'AAPL', '2024-01-01', 149.00),
(2, 'AAPL', '2024-01-02', 151.00),
(2, 'MSFT', '2024-01-01', 249.00),
(2, 'MSFT', '2024-01-02', 254.00);

-- 5. Query to compare 2 stock charts for a given time range and a specific user
SELECT 
    s1.date,
    s1.symbol AS symbol_1,
    s1.closing_price AS closing_price_1,
    s2.symbol AS symbol_2,
    s2.closing_price AS closing_price_2
FROM 
    stocks s1
JOIN 
    stocks s2 ON s1.date = s2.date AND s1.user_id = s2.user_id
WHERE 
    s1.symbol = 'AAPL' AND 
    s2.symbol = 'MSFT' AND
    s1.user_id = 1 AND 
    s1.date BETWEEN '2024-01-01' AND '2024-01-02';
