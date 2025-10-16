# Cloudflare Workers Deployment Guide

This guide walks you through deploying the AI Error Query Builder to Cloudflare Pages with full OpenAI LLM integration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed
2. **npm 9+** or **yarn 1.22+**
3. **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
   - You'll need billing enabled on your OpenAI account
   - Recommended: Set up a spending limit
4. **Cloudflare Account** - [Sign up here](https://dash.cloudflare.com/sign-up) (free tier works fine)
5. **Git** installed on your machine

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/ckorhonen/ai-error-query-builder.git
cd ai-error-query-builder

# Checkout the Cloudflare Workers branch
git checkout cloudflare-workers-migration

# Install dependencies
npm install
```

### 2. Install Wrangler CLI

Wrangler is Cloudflare's CLI tool for managing Workers and Pages:

```bash
# Install globally
npm install -g wrangler

# Or use it via npx (no installation needed)
npx wrangler --version
```

### 3. Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authorize Wrangler with your Cloudflare account.

## Configuration

### 1. Set Up Environment Variables Locally

Create a `.env` file for local development:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**⚠️ Important:** Never commit `.env` to version control!

### 2. Update wrangler.toml (Optional)

Review and customize `wrangler.toml` if needed:

```toml
name = "ai-error-query-builder"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

pages_build_output_dir = "dist"

[build]
command = "npm run build"
```

You can change the `name` to customize your deployment URL.

## Deployment

### Method 1: Automatic Deployment (Recommended)

This method builds and deploys in one command:

```bash
# Build and deploy
npm run cf:deploy
```

The first time you run this, Wrangler will:
1. Ask you to create a new project or use an existing one
2. Prompt for your project name (e.g., `ai-error-query-builder`)
3. Deploy your application

Your app will be available at: `https://YOUR-PROJECT-NAME.pages.dev`

### Method 2: Manual Deployment

If you prefer more control:

```bash
# Build the frontend
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=ai-error-query-builder
```

### Setting Production Secrets

After deployment, you must set your OpenAI API key as a secret:

```bash
# Set OpenAI API key (REQUIRED)
wrangler pages secret put OPENAI_API_KEY
# When prompted, paste your OpenAI API key
```

The secret will be encrypted and available to your Pages Functions.

### Verifying Deployment

Visit your deployment URL and test the application:

1. Go to `https://YOUR-PROJECT-NAME.pages.dev`
2. Select a platform (e.g., Sentry)
3. Enter a test query: "Show me all 500 errors from API"
4. Click "Convert to Query"
5. You should see a real AI-generated query!

## Testing

### Local Testing

Test the full stack locally before deploying:

```bash
# Build the frontend first
npm run build

# Start Cloudflare Pages local development server
npm run pages:dev
```

Visit `http://localhost:8788` to test with the real API functions.

### Testing the API Endpoint Directly

You can test the API endpoint with curl:

```bash
# Local testing
curl -X POST http://localhost:8788/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "naturalLanguage": "Show me all 500 errors from API",
    "platform": "sentry"
  }'

# Production testing (replace with your URL)
curl -X POST https://YOUR-PROJECT-NAME.pages.dev/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "naturalLanguage": "Find database timeout errors",
    "platform": "datadog"
  }'
```

Expected response:

```json
{
  "platform": "sentry",
  "query": "http.status_code:500 transaction:*/api/*",
  "originalInput": "Show me all 500 errors from API",
  "timestamp": 1704067200000
}
```

## Troubleshooting

### Issue: "OPENAI_API_KEY is not configured"

**Solution:** Make sure you've set the secret:

```bash
wrangler pages secret put OPENAI_API_KEY
```

Verify it's set:

```bash
wrangler pages secret list
```

### Issue: "OpenAI API error: 401"

**Cause:** Invalid or expired API key

**Solutions:**
1. Verify your API key at [OpenAI Platform](https://platform.openai.com/api-keys)
2. Ensure billing is enabled on your OpenAI account
3. Re-set the secret with the correct key

### Issue: "OpenAI API error: 429 - Rate limit exceeded"

**Cause:** Too many requests to OpenAI API

**Solutions:**
1. Set up Cloudflare AI Gateway (see Advanced Configuration)
2. Increase your OpenAI rate limits
3. Add retry logic or request queuing

### Issue: Deployment fails with "Build failed"

**Solutions:**
1. Ensure all dependencies are installed: `npm install`
2. Test the build locally: `npm run build`
3. Check build logs for specific errors
4. Ensure Node.js version is 18+

### Issue: CORS errors in production

**Cause:** CORS is already configured in the Functions, but check if you're calling from an unexpected origin

**Solution:** The Functions are configured to allow all origins. If issues persist, check browser console for the specific CORS error.

## Advanced Configuration

### Cloudflare AI Gateway Setup

AI Gateway provides caching, rate limiting, and analytics for your OpenAI API calls, which can significantly reduce costs.

#### 1. Create an AI Gateway

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **AI** → **AI Gateway**
3. Click **Create Gateway**
4. Name it (e.g., `ai-error-query-builder`)
5. Click **Create**

#### 2. Get Your Credentials

After creating the gateway, you'll see:
- **Account ID**: Found in the URL or dashboard
- **Gateway ID**: The name you chose

#### 3. Set Gateway Secrets

```bash
# Set AI Gateway Account ID
wrangler pages secret put AI_GATEWAY_ACCOUNT_ID
# Enter your Cloudflare account ID

# Set AI Gateway ID
wrangler pages secret put AI_GATEWAY_ID
# Enter your gateway name
```

#### 4. Benefits of AI Gateway

- **Caching**: Identical queries are cached, reducing API calls
- **Rate Limiting**: Protect against abuse
- **Analytics**: Track usage, costs, and performance
- **Fallback**: Gracefully handles API failures

### Custom Domain Setup

1. Go to **Cloudflare Dashboard** → **Pages** → **Your Project**
2. Click **Custom Domains**
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `query-builder.yourdomain.com`)
5. Follow the DNS setup instructions
6. Wait for DNS propagation (usually a few minutes)

### Environment-Specific Configuration

You can set different configurations for preview and production:

```bash
# Production secrets
wrangler pages secret put OPENAI_API_KEY --env production

# Preview/development secrets  
wrangler pages secret put OPENAI_API_KEY --env preview
```

### Monitoring and Logs

View logs in real-time:

```bash
# View production logs
wrangler pages deployment tail

# View logs for a specific deployment
wrangler pages deployment tail --deployment-id=DEPLOYMENT_ID
```

Or view logs in the Cloudflare Dashboard:
1. Go to **Pages** → **Your Project**
2. Click on a deployment
3. Click **View logs**

### Performance Optimization

1. **Enable Caching**: AI Gateway caching is automatic
2. **Optimize Prompts**: Shorter prompts = lower costs
3. **Response Caching**: The API includes Cache-Control headers
4. **Edge Caching**: Cloudflare automatically caches at the edge

### Cost Management

Monitor your costs:

1. **OpenAI Dashboard**: [View usage](https://platform.openai.com/usage)
2. **Set Spending Limits**: Configure in OpenAI settings
3. **AI Gateway Analytics**: Track API call costs in Cloudflare Dashboard
4. **Estimated Costs**:
   - GPT-4o-mini: ~$0.0001-0.0002 per query
   - 10,000 queries/month: ~$1-2 USD
   - Cloudflare Pages: Free tier is usually sufficient

### Continuous Deployment

Set up automatic deployments from GitHub:

1. Go to **Cloudflare Dashboard** → **Pages** → **Your Project**
2. Click **Settings** → **Builds & deployments**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Every push to the configured branch will auto-deploy

### Security Best Practices

1. **Never commit secrets**: Use `.gitignore` for `.env`
2. **Use Cloudflare secrets**: Never hardcode API keys
3. **Monitor usage**: Set up alerts in OpenAI dashboard
4. **Rate limiting**: Use AI Gateway to prevent abuse
5. **CORS**: Already configured, but review if needed
6. **Input validation**: Already implemented in the Functions

## Maintenance

### Updating Dependencies

```bash
# Update npm packages
npm update

# Check for outdated packages
npm outdated

# Update specific package
npm install package-name@latest
```

### Redeploying After Changes

```bash
# Method 1: Full redeploy
npm run cf:deploy

# Method 2: Manual
npm run build
wrangler pages deploy dist
```

### Rollback a Deployment

In the Cloudflare Dashboard:
1. Go to **Pages** → **Your Project** → **Deployments**
2. Find a previous successful deployment
3. Click **...** → **Rollback to this deployment**

## Next Steps

After successful deployment:

1. ✅ Test all four platforms (Sentry, Datadog, Elasticsearch, Splunk)
2. ✅ Set up a custom domain
3. ✅ Configure AI Gateway for cost savings
4. ✅ Set up monitoring and alerts
5. ✅ Share with your team!

## Need Help?

- **Documentation**: [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- **Community**: [GitHub Discussions](https://github.com/ckorhonen/ai-error-query-builder/discussions)
- **Issues**: [GitHub Issues](https://github.com/ckorhonen/ai-error-query-builder/issues)
- **Cloudflare Support**: [Community Forum](https://community.cloudflare.com/)

---

**Happy Deploying! 🚀**
