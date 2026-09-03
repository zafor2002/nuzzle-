# 🐾 Nuzzle — Full-Stack Social & Healthcare Ecosystem for Pets

<div align="center">

**Round 2: Backend & API Integration (Weeks 3–4)**  
*Session 2: Building RESTful APIs & Connecting Frontend to Backend*

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16_REST-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma 7](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Live GitHub Repositories:**  
Frontend Client: [https://github.com/zafor2002/nuzzle-](https://github.com/zafor2002/nuzzle-)  
Backend REST Engine: [https://github.com/zafor2002/nuzzle-backend](https://github.com/zafor2002/nuzzle-backend)

</div>

---

## 📖 Table of Contents

1. [Executive Summary & Project Context](#-executive-summary--project-context)
2. [Full-Stack Architecture Overview](#-full-stack-architecture-overview)
3. [RESTful API Architecture & Principles](#-restful-api-architecture--principles)
4. [Database Schema & Cloud Persistence (Prisma 7 + Supabase)](#-database-schema--cloud-persistence)
5. [Authentication & Security Architecture](#-authentication--security-architecture)
6. [API Endpoints Reference Suite](#-api-endpoints-reference-suite)
7. [Frontend-to-Backend Integration Layer](#-frontend-to-backend-integration-layer)
8. [Fresh Account Lifecycle & First-Visit Auth Gate](#-fresh-account-lifecycle--first-visit-auth-gate)
9. [Environment Variables Reference](#-environment-variables-reference)
10. [Local Development & Execution Guide](#-local-development--execution-guide)
11. [Production Cloud Deployment Guide](#-production-cloud-deployment-guide)
12. [Academic Deliverables & Presentation Deck](#-academic-deliverables--presentation-deck)

---

## 🌟 Executive Summary & Project Context

**Nuzzle** is an AI-powered, mobile-first social and healthcare network uniting pet parents, veterinary clinics, and pet stores. 

This repository and document represent the core deliverables for **Round 2: Backend & API Integration (Weeks 3–4)**, fulfilling **Session 2: Building RESTful APIs & Connecting Frontend to Backend**:
- **Deliverable 1**: Overview of Backend Architecture (REST principles, schema, authentication).
- **Deliverable 2**: API Integration Demo (connecting the Vue.js frontend with live REST endpoints).
- **Deliverable 3**: Lessons Learned & Improvements Made (connection poolers, Google OAuth 2.0, fresh account lifecycle, and production cloud release).

---

## 🏛️ Full-Stack Architecture Overview

Nuzzle implements a decoupled, modern three-tier cloud architecture designed for high throughput, sub-50ms latency, and zero client-server coupling.

```
┌────────────────────────────────────────────────────────────────────────┐
│                         TIER 1: CLIENT APPLICATION                     │
│               Vue 3 (Composition API) • Vite 6 • TypeScript            │
│  • Reactive State (appStore.ts)          • Tactile Pet Reactions (🐾)  │
│  • Typed HTTP Client (apiClient.ts)      • First-Visit Auth Gate       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON (Bearer JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 2: REST API GATEWAY                        │
│               Next.js 16 Route Handlers • Serverless Functions         │
│  • Stateless REST Resource Routes        • Standard JSON Envelopes     │
│  • Zod Input Validation                  • Multi-Role Access Control   │
│  • PawDoctor AI Triage Processor         • CORS & Error Boundaries     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ TCP / Connection Pooling
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  TIER 3: PERSISTENCE & CLOUD SECURITY                  │
│               Prisma 7 ORM • Supabase PostgreSQL • Auth                │
│  • 18 Relational Database Models         • Google OAuth 2.0 Provider   │
│  • Transaction Pooler (Port 6543)        • Session Pooler (Port 5432)  │
│  • PostgreSQL Row Level Security         • Encrypted JWT Sessions      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ RESTful API Architecture & Principles

The backend REST engine strictly adheres to foundational REST architectural constraints:

1. **Stateless Communication**: Every request carries complete authentication context via `Authorization: Bearer <Supabase_JWT>` headers. No session state is held in server memory.
2. **Resource-Oriented URI Design**: All URIs represent intuitive plural noun resources (e.g., `/api/posts`, `/api/lost-found`, `/api/vet/appointments`, `/api/marketplace`).
3. **Standard HTTP Verbs**:
   - `GET`: Safe, idempotent resource retrieval.
   - `POST`: Creation of new entities or action dispatches (e.g., reactions, claims, triage).
   - `PATCH` / `PUT`: Updates to existing resource attributes.
   - `DELETE`: Safe removal of resources.
4. **Standard JSON Envelopes**:
   Every response uses a predictable structure for seamless client consumption:
   ```json
   {
     "success": true,
     "data": { ... },
     "meta": { "count": 18, "page": 1 }
   }
   ```
   On errors:
   ```json
   {
     "success": false,
     "error": "Descriptive error message",
     "statusCode": 400
   }
   ```

---

## 🗄️ Database Schema & Cloud Persistence

The persistent data layer is powered by **Prisma 7** mapping to a managed **Supabase PostgreSQL** cloud cluster.

### 18 Relational Models Synchronized:
- **Identity & Accounts**: `Owner`, `Pet`, `Follow`
- **Social Den Feed**: `Post`, `Comment`, `Like`, `Hashtag`, `HashtagsOnPosts`
- **Ephemeral Media**: `Story`, `StoryView`, `Reel`, `ReelLike`
- **Emergency & Radar**: `LostFoundPost` (with geolocation lat/long coordinates & volunteer claim lock)
- **Clinical & Telemedicine**: `Vet`, `Appointment`, `HealthLog`
- **Boutique & Adoption**: `MarketplaceListing`, `AdoptionListing`
- **Direct Messaging & Activity**: `Message`, `Notification`

### Dual Connection Pooling Strategy:
To solve connection starvation on serverless runtime platforms, Nuzzle implements two distinct Supabase connection strings:
- **Transaction Pooler (Port 6543, `pgbouncer=true`)**: Used for `DATABASE_URL`. Serves all runtime API queries, multiplexing thousands of concurrent client requests over a lean pool of PostgreSQL connections.
- **Session Pooler (Port 5432)**: Used for `DIRECT_URL`. Dedicated exclusively to schema migrations (`prisma db push`) and structural DDL modifications requiring session-level locks.

---

## 🔐 Authentication & Security Architecture

Nuzzle features a production-grade multi-role authentication engine integrated with **Supabase Auth**:

### 1. Three-Role Hierarchy:
- 🐾 **Pet Guardian (`parent`)**: Can register pets, log vaccines, publish social moments, book vet appointments, and broadcast 5-mile lost pet radar alerts.
- 🛍️ **Verified Pet Store (`store`)**: Can publish marketplace items, manage boutique inventory, and display the official Gold Shield verification badge.
- 🏥 **Licensed Vet Clinic (`vet`)**: Manages telemedicine calendar slots, reviews medical histories, and receives PawDoctor clinical emergency triage dispatches.

### 2. Google OAuth 2.0 Integration ("Continue with Google"):
- **One-Click Onboarding**: Users authenticate with their Google accounts in a single click.
- **Auto-Provisioning**: On callback, `/api/auth/me` automatically creates an isolated `Owner` record in PostgreSQL with their real Google name and avatar.
- **Supabase OAuth Return Listener**: `initSupabaseAuthListener()` in `appStore.ts` detects token redirects and switches directly into the Den Feed.

---

## 📡 API Endpoints Reference Suite

| Category | Method | Endpoint URI | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/signup` | Registers email/password in Supabase Auth & creates PostgreSQL Owner. |
| **Auth** | `POST` | `/api/auth/login` | Authenticates credentials and returns Supabase Bearer JWT token. |
| **Auth** | `GET` | `/api/auth/me` | Validates Bearer token & auto-provisions fresh owner record. |
| **Den Feed** | `GET` | `/api/posts` | Returns paginated social moments with category and hashtag filters. |
| **Den Feed** | `POST` | `/api/posts` | Publishes a new moment with pet persona tag and media URLs. |
| **Reactions** | `POST` | `/api/posts/:id/react` | Toggles one of 5 tactile reactions (🐾 Paw, 💜 Nuzzle, 🦴 Treat, 🎾 Ball, 😻 Purr). |
| **Comments** | `POST` | `/api/posts/:id/comments` | Submits threaded comment as either human guardian or pet persona. |
| **Stories** | `GET` | `/api/stories` | Retrieves active 24-hour visual Snuggle Circle story reels. |
| **Radar** | `GET` | `/api/lost-found` | Queries missing/found pets filtered by 5-mile coordinate bounding box. |
| **Radar** | `POST` | `/api/lost-found` | Broadcasts high-priority emergency lost pet push alert. |
| **Rescue** | `POST` | `/api/lost-found/:id/claim` | Locks rescue case to 1 volunteer to prevent duplicate dispatch runs. |
| **Vets** | `GET` | `/api/vet/directory` | Lists accredited veterinary hospitals with ratings and distance radius. |
| **Appointments**| `POST` | `/api/vet/appointments` | Schedules consultation preventing calendar slot collisions. |
| **Marketplace** | `GET` | `/api/marketplace` | Returns products filtered by category (Food, Toys, Beds, Health). |
| **Marketplace** | `POST` | `/api/marketplace` | Verified merchants list authentic products with stock counts. |
| **Adoption** | `GET` | `/api/adoption` | Lists rescue animals with vaccination visas and temperament tags. |
| **PawAI** | `POST` | `/api/pawai/triage` | 24/7 symptom triage engine with bilingual (Bangla/English) analysis. |

---

## 🔗 Frontend-to-Backend Integration Layer

The Vue 3 frontend communicates with the REST API via a clean, decoupled service architecture:

### 1. `apiClient.ts` Core HTTP Client
- Restores Bearer JWT from `localStorage`.
- Automatically attaches `Authorization: Bearer <token>` to outbound requests.
- Unwraps `{ success, data, error }` envelopes and provides typed generic responses.

### 2. Domain Service Modules
Business logic is organized into modular services:
- `authService`: Signup, login, Google OAuth, session retrieval, logout.
- `postService`: Feed pagination, publishing, tactile reactions.
- `vetService`: Hospital directory and slot booking.
- `lostFoundService`: Emergency radar broadcasts and volunteer claim-and-lock.
- `pawAiService`: 24/7 symptom triage dispatches.

### 3. Optimistic UI Updates & Error Rollback
For tactile actions (e.g. reacting with 💜 Nuzzle or claiming a lost pet), the Vue reactive store (`appStore.ts`) increments the UI counter **instantly** (0ms perceived latency). It then sends the asynchronous REST request in the background. If the server fails, the state rolls back automatically and displays an alert toast.

---

## 🌱 Fresh Account Lifecycle & First-Visit Auth Gate

To ensure a true production experience upon launch:

1. **First-Visit Auth Gate**:
   - Fresh visitors with no active session in `localStorage` land directly on the **Sign In / Sign Up / Continue with Google** screen.
   - The navigation bar is hidden until the user signs in.
2. **Account Isolation & Clean Slate**:
   - New users receive an isolated personal profile with **0 followers**, **0 following**, and **0 pre-loaded stranger pets**.
   - Their personal passport displays a clean `+ Add Pet` prompt to register their own companions.
   - Their profile memories grid shows only the photos **they** post, rather than hardcoded mock images.

---

## ⚙️ Environment Variables Reference

### Backend (`Pet Social media/.env` & `.env.local`):
```env
# Database Connection (Transaction Pooler - Port 6543)
DATABASE_URL="postgresql://postgres.knykelyweiuslgfljiir:eVldjiOQoMS9okV7@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Database Connection (Session Pooler - Port 5432 - Schema Migrations)
DIRECT_URL="postgresql://postgres.knykelyweiuslgfljiir:eVldjiOQoMS9okV7@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

# Supabase Cloud Project Credentials (Both Private & Public supported)
SUPABASE_URL="https://knykelyweiuslgfljiir.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Frontend (`forntenduse vue js/.env`):
```env
# Live Backend REST API Endpoint
VITE_API_BASE_URL="http://localhost:3000/api"

# Supabase Auth Credentials
VITE_SUPABASE_URL="https://knykelyweiuslgfljiir.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 💻 Local Development & Execution Guide

### Prerequisites:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Active internet connection for Supabase Cloud PostgreSQL and Auth

### 1. Start the Backend REST API Engine:
```bash
cd "Pet Social media"
npm install
npm run dev
```
The Next.js REST API engine will start on **`http://localhost:3000`**.  
Visiting `http://localhost:3000` opens the **Nuzzle API v2.0 Console & Status Dashboard**.

### 2. Start the Vue.js Frontend Client:
```bash
cd "forntenduse vue js"
npm install
npm run dev
```
The Vue 3 client will start on **`http://localhost:5173`**.

---

## 🚀 Production Cloud Deployment Guide

### Deploying Frontend to Vercel:
1. Import repository `https://github.com/zafor2002/nuzzle-`.
2. Framework Preset: **Vite**.
3. Add Environment Variables:
   - `VITE_API_BASE_URL` = `https://nuzzle-backend.vercel.app/api`
   - `VITE_SUPABASE_URL` = `https://knykelyweiuslgfljiir.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOi...`
4. Deploy!

### Deploying Backend to Vercel:
1. Import repository `https://github.com/zafor2002/nuzzle-backend`.
2. Framework Preset: **Next.js**.
3. Add Environment Variables:
   - `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
4. Deploy!

### Supabase URL Configuration (Production):
In **Supabase Dashboard ➔ Authentication ➔ URL Configuration**:
- **Site URL**: `https://your-frontend-app.vercel.app`
- **Redirect URLs**:
  - `https://your-frontend-app.vercel.app/**`
  - `http://localhost:5173/**`

---

## 📊 Academic Deliverables & Presentation Deck

An automated 16:9 widescreen PowerPoint deck is generated directly from source:

- **Presentation File**: [`Nuzzle_Round2_Backend_API_Presentation.pptx`](./Nuzzle_Round2_Backend_API_Presentation.pptx)
- **Generator Script**: [`forntenduse vue js/scripts/generate_round2_pptx.cjs`](./forntenduse%20vue%20js/scripts/generate_round2_pptx.cjs)
- **Structure**: 10 Slides formatted for a **5-minute pitch per participant**, strictly using **Times New Roman** typography.

To rebuild the presentation at any time:
```bash
cd "forntenduse vue js"
node scripts/generate_round2_pptx.cjs
```

---

<div align="center">

**Nuzzle Full-Stack Engine**  
*Built for Gigalogy Technopreneurship 2026 • Abu Zafor, Nadim Rahman, Rizvi Sarker*

</div>
