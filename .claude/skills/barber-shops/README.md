# Barber Shop Website — Core Blueprint

Reusable foundation for building a full-stack barber shop website. Covers tech stack, feature set, working mechanism, and architecture. Excludes theme/design — apply those separately per client.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Storage | File-based JSON (`/data/*.json`) |
| Password Hashing | Node `crypto` SHA-256 |
| Client Auth | `sessionStorage` (one session per login) |
| Staff Auth | `localStorage` (persists across tabs) |
| Deployment | Vercel (recommended) |

---

## Pages & Routes

```
/                        → Main landing page
/signin                  → Client login / register
/appointments            → Client booking history (auth required)
/staff/login             → Staff password login
/staff/dashboard         → Staff management panel (auth required)

/api/bookings            → GET all | GET ?email= | POST | PATCH
/api/clients             → GET ?email= | POST (login/register)
/api/offers              → GET | GET ?email= | POST | PATCH | DELETE
```

---

## Data Storage

Three JSON files in `/data/`:

**`bookings.json`**
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "barber": "string",
  "services": ["string"],
  "date": "YYYY-MM-DD",
  "time": "string",
  "notes": "string",
  "status": "pending | confirmed | completed | cancelled",
  "createdAt": "ISO string"
}
```

**`clients.json`**
```json
{
  "email": "string (lowercase)",
  "name": "string",
  "passwordHash": "SHA-256 hex string",
  "createdAt": "ISO string"
}
```

**`offers.json`**
```json
{
  "id": "uuid",
  "customerEmail": "string",
  "customerName": "string",
  "type": "discount | free_service | custom",
  "value": "string (e.g. '20%' or 'Free Beard Trim')",
  "message": "string",
  "expiryDate": "YYYY-MM-DD",
  "used": false,
  "createdAt": "ISO string"
}
```

---

## Booking Flow

1. User fills the booking form (name, phone, barber, services, date, time, notes)
2. On submit — check `sessionStorage` for `client_session`
   - **Logged in** → submit booking directly → show success + open WhatsApp
   - **Not logged in** → show inline login/register gate
3. After login/register → submit booking → set session → show success + open WhatsApp
4. WhatsApp message is pre-filled with all booking details via `https://wa.me/{NUMBER}?text=...`
5. Booking saved to `data/bookings.json` via `POST /api/bookings`

**Form fields:** Name, Phone, Preferred Barber, Services (multi-select), Date, Time, Notes
**Email is NOT in the form** — taken from session (logged in) or from login gate

---

## Client Auth Flow

- **Register:** POST `/api/clients` `{ action: "register", email, password, name }`
  - Checks email not already taken
  - Stores `{ email, name, passwordHash: sha256(password) }`
  - Returns `{ success: true, name }`
- **Login:** POST `/api/clients` `{ action: "login", email, password }`
  - Looks up email, compares `sha256(password)` to stored hash
  - Returns `{ success: true, name }`
- **Session:** `sessionStorage.setItem('client_session', JSON.stringify({ email, name }))`
  - Cleared when browser is closed — one session per login
- **Check exists:** GET `/api/clients?email=xxx` → `{ exists: true/false }`

---

## Staff Auth Flow

- Single shared password stored in `process.env.NEXT_PUBLIC_ADMIN_PASSWORD` (fallback: `"admin123"`)
- On login: `localStorage.setItem('staff_auth', 'true')`
- Auth check on every dashboard page load — redirect to `/staff/login` if missing
- Sign out: `localStorage.removeItem('staff_auth')`

---

## Appointments Page (Client)

- Auth gate: reads `sessionStorage.client_session` — redirects to `/signin` if missing
- Fetches bookings by email: `GET /api/bookings?email=...`
- Fetches offers by email: `GET /api/offers?email=...`
- Shows status badges: Pending / Confirmed / Completed / Cancelled
- Shows price per booking (from `SERVICE_PRICES` map in `src/lib/pricing.ts`)
- Shows offer badge + discounted price if an active offer exists for that email

---

## Staff Dashboard

**Bookings tab:**
- Loads all bookings via `GET /api/bookings`
- Search by name, email, phone
- Filter by status
- Actions per booking: Confirm / Complete / Cancel → `PATCH /api/bookings { id, status }`
- Shows price + active offer badge per booking

**Special Offers tab:**
- Create offer form: customer email (autocomplete from existing customers), name, type, value, message, expiry
- Sends `POST /api/offers`
- Lists all existing offers with delete button

---

## Pricing System (`src/lib/pricing.ts`)

```ts
SERVICE_PRICES: Record<string, number>  // map of service name → price in $
calcTotal(services: string[]): number   // sum of selected services
calcWithOffer(services, offer?): PriceBreakdown
// returns: { subtotal, discount, total, offerLabel }
```

Offer logic:
- `discount` type with value like `"20%"` → applies percentage off
- `free_service` / `custom` → shows label, no automatic price change

---

## Components Structure

```
src/
  app/
    page.tsx                  → Main page (assembles all sections)
    signin/page.tsx           → Client auth page
    appointments/page.tsx     → Client booking history
    staff/
      login/page.tsx
      dashboard/page.tsx
    api/
      bookings/route.ts
      clients/route.ts
      offers/route.ts
  components/
    Navbar.tsx                → Sticky nav, shows logged-in client name
    HeroSection.tsx           → Full-screen hero, particles, parallax
    ServicesSection.tsx       → Service cards with pricing
    BookingSection.tsx        → Booking form + login gate + success screen
    TeamSection.tsx           → Barber profile cards
    TestimonialsSection.tsx   → Auto-scroll testimonials
    WhyUsSection.tsx          → Icon feature cards
    GallerySection.tsx        → Masonry gallery with lightbox
    LocationSection.tsx       → Map + contact info
    Footer.tsx                → Links, hours, socials, staff login link
    WhatsAppButton.tsx        → Floating WhatsApp CTA
    ScrollToTop.tsx           → Scroll to top button
  lib/
    pricing.ts                → Service prices + offer calculation
```

---

## Key Implementation Notes

- **No email in booking form** — email comes from session or login gate
- **React hydration** — all `Math.random()` and `new Date()` calls must run inside `useEffect`, never at module level or in JSX directly (causes SSR/client mismatch)
- **Decorative overlay divs** must have `pointer-events-none` or they block all clicks beneath them
- **WhatsApp link format:** `https://wa.me/{countrycode}{number}?text={encodeURIComponent(message)}`
- **Navbar logged-in state:** reads `sessionStorage` in `useEffect` on mount — shows client first name + sign out when logged in
- **Data directory:** must be created at startup if missing — all API routes handle this with `fs.existsSync` + `fs.mkdirSync`

---

## Customise Per Client

| Item | Where to change |
|---|---|
| Barber names | `BookingSection.tsx` → `barbers` array |
| Services + prices | `BookingSection.tsx` → `SERVICE_LIST` and `src/lib/pricing.ts` → `SERVICE_PRICES` |
| WhatsApp number | `BookingSection.tsx` + `WhatsAppButton.tsx` |
| Business hours | `Footer.tsx` → `hours` array |
| Locations | `Footer.tsx` + `LocationSection.tsx` |
| Staff password | `.env` → `NEXT_PUBLIC_ADMIN_PASSWORD` |
| Social links | `Footer.tsx` |
| Team members | `TeamSection.tsx` |
