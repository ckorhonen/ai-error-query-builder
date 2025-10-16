/**
 * Query History Management using D1
 */

import type { Platform } from '../../src/types'

export interface QueryHistoryItem {
  id?: number
  input: string
  platform: Platform
  query: string
  timestamp: number
}

/**
 * Save query to history
 */
export async function saveQueryHistory(
  db: D1Database,
  item: Omit<QueryHistoryItem, 'id'>
): Promise<void> {
  await db
    .prepare(`
      INSERT INTO query_history (input, platform, query, timestamp)
      VALUES (?, ?, ?, ?)
    `)
    .bind(item.input, item.platform, item.query, item.timestamp)
    .run()
}

/**
 * Get query history
 */
export async function getQueryHistory(
  db: D1Database,
  limit: number = 10
): Promise<QueryHistoryItem[]> {
  const result = await db
    .prepare(`
      SELECT id, input, platform, query, timestamp
      FROM query_history
      ORDER BY timestamp DESC
      LIMIT ?
    `)
    .bind(limit)
    .all()

  return result.results as QueryHistoryItem[]
}

/**
 * Clear history (optional utility)
 */
export async function clearQueryHistory(db: D1Database): Promise<void> {
  await db.prepare('DELETE FROM query_history').run()
}
