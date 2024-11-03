CREATE TABLE products (
  _id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  url_slug VARCHAR(255) UNIQUE NOT NULL,
  categorie_id INTEGER REFERENCES categories(_id) ON DELETE SET NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  status VARCHAR(20) CHECK (status IN ('active', 'inactive')) NOT NULL,
  image_url VARCHAR(255) NOT NULL
);
