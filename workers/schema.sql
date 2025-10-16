-- D1 Database Schema for AI Error Query Builder

-- Query history table
CREATE TABLE IF NOT EXISTS query_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  input TEXT NOT NULL,
  platform TEXT NOT NULL,
  query TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_timestamp ON query_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_platform ON query_history(platform);
