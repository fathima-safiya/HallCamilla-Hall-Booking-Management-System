# HallCamilla — Luxury Banquet & Event Hall Booking Management System

HallCamilla is a modern, responsive web-based Banquet and Event Hall Management System. It provides an intuitive portal for customers to discover luxury venues, inspect availability schedules, customize catering and event packages, calculate budgets, and reserve dates with automated quotations and receipts, while offering administrators complete oversight over venue operations, maintenance, services, vendors, and business reporting.

---

## 🌟 Key Features

### 👤 Customer Portal & Experience
* **Explore Luxury Halls**: Browse banquet halls with high-resolution imagery, capacity filtering, amenities, pricing tiers, and virtual tour showcases.
* **Live Availability Calendar**: Check real-time date availability with clear visual indicators to prevent booking conflicts.
* **Customizable Event Packages**: Select from pre-configured packages (Silver, Gold, Platinum) or customize with tailored decor, catering, photography, and VIP add-ons.
* **Interactive Budget Calculator**: Estimate event expenses upfront with dynamic calculations based on guest counts, halls, and selected services.
* **Seamless Booking Flow**: Multi-step reservation process with real-time quotation generation and itemized cost breakdown.
* **PayHere Payment Gateway Integration**: Secure deposit and full payment processing with automated digital receipt generation (PDF export).
* **Customer Dashboard**: Track ongoing reservations, download quotation and receipt PDFs, submit cancellation requests, and manage personal wishlists.
* **Customer Reviews & Ratings**: Submit and browse verified customer testimonials with star ratings.

### 🛡️ Administrator Portal
* **Operational Dashboard**: Real-time overview of key business metrics, recent booking requests, occupancy statistics, and revenue insights.
* **Booking Moderation & Approvals**: Approve, reject, review, and filter reservations with complete customer and event details.
* **Hall & Maintenance Management**: Manage venue profiles, capacities, pricing rules, and schedule routine hall maintenance periods.
* **Package & Service Catalog**: Configure and update catering packages, decor options, photography tiers, and add-on services.
* **Vendor Directory**: Manage external event vendors, contacts, assigned services, and partnership details.
* **Payment & Invoice Tracking**: Monitor transactions, view payment statuses, and review issued receipts.
* **Business Analytics & Printable Reports**: Generate printable financial summaries, booking schedules, and performance reports.
* **Role-Based Access Control**: Secure admin routes with authenticated administrator authorization.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Vite
* **Styling & UI**: Tailwind CSS, Lucide Icons, Responsive Grid System, Micro-animations
* **Backend & Cloud Database**: Firebase (Authentication, Cloud Firestore, Cloud Storage)
* **Offline Mock Fallback**: Built-in Browser LocalStorage database fallback (runs seamlessly even without Firebase configured)
* **Document Generation**: jsPDF & jsPDF-AutoTable for automated PDF quotations and payment receipts
* **Routing**: React Router DOM v7
* **Data Visualization**: Recharts for administrative analytics

---

## 🚀 Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (**v18+ or v20+** recommended)
* [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation Steps

1. **Clone the Project**:
   ```bash
   git clone https://github.com/fathima-safiya/HallCamilla-Hall-Booking-Management-System.git
   cd HallCamilla-Hall-Booking-Management-System
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment / Firebase (Optional)**:
   * Copy `firebase.config.example.json` to `firebase.config.json` (or create a `.env` file).
   * *Note: If Firebase credentials are not provided, HallCamilla will automatically run using its built-in local database.*

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Launch the Application**:
   Navigate to:
   ```text
   http://localhost:5174
   ```

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔐 Default Demo Accounts

When running locally with the default database configuration:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admincamillahotel@gmail.com` | `admin123` | Full administrative dashboard, bookings, halls & reports |
| **Customer** | Any email / Self-registration | Any password | Customer booking portal, package builder & wishlist |

---

## 📁 Project Directory Structure

```text
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

### **Fathima Safiya**
* **GitHub**: [@fathima-safiya](https://github.com/fathima-safiya)
* **Email**: [fathima.safiya.tech@gmail.com](mailto:fathima.safiya.tech@gmail.com)

---

## 📄 License
This project was developed for educational and portfolio demonstration purposes.
