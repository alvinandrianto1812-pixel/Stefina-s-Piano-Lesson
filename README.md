<p align="center">
  <img src="public/brand/gurunada_final_charcoal-03.png" alt="GuruNada Logo" width="280" />
</p>

<h1 align="center">GuruNada — Private Piano Lesson Platform</h1>

<p align="center">
  A modern, full-stack web application for managing private piano lessons in Jakarta.<br/>
  Built with <strong>React 19</strong>, <strong>Vite</strong>, <strong>Tailwind CSS</strong>, and <strong>Supabase</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/GSAP-Animations-88CE02?logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Three.js-Effects-000000?logo=threedotjs&logoColor=white" alt="Three.js" />
</p>

---

## ✨ Overview

**GuruNada** is a premium web platform designed for a private piano lesson studio in Jakarta. It serves as both a public-facing marketing website and an internal management tool, enabling students to register and submit payments, while admins manage schedules, finances, media, and teacher profiles.

## 🎯 Key Features

### Public Website
- **Landing Page** — Animated hero section with GSAP scroll-triggered reveals, interactive booking card, and feature explorer
- **Our Teachers** — Teacher profiles with 3D tilt effects and scroll-reveal animations
- **Our Services** — Class information with Three.js `MagicRings` background effects
- **Events** — Dynamic event listings fetched from Supabase (published/draft control)
- **Media Gallery** — Photo & video gallery with cinematic lightbox viewer
- **Contact Us** — Contact information with FAQ accordion
- **About Us** — Studio story with animated pillars and flip cards
- **Studio Policy** — Terms and conditions (required before registration)

### Student Portal
- **Authentication** — Email/password + Google OAuth via Supabase Auth
- **Questionnaire** — Multi-step registration form with schedule selection, instrument preference, and payment proof upload
- **Auto WhatsApp** — Automatic WhatsApp message generation to admin after registration

### Admin Dashboard
- **Payment Management** — View, verify, or reject payments with proof viewing (signed URLs for private storage)
- **Event Management** — CRUD operations for events with publish/draft toggle
- **Media Management** — Upload and manage photos/videos to Supabase Storage
- **Teacher Management** — Full teacher profile CRUD with photo upload and sort ordering
- **Finance Module** — Teacher attendance tracking and expense management

### Owner Dashboard
- **Financial Reports** — Monthly P&L view combining verified payments, finance records, and teacher attendance salary calculations
- **Transaction Ledger** — Detailed debit/credit journal

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + Vite 7 |
| **Styling** | Tailwind CSS 3 + Custom CSS (brand system) |
| **Animations** | GSAP (scroll-triggered, timelines) + Three.js (shader-based rings) |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, RLS) |
| **Routing** | React Router DOM 7 |
| **State** | React Context API (AuthProvider) |
| **Smooth Scroll** | Lenis |
| **Notifications** | react-hot-toast |
| **SEO** | react-helmet-async |
| **Icons** | react-icons |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Responsive nav with GSAP mobile menu
│   ├── Footer.jsx       # Site footer
│   ├── MagicRings.jsx   # Three.js animated ring effect
│   ├── ScrollFloat.jsx  # Per-character scroll animation
│   ├── ClickSpark.jsx   # Canvas click sparkle effect
│   ├── BounceIcons.jsx  # Musical note divider animation
│   ├── TypingText.jsx   # Typewriter text effect
│   ├── FeatureExplorer.jsx   # Sticky scroll feature showcase
│   ├── TestimonialSlider.jsx # Touch-enabled testimonial carousel
│   ├── PageHero.jsx     # Shared hero banner
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   ├── AdminRoute.jsx
│   └── OwnerRoute.jsx
├── pages/
│   ├── user/            # Public-facing pages
│   ├── admin/           # Admin dashboard + sections
│   ├── owner/           # Owner financial report
│   ├── Auth.jsx         # Login / Register
│   ├── AuthCallback.jsx # OAuth callback handler
│   ├── Logout.jsx
│   └── NotFound.jsx
├── contexts/
│   ├── AuthProvider.jsx        # Global auth state + role management
│   └── SmoothScrollProvider.jsx # Lenis wrapper
├── hooks/
│   ├── use3DTilt.js     # Mouse-tracking 3D card tilt
│   └── useScrollReveal.js # GSAP ScrollTrigger reveal
├── lib/
│   ├── supabaseClient.js # Supabase init + storage adapter
│   └── waLinks.js        # WhatsApp link constants
├── styles/
│   └── global.css        # Global keyframe animations
├── brand.css             # Brand design system (colors, typography, buttons)
└── index.css             # Tailwind directives + base styles
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Supabase](https://supabase.com) project with the required tables and RLS policies

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Stefina-s-Piano-Lesson.git
cd Stefina-s-Piano-Lesson

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_WA_PHONE=628xxxxxxxxxx
```

> ⚠️ **Never commit `.env` to version control.** The `.gitignore` already excludes it.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview   # Preview the production build locally
```

## 🌐 Deployment (Vercel)

This project deploys seamlessly to **Vercel** (free tier supported):

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects the Vite framework — no configuration needed
5. Add your environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WA_PHONE`
6. Click **Deploy**

> Vite is a build tool, React is the UI framework. Vercel supports both natively.

## 🗄️ Database

The application uses **Supabase** (PostgreSQL) with Row Level Security (RLS). Migration scripts are located in the `/scripts` directory:

| Script | Purpose |
|--------|---------|
| `migration-enforce-payment-amount.sql` | Enforces payment amount validation at database level |

### Key Tables

- `users` — User accounts synced from Supabase Auth
- `questionnaire` — Student registration data
- `payments` — Payment records with proof URLs
- `events` — Studio events (published/draft)
- `media` — Gallery items (photos/videos)
- `teachers` — Teacher profiles
- `presensi_guru` — Teacher attendance tracking
- `finance_records` — Income/outcome/salary records

### Storage Buckets

- `proofs` — Private bucket for payment proof uploads (accessed via signed URLs)
- `media-gallery` — Public bucket for gallery media and teacher photos

## 🎨 Brand System

The project uses a custom brand design system defined in `brand.css`:

| Token | Color | Usage |
|-------|-------|-------|
| `--cream` | `#F8F6ED` | Page backgrounds |
| `--blush` | `#D1A799` | Accent, CTAs |
| `--olive` | `#50553C` | Headings, primary |
| `--brick` | `#683730` | Emphasis, alerts |
| `--charcoal` | `#272925` | Body text, dark UI |

**Typography:** Rockdale FREE (headings) + Creato Display (body)

## 👥 Role-Based Access

| Role | Access |
|------|--------|
| **Guest** | Public pages only |
| **User** | + Questionnaire, payment submission |
| **Admin** | + Dashboard (payments, events, media, teachers, finance) |
| **Owner** | + Financial reports with P&L view |

## 📄 License

ISC

---

<p align="center">
  Built with ♪ for <strong>GuruNada Piano Studio</strong>
</p>
