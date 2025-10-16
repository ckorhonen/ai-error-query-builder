# API Documentation

## Overview

The AI Error Query Builder API provides functions to convert natural language error descriptions into platform-specific queries.

## Core Functions

### `convertToQuery()`

Converts natural language input to a platform-specific query.

**Signature:**
```typescript
function convertToQuery(
  naturalLanguage: string,
  platform: Platform
): Promise<QueryResult>
```

**Parameters:**
- `naturalLanguage` (string): Natural language description of the error
- `platform` (Platform): Target platform ('sentry' | 'datadog' | 'elasticsearch' | 'splunk')

**Returns:**
```typescript
interface QueryResult {
  platform: Platform
  query: string
  originalInput: string
  timestamp: number
}
```

**Example:**
```typescript
const result = await convertToQuery(
  "Show me all 500 errors from the API service",
  "sentry"
)

console.log(result)
// {
//   platform: "sentry",
//   query: "http.status_code:500 transaction:*/api/*",
//   originalInput: "Show me all 500 errors from the API service",
//   timestamp: 1704067200000
// }
```

**Error Handling:**
Throws an error if:
- Input is empty
- Platform is unsupported
- Conversion fails

### `validateQuery()`

Validates a generated query for a specific platform.

**Signature:**
```typescript
function validateQuery(
  query: string,
  platform: Platform
): ConversionError | null
```

**Parameters:**
- `query` (string): The query to validate
- `platform` (Platform): The target platform

**Returns:**
- `ConversionError | null`: Error object if validation fails, null if valid

```typescript
interface ConversionError {
  message: string
  code?: string
  platform?: Platform
}
```

**Example:**
```typescript
const error = validateQuery(
  '{"invalid": json}',
  'elasticsearch'
)

if (error) {
  console.error(error)
  // {
  //   message: "Invalid JSON syntax for Elasticsearch query",
  //   code: "INVALID_JSON",
  //   platform: "elasticsearch"
  // }
}
```

## Type Definitions

### Platform

Supported monitoring platforms:

```typescript
type Platform = 'sentry' | 'datadog' | 'elasticsearch' | 'splunk'
```

### PlatformConfig

Configuration for each platform:

```typescript
interface PlatformConfig {
  name: string              // Display name
  icon: string             // Icon identifier
  description: string      // Platform description
  exampleQuery: string     // Example query syntax
  syntaxHighlight: string  // Syntax highlighting mode
}
```

### QueryBuilderState

State management for the query builder:

```typescript
interface QueryBuilderState {
  input: string                    // User input
  platform: Platform               // Selected platform
  results: QueryResult[]           // Conversion results
  isLoading: boolean              // Loading state
  error: ConversionError | null   // Error state
}
```

## Query Syntax

### Sentry

Sentry uses a simple key:value syntax:

```
level:error http.status_code:500 transaction:*/api/*
```

**Common patterns:**
- `level:error` - Filter by log level
- `http.status_code:500` - Filter by status code
- `transaction:*/api/*` - Filter by transaction pattern
- `message:*timeout*` - Search in message text

### Datadog

Datadog uses a similar syntax with @ prefix for attributes:

```
status:error @service:api @message:*timeout*
```

**Common patterns:**
- `status:error` - Filter by status
- `service:api` - Filter by service name
- `@message:*text*` - Search in message
- `host:server-01` - Filter by host

### Elasticsearch

Elasticsearch uses JSON-based query DSL:

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "log.level": "error" } },
        { "match": { "http.response.status_code": 500 } }
      ]
    }
  }
}
```

**Common patterns:**
- `match` - Term matching
- `wildcard` - Pattern matching
- `range` - Range queries
- `bool` - Boolean logic

### Splunk

Splunk uses Search Processing Language (SPL):

```
index=main level=error status=500 | stats count by host
```

**Common patterns:**
- `index=main` - Specify index
- `level=error` - Field matching
- `source=*api*` - Source pattern
- `| stats count by field` - Aggregations

## Error Codes

| Code | Description |
|------|-------------|
| `EMPTY_INPUT` | Input string is empty |
| `EMPTY_QUERY` | Generated query is empty |
| `INVALID_JSON` | Invalid JSON syntax (Elasticsearch) |
| `MISSING_INDEX` | Missing index specification (Splunk) |
| `CONVERSION_ERROR` | General conversion failure |
| `UNSUPPORTED_PLATFORM` | Platform not supported |

## Best Practices

### Input Format

**Good examples:**
- "Show me all 500 errors from the API service"
- "Find database timeout errors in the last 24 hours"
- "Authentication failures from login endpoint"

**Avoid:**
- Too vague: "errors"
- Too specific: "error at line 42 in file.ts"
- Query syntax: "status:500" (just use natural language)

### Error Handling

Always wrap API calls in try-catch:

```typescript
try {
  const result = await convertToQuery(input, platform)
  
  // Validate result
  const error = validateQuery(result.query, platform)
  if (error) {
    console.error('Validation failed:', error)
    return
  }
  
  // Use result
  console.log(result.query)
} catch (error) {
  console.error('Conversion failed:', error)
}
```

### Performance

- Queries are processed with a simulated delay (1 second)
- In production, this will call an LLM API
- Consider implementing caching for repeated queries
- Debounce user input to reduce API calls

## Future Enhancements

### Planned Features

1. **Real LLM Integration**
   - OpenAI GPT-4 integration
   - Anthropic Claude support
   - Custom model fine-tuning

2. **Advanced Validation**
   - Syntax checking per platform
   - Query optimization suggestions
   - Performance impact warnings

3. **Query Templates**
   - Pre-built query templates
   - Custom template creation
   - Template sharing

4. **Batch Processing**
   - Convert multiple queries at once
   - Bulk export functionality
   - Query comparison tools

## Support

For API questions or issues:
- Open an issue on [GitHub](https://github.com/ckorhonen/ai-error-query-builder/issues)
- Check existing [discussions](https://github.com/ckorhonen/ai-error-query-builder/discussions)
