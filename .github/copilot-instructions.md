# Copilot Instructions for This Codebase

## Overview
This project is a React + TypeScript web application using Vite and Tailwind CSS. The codebase is organized by feature and domain, with a focus on modular, reusable components and clear separation of concerns.

## Architecture & Structure
- **src/components/**: Contains feature-based subfolders (e.g., `dashboard`, `datasets`, `maps`, `species`, `layout`). Each subfolder groups related UI components.
- **src/pages/**: Top-level route views, each corresponding to a major app section (e.g., `Dashboard.tsx`, `Datasets.tsx`). Pages compose components from `components/`.
- **src/contexts/**: React context providers for cross-cutting concerns (e.g., `AuthContext.tsx`, `NotificationContext.tsx`).
- **Styling**: Uses Tailwind CSS via `index.css` and `tailwind.config.js`. Avoid custom CSS unless necessary.
- **Entry Points**: `main.tsx` (app bootstrap), `App.tsx` (routing/layout shell).

## Developer Workflows
- **Development**: Run `npm run dev` to start the Vite dev server.
- **Build**: Run `npm run build` to create a production build.
- **No explicit test setup**: No test files or scripts are present; add tests if needed following the component structure.
- **Debugging**: Use browser devtools and Vite's fast refresh for UI debugging.

## Patterns & Conventions
- **Component Structure**: Prefer function components with hooks. Co-locate related files (e.g., `DashboardStats.tsx` with `DashboardCharts.tsx`).
- **Props & State**: Use props for parent-child data flow; use React context for global/shared state.
- **Data Flow**: Pages fetch/own data, pass down via props. Components are mostly presentational.
- **File Naming**: Use PascalCase for components, camelCase for variables/functions.
- **No Redux or external state management**: All state is managed via React context or local state.

## Integration & Dependencies
- **Vite**: Handles builds, hot reload, and config (`vite.config.ts`).
- **Tailwind CSS**: Utility-first styling (`tailwind.config.js`, `postcss.config.js`).
- **No backend code**: This repo is frontend-only; any API integration should be handled via fetch/axios in page components.

## Examples
- To add a new feature, create a folder in `src/components/` and a corresponding page in `src/pages/`.
- To add a new context, place it in `src/contexts/` and wrap `App.tsx` as needed.

## Key Files
- `src/App.tsx`, `src/main.tsx`: App entry and routing
- `src/contexts/AuthContext.tsx`: Authentication logic
- `src/components/layout/Sidebar.tsx`: Example of layout composition

---

For questions or unclear patterns, review the structure in `src/` and follow existing conventions. If adding new patterns, document them here.
