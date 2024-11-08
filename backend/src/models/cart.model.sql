CREATE TABLE IF NOT EXISTS cart (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    UNIQUE (user_id, product_id)
);