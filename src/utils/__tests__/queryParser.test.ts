import { describe, it, expect } from 'vitest'
import { convertToQuery, validateQuery } from '../queryParser'

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
    it('validates empty queries', async () => {
      const error = await validateQuery('', 'sentry')
      expect(error).not.toBeNull()
      expect(error?.code).toBe('EMPTY_QUERY')
    })

    it('validates Elasticsearch JSON syntax', async () => {
      const invalidJson = '{ invalid json }'
      const error = await validateQuery(invalidJson, 'elasticsearch')
      expect(error).not.toBeNull()
      expect(error?.code).toBe('INVALID_JSON')
    })

    it('validates Splunk index requirement', async () => {
      const error = await validateQuery('source=*api*', 'splunk')
      expect(error).not.toBeNull()
      expect(error?.code).toBe('MISSING_INDEX')
    })

    it('returns null for valid queries', async () => {
      expect(await validateQuery('level:error', 'sentry')).toBeNull()
      expect(await validateQuery('status:error', 'datadog')).toBeNull()
      expect(await validateQuery('{"query":{"match_all":{}}}', 'elasticsearch')).toBeNull()
      expect(await validateQuery('index=main status=error', 'splunk')).toBeNull()
    })
  })
})
