-- Your SQL goes here
CREATE TABLE rooms (
  id TEXT PRIMARY KEY NOT NULL,
  name VARCHAR NOT NULL,
  last_message TEXT NOT NULL,
  participant_ids TEXT NOT NULL,
  created_at TEXT NOT NULL
)
