CREATE TABLE IF NOT EXISTS orders (
    _id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES "user"(_id),
    total_amount FLOAT NOT NULL CHECK (total_amount >= 0),
    discount_amount FLOAT DEFAULT 0 CHECK (discount_amount >= 0),
    gross_amount FLOAT NOT NULL CHECK (gross_amount >= 0),
    shipping_amount FLOAT DEFAULT 0 CHECK (shipping_amount >= 0),
    net_amount FLOAT NOT NULL CHECK (net_amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'processing', 'shipping', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('paid', 'unpaid')),
    payment_type VARCHAR(20) CHECK (payment_type IN ('netbanking', 'upi')),
    payment_transaction_id VARCHAR(100),
    shipping_address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parcel_id VARCHAR(50)
);

-- time is according to utc
