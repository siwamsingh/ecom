CREATE TABLE IF NOT EXISTS order_items (
    _id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price FLOAT NOT NULL CHECK (price >= 0),
    total_amount FLOAT NOT NULL CHECK (total_amount >= 0),
    shipping_address_id INTEGER REFERENCES address(_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
