# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A digital restaurant menu system in three independent projects under one repo (not a git repo, no workspace tooling — each is run separately):

- **`manu-backend/menu-backend/`** — Laravel 13 REST API (PHP 8.3), the source of truth for menu data. Note the double-nested path: the Laravel app root is `manu-backend/menu-backend/`, not `manu-backend/`.
- **`menu/`** — React 19 + Vite public-facing menu shown to restaurant customers.
- **`menu-admin/`** — React 19 + Vite admin dashboard for managing the menu (categories, subcategories, products, restaurant info).

Both frontends are scaffolded but early-stage: `axios` is installed but no API client/base URL is wired up yet, and most admin pages (`Categories`, `Items`, etc.) are empty stubs. When adding frontend features, you will likely be the one establishing the API integration layer.

## Data model

The backend defines a 4-level hierarchy (see `app/Models/` and `database/migrations/2026_05_20_*`):

```
Restaurant (standalone: name, address, phone, logo, cover_image, instagram, whatsapp)
Category (name, image)
  └─ hasMany Subcategory (category_id, name)
       └─ hasMany Product (subcategory_id, name, description, price, image)
```

Foreign keys cascade on delete/update. `Restaurant` is currently independent of the Category/Product tree.

## API

Routes are in `routes/api.php` — all `apiResource` (full CRUD), no auth guarding the menu resources currently:
`/api/restaurants`, `/api/products`, `/api/categories`, `/api/subcategories`.

Controllers live in `app/Http/Controllers/API/`. Conventions to follow when adding/editing controllers:
- `index`/`show` return the model directly; `store`/`update`/`destroy` return a JSON envelope `{ success, message, data }`.
- Image uploads use `$request->file('image')->store('<resource>', 'public')` and store the returned path on the model. Validate images as `nullable|image|mimes:jpg,jpeg,png,webp|max:2048`.
- `unique` validation on `update` excludes the current id (e.g. `unique:categories,name,$id`).

Sanctum is installed (`/api/user` is the only auth-guarded route) but not yet applied to menu endpoints.

## Commands

### Backend (run from `manu-backend/menu-backend/`)
- `composer run dev` — runs server + queue listener + log tailer (pail) + vite concurrently
- `php artisan serve` — API server only
- `php artisan migrate` / `php artisan migrate:fresh` — apply / rebuild schema
- `php artisan storage:link` — required for served image uploads to resolve
- `composer run test` (clears config then runs `php artisan test`)
- Run a single test: `php artisan test --filter=TestMethodName`
- `./vendor/bin/pint` — format code (Laravel Pint)

Default DB is **SQLite** (`database/database.sqlite`); no external DB needed for local dev.

### Frontends (run from `menu/` or `menu-admin/` — identical scripts)
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run preview` — preview built output

## Frontend notes

- **React 19 with the React Compiler enabled** via `@rolldown/plugin-babel` + `reactCompilerPreset()` in `vite.config.js`. Avoid manual `useMemo`/`useCallback` micro-optimizations the compiler handles; don't write code that breaks the Rules of React.
- `menu` is a single-page layout (`NavBar` / `Home` / `Footer`, no router).
- `menu-admin` uses `react-router-dom` v7 with a `Layout` route wrapping pages via `<Outlet/>`; the sidebar open state is lifted into `Layout` and passed to `NavBar`/`SideBar`.
- Components are paired with a co-located `.css` file (e.g. `NavBar.jsx` + `NavBar.css`).
