# Second Brain (Frontend)

A personal knowledge base application built with Next.js. Capture, organize, and recall content in "Brains" (smart folders).

## Features

- **Authentication**: Secure login via GitHub, Google, or Credentials (NextAuth).
- **Brain Management**: Create and organize multiple "Brains".
- **Content Capture**: Add Links, Notes, Tweets, Videos, and more.
- **Modern UI**: Clean interface built with HeroUI and Tailwind CSS.
- **Dark Mode**: Fully supported theme switcher.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, HeroUI
- **Auth**: NextAuth.js
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see `NEXT_PUBLIC_API_URL`)

### Installation

1.  **Clone and Install:**
    ```bash
    git clone <repo-url>
    cd second-brain-FE
    npm install
    ```

2.  **Setup Environment:**
    Create a `.env.local` file in the root directory:

    ```env
    # Backend URL
    NEXT_PUBLIC_API_URL=http://localhost:3001

    # NextAuth Config
    AUTH_SECRET=your_auth_secret

    # OAuth Providers
    GITHUB_ID=your_github_id
    GITHUB_SECRET=your_github_secret
    GOOGLE_CLIENT_ID=your_google_id
    GOOGLE_CLIENT_SECRET=your_google_secret

    # Token Exchange (ES256)
    FE_JWS_PRIVATE_PEM=your_private_key
    FE_JWS_ISS=second-brain-web
    FE_JWS_AUD=second-brain-be
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - Start development server.
- `npm run build` - Build for production.
- `npm run start` - Start production server.
- `npm run lint` - Run ESLint.
