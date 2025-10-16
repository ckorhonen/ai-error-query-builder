/**
 * Application configuration
 * Cloudflare Workers Edition
 */

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'AI Error Query Builder',
    version: import.meta.env.VITE_APP_VERSION || '2.0.0',
    environment: import.meta.env.VITE_ENV || 'production',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000, // 30 seconds
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    realTimeLLM: true, // Always enabled in Cloudflare Workers version
  },
  platforms: ['sentry', 'datadog', 'elasticsearch', 'splunk'] as const,
} as const

export type Config = typeof config
