# Technical Documentation (Migrated)

## Overview
This application (`gamscholar`) is a Scholarship Finder platform built with Next.js. It features a modern stack using Server Components, Prisma ORM, and PostgreSQL.

## Technology Stack

### Core
-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **Styling**: TailwindCSS v4
-   **Authentication**: NextAuth.js
-   **Database**: PostgreSQL
-   **ORM**: Prisma

## Project Structure
```
scholarship-finder/
├── app/                  # Next.js App Router pages & API
├── components/           # React components
├── lib/                  # Utilities
├── prisma/               # Database schema & migrations
├── public/               # Static assets
└── package.json          # Project configuration
```

## Database Schema (Prisma)
Defined in `prisma/schema.prisma`.
-   **User**: Roles (Student, Donor, Admin).
-   **Scholarship**: Managed by Donors.
-   **Application**: Multi-step application process with persisted state (`stepData`).
-   **ApplicationDocument**: Stores file uploads (Base64 encoded text).

## Configuration
-   **Environment**: `.env` file requires `DATABASE_URL` (PostgreSQL connection string).
-   **Start**: `npm run dev` (starts Next.js dev server).

## Key Features
-   **Role-based Access**: Students apply, Donors create scholarships.
-   **Multi-step Forms**: Applications track progress.
-   **Server Actions**: Backend logic integrated into components/actions.
