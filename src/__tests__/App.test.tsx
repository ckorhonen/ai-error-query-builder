import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test/utils'
import App from '../App'

describe('App', () => {
  it('renders the application header', () => {
    renderWithProviders(<App />)
    expect(screen.getByText(/AI Error Query Builder/i)).toBeInTheDocument()
  })

  it('renders the main query builder component', () => {
    renderWithProviders(<App />)
    expect(screen.getByPlaceholderText(/Show me all 500 errors/i)).toBeInTheDocument()
  })

  it('displays the footer with GitHub link', () => {
    renderWithProviders(<App />)
    const githubLink = screen.getByText(/View on GitHub/i)
    expect(githubLink).toBeInTheDocument()
    expect(githubLink.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/ckorhonen/ai-error-query-builder'
    )
  })
})
