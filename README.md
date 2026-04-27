# Custom-Clerk-Auth-Template

A premium, full-stack authentication starter template built with **TanStack Start**, **Clerk**, and **Prisma**. This project demonstrates a high-end implementation of custom authentication flows, moving beyond basic pre-built components to provide a fully branded and optimized user experience.


## ✨ Features

-   **Custom Clerk Authentication**: Bespoke implementation using Clerk Hooks (`useSignIn`, `useSignUp`) for total UI control.
-   **Premium UI/UX**: Crafted with a "Linear" aesthetic using **Tailwind CSS 4.0** and **Lucide React**.
-   **Secure Verification flow**: custom 6-digit email OTP verification interface.
-   **Intelligent Sign-up**: Real-time password strength validation and confirmation matching.
-   **Protected Routes**: Robust dashboard protection using TanStack Router's authentication logic.
-   **Type Safe**: End-to-end type safety with TypeScript and TanStack Start.
-   **High Performance**: Powered by Vite and React 19 for instantaneous interactions.

## 🛠️ Tech Stack

-   **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack React)
-   **Authentication**: [Clerk](https://clerk.com/) (Custom UI Implementation)
-   **Database / ORM**: [Prisma](https://www.prisma.io/) with PostgreSQL
-   **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Linting & Formatting**: [Biome](https://biomejs.dev/)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   pnpm (recommended)
-   Clerk Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/custom-clerk-auth-template.git
   cd custom-clerk-auth-template
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root and add your Clerk keys:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   DATABASE_URL="postgresql://username:password@localhost:5432/custom-clerk-auth-template"
   ```

4. **Initialize Database:**
   ```bash
   pnpm db:push
   ```

5. **Start Development Server:**
   ```bash
   pnpm dev
   ```

## 📂 Project Structure

```text
src/
├── integrations/      # Clerk & Query Provider setups
├── routes/            # File-based routing (TanStack Router)
│   ├── index.tsx      # Protected Dashboard
│   ├── sign-in.$.tsx  # Custom Login Page
│   ├── sign-up.$.tsx  # Custom Register Page with strength meter
│   └── verify.tsx     # Custom OTP Verification
├── db.ts              # Prisma Client instance
└── main.tsx           # App Entry point
```

## 🧠 Key Implementation Details

### Custom Authentication Hooks
Instead of using `<SignIn />`, Custom-Clerk-Auth-Template utilizes lower-level hooks like `useSignIn()` to handle the authentication state manually. This allows for:
-   Granular loading states and custom error handling.
-   Complete design flexibility (no Clerk-branded containers).
-   Custom routing logic during the sign-in/up process.

### Password Strength Meter
The sign-up flow includes a custom validation engine that calculates password entropy and provides visual feedback to users, ensuring better security from the start.

### Email Verification Flow
A dedicated `/verify` route handles the OTP submission, featuring auto-focusing inputs and resend logic, providing a seamless onboarding experience.

## 📜 Available Scripts

-   `pnpm dev`: Runs the app in development mode.
-   `pnpm build`: Builds the app for production.
-   `pnpm db:push`: Syncs the Prisma schema with your database.
-   `pnpm db:studio`: Opens Prisma Studio to view/edit data.
-   `pnpm check`: Runs Biome linting and formatting checks.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by [Your Name/Handle]
