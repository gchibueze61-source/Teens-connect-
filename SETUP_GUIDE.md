# Development Environment Setup

## Prerequisites

- Node.js v18+
- npm v9+
- Git
- VS Code

## Quick Start

1. Clone repository
2. Run `npm install`
3. Copy `.env.example` to `.env.local`
4. Run `npm run dev`
5. Open http://localhost:5173

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linting
- `npm run format` - Format code
- `npm run type-check` - Check TypeScript
- `npm run test` - Run tests

## Firebase Setup

See FIREBASE_SETUP.md for detailed Firebase configuration.

## Troubleshooting

### Port already in use
```bash
lsof -i :5173
kill -9 <PID>
```

### Dependency issues
```bash
rm -rf node_modules package-lock.json
npm install
```
