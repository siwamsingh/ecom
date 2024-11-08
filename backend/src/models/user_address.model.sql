CREATE TABLE IF NOT EXISTS user_address (
    user_id INTEGER NOT NULL REFERENCES "user"(_id) ON DELETE CASCADE,
    address_id INTEGER NOT NULL REFERENCES address(_id) ON DELETE CASCADE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id, address_id)
);