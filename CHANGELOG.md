# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Real LLM API integration (OpenAI, Anthropic)
- Query history and favorites
- Dark mode support
- Additional platform integrations
- Query templates

## [1.0.0] - 2025-01-16

### Added - Production Enhancements
- ✅ Comprehensive testing infrastructure with Vitest
- ✅ Test utilities and helpers for component testing
- ✅ Sample test suite for components and utilities
- ✅ Code coverage reporting with @vitest/coverage-v8
- ✅ GitHub Actions workflow for automated testing
- ✅ PWA manifest (site.webmanifest) for progressive web app support
- ✅ SEO-optimized robots.txt for better search engine visibility
- ✅ Enhanced testing scripts (test, test:watch, test:ui, test:coverage)

### Technical Improvements
- Added @testing-library/react and @testing-library/jest-dom
- Configured jsdom for DOM testing environment
- Created test setup with mock utilities for clipboard and matchMedia APIs
- Added Vitest UI for interactive test debugging
- Implemented test structure for all major components
- Enhanced CI/CD with dedicated test workflow

### Project Status
- 🎯 **Production Ready**: Complete MVP with all core features implemented
- ✅ Full TypeScript/React setup with modern tooling
- ✅ Comprehensive testing infrastructure
- ✅ CI/CD pipelines for quality assurance
- ✅ Deployment automation to Vercel
- ✅ Responsive design with proper error handling
- ✅ Complete documentation (README, API, Contributing)

## [0.1.0] - 2024-01-01

### Added
- Initial release
- Support for 4 monitoring platforms (Sentry, Datadog, Elasticsearch, Splunk)
- Natural language to query conversion
- Platform selector with visual feedback
- Query result display with syntax highlighting
- Copy to clipboard functionality
- Input validation and error handling
- Responsive design with Tailwind CSS
- TypeScript support
- ESLint and Prettier configuration
- Comprehensive documentation
- GitHub Actions CI/CD workflows
- Dependabot configuration
- VSCode workspace settings

### Technical Details
- React 18 with TypeScript
- Vite 5 for build tooling
- Tailwind CSS 3 for styling
- Lucide React for icons
- Modern component architecture
- Production-ready error handling

[unreleased]: https://github.com/ckorhonen/ai-error-query-builder/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ckorhonen/ai-error-query-builder/releases/tag/v1.0.0
[0.1.0]: https://github.com/ckorhonen/ai-error-query-builder/releases/tag/v0.1.0
