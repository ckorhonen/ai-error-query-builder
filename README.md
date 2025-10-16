# 🤖 AI Error Query Builder

A modern, AI-powered tool that converts natural language error descriptions into platform-specific queries for monitoring and observability tools.

![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🎯 Natural Language Processing**: Describe errors in plain English, get optimized queries
- **📦 Multi-Platform Support**: 
  - Sentry (error tracking)
  - Datadog (infrastructure monitoring)
  - Elasticsearch (log analytics)
  - Splunk (SIEM and analytics)
- **🎨 Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **⚡ Real-time Conversion**: Instant query generation with loading states
- **📋 Copy to Clipboard**: One-click copying of generated queries
- **✅ Query Validation**: Automatic validation of generated queries
- **💡 Smart Examples**: Context-aware example queries for each platform

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+ or yarn 1.22+

### Installation

```bash
# Clone the repository
git clone https://github.com/ckorhonen/ai-error-query-builder.git
cd ai-error-query-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 📚 Usage

1. **Select Platform**: Choose your target monitoring platform (Sentry, Datadog, Elasticsearch, or Splunk)
2. **Describe Error**: Enter a natural language description of the error you want to query
3. **Convert**: Click "Convert to Query" or press Cmd/Ctrl + Enter
4. **Copy & Use**: Copy the generated query and use it in your monitoring platform

### Example Queries

- "Show me all 500 errors from the API service"
- "Find database timeout errors in the last 24 hours"
- "Authentication failures from login endpoint"
- "All exceptions with 404 status code"

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript 5.2
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier

## 📝 Project Structure

```
ai-error-query-builder/
├── src/
│   ├── components/
│   │   ├── QueryBuilder.tsx      # Main query builder component
│   │   ├── PlatformSelector.tsx   # Platform selection UI
│   │   └── QueryResult.tsx        # Query result display
│   ├── utils/
│   │   └── queryParser.ts         # Query conversion logic
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── styles/
│   │   └── globals.css            # Global styles and Tailwind
│   ├── App.tsx                    # Root component
│   └── main.tsx                   # Application entry point
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── .eslintrc.cjs                  # ESLint configuration
```

## 🧑‍💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run `npm run lint:fix` and `npm run format` before committing.

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ckorhonen/ai-error-query-builder)

### Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains the production-ready files
# Deploy the dist/ folder to your hosting service
```

### Environment Variables

For production deployment with real LLM integration, add:

```env
VITE_OPENAI_API_KEY=your_api_key_here
VITE_API_ENDPOINT=your_api_endpoint
```

## 🔮 Roadmap

- [ ] Real LLM API integration (OpenAI, Anthropic, etc.)
- [ ] Query history and favorites
- [ ] Advanced query builder with filters
- [ ] Export queries to multiple formats
- [ ] Dark mode support
- [ ] More platform integrations (New Relic, Grafana, etc.)
- [ ] Query templates and snippets
- [ ] Team collaboration features

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

See [API.md](API.md) for detailed documentation on the query conversion API.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Vite](https://vitejs.dev/)

## 💬 Support

For support, please open an issue on [GitHub Issues](https://github.com/ckorhonen/ai-error-query-builder/issues).

---

Made with ❤️ by [Chris Korhonen](https://github.com/ckorhonen)
