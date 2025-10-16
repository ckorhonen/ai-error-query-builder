# Testing Guide

This guide covers how to test the AI Error Query Builder locally and in production.

## Table of Contents

- [Local Testing](#local-testing)
- [Frontend Testing](#frontend-testing)
- [API Testing](#api-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Production Testing](#production-testing)
- [Test Scenarios](#test-scenarios)

## Local Testing

### Frontend Development Mode

Test the frontend without the backend:

```bash
# Start Vite dev server
npm run dev
```

Visit `http://localhost:5173`

**Note:** In this mode, the app will try to call `/api/convert` which won't work unless you're also running the Pages Functions server.

### Full Stack Development Mode

Test the complete application with Cloudflare Pages Functions:

```bash
# Step 1: Build the frontend
npm run build

# Step 2: Start Pages dev server
npm run pages:dev
```

Visit `http://localhost:8788`

This runs the complete stack locally:
- ✅ Frontend served from `dist/`
- ✅ API Functions running at `/api/*`
- ✅ Real OpenAI API calls (uses your local `.env`)

### Environment Setup

Create `.env` file:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
AI_GATEWAY_ACCOUNT_ID=your-account-id  # Optional
AI_GATEWAY_ID=your-gateway-id          # Optional
```

## Frontend Testing

### Run Unit Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
src/
├── __tests__/               # Integration tests
├── components/
│   └── __tests__/           # Component tests
└── utils/
    └── __tests__/           # Utility tests
```

### Example Test

```typescript
import { render, screen } from '@testing-library/react'
import { QueryBuilder } from './QueryBuilder'

test('renders query builder', () => {
  render(<QueryBuilder />)
  expect(screen.getByText(/describe your error/i)).toBeInTheDocument()
})
```

## API Testing

### Test Convert Endpoint

#### Using curl

```bash
# Test Sentry conversion
curl -X POST http://localhost:8788/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "naturalLanguage": "Show me all 500 errors from the API service",
    "platform": "sentry"
  }'
```

Expected response:
```json
{
  "platform": "sentry",
  "query": "http.status_code:500 transaction:*/api/*",
  "originalInput": "Show me all 500 errors from the API service",
  "timestamp": 1704067200000
}
```

#### Using HTTPie

```bash
# Install HTTPie
npm install -g httpie

# Test the endpoint
http POST localhost:8788/api/convert \
  naturalLanguage="Find database timeout errors" \
  platform=datadog
```

#### Using Postman

1. Import the API collection (create `postman_collection.json`):

```json
{
  "info": {
    "name": "AI Error Query Builder",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Convert to Sentry Query",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"naturalLanguage\": \"Show me all 500 errors from API\",\n  \"platform\": \"sentry\"\n}"
        },
        "url": {
          "raw": "http://localhost:8788/api/convert",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8788",
          "path": ["api", "convert"]
        }
      }
    }
  ]
}
```

### Test All Platforms

Create a test script `test-api.sh`:

```bash
#!/bin/bash

API_URL="${1:-http://localhost:8788}"

echo "Testing Sentry..."
curl -s -X POST "$API_URL/api/convert" \
  -H "Content-Type: application/json" \
  -d '{"naturalLanguage": "500 errors from API", "platform": "sentry"}' | jq .

echo -e "\nTesting Datadog..."
curl -s -X POST "$API_URL/api/convert" \
  -H "Content-Type: application/json" \
  -d '{"naturalLanguage": "database timeout errors", "platform": "datadog"}' | jq .

echo -e "\nTesting Elasticsearch..."
curl -s -X POST "$API_URL/api/convert" \
  -H "Content-Type: application/json" \
  -d '{"naturalLanguage": "authentication failures", "platform": "elasticsearch"}' | jq .

echo -e "\nTesting Splunk..."
curl -s -X POST "$API_URL/api/convert" \
  -H "Content-Type: application/json" \
  -d '{"naturalLanguage": "memory errors in production", "platform": "splunk"}' | jq .

echo -e "\nAll tests completed!"
```

Run it:
```bash
chmod +x test-api.sh
./test-api.sh
# Or test production:
./test-api.sh https://your-app.pages.dev
```

## End-to-End Testing

### Manual E2E Test Checklist

Test each platform:

#### 1. Sentry Platform

- [ ] Select Sentry from platform selector
- [ ] Enter: "Show me all 500 errors from the API service"
- [ ] Click "Convert to Query"
- [ ] Verify query looks like: `http.status_code:500 transaction:*/api/*`
- [ ] Click copy button
- [ ] Verify success message appears

#### 2. Datadog Platform

- [ ] Select Datadog
- [ ] Enter: "Find database timeout errors in production"
- [ ] Convert
- [ ] Verify query contains: `status:error service:database @message:*timeout*`
- [ ] Test copy functionality

#### 3. Elasticsearch Platform

- [ ] Select Elasticsearch
- [ ] Enter: "Authentication failures from login endpoint"
- [ ] Convert
- [ ] Verify valid JSON query with proper structure
- [ ] Verify `bool` query with `must` clauses
- [ ] Test copy functionality

#### 4. Splunk Platform

- [ ] Select Splunk
- [ ] Enter: "Memory errors in the payment service"
- [ ] Convert
- [ ] Verify query starts with `index=main`
- [ ] Verify includes `| stats` or similar aggregation
- [ ] Test copy functionality

### Edge Cases

Test error handling:

- [ ] Empty input → Shows error "Please enter a description"
- [ ] Very long input (1000+ chars) → Still processes
- [ ] Special characters in input → Handles correctly
- [ ] Non-English input → Works with other languages
- [ ] Invalid platform → Backend rejects with 400 error
- [ ] Network failure → Shows error message
- [ ] OpenAI API failure → Graceful error handling

## Production Testing

### Smoke Test

After deployment, run this quick test:

```bash
# Replace with your production URL
PROD_URL="https://your-app.pages.dev"

# Test the API
curl -X POST "$PROD_URL/api/convert" \
  -H "Content-Type: application/json" \
  -d '{
    "naturalLanguage": "Show me all errors",
    "platform": "sentry"
  }'
```

Expected: 200 OK with valid query response

### Health Check

The app includes a health check endpoint:

```bash
curl https://your-app.pages.dev/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-16T10:00:00.000Z",
  "environment": "production"
}
```

### Load Testing

Use a tool like `k6` or `artillery` for load testing:

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const payload = JSON.stringify({
    naturalLanguage: 'Show me all 500 errors from API',
    platform: 'sentry',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('https://your-app.pages.dev/api/convert', payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has query': (r) => JSON.parse(r.body).query !== undefined,
  });

  sleep(1);
}
```

Run it:
```bash
k6 run load-test.js
```

## Test Scenarios

### Scenario 1: Basic Error Query

**Input:** "Show me all 500 errors"

**Expected Output (Sentry):**
```
http.status_code:500
```

**Expected Output (Datadog):**
```
status:error @http.status_code:500
```

### Scenario 2: Service-Specific Query

**Input:** "Database timeout errors from the payment service"

**Expected Output (Elasticsearch):**
```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "service.name": "payment" } },
        { "wildcard": { "message": "*timeout*" } },
        { "match": { "log.level": "error" } }
      ]
    }
  }
}
```

### Scenario 3: Time-Based Query

**Input:** "Authentication failures in the last hour"

**Expected Output (Splunk):**
```
index=main level=error source=*auth* earliest=-1h | stats count by host
```

### Scenario 4: Complex Query

**Input:** "Show me all memory leak errors from the API service in production environment with high severity"

**Expected Output (Sentry):**
```
level:error message:*memory* transaction:*/api/* environment:production
```

## Monitoring Tests

### Check OpenAI API Usage

Monitor your OpenAI usage:

```bash
# Via OpenAI CLI (install first)
openai api usage.show

# Or check the dashboard
open https://platform.openai.com/usage
```

### Check Cloudflare Analytics

View analytics in Cloudflare Dashboard:
1. Go to Pages → Your Project
2. Click "Analytics"
3. Check:
   - Request count
   - Error rate
   - Response times
   - Bandwidth usage

### AI Gateway Analytics (if configured)

View AI Gateway analytics:
1. Go to AI → AI Gateway in Cloudflare Dashboard
2. Check:
   - API call counts
   - Cache hit rate
   - Cost savings
   - Error rates

## Debugging Tests

### Enable Verbose Logging

In Pages Functions, logs are automatically sent to Cloudflare:

```bash
# View real-time logs
wrangler pages deployment tail
```

### Common Issues

**Issue:** "OPENAI_API_KEY is not configured"
- **Solution:** Set the secret: `wrangler pages secret put OPENAI_API_KEY`

**Issue:** 429 Rate Limit Error
- **Solution:** Enable AI Gateway caching or increase OpenAI rate limits

**Issue:** Timeout Errors
- **Solution:** Check OpenAI API status: https://status.openai.com/

**Issue:** Invalid Query Generated
- **Solution:** Check system prompts in `functions/api/convert.ts`

## Best Practices

1. **Test Locally First**: Always test with `npm run pages:dev` before deploying
2. **Use Test API Keys**: Use a separate OpenAI API key for testing
3. **Monitor Costs**: Check OpenAI usage regularly
4. **Cache Results**: Enable AI Gateway to reduce API calls
5. **Version Control**: Test each deployment before promoting to production
6. **Automated Testing**: Set up GitHub Actions for continuous testing

## Continuous Integration

Example GitHub Actions workflow (`.github/workflows/test.yml`):

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Type check
        run: npm run type-check
```

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/ckorhonen/ai-error-query-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ckorhonen/ai-error-query-builder/discussions)
- **Cloudflare Docs**: [Pages Functions](https://developers.cloudflare.com/pages/functions/)
- **OpenAI Docs**: [API Reference](https://platform.openai.com/docs/api-reference)

---

**Happy Testing! 🧪**
