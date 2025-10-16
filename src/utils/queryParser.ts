import type { Platform, QueryResult, ConversionError } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * Converts natural language error descriptions to platform-specific queries
 * Now uses real LLM API via Cloudflare Workers!
 */
export async function convertToQuery(
  naturalLanguage: string,
  platform: Platform
): Promise<QueryResult> {
  // Basic validation
  if (!naturalLanguage.trim()) {
    throw new Error('Please enter a description of the error')
  }

  try {
    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        naturalLanguage,
        platform,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `API request failed: ${response.status}`)
    }

    const result = await response.json()
    return result as QueryResult
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to convert query. Please try again.')
  }
}

/**
 * Validate query syntax for a specific platform
 */
export async function validateQuery(
  query: string,
  platform: Platform
): Promise<ConversionError | null> {
  if (!query.trim()) {
    return {
      message: 'Query cannot be empty',
      code: 'EMPTY_QUERY',
      platform,
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        platform,
      }),
    })

    if (!response.ok) {
      return {
        message: 'Failed to validate query',
        code: 'VALIDATION_ERROR',
        platform,
      }
    }

    const result = await response.json()
    if (!result.valid && result.error) {
      return {
        message: result.error.message,
        code: result.error.code,
        platform,
      }
    }

    return null
  } catch (error) {
    // Return null on validation errors to allow queries through
    console.warn('Validation request failed:', error)
    return null
  }
}

/**
 * Legacy function for local query generation (fallback)
 * This is kept as a backup but should rarely be used
 */
export function generateQueryLocally(input: string, platform: Platform): string {
  const lowerInput = input.toLowerCase()

  // Extract common patterns
  const hasError = lowerInput.includes('error')
  const hasException = lowerInput.includes('exception')
  const has500 = lowerInput.includes('500')
  const has404 = lowerInput.includes('404')
  const hasTimeout = lowerInput.includes('timeout')
  const hasDatabase = lowerInput.includes('database') || lowerInput.includes('db')
  const hasApi = lowerInput.includes('api')
  const hasAuth = lowerInput.includes('auth') || lowerInput.includes('login')

  const patterns = {
    hasError,
    hasException,
    has500,
    has404,
    hasTimeout,
    hasDatabase,
    hasApi,
    hasAuth,
  }

  switch (platform) {
    case 'sentry':
      return generateSentryQuery(patterns)
    case 'datadog':
      return generateDatadogQuery(patterns)
    case 'elasticsearch':
      return generateElasticsearchQuery(patterns)
    case 'splunk':
      return generateSplunkQuery(patterns)
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

interface QueryPatterns {
  hasError: boolean
  hasException: boolean
  has500: boolean
  has404: boolean
  hasTimeout: boolean
  hasDatabase: boolean
  hasApi: boolean
  hasAuth: boolean
}

function generateSentryQuery(patterns: QueryPatterns): string {
  const conditions: string[] = []

  if (patterns.has500) conditions.push('http.status_code:500')
  else if (patterns.has404) conditions.push('http.status_code:404')
  else if (patterns.hasError || patterns.hasException) conditions.push('level:error')

  if (patterns.hasTimeout) conditions.push('message:*timeout*')
  if (patterns.hasDatabase) conditions.push('transaction:*/db/*')
  if (patterns.hasApi) conditions.push('transaction:*/api/*')
  if (patterns.hasAuth) conditions.push('transaction:*/auth/*')

  return conditions.length > 0 ? conditions.join(' ') : 'level:error'
}

function generateDatadogQuery(patterns: QueryPatterns): string {
  const conditions: string[] = []

  if (patterns.has500) conditions.push('status:500')
  else if (patterns.has404) conditions.push('status:404')
  else if (patterns.hasError || patterns.hasException) conditions.push('status:error')

  if (patterns.hasTimeout) conditions.push('@message:*timeout*')
  if (patterns.hasDatabase) conditions.push('service:database')
  if (patterns.hasApi) conditions.push('service:api')
  if (patterns.hasAuth) conditions.push('service:auth')

  return conditions.length > 0 ? conditions.join(' ') : 'status:error'
}

function generateElasticsearchQuery(patterns: QueryPatterns): string {
  const mustClauses: string[] = []

  if (patterns.has500) {
    mustClauses.push('{ "match": { "http.response.status_code": 500 } }')
  } else if (patterns.has404) {
    mustClauses.push('{ "match": { "http.response.status_code": 404 } }')
  } else if (patterns.hasError || patterns.hasException) {
    mustClauses.push('{ "match": { "log.level": "error" } }')
  }

  if (patterns.hasTimeout) {
    mustClauses.push('{ "wildcard": { "message": "*timeout*" } }')
  }
  if (patterns.hasDatabase) {
    mustClauses.push('{ "match": { "service.name": "database" } }')
  }
  if (patterns.hasApi) {
    mustClauses.push('{ "match": { "service.name": "api" } }')
  }
  if (patterns.hasAuth) {
    mustClauses.push('{ "match": { "service.name": "auth" } }')
  }

  if (mustClauses.length === 0) {
    mustClauses.push('{ "match": { "log.level": "error" } }')
  }

  return `{\n  "query": {\n    "bool": {\n      "must": [\n        ${mustClauses.join(',\n        ')}\n      ]\n    }\n  }\n}`
}

function generateSplunkQuery(patterns: QueryPatterns): string {
  const conditions: string[] = ['index=main']

  if (patterns.has500) conditions.push('status=500')
  else if (patterns.has404) conditions.push('status=404')
  else if (patterns.hasError || patterns.hasException) conditions.push('level=error')

  if (patterns.hasTimeout) conditions.push('message=*timeout*')
  if (patterns.hasDatabase) conditions.push('source=*database*')
  if (patterns.hasApi) conditions.push('source=*api*')
  if (patterns.hasAuth) conditions.push('source=*auth*')

  conditions.push('| stats count by host, source')

  return conditions.join(' ')
}
