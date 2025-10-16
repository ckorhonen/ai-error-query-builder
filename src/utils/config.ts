/**
 * Application configuration
 */

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'AI Error Query Builder',
    version: import.meta.env.VITE_APP_VERSION || '2.0.0',
    environment: import.meta.env.VITE_ENV || 'production',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || '/api',
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    history: true, // Always enabled with D1
  },
  platforms: [
    {
      id: 'sentry' as const,
      name: 'Sentry',
      description: 'Error tracking and monitoring',
      icon: '🔍',
    },
    {
      id: 'datadog' as const,
      name: 'Datadog',
      description: 'Infrastructure monitoring',
      icon: '📊',
    },
    {
      id: 'elasticsearch' as const,
      name: 'Elasticsearch',
      description: 'Log analytics and search',
      icon: '🔎',
    },
    {
      id: 'splunk' as const,
      name: 'Splunk',
      description: 'Security and analytics',
      icon: '📈',
    },
  ],
} as const

export type Platform = typeof config.platforms[number]['id']
