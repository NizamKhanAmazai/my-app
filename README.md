This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase Postgres Signup Integration

This project's signup API stores users in a Supabase PostgreSQL database.

### 1. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required values:

- `DATABASE_URL`: Supabase Postgres connection string used by Prisma.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Used for browser Supabase client usage.

For the current signup implementation, user creation is done via Prisma (`DATABASE_URL`) directly against Supabase Postgres.
`SUPABASE_SERVICE_ROLE_KEY` is optional unless you use server-side Supabase REST calls.

### 2. Run Prisma migration/generate

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 3. Start the app

```bash
npm run dev
```

The signup form at `/sign-up` calls `/api/auth/signup`, hashes the password with bcrypt, and inserts the user into the Supabase Postgres `User` table through Prisma.

### 4. Supabase dashboard checks (required)

1. In Supabase, open **Project Settings > Database** and copy the Postgres connection string into `DATABASE_URL`.
2. Keep Prisma migrations in sync:

```bash
npm run prisma:migrate
npm run prisma:generate
```

3. In **Table Editor**, confirm the `User` table exists and new rows appear after signup.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
