/**
 * Application configuration
 * Manages environment variables and app settings
 */

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'AI Error Query Builder',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_ENV || 'development',
  },
  features: {
    llmIntegration: import.meta.env.VITE_ENABLE_LLM_INTEGRATION === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
  api: {
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
    },
    anthropic: {
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      model: import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    },
    endpoint: import.meta.env.VITE_API_ENDPOINT,
  },
} as const

export const isDevelopment = config.app.environment === 'development'
export const isProduction = config.app.environment === 'production'
