-- Your SQL goes here
CREATE TABLE conversations (
  id TEXT PRIMARY KEY NOT NULL,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content VARCHAR NOT NULL,
  created_at TEXT NOT NULL
)
