# Res Runner 🏃‍♂️💨 💚

Res Runner is a premium, mobile-responsive web application designed for student-to-student runner and delivery services, initially serving Wits University residence halls and apartment blocks in Braamfontein, Johannesburg.

Styled in a **Claymorphic UI design system** (soft 3D elements, bubbly white borders, tactile press transitions), the application allows students to delegate campus errands while providing part-time jobs for student runners.

---

## ✨ Features

### 👩‍🎓 Customer Portal
- **Errand Selection**: Build shopping carts for Groceries, Late-Night takeaway food, Pharmacy essentials, or Laundry drop-offs/pickups.
- **Custom Errands**: Add custom items with estimated prices for items not in the catalog.
- **Wits Residence Selector**: Select delivery location (e.g. Noswal Hall, Wits Junction, Yale Village, Clifton Heights) with automatic distance-fee calculation.
- **EFT Payment confirmation**: Check banking details (FNB account details) and upload proofs of payment (POP).
- **Live Errand Tracking**: Dynamic vertical progression checklist coupled with an animated GPS map tracking overlay showing the runner's real-time transit location.
- **Global Running Animation**: A fun runner sprite runs across the screen periodically, showing live dispatches in the Braamfontein district!

### 🏃‍♂️ Runner Hub
- **Online Availability Toggle**: Set status to "Online" or "Offline" to receive or pause incoming errands.
- **Earnings Tracker**: Monitor cumulative earnings (service fee + distance fee) per delivery.
- **Active Task Checklist**: Check customer details (WhatsApp phone, delivery hall) and items checklist.
- **Delivery Updates**: Update status from *Assigned* ➜ *In Transit* ➜ *Delivered* with single-click actions.

### 🛠️ Admin Control Dashboard
- **EFT Verification Queue**: Inspect uploaded payment proofs and approve transactions.
- **Runner Recruitment Queue**: Verify student applicants (Wits emails, student cards, and ID copies) to grant runner privileges.
- **System Overview**: View active student runners and ongoing dispatches.

---

## 🎨 Design System: Claymorphism

- **Brand Color**: Emerald Green (`#16A34A` matching their Instagram 💚).
- **Typography**: Varela Round (bubbly, friendly headers) and Nunito Sans (highly legible body text).
- **Clay Shadows**: Double outer and inset shadows to generate a bubbly, soft-plastic tactile appearance:
  - Card: `8px 8px 16px rgba(0,0,0,0.06), -8px -8px 16px rgba(255,255,255,0.8)`
  - Button: `4px 4px 8px rgba(0,0,0,0.08), -4px -4px 8px rgba(255,255,255,0.8)`
- **Animations**: Soft click bounces (200ms scale-down curves) and interactive 3D logo parallax tilting.

---

## 🛠️ Tech Stack

- **Framework**: React + Vite (Fast HMR)
- **CSS Utility**: Tailwind CSS v4 (Using native CSS `@theme` directives for variables)
- **Routing**: React Router DOM (v7)
- **State**: React Context API with automated `localStorage` syncing for mock-database operations (persistent data on refresh)
- **Notification**: React Hot Toast
- **Icons**: Lucide React

---

## 🚀 Quick Start & Installation

To run this application locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/mazwiibaxolele/res-runner.git
   cd res-runner
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173/`.
5. Build the production package:
   ```bash
   npm run build
   ```

---

## 🧪 E2E Demo Walkthrough Guide

You can test the entire operational loop (Customer ➜ Admin ➜ Runner ➜ Customer) using the **Demo Testing Dashboard** located on the login screen:

1. **Place Order**: Log in as **👩‍🎓 Jane Student (Customer)** ➜ Add items ➜ Select residence ➜ Click **Place Order**.
2. **Submit POP**: Review payment details ➜ Upload mock proof of payment file ➜ Click **Submit POP**. Order shifts to *Verifying Payment*.
3. **Verify EFT**: Log out and log in as **🛠️ Admin User** ➜ Click **Verify & Dispatch** on the pending order.
4. **Deliver Errand**: Log out and log in as **🏃‍♂️ Speedy Gonzales (Runner)** ➜ Toggle status to **ONLINE** ➜ Click **Start Fetching** (moves to *In Transit*) ➜ Click **Mark Delivered** (increments runner earnings balance).
5. **Apply as Runner**: Apply through the *Become a Runner* page ➜ Approve application under the *Admin User* applications list.
