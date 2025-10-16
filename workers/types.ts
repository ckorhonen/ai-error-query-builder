/**
 * Cloudflare Workers type definitions
 */

export interface Env {
  DB: D1Database
  OPENAI_API_KEY: string
  AI_GATEWAY_ID?: string
  ENVIRONMENT: string
}

export interface APIError {
  error: string
  code?: string
  details?: unknown
}
