# Agent Configuration

## Commands

- `npm run dev` - Start dev server on port 3000
- `npm run build` - Production build with TypeScript check
- `npm test` - Run all tests with Vitest
- `npm run format` - Format code with Biome
- `npm run lint` - Lint code with Biome
- `npm run check` - Lint and format check with Biome

## Architecture

- Telegram Mini App built with React 19 + TanStack Router + TanStack Query
- Entry: `src/main.tsx`, Root: `src/routes/__root.tsx`
- File-based routing with auto-generated `src/routeTree.gen.ts`
- Web3 integration: Wagmi + ConnectKit + Viem for Ethereum
- State: Zustand for global state management
- Authentication: Custom Telegram auth class in `src/lib/auth.ts`
- API: RESTful backend with Zod validation schemas in `src/lib/constants.ts`

## Code Style

- Use tabs for indentation (Biome config)
- Double quotes for strings
- Path aliases: `@/*` maps to `src/*`
- TypeScript strict mode enabled
- Import organization with Biome
- Zod schemas for type validation (prefix with `zod`)
- Functional components with hooks pattern
- Error handling with try/catch and proper error types
