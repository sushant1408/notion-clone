# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

```bash
# Development server (runs on http://localhost:3008)
npm run dev

# Build for production
npm build

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
- **No hardcoded secrets**: Check `.env.local` for Clerk publishable key and Convex deployment URL
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

## Future Enhancements

Potential improvements based on current architecture:
- Add collaboration features (multi-user editing)
- Implement document versioning/history
- Add templates for new documents
- Implement virtual scrolling for large document lists
- Add full-text search in Convex
- Implement comments/annotations
- Add keyboard shortcuts modal
- Optimize editor performance for large documents
