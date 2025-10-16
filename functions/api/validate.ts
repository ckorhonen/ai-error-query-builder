import { PagesFunction } from '@cloudflare/workers-types';

interface Env {}

interface ValidateRequest {
  query: string;
  platform: 'sentry' | 'datadog' | 'elasticsearch' | 'splunk';
}

interface ValidateResponse {
  valid: boolean;
  error?: {
    message: string;
    code: string;
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json() as ValidateRequest;
    const { query, platform } = body;

    // Validate query is not empty
    if (!query || !query.trim()) {
      const response: ValidateResponse = {
        valid: false,
        error: {
          message: 'Query cannot be empty',
          code: 'EMPTY_QUERY',
        },
      };
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Platform-specific validation
    let validationError: { message: string; code: string } | null = null;

    switch (platform) {
      case 'elasticsearch':
        try {
          JSON.parse(query);
        } catch {
          validationError = {
            message: 'Invalid JSON syntax for Elasticsearch query',
            code: 'INVALID_JSON',
          };
        }
        break;

      case 'splunk':
        if (!query.includes('index=')) {
          validationError = {
            message: 'Splunk queries should specify an index',
            code: 'MISSING_INDEX',
          };
        }
        break;
    }

    const response: ValidateResponse = {
      valid: !validationError,
      error: validationError || undefined,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        valid: false,
        error: {
          message: 'Failed to validate query',
          code: 'VALIDATION_ERROR',
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
