# Rental Property Registration & Management System

A modern, full-stack real estate leasing application built with Nuxt, Vue 3, Prisma, and Tailwind CSS. The system provides two primary experiences: a public-facing portal where prospective tenants can browse rental properties and apply, and a comprehensive admin dashboard for property and application management.

## 🚀 Current Status: Phase 2 Completed
The system's **Tenant/User Portal** is fully functional, complete with user authentication, a searchable property catalog, the ability to save favorite properties, and a multi-step property application form with document uploads.

---

## 🛠 Tech Stack
- **Framework:** [Nuxt](https://nuxt.com/) (Vue 3)
- **UI & Styling:** [Nuxt UI](https://ui.nuxt.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database Engine:** MySQL
- **Authentication:** [Nuxt Auth (Sidebase)](https://sidebase.io/nuxt-auth/)
- **Icons:** Nuxt Icon (Iconify)

---

## ✨ Features (Tenant Portal)
- 🔒 **User Authentication:** Secure registration, login, and session persistence.
- 🏠 **Property Catalog:** Dynamic, responsive grids displaying available rental properties.
- 📋 **Property Details:** Comprehensive view of property amenities, pricing, descriptions, and galleries.
- 🏢 **Property Applications:** 
  - Multi-step job/background application process.
  - Secure document uploads.
  - Form validation.
- ❤️ **Saved Properties:** Allows users to bookmark listings and review them later in their private dashboard.
- 🛡️ **Route Protection:** Custom middleware (`auth.ts` and `guest.ts`) preventing unauthenticated users from applying and hiding login prompts from authenticated users.

---

## 🏗 Planned Features (Phase 3 & 4)
- **Admin Dashboard Layout:** Navigation sidebars, overview analytics, and summary cards.
- **Property CRUD:** Backoffice tables and forms to list, edit, and delist properties.
- **Application Review Workflow:** Admin interfaces to natively view tenant applications, approve or reject them, and manage document verifications.
- **Tenant Management:** User profile database, rent roll data, and banning capabilities.
- **In-App Notifications:** Alert systems for application status changes.

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+ recommended)
- MySQL Server

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your environment variables:
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
AUTH_SECRET="your-secure-random-secret"
AUTH_ORIGIN="http://localhost:3000"
```

### 4. Database Setup
Push the prisma schema to your database and generate the client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start Development Server
Start the Nuxt dev server on `http://localhost:3000`:
```bash
npm run dev
```

---

## 📝 Building for Production

Build the application:
```bash
npm run build
```

Locally preview the production build:
```bash
npm run preview
```
