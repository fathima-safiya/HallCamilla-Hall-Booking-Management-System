# HallCamilla — Luxury Banquet & Event Hall Booking Management System

A full-stack, responsive web application designed for banquet halls and event venues. HallCamilla provides a complete suite of tools for customers to explore halls, check live availability, customize event packages, calculate budgets, and reserve dates, while empowering administrators with comprehensive management over bookings, availability schedules, packages, services, vendors, payments, and analytical reporting.

---

## 🌟 Key Features

### 👤 Customer Experience
- **Explore Luxury Halls**: Browse banquet halls with high-resolution imagery, capacity filtering, amenities, pricing tiers, and virtual tour showcases.
- **Live Availability Calendar**: Check real-time date availability with clear status indicators to prevent booking conflicts.
- **Customizable Event Packages**: Select from pre-configured packages (Silver, Gold, Platinum) or customize with tailored decor, catering, photography, and VIP add-ons.
- **Interactive Budget Calculator**: Estimate event expenses upfront with dynamic calculations based on guest counts, halls, and selected services.
- **Seamless Booking Flow**: Multi-step reservation process with quotation generation and automated cost breakdown.
- **PayHere Payment Gateway Integration**: Secure deposit and full payment processing with automated digital receipt generation (PDF export).
- **Customer Dashboard**: Track ongoing reservations, view quotation/receipt PDFs, submit cancellation requests, and manage personal wishlists.
- **Customer Reviews & Ratings**: Submit and read verified customer testimonials with star ratings.

### 🛡️ Admin Management Portal
- **Operational Dashboard**: Overview of key business metrics, recent booking requests, occupancy statistics, and revenue insights.
- **Booking Management**: Approve, reject, review, and filter reservations with complete customer and event details.
- **Hall & Maintenance Management**: Manage venue profiles, capacities, pricing rules, and schedule routine hall maintenance periods.
- **Package & Service Catalog**: Configure and update catering packages, decor options, photography tiers, and add-on services.
- **Vendor Directory**: Manage external event vendors, contacts, assigned services, and partnership details.
- **Payment & Invoice Tracking**: Monitor transactions, view payment statuses, and review issued receipts.
- **Business Analytics & Printable Reports**: Generate printable financial summaries, booking schedules, and performance reports.
- **Role-Based Access Control**: Secure admin routes with authenticated email authorization.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Cloud Firestore, Cloud Storage)
- **Data Fallback**: Built-in Browser LocalStorage fallback engine (functions seamlessly even offline or without Firebase setup)
- **Document Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) for automated PDF quotations and payment receipts
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Data Visualization**: [Recharts](https://recharts.org/) for administrative analytics

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fathima-safiya/HallCamilla-Hall-Booking-Management-System.git
   cd HallCamilla-Hall-Booking-Management-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment / Firebase (Optional):**
   - Copy `firebase.config.example.json` to `firebase.config.json` (or configure `.env` variables).
   - If Firebase credentials are not provided, HallCamilla will automatically run using its local storage mock database.

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
HallCamilla/
├── public/                 # Static assets, hall images, package visuals, icons
├── src/
│   ├── assets/             # Component assets and service banners
│   ├── components/         # Reusable UI components (CostBreakdown, PayHereButton, etc.)
│   ├── context/            # Global context providers (AuthContext, AppContext, ToastContext)
│   ├── data/               # Default seed data and mock catalogues
│   ├── hooks/              # Custom React hooks (useHalls, useBookings, useAvailability, etc.)
│   ├── lib/                # Firebase configuration and initialization
│   ├── pages/
│   │   ├── admin/          # Admin portal screens (Dashboard, Bookings, Halls, Reports, etc.)
│   │   ├── customer/       # Customer portal screens (Dashboard, PackageSelection, Payment, Wishlist)
│   │   ├── public/         # Public pages (Home, Halls, HallDetails, BudgetCalculator, About, Contact)
│   │   └── shared/         # Shared layouts, navigation, and protected route guards
│   ├── services/           # Business logic, Firestore services, PDF quotation/receipt generation
│   ├── types/              # TypeScript interfaces and type definitions
│   ├── App.tsx             # Route definitions and layout tree
│   └── main.tsx            # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 👩‍💻 Author

**Fathima Safiya**  
- GitHub: [@fathima-safiya](https://github.com/fathima-safiya)
- Email: fathima.safiya.tech@gmail.com
