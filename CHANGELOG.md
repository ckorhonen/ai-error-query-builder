# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-16

### 🚀 Major Release - Cloudflare Workers Migration

This is a **breaking change** from v1.0.0. The application now uses real LLM integration via OpenAI and runs on Cloudflare Workers instead of Vercel.

### Added - Real AI Integration 🤖

- ✅ **OpenAI GPT-4o-mini integration** - Real AI-powered query generation
- ✅ **Cloudflare Pages Functions** - Serverless backend API
- ✅ **Cloudflare AI Gateway support** - Optional caching, rate limiting, and analytics
- ✅ Platform-specific system prompts for accurate query generation
- ✅ Comprehensive error handling and validation
- ✅ CORS configuration for production deployment
- ✅ Environment-based configuration (development vs production)

### Infrastructure Changes

- ✅ **Migrated from Vercel to Cloudflare Pages**
  - Replaced `vercel.json` with `wrangler.toml`
  - Removed Vercel-specific configurations
  - Added Cloudflare Pages Functions in `functions/` directory
- ✅ **New API Architecture**
  - `/api/convert` - Convert natural language to queries using OpenAI
  - `/api/validate` - Validate query syntax for each platform
  - Real-time LLM processing on Cloudflare's edge network
- ✅ **Wrangler CLI integration**
  - `npm run pages:dev` - Local development with Functions
  - `npm run pages:deploy` - Deploy to Cloudflare Pages
  - `npm run cf:deploy` - One-command deployment

### Frontend Updates

- ✅ Updated `queryParser.ts` to call real API endpoints
- ✅ Removed mock query generation logic (kept as fallback)
- ✅ Enhanced error handling for API failures
- ✅ Improved loading states and user feedback
- ✅ Added API base URL configuration via environment variables

### Documentation

- ✅ **Comprehensive README update**
  - Cloudflare Workers architecture diagram
  - Step-by-step deployment instructions
  - Cost estimation and optimization tips
  - Security best practices
- ✅ **New CLOUDFLARE_DEPLOYMENT.md guide**
  - Detailed setup walkthrough
  - Troubleshooting section
  - Advanced configuration (AI Gateway, custom domains)
  - Monitoring and logging guidance
- ✅ Updated `.env.example` with Cloudflare-specific variables
- ✅ Updated API documentation with real endpoints

### Dependencies

- ✅ Added `openai` ^4.77.3 - Official OpenAI SDK
- ✅ Added `wrangler` ^3.95.0 - Cloudflare CLI
- ✅ Added `@cloudflare/workers-types` ^4.20241218.0 - TypeScript types
- ✅ Kept all existing frontend dependencies

### Configuration Files

- ✅ `wrangler.toml` - Cloudflare Workers configuration
- ✅ `functions/api/convert.ts` - Main conversion API
- ✅ `functions/api/validate.ts` - Query validation API
- ✅ Updated `.env.example` for Cloudflare deployment
- ✅ Enhanced `.gitignore` for Cloudflare artifacts

### Breaking Changes ⚠️

- **Deployment Target**: No longer deploys to Vercel
  - Must deploy to Cloudflare Pages
  - Requires Cloudflare account and Wrangler CLI
- **Environment Variables**: New required variables
  - `OPENAI_API_KEY` - Required for LLM integration
  - `AI_GATEWAY_ACCOUNT_ID` - Optional, for AI Gateway
  - `AI_GATEWAY_ID` - Optional, for AI Gateway
- **API Endpoints**: Changed from mock to real APIs
  - Requires OpenAI API key with billing enabled
  - API calls will incur costs (minimal, ~$0.0001-0.0002 per query)
- **Build Process**: New deployment workflow
  - Use `npm run cf:deploy` instead of `vercel deploy`
  - Requires Wrangler authentication

### Migration Guide

For users upgrading from v1.0.0:

1. **Get an OpenAI API key**: https://platform.openai.com/api-keys
2. **Install Wrangler**: `npm install -g wrangler`
3. **Login to Cloudflare**: `wrangler login`
4. **Set secrets**: `wrangler pages secret put OPENAI_API_KEY`
5. **Deploy**: `npm run cf:deploy`

See [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) for detailed instructions.

### Performance Improvements

- ⚡ Edge computing with Cloudflare Workers (global low latency)
- 🎯 Smart caching via AI Gateway (reduces API costs and latency)
- 🚀 Static assets served from Cloudflare CDN
- 💾 Optional response caching (5 minutes default)

### Cost Optimization

- **Cloudflare Pages**: Free tier supports most use cases
- **OpenAI API**: ~$1-2 USD for 10,000 queries/month
- **AI Gateway**: Free caching reduces OpenAI costs by ~50%
- **Total**: Estimated $1-3/month for typical usage

### Security Enhancements

- 🔒 API keys stored as encrypted Cloudflare secrets
- 🛡️ No API keys exposed to frontend
- 🔐 CORS properly configured for production
- 📊 Rate limiting available via AI Gateway
- ✅ Input validation and sanitization

### Quality Assurance

- ✅ All existing tests still pass
- ✅ Added integration tests for API endpoints
- ✅ Tested deployment pipeline
- ✅ Verified all four platforms (Sentry, Datadog, Elasticsearch, Splunk)
- ✅ Cross-browser compatibility maintained

## [1.0.0] - 2025-01-16

### Added - Production Enhancements (Vercel Deployment)

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

### Project Status (v1.0.0)

- 🎯 **MVP Complete**: Mock-based query generation
- ✅ Full TypeScript/React setup with modern tooling
- ✅ Comprehensive testing infrastructure
- ✅ CI/CD pipelines for quality assurance
- ✅ Deployment automation to Vercel
- ✅ Responsive design with proper error handling
- ✅ Complete documentation (README, API, Contributing)

## [0.1.0] - 2024-01-01

### Added - Initial Release

- Initial release with mock query generation
- Support for 4 monitoring platforms (Sentry, Datadog, Elasticsearch, Splunk)
- Natural language to query conversion (rule-based)
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

---

## Version History

- **v2.0.0** (Current) - Cloudflare Workers with real OpenAI integration 🚀
- **v1.0.0** - Production-ready MVP on Vercel with mock queries
- **v0.1.0** - Initial release with basic functionality

[unreleased]: https://github.com/ckorhonen/ai-error-query-builder/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/ckorhonen/ai-error-query-builder/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/ckorhonen/ai-error-query-builder/releases/tag/v1.0.0
[0.1.0]: https://github.com/ckorhonen/ai-error-query-builder/releases/tag/v0.1.0
