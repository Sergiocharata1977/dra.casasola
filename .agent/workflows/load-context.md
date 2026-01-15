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
| **Stack** | Next.js + TailwindCSS + shadcn/ui |

### URLs
- **Production**: https://dra-casasola.vercel.app
- **GitHub**: https://github.com/Sergiocharata1977/dra.casasola.git
- **Vercel Project**: dra-casasola

## 📁 Project Structure

```
├── app/
│   ├── globals.css       # Theme colors (navy/gold)
│   ├── layout.tsx        # Metadata & fonts
│   ├── page.tsx          # Main landing page
│   ├── admin/            # Admin panel (legacy)
│   └── login/            # Login page (legacy)
├── components/
│   ├── header.tsx        # Navigation header
│   ├── hero.tsx          # Hero section with photo
│   ├── sobre-mi.tsx      # About section
│   ├── servicios.tsx     # Services cards
│   ├── contacto-form.tsx # Contact form
│   ├── footer.tsx        # Footer
│   └── ui/               # shadcn/ui components
├── public/
│   └── professional-female-lawyer.jpg
└── contexts/
    └── AuthContext.tsx   # Auth context (legacy)
```

## 🎨 Design System

### Color Theme
- **Primary**: Navy blue `oklch(0.28 0.08 245)` - Headers, hero bg, footer
- **Accent**: Gold `oklch(0.68 0.12 75)` - CTAs, badges, icons
- **Background**: Light gray/white
- **Text**: Dark navy

### Typography
- **Headings**: Serif font (Georgia)
- **Body**: Sans-serif (Geist)

## 📋 Key Components

### Header (`components/header.tsx`)
- Sticky navigation
- Menu: Inicio, Sobre Mí, Servicios, Contacto
- Mobile responsive hamburger menu

### Hero (`components/hero.tsx`)
- Navy background
- "Jefa del ANSES" badge
- Professional photo
- "20+ Años de Experiencia" floating badge
- Two CTAs: "Consulta Gratuita" + "Ver Servicios"

### Sobre Mí (`components/sobre-mi.tsx`)
- Stats: 500+ Casos Exitosos, 98% Clientes Satisfechos
- Credentials card: Especialización, Cargo, Experiencia

### Servicios (`components/servicios.tsx`)
- 3 service cards:
  1. **Jubilaciones** - ordinaria, anticipada, reajuste
  2. **Pensiones** - fallecimiento, invalidez, no contributivas
  3. **Sucesiones** - declaratoria, testamentos, herencias

### Contacto (`components/contacto-form.tsx`)
- Contact form: nombre, email, teléfono, mensaje
- Contact info: phone, email, address

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

## 📝 History & Origin

Este proyecto fue originalmente **lla-sudoeste** (La Libertad Avanza - Sudoeste Chaco), un sitio político. Fue completamente rediseñado el **15 de enero de 2026** para convertirse en el sitio profesional de la Dra. Lidia Casasola.

### Transformation Summary:
1. Replaced violet political theme → Navy/gold professional theme
2. Replaced political content → Legal services content
3. Updated all components (header, hero, services, etc.)
4. Created new GitHub repo: `Sergiocharata1977/dra.casasola`
5. Deployed to Vercel: `dra-casasola.vercel.app`

## ⚙️ Configuration Files

- `package.json` - Dependencies and scripts
- `tailwind.config.ts` - Tailwind configuration
- `next.config.mjs` - Next.js configuration
- `vercel.json` - Vercel deployment config
- `components.json` - shadcn/ui configuration

## 🔧 Quick Fixes

### Update Contact Info
Edit `components/contacto-form.tsx` and `components/footer.tsx`:
- Phone number
- Email address
- Physical address

### Update Social Sharing Preview
Edit `app/layout.tsx`:
- `metadata.title`
- `metadata.description`
- `metadata.openGraph.*`

### Change Photo
Replace `public/professional-female-lawyer.jpg` with new image.

## 📌 Notes for AI Agents

1. This is a **static landing page** - no backend/database
2. Legacy admin panel exists but is NOT used
3. AuthContext exists from old project but can be removed
4. When deploying changes: `git push` triggers auto-deploy on Vercel
5. WhatsApp previews are cached - use Facebook Debugger to clear cache
