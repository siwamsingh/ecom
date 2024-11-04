CREATE TABLE discounts (
  _id SERIAL PRIMARY KEY,
  coupon_code VARCHAR(50) UNIQUE NOT NULL,
  product_id INTEGER REFERENCES products(_id) ON DELETE CASCADE,
  discount_value DECIMAL(5, 2) CHECK (discount_value >= 0 AND discount_value <= 100),  -- Ensures discount value is between 0 and 100 percent
  start_date DATE NOT NULL,
  end_date DATE NOT NULL CHECK (end_date > start_date),
  description TEXT,
  status VARCHAR(10) CHECK (status IN ('active', 'inactive')) NOT NULL
);

