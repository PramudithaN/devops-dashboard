This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# DevOps Dashboard

A full-stack Next.js dashboard for monitoring repository build status and logs, styled with Tailwind CSS, using MongoDB for data storage.

## Features

- View all repositories and their latest build status
- See build logs and trends with charts (Recharts)
- Add new repositories
- GitHub webhook integration for workflow runs
- Filters for build status (Success/Failed/All)
- Responsive, modern UI
- CI/CD with GitHub Actions (lint, test, build, deploy to Vercel or DockerHub)

## Folder Structure

```
components/         # React components (tables, charts, badges)
lib/                # DB connection and models
pages/api/          # API routes (repos, builds, webhook)
src/app/dashboard/  # Dashboard page
.github/workflows/  # CI/CD workflows
.env.example        # Example environment variables
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- `MONGODB_URI`: MongoDB connection string
- `GITHUB_WEBHOOK_SECRET`: GitHub webhook secret

## Setup & Running

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/dashboard` for the dashboard.

## MongoDB Models

- **Repo**: `{ name, url, lastBuildStatus, lastBuildTime }`
- **Build**: `{ repoId, status, commitHash, duration, timestamp }`

## API Routes

- `GET /api/repos` — List all repos
- `POST /api/repos` — Add a repo
- `GET /api/builds` — List build logs
- `POST /api/webhook` — GitHub workflow webhook

## CI/CD

See `.github/workflows/ci.yml` for GitHub Actions workflow. Configure Vercel/DockerHub secrets in your repo settings.

## Advanced Features (Optional)

- User authentication (NextAuth.js)
- Slack/Discord notifications
- Historical build performance graphs
- Deployment tracking

---

Feel free to customize and extend for your DevOps needs!
