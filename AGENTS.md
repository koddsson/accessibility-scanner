# AGENTS.md

This file provides guidance for AI agents working with the accessibility-scanner repository.

## Project Overview

**accessibility-scanner** is a TypeScript-based accessibility scanner that implements WCAG 2.0 Level A & AA rules. The project provides a scanner that can detect accessibility issues in web content, following standards from the Axe-core rule set and W3C Accessibility Conformance Testing (ACT) rules.

## Repository Structure

```
accessibility-scanner/
├── src/
│   ├── app.ts              # Main application entry point
│   ├── scanner.ts          # Core scanner implementation
│   ├── logger.ts           # Logging utilities
│   ├── rules/              # Individual accessibility rule implementations
│   └── utils/              # Utility functions
├── tests/                  # Test files
├── scripts/                # Build and utility scripts
├── package.json            # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md              # Project documentation
```

## Development Environment

### Prerequisites
- Node.js (version compatible with package-lock.json)
- npm

### Initial Setup
```bash
npm install
```

## Key Commands

### Build
```bash
npm run build
```
Compiles TypeScript to JavaScript using `tsc`.

### Lint
```bash
npm run lint
```
Runs ESLint on TypeScript files in the `src` directory.

### Format
```bash
npm run format
```
Auto-fixes linting issues using ESLint's `--fix` flag.

### Test
```bash
npm test
```
Runs the formatter and then executes tests using `web-test-runner`.

### Watch Mode
```bash
npm run test:watch
```
Runs tests in watch mode for continuous development.

### Development Server
```bash
npm start
```
Starts the web development server.

### Build README
```bash
npm run build:readme
```
Regenerates the README.md file using the `generate-readme.ts` script.

## Code Structure

### Rules
The `src/rules/` directory contains individual accessibility rule implementations. Each rule is a TypeScript file that:
- Implements a specific WCAG or Axe-core accessibility rule
- Follows a consistent structure for rule checking
- Includes rule metadata (id, description, tags, etc.)

Example rules include:
- `aria-hidden-focus.ts` - Ensures aria-hidden elements don't contain focusable elements
- `button-name.ts` - Ensures buttons have discernible text
- `image-alt.ts` - Ensures images have alternate text
- `label.ts` - Ensures form elements have labels

### Scanner
The core scanner (`src/scanner.ts`) orchestrates the execution of all rules against web content.

### Testing
Tests are located in the `tests/` directory and use:
- `@web/test-runner` for running tests
- `@open-wc/testing` for web component testing utilities
- Playwright for browser automation

## Coding Conventions

### Language & Style
- **Language**: TypeScript
- **Module System**: ES Modules (specified in package.json)
- **Linting**: ESLint with `@koddsson/eslint-config`
- **Formatting**: Automated via `npm run format`

### File Naming
- Use kebab-case for file names (e.g., `aria-hidden-focus.ts`)
- Test files should mirror source file names

### Code Style
- Follow ESLint rules configured in `eslint.config.js`
- Run `npm run format` before committing to ensure code consistency

## Testing Guidelines

### Running Tests
Always run tests before submitting changes:
```bash
npm test
```

### Writing Tests
- Tests should be comprehensive and cover edge cases
- Use the existing test infrastructure with `@web/test-runner`
- Follow patterns from existing test files in the `tests/` directory

### Test Reports
The project uses:
- `verbose-test-reporter.js` for detailed test output
- `@web/test-runner-junit-reporter` for JUnit-style reports

## Common Tasks

### Adding a New Accessibility Rule
1. Create a new TypeScript file in `src/rules/` following the naming convention
2. Implement the rule following patterns from existing rules
3. Add corresponding tests in the `tests/` directory
4. Update the README if necessary using `npm run build:readme`
5. Run `npm test` to ensure all tests pass

### Updating Dependencies
1. Update `package.json`
2. Run `npm install` to update `package-lock.json`
3. Test thoroughly to ensure compatibility

### Modifying Existing Rules
1. Make changes to the relevant file in `src/rules/`
2. Update or add tests as needed
3. Run `npm run lint` and `npm test`
4. Verify the change doesn't break existing functionality

## Build Output

Compiled files are output to the `dist/src/` directory as specified in `package.json`:
- Main export: `./dist/src/scanner.js`
- Rule exports: `./dist/src/rules/*.js`

## Additional Resources

- **ACT Rules**: W3C Accessibility Conformance Testing rules referenced in `testcases.json`
- **Axe Rules**: Deque University rules documented in the README
- **Rules Data**: `rules.json` contains metadata about implemented rules
- **Test Cases**: `testcases.json` contains test scenarios

## Notes for AI Agents

- Always run `npm run format` and `npm test` before committing changes
- The project follows TypeScript strict mode
- Accessibility rules should follow WCAG 2.0 Level A & AA standards
- When adding rules, check `rules.json` and the README for existing implementations
- Test coverage is important - add tests for any new functionality
- The project uses Web Components and requires browser testing via Playwright
