# VOLZEN — EV Charging, Anytime

> Airbnb for EV charging. Connect drivers with homeowners who have idle charging stations.

---

## Problem Statement

EV adoption in Vietnam is accelerating, but public charging infrastructure hasn't kept up. Drivers face range anxiety in dense urban areas like Ho Chi Minh City, while thousands of homeowners with private Type 2, CCS, or CHAdeMO chargers sit idle for most of the day. There is no platform that bridges this gap — no way for a driver to discover, book, and navigate to a private charger nearby.

## Solution Overview

VOLZEN is a two-sided marketplace that lets EV drivers find and book private charging slots from homeowner hosts. Drivers open the map, filter by connector type and price, book a time slot, and get turn-by-turn directions to the host's address. Hosts list their station, set availability, and earn passive income. An AI assistant handles support queries so the team doesn't need a support team on day one.

## Features

- **Interactive map** — discover nearby charging stations with live distance sorting
- **Provider profiles** — photos, amenities, connector specs, reviews, and real-time availability
- **Booking flow** — date/time picker, upfront pricing, order confirmation
- **Host dashboard** — manage spots, view bookings, track earnings and analytics
- **Provider onboarding** — guided 3-phase chatbot onboarding with Vietnam business registration form
- **AI support chat** — GPT-powered help assistant at `/help`
- **Light/dark theme** — persisted across sessions

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ |
| Java | 17+ |
| Maven wrapper | included (`./mvnw`) |
| OpenAI API key | for the AI chat feature |

---

## Setup

**1. Clone the repo**

```bash
git clone <repo-url>
cd venus
```

**2. Install frontend dependencies**

```bash
cd frontend
npm install
```

**3. Configure the backend AI key**

Create `server/.env`:

```bash
OPENAI_API_KEY=sk-...
```

No other configuration is required for local development. The backend uses an H2 in-memory database and seeds demo data automatically on startup.

---

## Running Locally

### VS Code Run And Debug

This repo includes checked-in VS Code launch/tasks config under `.vscode/`. After installing frontend dependencies and creating `server/.env`, you can open the Run and Debug panel in VS Code and start:

- `Venus Full Stack` for backend + frontend with the default AI setup
- `Venus Full Stack - OpenAI` for backend + frontend using OpenAI-compatible config

Make sure Java 17+, Node.js 20+, and `OPENAI_API_KEY` in `server/.env` are set up before using the OpenAI debug profile.

**Backend** (runs on port 8080)

```bash
cd server
set -a && source .env && set +a
./mvnw spring-boot:run
```

**Frontend** (runs on port 3000)

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Verify the backend is up:**

```bash
curl http://localhost:8080/api/health
```

**Verify AI is connected:**

```bash
curl http://localhost:8080/api/ai/status
# "status": "Connected" confirms OpenAI is live
```

If the OpenAI key is missing the backend falls back to mock mode — all features work except the `/help` chatbot.

---

## User Guide

### As a Driver

1. **Land on the homepage** → click **Get started** to sign up or **Sign in**
2. **Explore** → the map view shows all nearby stations; click a pin or card to open the provider profile
3. **Book** → choose a date and time slot on the provider detail page, confirm the order
4. **Navigate** → after booking, the route page gives turn-by-turn directions to the charger
5. **Get help** → click **Help** in the nav to chat with the AI assistant

### As a Host

1. **Sign up** and select the **Provider** role
2. Complete the **Provider Onboarding** chatbot (3 phases: business info → station details → Vietnam Biz Reg form)
3. Access the **Host Dashboard** at `/host/spots` to manage your listings
4. View incoming bookings at `/host/bookings` and earnings at `/host/financial`

### H2 Database Console (dev only)

```
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:venus
User:     username
Password: password
```

### Demo Seed Data

The backend seeds demo data on every fresh startup. Key IDs:

| Type | ID |
|---|---|
| Driver | `usr_demo_driver` |
| Vehicle | `veh_demo_vf8` |
| Stations | `pvd_p1`, `pvd_p2`, `pvd_p3` |
| Orders | `ord_demo_confirmed`, `ord_demo_completed_1` |

---

## Tech Stack

### Frontend

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind v4 (CSS-first, no config file) |
| Components | ShadCN/ui |
| Maps | Leaflet (dynamic import, SSR-disabled) |
| Fonts | DM Sans + Instrument Serif (Google Fonts) |
| Theme | CSS custom properties, `data-theme` toggle, localStorage persistence |

### Backend

| | |
|---|---|
| Runtime | Java 17 + Spring Boot |
| API | Spring Web MVC (REST) |
| Database | H2 in-memory (JPA / Hibernate) |
| AI | OpenAI-compatible client; Ollama fallback; mock fallback |
| Build | Maven wrapper (`./mvnw`) |

### Architecture Notes

```
frontend/          Next.js app (App Router)
  app/             Pages and routes
  components/      Shared UI components
  lib/             API helpers and mock data

server/
  src/main/java/com/app/venus/
    modules/       Feature modules (ai, advisor, order, provider, review)
      <module>/
        application/    Services and use cases
        domain/         Domain models
        infrastructure/ Persistence and external clients
        interfaces/     REST controllers and DTOs
    shared/        Cross-cutting: CORS, exception handling, response wrapper
  src/main/resources/
    application.properties
```

Each feature module is self-contained. New modules drop into `modules/<name>` and follow the same four-package layout. Shared utilities live in `shared/` only when genuinely reusable.

**Auth note:** Auth is stubbed for the MVP. All endpoints resolve the current user from a fixed demo identity (`usr_demo_driver`). Production auth would replace `DemoCurrentUserService` with JWT/session principal lookup.
