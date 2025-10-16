import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../test/utils'
import { QueryBuilder } from '../QueryBuilder'

// Mock the queryParser module
vi.mock('../../utils/queryParser', () => ({
  convertToQuery: vi.fn().mockResolvedValue({
    platform: 'sentry',
    query: 'level:error',
    originalInput: 'test input',
    timestamp: Date.now(),
  }),
  validateQuery: vi.fn().mockReturnValue(null),
}))

describe('QueryBuilder', () => {
  it('renders the query builder form', () => {
    renderWithProviders(<QueryBuilder />)
    expect(screen.getByLabelText(/Describe Your Error/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Convert to Query/i })).toBeInTheDocument()
  })

  it('shows error when submitting empty input', async () => {
    renderWithProviders(<QueryBuilder />)
    const button = screen.getByRole('button', { name: /Convert to Query/i })
    
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a description/i)).toBeInTheDocument()
    })
  })

  it('disables button when input is empty', () => {
    renderWithProviders(<QueryBuilder />)
    const button = screen.getByRole('button', { name: /Convert to Query/i })
    expect(button).toBeDisabled()
  })

  it('enables button when input is provided', () => {
    renderWithProviders(<QueryBuilder />)
    const textarea = screen.getByPlaceholderText(/Show me all 500 errors/i)
    const button = screen.getByRole('button', { name: /Convert to Query/i })
    
    fireEvent.change(textarea, { target: { value: 'Show errors' } })
    
    expect(button).not.toBeDisabled()
  })

  it('displays example queries', () => {
    renderWithProviders(<QueryBuilder />)
    expect(screen.getByText(/Example Queries:/i)).toBeInTheDocument()
    expect(screen.getByText(/Show me all 500 errors from the API service/i)).toBeInTheDocument()
  })
})
