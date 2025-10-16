import { Copy, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import type { QueryResult as QueryResultType } from '../types'
import { clsx } from 'clsx'
import { PLATFORMS } from './PlatformSelector'

interface QueryResultProps {
  result: QueryResultType
  onCopy?: () => void
}

export function QueryResult({ result, onCopy }: QueryResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.query)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const platform = PLATFORMS[result.platform]

  return (
    <div className="card space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {platform.name} Query
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Generated from: &ldquo;{result.originalInput}&rdquo;
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={clsx(
            'inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            copied
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <pre className="code-block">
          <code>{result.query}</code>
        </pre>
      </div>

      <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Usage Tip:</p>
          <p className="mt-1">
            Copy this query and paste it into your {platform.name} search interface.
            Adjust the parameters as needed for your specific use case.
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Generated at {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>
  )
}
