# 🚂 RailBite Bharat

**Smart food ordering for Indian Railway passengers** — order fresh, FSSAI-verified food delivered to your seat by local vendors, including women-led SHG businesses.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (cart) + useReducer (app state) |
| Routing | React Router v6 |
| Charts | Recharts |
| Backend | Node.js + Express + TypeScript |
| Real-time | Socket.io |
| Auth | Firebase Authentication (ready to connect) |
| DB | Firebase Firestore (ready to connect) |
| Payments | Razorpay (mock + webhook endpoints) |
| AI/ML | brain.js demand forecasting (Node.js) |
| Deployment | Vercel (frontend) + Railway/Render (backend) |

---

## 📁 Project Structure

```
Rail-Bits-Bharat/
├── src/
│   ├── pages/
│   │   ├── Homepage.tsx           # Landing page with animated hero
│   │   ├── PassengerPortal.tsx    # PNR → Station → Vendor → Menu flow
│   │   ├── CheckoutPage.tsx       # Cart editing + payment method + GST
│   │   ├── OrderSummary.tsx       # Live status timeline + QR code
│   │   ├── OrderTracking.tsx      # SVG map with animated delivery partner
│   │   ├── RateOrderPage.tsx      # 5-star rating + complaint filing
│   │   ├── VendorDashboard.tsx    # Order queue + menu + AI forecast
│   │   ├── VendorRegister.tsx     # 5-step onboarding wizard
│   │   ├── AdminDashboard.tsx     # KPIs + charts + vendor/order management
│   │   ├── DemandForecast.tsx     # AI demand prediction with brain.js
│   │   ├── SHGPortal.tsx          # SHG vendor program portal
│   │   ├── LoginPage.tsx          # Email + Phone OTP + Quick PIN
│   │   └── SignupPage.tsx         # Registration with Google OAuth
│   ├── components/
│   │   ├── Navbar.tsx             # Glassmorphic sticky nav with dark mode
│   │   └── ProtectedRoute.tsx     # Route guard (swap with Firebase auth)
│   ├── store/
│   │   ├── AppContext.tsx         # Orders, vendors, complaints state
│   │   ├── AuthContext.tsx        # Auth state (Firebase-ready)
│   │   └── cartStore.ts           # Zustand persistent cart
│   └── data/
│       └── mockData.ts            # 15 stations, 8 vendors, 50+ menu items
└── backend/
    ├── server.ts                  # Express + Socket.io API
    └── package.json
```

---

## 🚀 Quick Start

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npx tsx server.ts
# → http://localhost:4000
```

---

## 🌍 Environment Variables

Create `.env` in project root:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_RAZORPAY_KEY_ID=rzp_test_xxxx
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
VITE_API_BASE_URL=http://localhost:4000
```

Create `backend/.env`:

```env
PORT=4000
RAZORPAY_KEY_SECRET=your_secret
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
NODEMAILER_USER=your@email.com
NODEMAILER_PASS=your_password
```

---

## 📱 Key Features

### Passenger Flow
1. Enter PNR → auto-fetch train + coach + seat
2. Select upcoming station
3. Browse FSSAI-verified vendors with hygiene scores
4. Filter by Veg/Non-Veg, cuisine, rating
5. Add to cart with quantity controls
6. Pay via UPI, Card, Netbanking (Razorpay)
7. Real-time order status: Placed → Confirmed → Preparing → Out for Delivery → Delivered
8. Live delivery tracking map with ETA countdown
9. Rate order + file complaints

### Vendor Portal
- Accept/Reject/Prepare orders in real-time
- Menu management with availability toggle
- Earnings dashboard (daily/weekly charts)
- AI demand forecast for tomorrow's prep
- Customer review management

### Admin Dashboard
- KPI cards: orders, revenue, vendors, complaints
- Revenue + station-wise order charts
- Vendor approval with flag/unflag
- Complaint ticket management

### SHG Program
- Dedicated portal at `/shg`
- Government scheme links (PM FME, NABARD)
- Simplified registration for SHG groups

---

## 🤖 AI Demand Forecasting

The forecast model (at `/forecast` and `/api/forecast/predict`) uses:
- **Inputs**: station code, day of week, time slot (breakfast/lunch/dinner), weekend flag
- **Outputs**: predicted orders per category + confidence scores
- **Color coding**: Green ≥80%, Amber 50–80%, Red <50%
- **Auto-retraining**: Every Sunday 2 AM via node-cron (configure in backend)

---

## 💳 Payment Flow

```
Passenger pays → Razorpay escrow
                    ↓
         Order delivered (confirmed)
                    ↓
     T+1 payout: vendor gets 92% (platform 8%)
```

Refund policy:
- Before "Preparing": 100% refund
- After "Preparing": 50% refund

---

## 🚂 Demo PNR Numbers

| PNR | Train | Route |
|-----|-------|-------|
| 2847501234 | Mumbai Rajdhani | Delhi → Bhopal → Nagpur → Mumbai |
| 3921847563 | Howrah Rajdhani | Delhi → Kanpur → Prayagraj → Varanasi → Howrah |
| 4851209371 | Karnataka Express | Delhi → Bhopal → Hyderabad → Bangalore |
| 1234567890 | Jaipur Shatabdi | Delhi → Jaipur |

---

## 🚢 Deployment

### Vercel (Frontend)
```bash
npm run build
# Deploy dist/ to Vercel
```

### Railway/Render (Backend)
```bash
cd backend
npm run build
# Set PORT env var on platform
```

---

## 🗺️ Roadmap (Phase 2)

- [ ] React Native mobile app (Expo)
- [ ] Firebase Auth full integration
- [ ] Firestore real-time sync
- [ ] Razorpay live payments
- [ ] IRCTC PNR API webhook
- [ ] Push notifications (FCM)
- [ ] Hindi/Tamil/Bengali i18n
- [ ] Full brain.js model training pipeline
- [ ] Leaflet.js live GPS map (replace SVG)

---

*Made with ❤️ for Indian Railways • RailBite Bharat © 2026*