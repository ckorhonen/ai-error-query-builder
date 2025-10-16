# 🤖 AI Error Query Builder

> **🌟 Now powered by Cloudflare Workers with real OpenAI LLM integration!**

A modern, AI-powered tool that converts natural language error descriptions into platform-specific queries for monitoring and observability tools. Built with React, TypeScript, and deployed on Cloudflare Pages with real AI capabilities.

![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🤖 Real AI Integration**: Uses OpenAI GPT-4o-mini for intelligent query generation
- **🎯 Natural Language Processing**: Describe errors in plain English, get optimized queries
- **📦 Multi-Platform Support**: 
  - **Sentry** - Error tracking with transaction filters
  - **Datadog** - Infrastructure monitoring with service tags
  - **Elasticsearch** - JSON DSL queries for log analytics
  - **Splunk** - SPL queries for SIEM and analytics
- **⚡ Cloudflare Workers**: Lightning-fast edge computing with global deployment
- **🛡️ AI Gateway**: Optional caching, rate limiting, and analytics via Cloudflare AI Gateway
- **🎨 Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **📋 Copy to Clipboard**: One-click copying of generated queries
- **🔍 Smart Prompts**: Platform-specific system prompts for accurate results

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+ or yarn 1.22+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Cloudflare account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/ckorhonen/ai-error-query-builder.git
cd ai-error-query-builder

# Checkout the Cloudflare Workers branch
git checkout cloudflare-workers-migration

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start development server (frontend only)
npm run dev

# For full stack development with Cloudflare Pages Functions
npm run build
npm run pages:dev
```

The app will be available at `http://localhost:5173` (dev) or `http://localhost:8788` (Pages dev)

## 📚 Usage

1. **Select Platform**: Choose your target monitoring platform (Sentry, Datadog, Elasticsearch, or Splunk)
2. **Describe Error**: Enter a natural language description of the error you want to query
3. **Convert**: Click "Convert to Query" or press `Cmd/Ctrl + Enter`
4. **Copy & Use**: Copy the generated query and use it in your monitoring platform

### Example Queries

- "Show me all 500 errors from the API service in the last hour"
- "Find database timeout errors in production environment"
- "Authentication failures from the login endpoint"
- "All exceptions with 404 status code from mobile clients"
- "Memory errors in the payment service"

## 🌐 Deployment to Cloudflare

### Step 1: Set Up Cloudflare

1. Create a [Cloudflare account](https://dash.cloudflare.com/sign-up) if you don't have one
2. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
3. Login to Cloudflare:
   ```bash
   wrangler login
   ```

### Step 2: Configure Environment Variables

Set your OpenAI API key as a secret:

```bash
# For Cloudflare Pages
wrangler pages secret put OPENAI_API_KEY
# Enter your OpenAI API key when prompted
```

**(Optional) Configure Cloudflare AI Gateway** for caching, rate limiting, and analytics:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → AI → AI Gateway
2. Create a new gateway (e.g., "ai-error-query-builder")
3. Note your Account ID and Gateway ID
4. Add these as secrets:
   ```bash
   wrangler pages secret put AI_GATEWAY_ACCOUNT_ID
   wrangler pages secret put AI_GATEWAY_ID
   ```

### Step 3: Deploy

```bash
# Build and deploy to Cloudflare Pages
npm run cf:deploy

# Or deploy manually
npm run build
wrangler pages deploy dist --project-name=ai-error-query-builder
```

Your app will be live at: `https://ai-error-query-builder.pages.dev`

### Step 4: Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Pages → Your Project → Custom Domains
2. Add your custom domain
3. Update DNS settings as instructed

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                         │
│              (React + TypeScript + Vite)             │
│                  Tailwind CSS                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓ API Request (/api/convert)
┌──────────────────────────────────────────────────────┐
│           Cloudflare Pages Functions                 │
│            (Edge Computing)                          │
└──────────────────┬───────────────────────────────────┘
                   │
                   ↓ (Optional)
┌──────────────────────────────────────────────────────┐
│         Cloudflare AI Gateway                        │
│      (Caching, Rate Limiting, Analytics)             │
└──────────────────┬───────────────────────────────────┘
                   │
                   ↓ OpenAI API Request
┌──────────────────────────────────────────────────────┐
│              OpenAI GPT-4o-mini                      │
│       (Query Generation)                             │
└──────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

**Frontend:**
- React 18.3
- TypeScript 5.6
- Vite 5.4
- Tailwind CSS 3.4
- Lucide React (icons)

**Backend:**
- Cloudflare Pages Functions
- OpenAI API (GPT-4o-mini)
- Cloudflare AI Gateway (optional)

**Development Tools:**
- Wrangler 3.95
- ESLint + Prettier
- Vitest (testing)

## 📁 Project Structure

```
ai-error-query-builder/
├── src/                           # Frontend source code
│   ├── components/
│   │   ├── QueryBuilder.tsx       # Main query builder
│   │   ├── PlatformSelector.tsx   # Platform selection
│   │   └── QueryResult.tsx        # Result display
│   ├── utils/
│   │   └── queryParser.ts         # API client
│   ├── types/
│   │   └── index.ts               # Type definitions
│   └── styles/
│       └── globals.css            # Global styles
├── functions/                     # Cloudflare Pages Functions
│   └── api/
│       ├── convert.ts             # Main conversion endpoint
│       └── validate.ts            # Query validation
├── public/                        # Static assets
├── wrangler.toml                  # Cloudflare configuration
├── package.json
└── README.md
```

## 🧑‍💻 Development

### Available Scripts

```bash
# Frontend development
npm run dev                    # Start Vite dev server
npm run build                  # Build frontend
npm run preview                # Preview production build

# Cloudflare development
npm run pages:dev              # Test with Cloudflare Pages locally
npm run pages:deploy           # Deploy to Cloudflare Pages
npm run cf:login               # Login to Cloudflare
npm run cf:deploy              # Full deployment

# Code quality
npm run lint                   # Run ESLint
npm run lint:fix               # Fix linting issues
npm run format                 # Format code with Prettier
npm run type-check             # TypeScript type checking

# Testing
npm run test                   # Run tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
```

### Environment Variables

Create a `.env` file (never commit this):

```env
# Required
OPENAI_API_KEY=sk-proj-...

# Optional (for AI Gateway)
AI_GATEWAY_ACCOUNT_ID=your-account-id
AI_GATEWAY_ID=your-gateway-id

# Frontend config
VITE_APP_NAME=AI Error Query Builder
VITE_APP_VERSION=2.0.0
VITE_API_BASE_URL=/api
```

## 🔐 Security Notes

- **Never commit** your OpenAI API key to version control
- API keys are stored as Cloudflare secrets and not exposed to the frontend
- CORS is configured for security in production
- API requests are rate-limited via Cloudflare AI Gateway (if configured)

## 🎯 Platform Query Examples

### Sentry
```
http.status_code:500 transaction:*/api/* environment:production
```

### Datadog
```
status:error service:api @http.status_code:500 env:production
```

### Elasticsearch
```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "http.response.status_code": 500 } },
        { "match": { "service.name": "api" } }
      ]
    }
  }
}
```

### Splunk
```
index=main status=500 source=*api* | stats count by host, source
```

## 🔮 Roadmap

- [x] Real LLM API integration with OpenAI
- [x] Cloudflare Workers deployment
- [x] Cloudflare AI Gateway integration
- [ ] D1 Database for query history
- [ ] Advanced query builder with filters
- [ ] Query templates and favorites
- [ ] Dark mode support
- [ ] More platform integrations (New Relic, Grafana, etc.)
- [ ] Export queries to multiple formats
- [ ] Team collaboration features
- [ ] Query analytics and insights

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

See [API.md](API.md) for detailed documentation on the query conversion API.

## 💰 Cost Estimation

**Cloudflare Pages:**
- Free tier: 500 builds/month, unlimited requests
- Pro: $20/month for additional builds and features

**OpenAI API (GPT-4o-mini):**
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens
- Average query: ~$0.0001-0.0002 per conversion

**Cloudflare AI Gateway (Optional):**
- Free tier available
- Provides caching which reduces OpenAI costs

**Estimated costs for 10,000 queries/month:** ~$1-2 USD

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Cloudflare Workers](https://workers.cloudflare.com/)
- AI by [OpenAI](https://openai.com/)

## 📞 Support

For support, please:
- Open an issue on [GitHub Issues](https://github.com/ckorhonen/ai-error-query-builder/issues)
- Join our [Discussions](https://github.com/ckorhonen/ai-error-query-builder/discussions)

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Contributing code

---

**Made with ❤️ by [Chris Korhonen](https://github.com/ckorhonen)**

**Now running on Cloudflare Workers with real AI! 🚀**
