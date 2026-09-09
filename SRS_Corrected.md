# SOFTWARE REQUIREMENT SPECIFICATION (SRS)
## Hall Booking and Management System (Camilla Banquet Hotel)

**Institution:** Sri Lanka Institute of Advanced Technological Education  
**Course:** Higher National Diploma in Information Technology (HNDIT)  
**Module:** HNDIT 4052 – Programming Individual Project  
**Academic Year:** 2026/2027  

---

## 1. Introduction
### 1.1 Purpose
This Software Requirements Specification (SRS) document details the functional and non-functional requirements of the Hall Booking and Management System designed for the **Camilla Banquet Hotel**. It provides a baseline reference for system logic, security validation rules, and structural architecture.

### 1.2 Scope of the System
The system is a cloud-based web application tailored to streamline banquet hall reservation scheduling. It includes:
*   Real-time date availability checking.
*   Secure identity verification via Firebase Authentication.
*   Interactive dashboards for regular customers and administrative managers.
*   Complete CRUD (Create, Read, Update, Delete) controls for managing banquet rooms.

### 1.3 Definitions and Acronyms
*   **SRS:** Software Requirements Specification
*   **BaaS:** Backend-as-a-Service (Google Firebase)
*   **NoSQL:** Non-Relational Database (Firestore)
*   **SPA:** Single-Page Application (React)
*   **RBAC:** Role-Based Access Control

---

## 2. General Description
### 2.1 Product Perspective
This system is structured as a serverless web application. Instead of maintaining a separate API server, the React frontend leverages secure SDK hooks to connect directly to Google Firebase modules. Database read/write parameters are controlled at the cloud layer through custom security rules.

```
[React SPA Client] ➔ (Firebase Auth API)
        |
        +➔ (Firestore NoSQL DB with Security Rules Verification)
```

### 2.2 Product Functions
*   **Authentication & Session Management:** Customer signup, email logins, password validation.
*   **Public Portal:** Home page with hotel information, venue displays, and capacity statistics.
*   **Role-Based Access Control:** Redirection of users to Customer or Admin dashboards depending on their profiles.
*   **Venue Control (CRUD):** Admin UI to add, change, or remove halls dynamically.
*   **Booking Management System:** Client booking form with built-in date checker and admin approval workflow.

### 2.3 User Classes and Characteristics
1.  **Administrator (Hall Manager):** Manages booking statuses, updates room database profiles, and audits incoming requests.
2.  **Customer (Guest User):** Reviews availability calendars, submits booking requests, and tracks status history.

---

## 3. Functional Requirements
### 3.1 User Authentication
*   **FR-1.1:** Users shall register an account using a unique email address, full name, phone number, and password.
*   **FR-1.2:** Registered users shall sign in securely using email credentials.
*   **FR-1.3:** The system shall restrict administrative dashboard routes (`/admin/*`) to accounts possessing the `admin` flag in the user document database.
*   **FR-1.4:** Users must be able to log out securely, immediately terminating their active session.

### 3.2 Hall Management (Admin CRUD)
*   **FR-2.1:** The admin panel shall display an interactive grid of current halls.
*   **FR-2.2:** The administrator shall have the ability to create new halls with parameters including capacity, price (LKR), image URL, and descriptions.
*   **FR-2.3:** The administrator shall be able to update hall parameters at any time.
*   **FR-2.4:** The administrator shall be able to delete a hall from the database grid.

### 3.3 Booking Management
*   **FR-3.1:** The system shall provide an availability check function that queries existing bookings for a matching `hallId` and `date`.
*   **FR-3.2:** If a hall is already booked with a status of `Pending` or `Approved` on a requested date, the interface shall warn the user and block creation.
*   **FR-3.3:** When a customer submits a booking, the initial state of the document must be set to `Pending`.
*   **FR-3.4:** The admin dashboard shall show all pending, approved, and cancelled booking requests.
*   **FR-3.5:** The administrator shall be able to transition a booking status to `Approved` or `Rejected` directly from the dashboard view.

---

## 4. Interface Requirements
### 4.1 User Interface
*   **UI-1:** The styling system shall adopt a premium layout theme using rich dark emerald (`#002215`) and gold tones matching the hotel brand.
*   **UI-2:** The application layout must be fully responsive, rendering columns cleanly on mobile, tablet, and widescreen layouts.
*   **UI-3:** The customer dashboard shall display active bookings in clean tabular modules.

### 4.2 Software Interfaces
*   **Frontend UI Library:** React (TypeScript)
*   **Database Service:** Google Cloud Firestore (SDK v10+)
*   **Authentication API:** Firebase Auth Service
*   **Build Bundler:** Vite

---

## 5. Non-Functional Requirements
### 5.1 Performance
*   **NFR-1.1:** Interface transitions and database checks should resolve within 2.5 seconds under typical 3G/4G bandwidth.
*   **NFR-1.2:** Database changes made on Firestore must propagate dynamically to dashboard listeners via real-time hooks without page reloads.

### 5.2 Security
*   **NFR-2.1:** All database collections must have custom access constraints matching authenticated user IDs.
*   **NFR-2.2:** Regular customers must be blocked from writing data to the `halls` collection.
*   **NFR-2.3:** Admin views must verify user role credentials before loading components.

### 5.3 Maintainability
*   **NFR-3.1:** The codebase must follow a modular component design.
*   **NFR-3.2:** Data access logic must be isolated in dedicated service modules (`bookingService.ts`, `hallService.ts`).
