/**
 * API Service for communicating with Cloudflare Workers backend
 */

import type { Platform, QueryResult } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

interface ConvertRequest {
  input: string
  platform: Platform
}

interface ConvertResponse {
  platform: Platform
  query: string
  originalInput: string
  timestamp: number
  error?: string
  code?: string
}

export interface HistoryItem {
  id: number
  input: string
  platform: Platform
  query: string
  timestamp: number
}

/**
 * Convert natural language to platform-specific query using AI
 */
export async function convertToQuery(
  input: string,
  platform: Platform
): Promise<QueryResult> {
  const response = await fetch(`${API_BASE_URL}/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input, platform } as ConvertRequest),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `API request failed: ${response.status}`
    )
  }

  const data: ConvertResponse = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return {
    platform: data.platform,
    query: data.query,
    originalInput: data.originalInput,
    timestamp: data.timestamp,
  }
}

/**
 * Get query history from D1 database
 */
export async function getQueryHistory(limit: number = 10): Promise<HistoryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`)

    if (!response.ok) {
      console.error('Failed to fetch history:', response.status)
      return []
    }

    const data = await response.json()
    return data.history || []
  } catch (error) {
    console.error('Error fetching history:', error)
    return []
  }
}

/**
 * Check API health
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}
