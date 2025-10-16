/**
 * Legacy query parser (mock implementation)
 * Kept for fallback and development without API
 */

import type { Platform, QueryResult, ConversionError } from '../types'

/**
 * Converts natural language error descriptions to platform-specific queries
 * This is a fallback - production uses the Cloudflare Workers API
 */
export async function convertToQueryLegacy(
  naturalLanguage: string,
  platform: Platform
): Promise<QueryResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Basic validation
  if (!naturalLanguage.trim()) {
    throw new Error('Please enter a description of the error')
  }

  const query = generateQuery(naturalLanguage, platform)

  return {
    platform,
    query,
    originalInput: naturalLanguage,
    timestamp: Date.now(),
  }
}

/**
 * Generate platform-specific query syntax
 * Basic pattern matching (not AI-powered)
 */
function generateQuery(input: string, platform: Platform): string {
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

  switch (platform) {
    case 'sentry':
      return generateSentryQuery({
        hasError,
        hasException,
        has500,
        has404,
        hasTimeout,
        hasDatabase,
        hasApi,
        hasAuth,
      })

    case 'datadog':
      return generateDatadogQuery({
        hasError,
        hasException,
        has500,
        has404,
        hasTimeout,
        hasDatabase,
        hasApi,
        hasAuth,
      })

    case 'elasticsearch':
      return generateElasticsearchQuery({
        hasError,
        hasException,
        has500,
        has404,
        hasTimeout,
        hasDatabase,
        hasApi,
        hasAuth,
      })

    case 'splunk':
      return generateSplunkQuery({
        hasError,
        hasException,
        has500,
        has404,
        hasTimeout,
        hasDatabase,
        hasApi,
        hasAuth,
      })

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

/**
 * Validate query syntax for a specific platform
 */
export function validateQuery(query: string, platform: Platform): ConversionError | null {
  if (!query.trim()) {
    return {
      message: 'Query cannot be empty',
      code: 'EMPTY_QUERY',
      platform,
    }
  }

  // Platform-specific validation
  switch (platform) {
    case 'elasticsearch':
      try {
        JSON.parse(query)
      } catch {
        return {
          message: 'Invalid JSON syntax for Elasticsearch query',
          code: 'INVALID_JSON',
          platform,
        }
      }
      break

    case 'splunk':
      if (!query.includes('index=')) {
        return {
          message: 'Splunk queries should specify an index',
          code: 'MISSING_INDEX',
          platform,
        }
      }
      break
  }

  return null
}
