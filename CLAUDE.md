# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

### Prerequisites
Before running the project, you need to set up accounts and obtain API keys:

1. **Convex** (Backend Database)
   - Create account at https://dashboard.convex.dev
   - Create a new project
   - Copy your deployment URL

2. **Clerk** (Authentication)
   - Create account at https://dashboard.clerk.com
   - Create a new application
   - Copy your Publishable Key

3. **EdgeStore** (Optional - File Uploads)
   - Create account at https://edgestore.dev
   - Create a new project for file storage

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then update `.env` with your actual credentials:

**Important**: Never commit `.env` to version control. The `.env.example` file shows the required variables without secrets.

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3008)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run single file/test (if applicable)
# Currently no test runner configured - add Jest/Vitest as needed
```

## Project Overview

This is a **Next.js 15 Notion clone** with real-time database synchronization, rich text editing, and document hierarchy. It's a full-stack application combining:
- **Frontend**: Next.js with React 19
- **Backend**: Convex (real-time database)
- **Authentication**: Clerk
- **File Storage**: EdgeStore
- **Rich Editing**: BlockNote with code block support

## Architecture

### High-Level Structure

```
src/
├── app/                          # Next.js App Router routes
│   ├── (marketing)/              # Public landing page
│   ├── (main)/                   # Protected app routes (requires auth)
│   │   ├── layout.tsx            # Auth guard via useConvexAuth()
│   │   ├── _components/          # Sidebar, navigation, document list
│   │   └── (routes)/documents/   # Document editor and list
│   ├── (public)/                 # Published/preview pages (no auth)
│   ├── api/edgestore/            # File upload endpoint
│   └── layout.tsx                # Root providers
├── components/                   # Shared components (editor, toolbar, cover, etc.)
├── features/                     # Feature modules
│   ├── documents/                # Document API hooks and mutations
│   ├── search/                   # Search modal & hooks
│   └── settings/                 # Settings modal & hooks
├── hooks/                        # Custom React hooks (useOrigin, useConfirm, etc.)
├── lib/                          # Utilities (EdgeStore provider, etc.)
└── middleware.ts                 # Clerk middleware for auth protection

