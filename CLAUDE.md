# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Package manager: `pnpm`

### Core Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript compilation + Vite build)
- `pnpm preview` - Preview production build

### Code Quality
- `pnpm lint` - Run Biome linter
- `pnpm lint:fix` - Run Biome linter with auto-fix
- `pnpm format` - Format code with Biome
- `pnpm biome:ci` - Run Biome in CI mode

### Testing
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode

## Architecture Overview

This is a collaborative web IDE frontend built with React, TypeScript, and Vite. The application uses real-time collaboration through Liveblocks and Monaco Editor.

### Key Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI components
- **Editor**: Monaco Editor with collaborative editing via Liveblocks + Yjs
- **State Management**: Zustand stores
- **Routing**: React Router v7
- **Form Handling**: React Hook Form + Zod validation
- **Code Quality**: Biome (linting + formatting)

### Project Structure
- `src/components/` - React components organized by feature:
  - `auth/` - Authentication forms and components
  - `ide/` - IDE-specific components (editor, tabs, top bar)
  - `sidebar/` - File explorer and sidebar components
  - `ui/` - Reusable UI components (based on Radix UI)
- `src/pages/` - Route components (Login, SignUp, IDE, etc.)
- `src/stores/` - Zustand state management stores
- `src/hooks/` - Custom React hooks, including collaborative editor hooks
- `src/lib/` - Utility functions and schemas

### Collaborative Editing Architecture
The IDE uses Liveblocks for real-time collaboration:
- `liveblocks.config.ts` - Liveblocks client configuration
- `src/hooks/editor/` - Collaborative editor hooks:
  - `useMonacoBinding.ts` - Binds Monaco Editor to Yjs document
  - `useAwareness.ts` - Manages user presence/cursors
  - `useCollaborativeEditor.ts` - Main collaborative editor logic

### State Management
Uses Zustand stores for different concerns:
- `editor-tabs-store.ts` - Active tabs and editor state
- `file-tree-store.ts` - File explorer state
- `sidebar-store.ts` - Sidebar visibility/state
- `user-store.ts` - User authentication state

### Important Notes
- Uses `@` alias for `src/` imports (configured in vite.config.ts)
- Biome is used instead of ESLint/Prettier for code quality
- All UI components follow Radix UI + Tailwind CSS patterns
- Real-time collaboration requires Liveblocks room context