CREATE TABLE categories (
  _id SERIAL PRIMARY KEY,
  category_name VARCHAR(55) UNIQUE NOT NULL,
  url_slug VARCHAR(255) UNIQUE NOT NULL,
  parent_categorie_id INTEGER REFERENCES categories(_id) ON DELETE SET NULL,
  status VARCHAR(20) CHECK (status IN ('active', 'inactive')) NOT NULL
);