convex/                           # Backend
├── schema.ts                     # Database schema definition
├── documents.ts                  # Document mutations & queries
├── auth.config.ts                # Clerk integration config
└── _generated/                   # Auto-generated Convex types
```

### Key Integration Points

**Frontend → Convex → Clerk Flow:**
1. User authenticates via Clerk
2. ClerkProvider wraps entire app at root layout
3. ConvexProviderWithClerk passes Clerk tokens to Convex
4. All Convex mutations/queries call `ctx.auth.getUserIdentity()` to verify user
5. Database queries filtered by userId for security

**UI State Management:**
- Zustand stores for modal states (search, settings, cover image)
- Custom hooks wrap Convex mutations with loading/error states
- Real-time synchronization via Convex useQuery subscriptions

## Database Schema

**Documents Table** (`convex/schema.ts`):
```typescript
{
  title: string (optional)
  userId: string                    // Owner from Clerk
  isArchived: boolean               // Soft delete
  parentDocument: ID (optional)     // Hierarchical structure
  content: string (optional)        // BlockNote JSON
  coverImage: string (optional)     // EdgeStore URL
  icon: string (optional)           // Emoji
  isPublished: boolean              // Public sharing
}
```

**Indexes**:
- `by_user`: Optimize queries filtering by userId
- `by_user_parent`: Optimize hierarchical queries (userId + parentDocument)

## Core Features & Implementation

### Document Management
- **Create**: `useCreateDocument` hook → `createDocument` mutation → Inserts with parent reference
- **Update**: `useUpdateDocument` → Updates title, content, cover, icon, publish state
- **Archive**: `useArchiveDocument` → Soft delete with recursive child archival
- **Restore**: `useRestoreDocument` → Restore from trash with parent validation
- **Delete**: `useDeleteDocument` → Permanent deletion (only from trash)
- **Hierarchy**: Documents can have parent IDs, enabling nested structure

### Document Editing
- **Editor**: `src/components/editor.tsx` uses BlockNote library
- **Custom Schema**: Code blocks with syntax highlighting, mentions, file uploads
- **Toolbar**: Icon selection, cover image management, editable title
- **Auto-save**: Updates via `useUpdateDocument` on content changes
- **Theme Support**: Dark/light mode via next-themes

### Publishing & Sharing
- **Publish Toggle**: `src/app/(main)/_components/publish.tsx`
- **Public URL**: `/preview/[documentId]` accessible without auth if `isPublished === true`
- **Preview Mode**: Read-only view of published documents
- **Security**: `getDocumentById` query allows public access only for published, non-archived docs

### Search
- **Modal**: Cmd/Ctrl+K opens search via `src/features/search/components/search-command.tsx`
- **Fuzzy Search**: Uses cmdk library for fast client-side filtering
- **State**: `useSearch` Zustand hook manages modal open/close

### Trash & Deletion
- **Archive**: Soft delete sets `isArchived = true`, document still exists
- **Restore**: Unarchive documents, validates parent not archived
- **Trash UI**: `src/app/(main)/_components/trash-box.tsx` lists archived docs
- **Permanent Delete**: `deleteDocument` mutation removes from database

### Settings
- **Modal**: `src/features/settings/components/settings-modal.tsx`
- **Theme Toggle**: Light/dark/system mode via next-themes
- **State**: `useSettings` Zustand hook

## Key Technologies & Integration Details

### Convex (Backend & Real-Time Sync)
- All data operations go through mutations/queries in `convex/documents.ts`
- `useQuery` hooks automatically subscribe to real-time changes
- Mutations include auth checks: `ctx.auth.getUserIdentity()` validates Clerk token
- Provider initialized in `src/components/convex-client-provider.tsx`

### Clerk (Authentication)
- Config: `convex/auth.config.ts` registers Clerk domain
- Middleware: `src/middleware.ts` validates requests
- Provider: `ClerkProvider` wraps app for client-side auth
- Integration: `ConvexProviderWithClerk` bridges Clerk tokens to Convex
- Guards: Main layout redirects unauthenticated users to home

### EdgeStore (File Uploads)
- Client-side provider in root layout (`src/lib/edgestore.ts`)
- Upload endpoint: `src/app/api/edgestore/[...edgestore]/route.ts`
- Used for cover images and file uploads in editor
- Images configured as remote pattern in `next.config.ts`

### BlockNote Editor
- Dependencies: `@blocknote/react`, `@blocknote/core`, `@blocknote/mantine`, `@blocknote/code-block`
- Rich schema includes code blocks with highlighting, mentions, uploads
- Stored as JSON in `documents.content` field
- Dark/light theme support

## Custom Hooks

### State Management (Zustand)
- `useSearch()` - Search modal open/close
- `useSettings()` - Settings modal state
- `useCoverImageModal()` - Cover image modal with URL tracking

### Convex Operations (Feature Hooks)
Located in `src/features/documents/api/`:
- `useCreateDocument` - Create with callbacks
- `useUpdateDocument` - Update with status tracking
- `useArchiveDocument` - Archive with callbacks
- `useRestoreDocument` - Restore from trash
- `useDeleteDocument` - Permanent delete
- `useRemoveIcon` - Remove emoji
- `useRemoveCoverImage` - Remove cover
- `useGetDocumentById` - Fetch single doc
- `useGetSidebarDocuments` - Fetch hierarchy
- `useGetSearchDocuments` - Fetch all docs
- `useGetTrashContent` - Fetch archived docs

**Hook Pattern**: Wraps Convex mutations/queries with:
```typescript
const { data, error, isLoading, isPending, mutate } = useCustomHook();
// Or: const { data, isLoading } = useQuery(api.documents.getSidebar, args);
```

### Utility Hooks
- `useOrigin()` - Safe window.location.origin (handles SSR)
- `useConfirm()` - Promise-based confirmation dialog
- `useScrollTop()` - Detects if page is scrolled

## Component Organization

**UI Components** (`src/components/ui/`): Radix UI primitives (buttons, dialogs, popovers, etc.)

**Feature Components**:
- Navigation & Sidebar: `src/app/(main)/_components/`
- Document Tree: Recursive `DocumentList` + `Item` components
- Editor UI: Toolbar, Cover, Editor wrapper
- Search: Modal + command palette
- Modals: Settings, Cover image

**Provider Components**:
- `convex-client-provider.tsx` - Clerk + Convex
- `theme-provider.tsx` - next-themes
- `modals.tsx` - Portal for all modals

## Styling & Theme

- **Framework**: Tailwind CSS with custom config
- **Utilities**: clsx for conditional classes, class-variance-authority for variants
- **Theme**: next-themes manages light/dark/system mode
- **Animation**: tailwindcss-animate for transitions
- **Global Styles**: `src/app/globals.css`

## Authentication Flow

1. **Unauthenticated user** visits app
2. Middleware checks Clerk session
3. Redirect to home page with Clerk sign-in modal
4. User signs up/logs in via Clerk
5. Clerk token stored in session
6. Route guard in main layout: `useConvexAuth()` validates
7. If authenticated, user can access `/documents` and create/edit
8. All Convex operations validate userId before executing
9. Published documents bypass auth check (public preview)

## Important Notes

### Security
- **No hardcoded secrets**: Use `.env` for sensitive values (never commit this file)
  - See `.env.example` for required environment variables
- **User isolation**: All queries filtered by userId from Clerk
- **Ownership validation**: Mutations verify user owns document before updating
- **Published documents**: Still validate ownership for editing, but allow public read-only access

### Performance
- Database indexes on `by_user` and `by_user_parent` optimize queries
- Real-time sync minimizes network requests
- Image optimization via Next.js Image component
- Virtualization not yet implemented for large document lists (could improve sidebar performance)

### Data Persistence
- **Soft delete**: Archive rather than delete (recoverable)
- **Permanent delete**: Only from trash, hard removes from database
- **Recursive operations**: Archive/restore cascades to child documents
- **Cover images**: Stored via EdgeStore, URL saved in document

### Common Patterns

**Creating a hook with Convex:**
```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const result = useQuery(api.documents.getSidebar, { parentDocument: undefined });
```

**Calling a mutation with callbacks:**
```typescript
const { mutate } = useCreateDocument();
mutate(
  { title: "New Document" },
  {
    onSuccess: (documentId) => router.push(`/documents/${documentId}`),
    onError: (error) => toast.error(error.message),
  }
);
```

**Using Clerk auth in components:**
```typescript
const { user } = useUser();
const { isAuthenticated } = useConvexAuth();
const { push } = useRouter();

