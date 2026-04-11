# handy-utils

A collection of handy developer utilities built with Svelte 5 and SvelteKit.

## Features

- **Cookie Analysis Tool** - Compare and analyze cookies to understand their similarities and differences
- **Base64 Encoder/Decoder** - Encode plain text to Base64 or decode Base64 back to plain text
- **String Utilities** - Various string manipulation tools (case conversion, formatting, etc.)
- **Code Snippets** - Save and manage your code snippets (requires authentication)

## Tech Stack

- **Framework**: Svelte 5 + SvelteKit
- **Styling**: TailwindCSS v4
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Stytch
- **UI Components**: Custom components inspired by shadcn-ui

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run TypeScript checks |
| `npm run db:push` | Push database schema |
| `npm run db:generate` | Generate database migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run fmt` | Format code with Biome |

## Project Structure

```
src/
├── routes/
│   ├── (app)/           # Protected routes
│   │   ├── base64/      # Base64 encoder/decoder
│   │   ├── cookies/     # Cookie analysis tool
│   │   ├── snippets/    # Code snippet manager
│   │   └── strings/     # String utilities
│   ├── auth/            # Authentication routes
│   └── +page.svelte    # Home page
└── lib/
    ├── components/      # Reusable UI components
    └── server/         # Server-side code (db, auth)
```