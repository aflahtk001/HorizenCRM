# Horizen CRM

A production-ready, mobile-first CRM for web development agencies to manage cold calls, follow-ups, and client discussions.

## Features

- 📱 **Mobile-first design** — optimized for one-handed use while making calls
- 📞 **Call tracking** — record every cold call with status, remarks, and follow-up dates
- 📅 **Follow-up calendar** — visual calendar with color-coded overdue/today/upcoming
- 📊 **Statistics dashboard** — 12 animated stat cards with team analytics
- 🔍 **Instant search** — debounced global search across all fields
- 🏷 **Advanced filters** — filter by status, date, user, website discussed
- 🌙 **Dark mode** — premium dark-first design with light mode toggle
- 💬 **WhatsApp & Call integration** — one-tap calling from any card

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** with custom design system
- **MongoDB Atlas** + **Mongoose**
- **Framer Motion** animations
- **React Hook Form** + **Zod** validation
- **Lucide React** icons
- **React Hot Toast** notifications

## Getting Started

### 1. Clone & Install

```bash
npm install
```

### 2. Configure MongoDB

Create `.env.local` and add your MongoDB Atlas URI:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/horizen-crm?retryWrites=true&w=majority
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
horizen-crm/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (calls, stats)
│   ├── calls/             # Call detail & new call pages
│   ├── followups/         # Follow-up calendar
│   ├── statistics/        # Stats dashboard
│   └── settings/          # App settings
├── components/
│   ├── ui/                # Reusable UI primitives
│   ├── layout/            # Navigation, sidebar, FAB
│   ├── calls/             # Call-specific components
│   ├── dashboard/         # Search, filters
│   ├── stats/             # Statistics cards
│   └── calendar/          # Follow-up calendar
├── hooks/                 # Custom React hooks
├── lib/                   # MongoDB, models, validation, utils
└── types/                 # TypeScript definitions
```

## Deployment (Vercel)

1. Push to GitHub
2. Import into Vercel
3. Add `MONGODB_URI` environment variable in Vercel settings
4. Deploy

## Users

No password required. Select your user on login:
- **Aflah**
- **Anna**

Session is stored in `localStorage`.

## Mobile Navigation

Bottom navigation tabs:
- 🏠 Dashboard
- 📅 Follow Ups  
- ➕ Add Call (center, prominent)
- 📊 Statistics
- ⚙ Settings
