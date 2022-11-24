-- Your SQL goes here
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  username VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  created_at TEXT NOT NULL,
  unique(phone)
)
