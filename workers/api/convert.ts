/**
 * AI Query Conversion using OpenAI via Cloudflare AI Gateway
 */

import type { Platform, QueryResult } from '../../src/types'

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  sentry: `Generate a Sentry query using their search syntax:
- Use field:value format (e.g., level:error, http.status_code:500)
- Use wildcards with * (e.g., message:*timeout*)
- Use transaction filters (e.g., transaction:*/api/*)
- Common fields: level, message, http.status_code, transaction, user.email
Return ONLY the query string, no explanations.`,

  datadog: `Generate a Datadog query using their log search syntax:
- Use field:value format (e.g., status:error, service:api)
- Use @message for log message searches with wildcards
- Use facets for structured data
- Common fields: status, service, @message, host, source
Return ONLY the query string, no explanations.`,

  elasticsearch: `Generate an Elasticsearch JSON DSL query:
- Use bool queries with must/should/filter clauses
- Use match for text searches, term for exact matches
- Use wildcard for pattern matching
- Include proper JSON structure
Return ONLY the JSON query, no explanations or markdown formatting.`,

  splunk: `Generate a Splunk SPL (Search Processing Language) query:
- Start with index= (e.g., index=main)
- Use field=value format
- Use wildcards with *
- End with stats or table commands
Return ONLY the SPL query, no explanations.`
}

/**
 * Convert natural language to platform-specific query using OpenAI
 */
export async function convertToQueryWithAI(
  input: string,
  platform: Platform,
  apiKey: string,
  gatewayId?: string
): Promise<QueryResult> {
  const systemPrompt = `You are an expert at converting natural language error descriptions into ${platform} queries.

${PLATFORM_INSTRUCTIONS[platform]}

Be precise and use proper syntax. Extract relevant information like:
- Error types (500, 404, timeout, etc.)
- Services (api, database, auth, etc.)
- Time ranges
- Status codes
- Error levels`

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: input
    }
  ]

  // Use Cloudflare AI Gateway if available, otherwise direct OpenAI
  const endpoint = gatewayId
    ? `https://gateway.ai.cloudflare.com/v1/${gatewayId}/openai/chat/completions`
    : 'https://api.openai.com/v1/chat/completions'

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.1,
      max_tokens: 500
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  const data = await response.json() as OpenAIResponse
  const query = data.choices[0]?.message?.content?.trim()

  if (!query) {
    throw new Error('No query generated from AI')
  }

  // Clean up markdown code blocks if present
  let cleanQuery = query
  if (platform === 'elasticsearch') {
    cleanQuery = cleanQuery.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  }

  return {
    platform,
    query: cleanQuery,
    originalInput: input,
    timestamp: Date.now()
  }
}
