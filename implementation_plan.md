# New Booking Workflow: Request → Admin Approval → User Payment

## Overview

Currently users go directly from Review → Payment. The new workflow introduces an **admin approval gate**:

**New Flow:**
1. User submits request — Status: `Pending`
2. Admin reviews in the Bookings panel
   - Admin **Approves** → Status: `Approved`
   - Admin **Rejects** → Status: `Rejected`
3. If Approved: User sees a gold "Confirm & Pay" CTA on their Dashboard
4. User pays → Status: `Confirmed`, paymentStatus: `Paid`

---

## Changes to Data Model

### [MODIFY] AppContext.tsx
Add `'Approved'` and `'Rejected'` to the booking status union type. Full set:
`'Pending' | 'Approved' | 'Rejected' | 'Confirmed' | 'Completed' | 'Cancelled'`

---

## Proposed Changes

### User-Facing Pages

#### [MODIFY] Booking.tsx (Review page - Step 3)
- Rename the CTA button from "PROCEED TO PAYMENT" to "SUBMIT BOOKING REQUEST"
- Instead of navigating to `/booking/payment`, call `addBooking(...)` directly with `status: 'Pending'` and `paymentStatus: 'Unpaid'`
- After saving, navigate to `/booking/submitted` (new page)

#### [NEW] BookingSubmitted.tsx
- New page shown immediately after user submits a request
- Shows: "Your booking request has been submitted! Our team will review within 24 hours."
- Displays the Booking Reference ID
- Has a "Go to My Bookings" button

#### [MODIFY] Dashboard.tsx
- Status `Approved` → glowing gold "APPROVED - Confirm and Pay" CTA button
- Status `Pending` → grey "Awaiting Admin Review" badge
- Status `Rejected` → red "Request Rejected" badge

#### [MODIFY] BookingDetails.tsx
- Show a status timeline at the top: Submitted → Approved → Paid
- If status is `Approved` and paymentStatus is `Unpaid`, show a "Proceed to Payment" button

#### [MODIFY] Payment.tsx
- Instead of creating a new booking, it now UPDATES an existing one via `updateBooking(id, { status: 'Confirmed', paymentStatus: 'Paid' })`
- Reads the booking `id` from query params

#### [MODIFY] Notifications.tsx
- Dynamically show a notification when any user booking is `Approved`, prompting them to pay

---

### Admin Panel

#### [MODIFY] AdminBookings.tsx
- Add "Approve" (green) button for `Pending` bookings → sets `status: 'Approved'`
- Add "Reject" (red) button for `Pending` bookings → sets `status: 'Rejected'`
- Add `Approved` and `Rejected` to the status filter tabs

---

## App.tsx

#### [MODIFY] App.tsx
- Add route for `/booking/submitted` pointing to the new `BookingSubmitted` page (protected)

---

## Verification Plan
1. Submit a booking request as a user, verify it shows as `Pending` in dashboard and admin panel
2. Admin approves the request, verify user dashboard shows the gold "Confirm and Pay" CTA
3. User pays, verify status becomes `Confirmed` and `paymentStatus: Paid`
4. Admin rejects a request, verify user dashboard shows `Rejected` badge
5. Run `npm run build` to confirm zero TypeScript errors
