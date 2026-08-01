# Firebase Setup Guide

## Prerequisites

- Firebase account at console.firebase.google.com
- Firebase CLI installed

## Steps

1. Create Firebase project
2. Create web app in Firebase Console
3. Copy config to .env.local
4. Enable Authentication (Email/Password, Google)
5. Create Firestore database
6. Set up Storage
7. Configure security rules

## Environment Variables

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender
VITE_FIREBASE_APP_ID=your_app_id
```

See documentation for complete setup instructions.