if (!isAuthenticated) {
  push("/"); // Redirect to home
}
```

## File Uploads

- **Implementation**: Single image dropzone in cover component (`src/components/single-image-dropzone.tsx`)
- **Provider**: EdgeStore client initialized in root layout
- **Endpoint**: Next.js API route at `/api/edgestore/[...edgestore]`
- **Usage**: Upload returns URL, stored in document via `updateDocument` mutation
- **Deletion**: `edgestore.publicFiles.delete()` when removing cover

## Development Tips

- **Hot reload**: Changes to files trigger next dev refresh automatically
- **Type safety**: TypeScript strict mode enabled; Convex generates types automatically
- **Convex types**: Auto-generated at `convex/_generated/` after schema changes
- **Testing**: No test runner configured yet—add Jest/Vitest as needed
- **Debugging**: Use browser DevTools; Convex queries/mutations visible in Network tab

## Libraries & Dependencies

### Core Framework
- **Next.js** (15.1.7) - React framework with App Router, API routes, and SSR
- **React** (19.0.0) - UI library with latest hooks and features
- **React DOM** (19.0.0) - DOM rendering for React

### Backend & Database
- **Convex** (1.19.2) - Real-time database with automatic synchronization and mutations
- **@clerk/nextjs** (6.12.0) - Next.js Clerk integration for authentication
- **@clerk/clerk-react** (5.23.0) - React hooks and components for Clerk auth

### Rich Text Editing
- **@blocknote/react** (0.41.1) - React wrapper for BlockNote editor
- **@blocknote/core** (0.41.1) - Core BlockNote editing engine
- **@blocknote/mantine** (0.41.1) - Mantine UI integration for BlockNote
- **@blocknote/code-block** (0.41.1) - Code block plugin with syntax highlighting

### File Storage
- **@edgestore/react** (0.3.3) - Client-side EdgeStore provider for file uploads
- **@edgestore/server** (0.3.3) - Server-side EdgeStore utilities for API routes
- **react-dropzone** (14.3.5) - Drag-and-drop file upload component

### UI Components & Styling
- **@radix-ui/react-avatar** (1.1.3) - Avatar component primitive
- **@radix-ui/react-dialog** (1.1.6) - Dialog/modal component primitive
- **@radix-ui/react-dropdown-menu** (2.1.6) - Dropdown menu component primitive
- **@radix-ui/react-label** (2.1.2) - Label component primitive
- **@radix-ui/react-popover** (1.1.6) - Popover component primitive
- **@radix-ui/react-slot** (1.1.2) - Slot composition utility
- **@radix-ui/react-tooltip** (1.1.8) - Tooltip component primitive
- **Tailwind CSS** (3.4.1) - Utility-first CSS framework
- **tailwindcss-animate** (1.0.7) - Animation utilities for Tailwind CSS
- **tailwind-merge** (3.0.1) - Merge Tailwind CSS classes without conflicts
- **class-variance-authority** (0.7.1) - CSS-in-JS variant composition
- **clsx** (2.1.1) - Conditional CSS class composition utility

### State Management & Forms
- **Zustand** (5.0.3) - Lightweight state management for modals and UI state
- **Zod** (3.24.2) - TypeScript-first schema validation and parsing
- **cmdk** (1.0.4) - Command/search menu component with fuzzy search

### Theme & Utilities
- **next-themes** (0.4.4) - Light/dark/system theme management
- **lucide-react** (0.475.0) - Icon library with 475+ icons
- **emoji-picker-react** (4.12.0) - Emoji picker component for icons
- **react-textarea-autosize** (8.5.7) - Auto-resizing textarea component
- **sonner** (2.0.1) - Toast notification library
- **usehooks-ts** (3.1.1) - Collection of useful React hooks

### Development Tools
- **TypeScript** (5) - Type-safe JavaScript with strict mode
- **ESLint** (9) - Code linting and style checking
- **PostCSS** (8) - CSS transformation tool for Tailwind CSS
- **@types packages** - TypeScript type definitions for Node, React, React DOM
