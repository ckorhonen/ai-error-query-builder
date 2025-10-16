# Contributing to AI Error Query Builder

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 👋 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- A GitHub account

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-error-query-builder.git
   cd ai-error-query-builder
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ckorhonen/ai-error-query-builder.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Guidelines

### Code Style

We use ESLint and Prettier to maintain code quality:

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### TypeScript

- Always use TypeScript for new files
- Define proper types and interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

**Good:**
```typescript
interface UserProps {
  name: string
  age: number
}

function greetUser({ name, age }: UserProps): string {
  return `Hello ${name}, you are ${age} years old`
}
```

**Avoid:**
```typescript
function greetUser(user: any) {
  return `Hello ${user.name}`
}
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use proper prop types

**Component Structure:**
```typescript
import { useState } from 'react'
import type { ComponentProps } from './types'

interface MyComponentProps {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState(false)

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Click me</button>
    </div>
  )
}
```

### File Naming

- React components: `PascalCase.tsx` (e.g., `QueryBuilder.tsx`)
- Utilities: `camelCase.ts` (e.g., `queryParser.ts`)
- Types: `index.ts` in a types folder
- Styles: `globals.css`, `component.module.css`

### Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(query-builder): add support for Grafana queries

fix(platform-selector): resolve platform switching bug

docs(readme): update installation instructions
```

## 🛠️ Development Workflow

### Making Changes

1. **Sync with upstream**
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow the code style guidelines
   - Add tests if applicable

4. **Test your changes**
   ```bash
   npm run dev
   npm run lint
   npm run type-check
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template

### Pull Request Guidelines

**Before submitting:**
- [ ] Code follows the style guidelines
- [ ] Tests pass (when applicable)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

**PR Description should include:**
- What changes were made and why
- Screenshots for UI changes
- Links to related issues
- Breaking changes (if any)

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All checks pass

## Screenshots (if applicable)

## Related Issues
Fixes #123
```

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the issue already exists
2. Update to the latest version
3. Try to reproduce the issue

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g., macOS 14.0]
 - Browser: [e.g., Chrome 120]
 - Version: [e.g., 0.1.0]

**Additional context**
Any other relevant information.
```

## ✨ Feature Requests

### Before Requesting

1. Check if the feature already exists
2. Search existing feature requests
3. Consider if it fits the project scope

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Describe the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information.
```

## 📝 Documentation

Documentation improvements are always welcome!

**Areas to contribute:**
- README improvements
- API documentation
- Code comments
- Examples and tutorials
- FAQ section

## ❓ Questions

If you have questions:
1. Check the [README](README.md)
2. Check the [API documentation](API.md)
3. Search [existing discussions](https://github.com/ckorhonen/ai-error-query-builder/discussions)
4. Create a new discussion if needed

## 🚀 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes (backwards compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] Git tag created
- [ ] Release notes written

## 👥 Community

### Code of Conduct

Be respectful, inclusive, and professional:
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community

### Recognition

All contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation

## 💬 Getting Help

If you need help:
- Open a [discussion](https://github.com/ckorhonen/ai-error-query-builder/discussions)
- Ask in the comments of related issues
- Reach out to maintainers

## 🚀 What to Contribute

### Good First Issues

Look for issues labeled:
- `good first issue`
- `help wanted`
- `documentation`

### Priority Areas

1. **Platform Support**
   - Add new monitoring platforms
   - Improve existing platform queries

2. **UI/UX**
   - Improve responsive design
   - Add dark mode
   - Enhance accessibility

3. **Features**
   - Query history
   - Templates and snippets
   - Export functionality

4. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

5. **Documentation**
   - Examples and tutorials
   - Video walkthroughs
   - API documentation

## 🙏 Thank You

Thank you for contributing to AI Error Query Builder! Your efforts help make this tool better for everyone.

---

Questions? Open an issue or discussion on GitHub!
