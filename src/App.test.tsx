import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders platform selection buttons', () => {
    render(<App />);
    expect(screen.getByText(/sentry/i)).toBeInTheDocument();
    expect(screen.getByText(/datadog/i)).toBeInTheDocument();
    expect(screen.getByText(/elasticsearch/i)).toBeInTheDocument();
    expect(screen.getByText(/splunk/i)).toBeInTheDocument();
  });
});
