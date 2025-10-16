export type Platform = 'sentry' | 'datadog' | 'elasticsearch' | 'splunk'

export interface QueryResult {
  platform: Platform
  query: string
  originalInput: string
  timestamp: number
}

export interface PlatformConfig {
  name: string
  icon: string
  description: string
  exampleQuery: string
  syntaxHighlight: string
}

export interface ConversionError {
  message: string
  code?: string
  platform?: Platform
}

export interface QueryBuilderState {
  input: string
  platform: Platform
  results: QueryResult[]
  isLoading: boolean
  error: ConversionError | null
}
