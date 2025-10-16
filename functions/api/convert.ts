import { PagesFunction } from '@cloudflare/workers-types';
import OpenAI from 'openai';

interface Env {
  OPENAI_API_KEY: string;
  AI_GATEWAY_ACCOUNT_ID?: string;
  AI_GATEWAY_ID?: string;
}

interface ConvertRequest {
  naturalLanguage: string;
  platform: 'sentry' | 'datadog' | 'elasticsearch' | 'splunk';
}

interface ConvertResponse {
  platform: string;
  query: string;
  originalInput: string;
  timestamp: number;
  reasoning?: string;
}

const PLATFORM_SYSTEM_PROMPTS = {
  sentry: `You are an expert at converting natural language error descriptions into Sentry query syntax.

Sentry query syntax uses key:value pairs. Common patterns:
- level:error, level:warning, level:info
- http.status_code:500, http.status_code:404
- transaction:*/api/*, transaction:*/auth/*
- message:*timeout*, message:*error*
- environment:production, environment:staging
- release:1.0.0
- user.email:*@example.com

Examples:
- "500 errors from API" → "http.status_code:500 transaction:*/api/*"
- "login failures" → "level:error transaction:*/auth/* message:*login*"
- "database timeouts" → "level:error message:*timeout* message:*database*"

Respond ONLY with the Sentry query syntax, no explanations.`,

  datadog: `You are an expert at converting natural language error descriptions into Datadog query syntax.

Datadog query syntax uses key:value pairs with @ prefix for custom attributes. Common patterns:
- status:error, status:warn, status:info
- service:api, service:database, service:auth
- @http.status_code:500, @http.status_code:404
- @message:*timeout*, @message:*error*
- env:production, env:staging
- host:server-01
- @error.type:TimeoutError

Examples:
- "500 errors from API" → "status:error @http.status_code:500 service:api"
- "login failures" → "status:error service:auth @message:*login*"
- "database timeouts" → "status:error service:database @message:*timeout*"

Respond ONLY with the Datadog query syntax, no explanations.`,

  elasticsearch: `You are an expert at converting natural language error descriptions into Elasticsearch Query DSL (JSON format).

Elasticsearch uses JSON-based query DSL. Common patterns:
- { "match": { "log.level": "error" } }
- { "match": { "http.response.status_code": 500 } }
- { "wildcard": { "message": "*timeout*" } }
- { "match": { "service.name": "api" } }
- { "range": { "@timestamp": { "gte": "now-1h" } } }

Examples:
- "500 errors from API" → 
{
  "query": {
    "bool": {
      "must": [
        { "match": { "http.response.status_code": 500 } },
        { "match": { "service.name": "api" } }
      ]
    }
  }
}

Respond ONLY with valid JSON for Elasticsearch Query DSL, no explanations.`,

  splunk: `You are an expert at converting natural language error descriptions into Splunk SPL (Search Processing Language).

Splunk SPL syntax starts with index and uses field=value. Common patterns:
- index=main level=error
- status=500 status=404
- source=*api* source=*database*
- sourcetype=access_combined
- host=server-01
- | stats count by field
- | timechart span=1h count
- | where field > value

Examples:
- "500 errors from API" → "index=main status=500 source=*api* | stats count by host, source"
- "login failures" → "index=main level=error source=*auth* message=*login* | timechart span=5m count"
- "database timeouts" → "index=main level=error source=*database* message=*timeout* | stats count by host"

Respond ONLY with the Splunk SPL query, no explanations.`
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      webSocket: null
    });
  }

  try {
    // Parse request body
    const body = await request.json() as ConvertRequest;
    const { naturalLanguage, platform } = body;

    // Validate input
    if (!naturalLanguage || !naturalLanguage.trim()) {
      return new Response(
        JSON.stringify({ error: 'Please enter a description of the error' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          webSocket: null
        }
      );
    }

    if (!['sentry', 'datadog', 'elasticsearch', 'splunk'].includes(platform)) {
      return new Response(
        JSON.stringify({ error: 'Invalid platform specified' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          webSocket: null
        }
      );
    }

    // Configure OpenAI client
    let baseURL = 'https://api.openai.com/v1';
    
    // Use Cloudflare AI Gateway if configured
    if (env.AI_GATEWAY_ACCOUNT_ID && env.AI_GATEWAY_ID) {
      baseURL = `https://gateway.ai.cloudflare.com/v1/${env.AI_GATEWAY_ACCOUNT_ID}/${env.AI_GATEWAY_ID}/openai`;
    }

    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL,
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: PLATFORM_SYSTEM_PROMPTS[platform],
        },
        {
          role: 'user',
          content: naturalLanguage,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const query = completion.choices[0]?.message?.content?.trim();

    if (!query) {
      throw new Error('Failed to generate query');
    }

    // Build response
    const response: ConvertResponse = {
      platform,
      query,
      originalInput: naturalLanguage,
      timestamp: Date.now(),
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
      webSocket: null
    });
  } catch (error) {
    console.error('Error in convert API:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to convert query',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        webSocket: null
      }
    );
  }
};
