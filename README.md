# Drone Fleet Monitor

![Project screenshot](/mnt/data/d4601cd7-99e8-4450-a60e-95f2b3f37dd2.png)

A modern **Next.js (App Router) + TypeScript** frontend for monitoring a fleet of drones. This repository contains the source code (app router), UI components, and static assets used in the demo deployed on Vercel.

---

## Table of Contents

* [Demo / Screenshot](#demo--screenshot)
* [Features](#features)
* [Tech stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Getting started (Run locally)](#getting-started-run-locally)
* [Build & Production](#build--production)
* [Environment variables](#environment-variables)
* [Deploying to Vercel](#deploying-to-vercel)
* [Repository layout](#repository-layout)
* [Git hints & common issues](#git-hints--common-issues)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Demo / Screenshot

See the screenshot above for the current UI. The app uses the `app/` directory (Next.js App Router) and static data under `public/` for demo drones.

---

## Features

* Dashboard overview of drone fleet
* Drone detail pages (dynamic route under `app/drone/[id]/`)
* Interactive fleet map component
* Reusable UI components (UI library under `components/ui/`)
* TypeScript-first codebase
* Static demo data in `public/drones-data.json`

---

## Tech stack

* Next.js (App Router)
* React + TypeScript
* pnpm / npm
* Tailwind CSS (likely configured via `postcss.config.mjs`)

---

## Prerequisites

* Node.js (v16+ recommended)
* pnpm (optional but recommended)
* Git

---

## Getting started (Run locally)

1. Clone the repo:

```bash
git clone https://github.com/akjaineverlign/Fleet_monitoring.git
cd Fleet_monitoring
```

2. Install dependencies (recommended: pnpm):

```bash
npm install -f   # if you don't have pnpm installed
pnpm install
```

If you prefer npm or don't want to install pnpm:

```bash
npm install -f
```

3. Run the dev server:

```bash
pnpm dev    # or
npm run dev

```

Open `http://localhost:3000` in your browser.

---

## Build & Production

Build for production and preview the production build locally:

```bash
pnpm build
pnpm start    # or `npm run build` && `npm start` depending on scripts
```

If this is a static export project (not required for Next.js App Router), you can run:

```bash
pnpm export
```

---

## Environment variables

Place sensitive keys in `.env.local` (this repo already has `.gitignore` entries for `.env*`). Example variables you might add:

```
NEXT_PUBLIC_MAP_API_KEY=your_map_key_here
NEXT_PUBLIC_API_BASE=https://api.example.com
```

Access these in the app with `process.env.NEXT_PUBLIC_...`.

---

## Deploying to Vercel

1. Sign in to Vercel and create a new project.
2. Link to your GitHub repository and choose the `main` branch.
3. Vercel auto-detects Next.js — default build command is `pnpm build` (or `npm run build`) and output is handled by Vercel.
4. Add environment variables in the Vercel project settings if needed.

---

## Repository layout

```
app/                # Next.js app router pages + layout
components/         # reusable components and UI primitives
hooks/              # custom React hooks
lib/                # utility helpers
public/             # images, json, static assets (drones-data.json)
styles/             # global CSS
.next/              # Next.js build artifacts (ignored)
package.json
pnpm-lock.yaml
tsconfig.json
next.config.mjs
```

---

