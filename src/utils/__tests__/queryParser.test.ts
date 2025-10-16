import { describe, it, expect, beforeEach } from 'vitest'
import { convertToQuery, validateQuery } from '../queryParser'
import type { Platform } from '../../types'

describe('queryParser', () => {
  describe('convertToQuery', () => {
    it('converts natural language to Sentry query', async () => {
      const result = await convertToQuery('Show me all 500 errors', 'sentry')
      expect(result.platform).toBe('sentry')
      expect(result.query).toContain('http.status_code:500')
      expect(result.originalInput).toBe('Show me all 500 errors')
    })

    it('converts natural language to Datadog query', async () => {
      const result = await convertToQuery('Find timeout errors', 'datadog')
      expect(result.platform).toBe('datadog')
      expect(result.query).toContain('timeout')
    })

    it('converts natural language to Elasticsearch query', async () => {
      const result = await convertToQuery('Show database errors', 'elasticsearch')
      expect(result.platform).toBe('elasticsearch')
      expect(result.query).toContain('"query"')
      expect(() => JSON.parse(result.query)).not.toThrow()
    })

    it('converts natural language to Splunk query', async () => {
      const result = await convertToQuery('API errors', 'splunk')
      expect(result.platform).toBe('splunk')
      expect(result.query).toContain('index=')
    })

    it('throws error for empty input', async () => {
      await expect(convertToQuery('', 'sentry')).rejects.toThrow(
        'Please enter a description of the error'
      )
    })
  })

  describe('validateQuery', () => {
    it('validates empty queries', () => {
      const error = validateQuery('', 'sentry')
      expect(error).not.toBeNull()
      expect(error?.code).toBe('EMPTY_QUERY')
    })

    it('validates Elasticsearch JSON syntax', () => {
      const invalidJson = '{ invalid json }'
      const error = validateQuery(invalidJson, 'elasticsearch')
      expect(error).not.toBeNull()
      expect(error?.code).toBe('INVALID_JSON')
    })

    it('validates Splunk index requirement', () => {
      const error = validateQuery('source=*api*', 'splunk')
      expect(error).not.toBeNull()
      expect(error?.code).toBe('MISSING_INDEX')
    })

    it('returns null for valid queries', () => {
      expect(validateQuery('level:error', 'sentry')).toBeNull()
      expect(validateQuery('status:error', 'datadog')).toBeNull()
      expect(validateQuery('{"query":{"match_all":{}}}', 'elasticsearch')).toBeNull()
      expect(validateQuery('index=main status=error', 'splunk')).toBeNull()
    })
  })
})
