<p align="center">
  <img src="public/banner.jpg" alt="Zoo Explorer AI Banner" width="100%" />
</p>

# 🦁 Zoo Explorer AI — Discover Wildlife with AI

<p align="center">
  <strong>A modern, mobile-first zoo companion web application powered by AI animal vision recognition, voice-assisted interactive naturalists, smart ticketing, and interactive zone mapping.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-blue?logo=react&style=for-the-badge" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite&style=for-the-badge" alt="Vite" />
  <img src="https://img.shields.io/badge/TanStack_Router-1.168-FF4154?logo=tanstack&style=for-the-badge" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&style=for-the-badge" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Architecture & Workflow](#-system-architecture--workflow)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#1-clone--install-dependencies)
  - [Environment Configuration](#2-environment-setup)
  - [Backend Setup (Bring Your Own Backend)](#3-backend-setup)
  - [Running the App](#4-run-development-server)
- [Security & Privacy](#-security--privacy)
- [License](#-license)

---

## 🌿 Overview

**Zoo Explorer AI** transforms the traditional zoo experience into an engaging, educational, and tech-driven adventure. Designed from the ground up with a nature-inspired design language and high-performance full-stack React 19 architecture, it empowers zoo visitors to:

1. **Snap or Upload** pictures of animals to instantly identify species, diets, conservation statuses, and fun trivia.
2. **Talk to a Naturalist AI** in real-time with full two-way voice recognition and speech synthesis.
3. **Navigate the Zoo Grounds** with an interactive coordinate-mapped aerial map.
4. **Book Tickets Online** with instant price calculation and validation.
5. **Collect Wildlife Moments** into favorites and personal scan journals.

---

## 📊 System Architecture & Workflow

```mermaid
flowchart TD
    subgraph Client["📱 Frontend (React 19 + TanStack)"]
        UI[Zoo Explorer UI]
        Cam[Camera / Upload]
        Voice[Web Speech API STT/TTS]
        Map[Interactive Zoo Map]
        Ticket[Ticket Booking Engine]
    end

    subgraph AuthSecurity["🛡️ Security Layer"]
        EnvCheck[Environment Variables Validation]
        AuthGate[Auth Session Gate]
    end

    subgraph Backend["☁️ Backend / Server Functions"]
        ServerFn[TanStack Server Functions]
        EdgeFn[Vision & Naturalist Edge Service]
    end

    subgraph AI["🧠 AI Inference Engine"]
        VisionAI[Multimodal Vision Model]
        NaturalistAI[Context-Aware Naturalist Assistant]
    end

    subgraph DB["🗄️ Database & Storage"]
        UserDB[(Profiles & Favorites)]
        ScanDB[(Scan History & Thumbnails)]
        TicketDB[(Ticket Bookings)]
    end

    UI --> Cam --> EnvCheck
    Cam --> EdgeFn --> VisionAI
    VisionAI --> EdgeFn --> UI
    UI <--> Voice <--> NaturalistAI
    Map --> UI
    Ticket --> ServerFn --> TicketDB
    AuthGate <--> UserDB
    EdgeFn --> ScanDB
```

---

## ✨ Core Features

| Feature | Description | Highlight |
| :--- | :--- | :--- |
| 📷 **AI Vision Recognition** | Identify wild animals, birds, reptiles, and aquatic species instantly from camera capture or image uploads. | High-precision species classification & conservation metadata |
| 🎙️ **Voice Naturalist AI** | Interactive two-way voice assistant (Speech-to-Text & Text-to-Speech) to ask natural questions about any animal. | Hands-free audio learning experience |
| 🗺️ **Interactive Zone Map** | Aerial zoo map with interactive pins navigating straight to curated zones (Wild Zone, Aviary, Aquarium, etc.). | Zone-based discoverability |
| 🎟️ **Ticketing System** | Full booking workflow supporting Adult, Student, Child, Senior, and Family packages with date selection. | Real-time pricing & ticket records |
| ❤️ **Favorites & Scan History** | Save favorite creatures and review past scans with lightweight auto-compressed thumbnails. | Offline-ready local & cloud sync |
| 📱 **PWA & Mobile First** | Installable Progressive Web App with offline caching, smooth mobile gestures, and responsive layouts. | Works seamlessly on phones & tablets |

---

## 🛠️ Tech Stack

- **Core Framework**: [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **Bundler & Tooling**: [Vite 7](https://vitejs.dev/) + TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with native OKLCH theme tokens and CSS variables
- **Components & Primitives**: [Radix UI](https://www.radix-ui.com/) accessible primitives + Lucide Icons
- **Voice Capabilities**: Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Notifications**: Sonner Toasts
- **Data Layer**: Clean decoupled architecture ready for Supabase or any custom REST/GraphQL backend

---

## 📁 Project Structure

```text
zoo-explorer-ai/
├── public/                     # Static assets, PWA icons, manifest & banners
│   ├── banner.jpg              # Full-size header banner
│   ├── manifest.webmanifest    # PWA configuration
│   └── ...
├── src/
│   ├── assets/                 # Wildlife imagery, category visuals, and app branding
│   ├── components/             # Reusable UI widgets & feature components
│   │   ├── ui/                 # Radix UI design system primitives (Button, Card, Dialog...)
│   │   ├── AiChatPanel.tsx     # Voice-enabled Naturalist Q&A conversation panel
│   │   ├── ProfileMenu.tsx     # Visitor account & quick navigation menu
│   │   ├── ScanFooter.tsx      # Sticky mobile navigation bar (Capture, Scan, Upload)
│   │   └── SplashScreen.tsx    # Branded introductory splash screen
│   ├── hooks/                  # Custom React hooks (useAuth, use-mobile)
│   ├── integrations/           # Backend adapters (Supabase client & middleware)
│   ├── lib/                    # Domain logic & utility libraries
│   │   ├── animals.ts          # Static animal categories & facts catalog
│   │   ├── recognize.ts        # AI recognition client and prompt contracts
│   │   ├── ticketPricing.ts    # Pricing matrix & calculation algorithms
│   │   └── voice.ts            # Web Speech API helpers (STT & TTS)
│   ├── routes/                 # File-based routes (TanStack Router)
│   │   ├── __root.tsx          # App shell, navigation header, and providers
│   │   ├── index.tsx           # Home page with hero, categories & quick cards
│   │   ├── scan.tsx            # AI scanner, results overview & Q&A interface
│   │   ├── animal.$slug.tsx    # Comprehensive animal profile & deeper insights
│   │   ├── category.$slug.tsx  # Categorized animal gallery
│   │   ├── map.tsx             # Interactive zoo grounds map with zone pins
│   │   ├── tickets.tsx         # Booking form & pass confirmation history
│   │   ├── favorites.tsx       # Bookmarked animals list
│   │   └── history.tsx         # Recent scan journal
│   ├── server/                 # Server functions (tickets.functions.ts)
│   └── styles.css              # Tailwind v4 styles, custom gradients & tokens
├── .env.example                # Template for environment configuration
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript compiler rules
└── vite.config.ts              # Vite build configuration
```

---

## 🚀 Getting Started

Follow these steps to set up and run Zoo Explorer AI locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (version **18.x** or higher, recommended **20+**)
- `npm`, `pnpm`, or `bun` package manager

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/dipzz0/Zoo-Explorer-AI.git
cd Zoo-Explorer-AI
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory by copying the sample template:

```bash
cp .env.example .env
```

Open `.env` and fill in your backend credentials:

```env
# Backend / Database Configuration (e.g. Supabase)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-publishable-key"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-publishable-key"
```

### 3. Backend Setup

This frontend is designed to be completely **backend-agnostic**. You can connect it to your own **Supabase** instance or custom backend service:

<details>
<summary><strong>Click to view required database tables schema (SQL)</strong></summary>

```sql
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  created_at timestamptz not null default now()
);

-- User Favorites
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  animal_name text not null,
  category text,
  image_url text,
  created_at timestamptz not null default now(),
  unique(user_id, animal_name)
);

-- Scan History
create table public.scan_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text,
  summary text,
  image_data text,
  created_at timestamptz not null default now()
);

-- Ticket Bookings
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  visit_date date not null,
  visitors integer not null check (visitors > 0),
  total_amount numeric not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);
```

</details>

### 4. Run Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to start exploring!

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## 🔒 Security & Privacy

- **Zero Credentials Policy**: No API keys, secret tokens, private keys, or production database credentials are committed to this repository.
- **Environment Isolation**: All configuration values are loaded securely through `.env` files which are strictly excluded via `.gitignore`.
- **Client-Side Data Safeguards**: Images scanned by users are compressed into lightweight client thumbnails to minimize network bandwidth and storage footprints.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and build upon it.

<p align="center">
  Made with 🌿 for wildlife lovers & nature explorers everywhere.
</p>
