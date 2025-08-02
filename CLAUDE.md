# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (runs TypeScript compilation + Vite build)
- `pnpm preview` - Preview production build locally

### Code Quality & Linting
- `pnpm lint` - Run Biome linter checks
- `pnpm lint:fix` - Run Biome linter with auto-fix
- `pnpm format` - Format code with Biome
- `pnpm biome:ci` - Run Biome checks for CI (no auto-fix)

### Testing
- `pnpm test` - Run all tests once
- `pnpm test:watch` - Run tests in watch mode

## Project Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: Zustand for client state
- **Data Fetching**: TanStack Query (React Query)
- **Real-time Collaboration**: Liveblocks with Yjs for collaborative editing
- **Code Editor**: Monaco Editor with collaborative features
- **UI Components**: Radix UI primitives with custom styling
- **Form Handling**: React Hook Form with Zod validation
- **Package Manager**: pnpm

### Core Architecture Patterns

#### Component Structure
- **Pages**: Top-level route components in `src/pages/` (PascalCase naming)
- **Layouts**: Layout components like `IdeLayout` manage overall page structure
- **UI Components**: shadcn/ui components in `src/components/ui/` (no linting applied)
- **Feature Components**: Domain-specific components organized by feature area

#### State Management Strategy
- **Zustand Stores**: All located in `src/stores/`
  - `sidebar-store.ts` - Sidebar tab and panel state with persistence
  - `editor-tabs-store.ts` - Editor tab management with persistence
  - `file-tree-store.ts` - File explorer state
  - `project-store.ts` - Project-level state
  - `user-store.ts` - User authentication state
- **TanStack Query**: Server state management for API calls
- **Liveblocks**: Real-time collaboration state (cursors, presence, document sync)

#### API Layer
- **Base Client**: `src/services/api/api-client.ts` - Axios configuration with interceptors
- **API Modules**: Feature-specific API clients (auth, projects, file-system, chat)
- **Proxy Configuration**: Development API requests proxied to `http://15.165.2.193:8080`

#### Real-time Features
- **Collaborative Editing**: Monaco + Yjs integration for multi-user editing
- **Live Cursors**: User presence and cursor tracking via Liveblocks
- **Chat System**: WebSocket-based chat with STOMP protocol
- **File Operations**: Real-time file system synchronization

### Key Implementation Details

#### IDE Layout Structure
The main IDE interface uses a resizable panel layout:
- **TopBar**: Global navigation and project controls
- **Sidebar**: Tabbed interface (files, search, share, etc.) with collapsible panels
- **Editor**: Monaco-based code editor with collaborative features
- **Responsive Design**: Panels can be resized and collapsed

#### Collaborative Editing Flow
1. Liveblocks provides room-based collaboration context
2. Yjs handles operational transformation for conflict-free editing
3. Monaco Editor bindings sync cursor positions and selections
4. User awareness shows active collaborators

#### File Management
- Tree-based file explorer with drag-and-drop support
- Context menus for file operations (create, delete, rename)
- File operations sync across all connected users
- Tab-based editor interface with persistence

## Code Style & Conventions

### File Naming (Enforced by Biome)
- **Components**: `kebab-case` or `PascalCase` (src/components/)
- **Pages**: `PascalCase` (src/pages/)
- **Hooks**: `camelCase` (src/hooks/)
- **General files**: `kebab-case`

### Code Standards
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Imports**: Use `@/` alias for src directory imports
- **Formatting**: 2-space indentation, double quotes, trailing commas (ES5)
- **Line Width**: 100 characters max
- **React**: JSX with automatic runtime, hooks pattern

### Project-Specific Patterns
- **Zustand Stores**: Use devtools and persist middleware
- **API Calls**: Wrap in TanStack Query mutations/queries
- **Components**: Follow shadcn/ui composition patterns
- **Error Handling**: Use React Error Boundaries and toast notifications
- **Form Validation**: Zod schemas with React Hook Form

## Development Workflow

### Branch Strategy
- **Main Branch**: `dev` (use for PRs)
- **Feature Branches**: Use descriptive names with prefixes

### Testing Approach
- **Testing Framework**: Vitest with jsdom environment
- **Test Location**: Co-located with components or in `__tests__` directories
- **Testing Library**: React Testing Library for component tests

### Build Process
1. TypeScript compilation validates types
2. Vite bundles application with optimizations
3. Biome runs linting and formatting checks
4. Husky pre-commit hooks ensure code quality

### Environment Configuration
- **Development**: Uses Vite dev server with API proxy
- **Production**: Builds static assets for deployment
- **API Integration**: Configured for development backend at specified IP