/**
 * Cloudflare Workers API Handler
 * Handles API routes for AI Error Query Builder
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { cache } from 'hono/cache'
import { convertToQueryWithAI } from './api/convert'
import { saveQueryHistory, getQueryHistory } from './api/history'

type Bindings = {
  DB: D1Database
  OPENAI_API_KEY: string
  AI_GATEWAY_ID?: string
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT
  })
})

// Convert natural language to query (with real LLM)
app.post('/api/convert', async (c) => {
  try {
    const body = await c.req.json()
    const { input, platform } = body

    if (!input || !platform) {
      return c.json({ 
        error: 'Missing required fields: input and platform' 
      }, 400)
    }

    // Convert using OpenAI
    const result = await convertToQueryWithAI(
      input,
      platform,
      c.env.OPENAI_API_KEY,
      c.env.AI_GATEWAY_ID
    )

    // Save to history
    try {
      await saveQueryHistory(c.env.DB, {
        input,
        platform,
        query: result.query,
        timestamp: Date.now()
      })
    } catch (err) {
      console.error('Failed to save history:', err)
    }

    return c.json(result)
  } catch (error) {
    console.error('Conversion error:', error)
    return c.json({
      error: error instanceof Error ? error.message : 'Failed to convert query',
      code: 'CONVERSION_ERROR'
    }, 500)
  }
})

// Get query history
app.get('/api/history', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10')
    const history = await getQueryHistory(c.env.DB, limit)
    return c.json({ history })
  } catch (error) {
    console.error('History error:', error)
    return c.json({
      error: 'Failed to fetch history'
    }, 500)
  }
})

// Static assets fallback
app.get('*', cache({
  cacheName: 'static-assets',
  cacheControl: 'max-age=3600',
}))

export default app
