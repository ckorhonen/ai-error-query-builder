import { Database, Server, Search, Activity } from 'lucide-react'
import type { Platform, PlatformConfig } from '../types'
import { clsx } from 'clsx'

const PLATFORMS: Record<Platform, PlatformConfig> = {
  sentry: {
    name: 'Sentry',
    icon: 'Activity',
    description: 'Error tracking and performance monitoring',
    exampleQuery: 'level:error http.status_code:500',
    syntaxHighlight: 'sentry',
  },
  datadog: {
    name: 'Datadog',
    icon: 'Server',
    description: 'Infrastructure and application monitoring',
    exampleQuery: 'status:error service:api',
    syntaxHighlight: 'datadog',
  },
  elasticsearch: {
    name: 'Elasticsearch',
    icon: 'Search',
    description: 'Distributed search and analytics',
    exampleQuery: '{"query": {"match": {"level": "error"}}}',
    syntaxHighlight: 'json',
  },
  splunk: {
    name: 'Splunk',
    icon: 'Database',
    description: 'Log analysis and SIEM platform',
    exampleQuery: 'index=main level=error | stats count by host',
    syntaxHighlight: 'splunk',
  },
}

interface PlatformSelectorProps {
  selected: Platform
  onSelect: (platform: Platform) => void
}

const PlatformIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'Activity':
      return <Activity className="h-6 w-6" />
    case 'Server':
      return <Server className="h-6 w-6" />
    case 'Search':
      return <Search className="h-6 w-6" />
    case 'Database':
      return <Database className="h-6 w-6" />
    default:
      return null
  }
}

export function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Select Target Platform
        </h2>
        <p className="text-sm text-gray-600">
          Choose the monitoring platform for query conversion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(PLATFORMS) as Platform[]).map((platform) => {
          const config = PLATFORMS[platform]
          const isSelected = selected === platform

          return (
            <button
              key={platform}
              onClick={() => onSelect(platform)}
              className={clsx(
                'relative p-4 rounded-lg border-2 transition-all duration-200 text-left',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                isSelected
                  ? 'border-primary-600 bg-primary-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={clsx(
                    'rounded-lg p-2',
                    isSelected
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700'
                  )}
                >
                  <PlatformIcon icon={config.icon} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {config.name}
                    </h3>
                    {isSelected && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {config.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary-200">
                  <p className="text-xs text-gray-600 mb-1">Example query:</p>
                  <code className="text-xs bg-white px-2 py-1 rounded border border-primary-200 text-gray-800 block overflow-x-auto">
                    {config.exampleQuery}
                  </code>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { PLATFORMS }
