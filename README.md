# CheersLK - Liquor & Essentials Delivery App

Sri Lanka prohibits drink and drive, and liquor shops are only located in towns. CheersLK bridges this gap by delivering liquor, cigarettes, food, and mixers directly to customers' doorsteps.

## Apps

| App | Tech | Description |
|-----|------|-------------|
| **Customer** | React Native (Expo) | Browse products, order, pay via PayHere, track delivery in real-time |
| **Rider** | React Native (Expo) | Accept deliveries, navigate, track earnings |
| **Admin** | React (Vite) + Tailwind | Manage products, orders, riders, promos, analytics |

## Tech Stack

- **Frontend:** React Native (Expo Router) + React (Vite)
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions)
- **Payments:** PayHere (Visa, MasterCard, bank transfers, eZ Cash)
- **Maps:** Google Maps
- **SMS OTP:** notify.lk
- **State:** Zustand + MMKV
- **i18n:** react-i18next (English, Sinhala, Tamil)
- **Monorepo:** Turborepo + pnpm

## Project Structure

```
cheerslk/
├── apps/
│   ├── customer/          # Customer mobile app (Expo)
│   ├── rider/             # Rider mobile app (Expo)
│   └── admin/             # Admin web panel (Vite + Tailwind)
├── packages/
│   ├── shared-types/      # TypeScript type definitions
│   ├── shared-utils/      # Utilities (currency, NIC validator, phone, distance)
│   ├── shared-constants/  # Enums, config, categories
│   ├── i18n/              # Translations (English, Sinhala, Tamil)
│   └── supabase-client/   # Supabase client, queries, realtime, storage
└── supabase/
    ├── migrations/        # 12 PostgreSQL migrations (PostGIS, RLS)
    ├── functions/         # 10 Edge Functions
    └── seed.sql           # Sample data
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Supabase CLI
- Expo CLI

### Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/pubuduyashan/cheerslk.git
   cd cheerslk
   pnpm install
   ```

2. **Configure environment variables:**

   Create `.env` files in each app:

   **apps/customer/.env** and **apps/rider/.env:**
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
   ```

   **apps/admin/.env:**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up Supabase:**
   ```bash
   supabase start
   supabase db push
   supabase db seed
   ```

4. **Run apps:**
   ```bash
   pnpm dev:customer   # Customer mobile app
   pnpm dev:rider      # Rider mobile app
   pnpm dev:admin      # Admin panel at localhost:5173
   ```

## Features

### Customer App
- Phone + OTP authentication
- NIC-based age verification (21+)
- Product browsing with search and categories
- Cart with promo codes
- PayHere payment integration
- Real-time order tracking with live map
- Ratings and reviews
- Loyalty rewards (Bronze/Silver/Gold/Platinum tiers)
- Multi-language support (EN/SI/TA)

### Rider App
- Registration with document upload
- Online/offline toggle
- Order acceptance with 30s countdown
- Step-by-step delivery flow
- Background GPS tracking
- Earnings dashboard

### Admin Panel
- Dashboard with KPI cards and charts
- Product and category management
- Order management with real-time updates
- Rider verification and management
- User age verification review
- Promo code management
- Delivery zone configuration
- Analytics and reporting

## Database

12 PostgreSQL migrations with:
- PostGIS for geospatial queries (nearest rider, delivery zones)
- pg_trgm for fuzzy product search
- Row Level Security on all tables
- Automatic triggers for status history, rating updates, location tracking

## Edge Functions

| Function | Purpose |
|----------|---------|
| `send-otp` | Send OTP via notify.lk |
| `verify-otp` | Validate OTP (max 3 attempts) |
| `place-order` | Create order with stock validation |
| `verify-payment` | PayHere webhook verification |
| `assign-rider` | PostGIS nearest rider assignment |
| `update-rider-location` | GPS tracking updates |
| `apply-promo` | Promo code validation |
| `calculate-delivery-fee` | Zone-based fee calculation |
| `process-loyalty-points` | Points earning and redemption |
| `send-push-notification` | Expo Push API notifications |

## Costs

| Service | Cost |
|---------|------|
| Supabase Pro | ~$25/month |
| PayHere | ~3% per transaction |
| Google Maps | $200/month free credit |
| notify.lk SMS | ~LKR 0.35/SMS |
| EAS Build | Free tier (30 builds/month) |
| Vercel (admin) | Free tier |

## License

Private - All rights reserved.
