CREATE TABLE "user" (
  _id SERIAL PRIMARY KEY,  -- Auto-incrementing ID
  username VARCHAR(50) NOT NULL,  -- Usernames can be anything
  phone_number VARCHAR(15) NOT NULL,  -- Phone number is required
  password VARCHAR(255) NOT NULL,  -- Password (hashed, typically)
  status VARCHAR(10) CHECK (status IN ('active', 'inactive', 'blocked')) NOT NULL,  -- Enum-like constraint
  role VARCHAR(10) CHECK (role IN ('customer', 'admin')) NOT NULL,  -- Enum-like constraint for role
  refresh_token VARCHAR(255),  -- JWT refresh token
  last_login_time TIMESTAMP,  -- Stores the last login time
  login_attempt SMALLINT CHECK (login_attempt BETWEEN 0 AND 3),  -- Limits login attempts to 0-3
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Tracks when the user was created
);

-- Adjust the sequence to start _id from 1000
ALTER SEQUENCE "user__id_seq" RESTART WITH 1000;