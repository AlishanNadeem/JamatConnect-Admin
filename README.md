# Jamat Connect Admin

React + Vite admin panel for Jamat Connect. Currently includes the **Auth** module only.

## Stack

- React Vite
- React Hook Form + Yup
- Redux Toolkit + RTK Query
- Redux Persist with AES-encrypted storage
- Framer Motion

## Setup

```bash
cd JamatConnect-Admin
npm install
cp .env.example .env
```

Update `.env` with your API base URL (same pattern as the mobile app):

```
VITE_API_BASE_URL=http://YOUR_IP:5002/jamatconnect/v1/api
```

## Run

```bash
npm run dev
```

## Auth notes

- Login posts to `/auth/login` with `source: "admin"`
- Only users with the `admin` role can sign in
- Remember-me credentials and persisted session data are encrypted before storage

## Seeded admin (from backend seeder)

- Email: `info@jamatconnect.com`
- Password: `Admin@123`
