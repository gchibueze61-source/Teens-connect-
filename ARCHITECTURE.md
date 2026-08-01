# Architecture Overview

## Folder Structure

```
src/
├── assets/           # Images, videos, documents
├── components/       # Reusable React components
├── dashboard/        # Dashboard-specific UI
├── pages/           # Page components
├── layouts/         # Layout wrappers
├── routes/          # Route configuration
├── hooks/           # Custom React hooks
├── context/         # React Context providers
├── services/        # Business logic & API
├── firebase/        # Firebase configuration
├── utils/           # Utility functions
├── constants/       # App constants
├── types/           # TypeScript interfaces
├── styles/          # Global styles
└── config/          # Configuration
```

## Key Technologies

- React 18+ with TypeScript
- Vite (fast build tool)
- Tailwind CSS (utility-first styling)
- Firebase (backend)
- React Router (routing)
- Framer Motion (animations)
- React Hook Form (forms)

## Public Pages (11)

1. Home
2. About
3. Programs
4. Events
5. Gallery
6. Blog
7. Contact
8. Volunteer
9. Founder
10. 404 (Not Found)
11. Success

## Authentication Pages

- Login
- Register
- Forgot Password

## Dashboards (3)

1. Founder Dashboard
2. Volunteer Dashboard
3. Admin Dashboard (future)

## Design System

- Primary: Navy (#1a237e)
- Secondary: Teal (#00897b)
- Accent: Orange (#ff6f00)
- Font: Inter

See STYLE_GUIDE.md for details.
