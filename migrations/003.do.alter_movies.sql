ALTER TABLE movies
  ADD COLUMN
    user_id INTEGER REFERENCES users(id)
    ON DELETE SET NULL;