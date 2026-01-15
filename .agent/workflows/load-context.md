---
description: Load project context for efficient work sessions
---

# Dra. Lidia Casasola - Project Context

## 🎯 Project Overview

Este es el sitio web profesional de la **Dra. Lidia Casasola**, abogada especialista en Derecho Previsional y Civil.

### Key Information
| Campo | Valor |
|-------|-------|
| **Nombre** | Dra. Lidia Casasola |
| **Cargo** | Jefa del ANSES |
| **Especialidad** | Derecho Previsional y Civil |
| **Servicios** | Jubilaciones, Pensiones, Sucesiones |
| **Stack** | Next.js + TailwindCSS + shadcn/ui + Firebase |

### URLs
- **Production**: https://dra-casasola.vercel.app
- **GitHub**: https://github.com/Sergiocharata1977/dra.casasola.git
- **Vercel Project**: dra-casasola
- **Firebase Console**: https://console.firebase.google.com/project/dra-casasola-web

## 🔥 Firebase Configuration

| Campo | Valor |
|-------|-------|
| **Project ID** | `dra-casasola-web` |
| **App ID** | `1:787477542103:web:a69baa95716a38227dac92` |
| **Auth Domain** | `dra-casasola-web.firebaseapp.com` |
| **Storage Bucket** | `dra-casasola-web.firebasestorage.app` |

### Firebase Services Enabled
- ✅ Firestore Database (nam5)
- ⏳ Authentication (Email/Password - needs to be enabled in console)
- ⏳ Hosting (optional)

### Firestore Collections
```
├── users/          # Admin users
├── news/           # Legal news articles
├── events/         # Legal events
└── tasks/          # Task management (Kanban)
```

## 📁 Project Structure

```
├── app/
│   ├── globals.css       # Theme colors (navy/gold)
│   ├── layout.tsx        # Metadata & fonts
│   ├── page.tsx          # Main landing page
│   ├── login/            # Admin login
│   ├── setup/            # Initial setup
│   └── admin/            # Admin panel
│       ├── layout.tsx    # Admin sidebar
│       ├── page.tsx      # Dashboard
│       ├── news/         # News management
│       ├── events/       # Events management
│       ├── tasks/        # Kanban tasks
│       └── users/        # User management
├── components/
│   ├── header.tsx        # Navigation header
│   ├── hero.tsx          # Hero section
│   ├── sobre-mi.tsx      # About section
│   ├── servicios.tsx     # Services cards
│   ├── contacto-form.tsx # Contact form
│   ├── footer.tsx        # Footer
│   ├── admin/            # Admin components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── firebase.ts       # Firebase config
│   ├── firebase/auth.ts  # Auth functions
│   ├── services.ts       # CRUD services
│   └── types.ts          # TypeScript types
├── contexts/
│   └── AuthContext.tsx   # Auth state
└── public/
    └── professional-female-lawyer.jpg
```

## 🎨 Design System

### Color Theme
- **Primary**: Navy blue `oklch(0.28 0.08 245)` - Headers, hero bg, footer, sidebar
- **Accent**: Gold `oklch(0.68 0.12 75)` - CTAs, badges, icons
- **Background**: Light gray/white
- **Text**: Dark navy

## 🔐 Admin Panel Features

### Already Implemented
| Module | Route | Description |
|--------|-------|-------------|
| Dashboard | `/admin` | Stats overview |
| Noticias | `/admin/news` | Legal news CRUD |
| Eventos | `/admin/events` | Events CRUD |
| Tareas | `/admin/tasks` | Kanban board |
| Usuarios | `/admin/users` | User management |

### Task Kanban States
`backlog` → `todo` → `in-progress` → `done`

## 🚀 Development Commands

// turbo-all

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

## ⚠️ IMPORTANT: Enable Firebase Auth

Before login works, you MUST enable Email/Password authentication:

1. Go to: https://console.firebase.google.com/project/dra-casasola-web/authentication
2. Click "Get started"
3. Enable "Email/Password" provider
4. Create a user for Dra. Casasola

## 📝 History

- **2026-01-15 AM**: Transformed from political site (lla-sudoeste) to law firm
- **2026-01-15 PM**: Created Firebase project `dra-casasola-web`, configured Firestore, updated admin panel with new branding

## 📌 Notes for AI Agents

1. Firebase project is `dra-casasola-web` (NOT the old `lla-landding`)
2. Admin panel uses new navy/gold theme
3. Auth must be enabled manually in Firebase Console
4. When deploying changes: `git push` triggers auto-deploy on Vercel
