import { useState, useEffect } from 'react'
import { Sparkles, AlertCircle, Loader2, History } from 'lucide-react'
import type { Platform, QueryResult, ConversionError } from '../types'
import { convertToQuery, getQueryHistory, type HistoryItem } from '../services/api'
import { validateQuery } from '../utils/queryParserLegacy'
import { PlatformSelector } from './PlatformSelector'
import { QueryResult as QueryResultComponent } from './QueryResult'

export function QueryBuilder() {
  const [input, setInput] = useState('')
  const [platform, setPlatform] = useState<Platform>('sentry')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ConversionError | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Load history on mount
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const items = await getQueryHistory(5)
    setHistory(items)
  }

  const handleConvert = async () => {
    if (!input.trim()) {
      setError({
        message: 'Please enter a description of the error you want to query',
        code: 'EMPTY_INPUT',
      })
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Call the Cloudflare Workers API with real LLM integration
      const queryResult = await convertToQuery(input, platform)

      // Validate the generated query
      const validationError = validateQuery(queryResult.query, platform)
      if (validationError) {
        setError(validationError)
        return
      }

      setResult(queryResult)
      
      // Reload history after successful conversion
      loadHistory()
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Failed to convert query',
        code: 'CONVERSION_ERROR',
        platform,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleConvert()
    }
  }

  const loadFromHistory = (item: HistoryItem) => {
    setInput(item.input)
    setPlatform(item.platform)
    setShowHistory(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Platform Selection */}
      <PlatformSelector selected={platform} onSelect={setPlatform} />

      {/* Input Section */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label
              htmlFor="error-description"
              className="block text-lg font-semibold text-gray-900 mb-2"
            >
              Describe Your Error
            </label>
            <p className="text-sm text-gray-600">
              Enter a natural language description - powered by OpenAI GPT-4o-mini
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <History className="h-4 w-4" />
              History
            </button>
          )}
        </div>

        {showHistory && history.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Recent Queries:</h3>
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item)}
                className="w-full text-left px-3 py-2 text-sm bg-white rounded border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 truncate">{item.input}</span>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {item.platform}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <textarea
          id="error-description"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="e.g., Show me all 500 errors from the API service in the last hour"
          className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-y"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd> +{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to convert
          </p>

          <button
            onClick={handleConvert}
            disabled={isLoading || !input.trim()}
            className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Converting with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Convert to Query
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card bg-red-50 border-red-200 animate-fade-in">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900">Error</h3>
              <p className="mt-1 text-sm text-red-800">{error.message}</p>
              {error.code && (
                <p className="mt-1 text-xs text-red-700">Error code: {error.code}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && !error && (
        <QueryResultComponent
          result={result}
          onCopy={() => console.log('Query copied to clipboard')}
        />
      )}

      {/* Examples */}
      {!result && !isLoading && (
        <div className="card bg-gray-50 border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Example Queries:
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Show me all 500 errors from the API service in the last hour</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Find database connection timeout errors from yesterday</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Authentication failures from login endpoint this week</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>All JavaScript exceptions with 404 status code</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
