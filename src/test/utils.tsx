import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

/**
 * Helper to create mock query results
 */
export function createMockQueryResult(overrides = {}) {
  return {
    platform: 'sentry' as const,
    query: 'level:error',
    originalInput: 'Show me all errors',
    timestamp: Date.now(),
    ...overrides,
  }
}

/**
 * Helper to create mock conversion errors
 */
export function createMockError(overrides = {}) {
  return {
    message: 'Test error message',
    code: 'TEST_ERROR',
    platform: 'sentry' as const,
    ...overrides,
  }
}

// Re-export everything from @testing-library/react
// This fixes the react-refresh/only-export-components warning
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
