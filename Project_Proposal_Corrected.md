# PROJECT PROPOSAL: HALL BOOKING AND MANAGEMENT SYSTEM
**Institution:** Sri Lanka Institute of Advanced Technological Education  
**Course:** Higher National Diploma in Information Technology (HNDIT)  
**Module:** HNDIT 4052 – Programming Individual Project  
**Academic Year:** 2026/2027 (Year II, Semester II)  

**Student Name:** S.F Safiya  
**Student ID:** KUR/IT/2324/F/0080  
**Supervisor:** Ms. P.G.R.N.J. Gamlath  

---

## 1. Problem Statement
Many small and medium-scale event venues in Sri Lanka, such as the **Camilla Banquet Hall** (Kurunegala), still rely on manual administration like paper logbooks, telephone calls, and spreadsheet trackers. While suitable for basic operations, this manual approach results in major operational pain points as the business grows:
*   **Double Booking Conflicts:** Without a real-time validation mechanism, managers risk confirming multiple clients for the same venue on the same day.
*   **Inefficient Payment Records:** Keep track of down payments, remaining balances, and payment statuses on paper logs frequently leads to data inaccuracies and billing confusion.
*   **Lack of Real-Time Availability View:** Customers cannot check dates on their own, overloading hall managers with inquiry calls.
*   **Data Fragmentation:** Customer details, reservation schedules, and financial transactions are stored in disconnected locations, hindering standard audits.

To address these core issues, there is a clear need for a centralized, cloud-connected digital system to automate reservations and provide clear records for management.

---

## 2. Objectives and Goals
### Main Objective
To develop a responsive, serverless web-based **Hall Booking and Management System** that digitizes the reservation workflow, prevents double bookings, organizes client records, and tracks payments through a cloud interface.

### Specific Objectives
1.  **Digitize Reservation Workflow:** Replace paper logs with a cloud-synchronized data store using Firestore.
2.  **Prevent Scheduling Conflicts:** Implement real-time date validation to automatically block a hall if it already has an approved or pending booking on that day.
3.  **Establish Secure Role-Based Access:** Implement Firebase Authentication with separate UI dashboards for Customers (viewing, requesting, tracking) and Admins (managing halls, approving/rejecting booking requests).
4.  **Simplify Payment & Package Tracking:** Allow customers to choose standard event packages (Silver, Gold, Platinum) and let admins manage and record advance payments and outstanding balances.
5.  **Enable Hall CRUD Operations:** Provide the administrator with tools to add, modify, and delete hall configurations (capacity, default pricing, description) dynamically.

---

## 3. Proposed Solution & Approach
The system is implemented as a serverless single-page web application (SPA) that communicates directly with cloud infrastructure.

### Technology Stack
*   **Frontend User Interface:** React.js built with TypeScript for type-safety and structured coding.
*   **Styling & Design System:** Tailwind CSS for a premium layout styled with dark emerald and gold tones matching the Camilla Hotel brand identity.
*   **Database & Cloud Logic:** Google Firebase Firestore (a real-time, NoSQL cloud database).
*   **Identity Management:** Firebase Authentication for secure client registration, sign-in, and session persistency.
*   **Hosting:** Firebase Hosting for fast, global delivery of the static React bundle.

### System Workflow
1.  **Request Submission:** Customer checks hall availability, selects a package, and submits a pending request.
2.  **Admin Evaluation:** The Admin evaluates the request on the Admin Bookings grid and clicks either "Approve" or "Reject".
3.  **Payment Update:** Once approved, the customer dashboard reflects the status change, enabling status updates to "Confirmed" when payment records are balanced.

---

## 4. Scope and Limitations
### Scope
*   **User Registration & Secure Roles:** Secure customer signup and role-based path protection (preventing customers from viewing administrative controls).
*   **Dynamic Hall Showcase:** Public pages displaying hall details, capacity, pricing, and images.
*   **Date Selection & Validation:** Real-time checking to block already-booked dates.
*   **Interactive Dashboards:**
    *   **Customer:** Displays booking requests, statuses (Pending, Approved, Confirmed, Cancelled), and payment breakdowns.
    *   **Admin:** Dynamic grids to oversee bookings, toggle statuses, and configure hall parameters.

### Limitations
1.  **Internet Dependency:** The system operates as a cloud-hosted web app and requires an active internet connection.
2.  **No Native Mobile App:** The system is built as a responsive web app optimized for desktop and mobile browsers, rather than a native mobile application.
3.  **Single-Tenant Architecture:** The application model is tailored for the Camilla Banquet Hotel operations and does not support multi-branch/multi-organization scaling natively.

---

## 5. Methodology
The project utilizes an **Agile-inspired iterative methodology** which allows for incremental development, continuous testing, and alignment with academic review timelines.

```
[Requirement Gathering] ➔ [UI/UX Wireframing] ➔ [Firestore Database Design]
         ➔ [Core Development] ➔ [Security Rules Setup] ➔ [Deployment & Review]
```

### Core Phases
1.  **Requirements & Specifications:** Defining database collections and target dashboards.
2.  **Database Design:** Establishing schema layouts for collections (`users`, `halls`, `bookings`, `packages`).
3.  **Component Development:** Building reuseable React views styled with Tailwind CSS.
4.  **Cloud Integration:** Connecting UI state variables to Firestore via asynchronous Firebase SDK hooks.
5.  **Security Rule Configuration:** Editing `firestore.rules` to enforce strict data protection filters.

---

## 6. Resources & Budget
*   **Development Environment:** Visual Studio Code (IDE), Git/GitHub (Version Control).
*   **Infrastructure Hosting:** Google Firebase Free Tier (Firestore, Hosting, Authentication).
*   **Budget Details:** 100% free-tier software tools. The only financial resources are dedicated to final printing and academic presentation bindings (LKR 500 – 1500).

---

## 7. Literature Review
To understand the current standards in event booking interfaces, three systems were evaluated:
1.  **Eventbrite:** Extremely robust for mass ticket sales but overly complex and lacks the custom room layouts and administrative oversight required by single-venue hotel managers.
2.  **Cvent:** High-end enterprise event tool containing excessive logistics modules. The setup costs and complexity make it impractical for local hospitality operations.
3.  **Manual Ledger Systems (Traditional):** While having zero technological dependency, they are highly prone to transcription mistakes, physical damage, and cannot prevent double-booking conflicts.

**The Research Gap:** A lightweight, premium web application specifically designed for local Sri Lankan hospitality providers that manages rooms, validation gates, and package selections without enterprise complexity.

---

## 8. References
*   React Official Library Documentation: [https://react.dev](https://react.dev)
*   Firebase NoSQL Cloud Services Documentation: [https://firebase.google.com/docs](https://firebase.google.com/docs)
*   Tailwind CSS Design Framework Docs: [https://tailwindcss.com](https://tailwindcss.com)
*   Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson.
