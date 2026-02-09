# GitIntel 🚀

GitIntel is a **GitHub analytics and intelligence platform** that tracks repositories, contributors, and pull request activity to generate meaningful insights like contribution scores, merge rates, and live activity feeds.

It is built with **Next.js, Prisma, Supabase, Redis, and GitHub Webhooks**, and is designed to work both locally and in production (Vercel).

---

## ✨ Features

- 📊 **Repository Analytics**
  - Total PRs
  - Merge rate
  - Contribution statistics

- 🏆 **Contributor Leaderboard**
  - Score-based ranking
  - PR activity & impact tracking

- 🔔 **Live GitHub Events**
  - PR opened / merged
  - Push events
  - Real-time updates via webhooks

- ⚙️ **Background Worker**
  - Periodic GitHub polling
  - Score recalculation
  - Event processing

- 🧠 **Intelligent Scoring**
  - Merge weight
  - Bug-fix weighting
  - Review contributions

---

## 🏗️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Queue / Cache**: Redis (Upstash)
- **Auth / Integrations**: GitHub App + Webhooks
- **Deployment**: Vercel

---

## 📂 Project Structure

apps/
web/ → Next.js frontend + API routes
worker/ → Background worker (queues, polling)
prisma/ → Prisma schema & migrations


---

## 🔐 Environment Variables

Create a `.env` file (or configure in Vercel):

```env
# Database (Supabase)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Redis
REDIS_URL=rediss://...

# GitHub App
GITHUB_APP_ID=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=
GITHUB_PRIVATE_KEY=

# NextAuth (if enabled)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
⚠️ Never commit .env files or secrets to GitHub

🧬 Prisma Setup
npx prisma generate
npx prisma migrate dev
Prisma is configured using a singleton client to avoid connection issues in serverless environments.

▶️ Running Locally
# install dependencies
npm install

# start web app
cd apps/web
npm run dev

# start worker (separately)
cd apps/worker
npm run dev
App will be available at:

http://localhost:3000
🚀 Deployment (Vercel)
Push to GitHub

Import repo into Vercel

Add environment variables

Deploy

Recommended:

Use Supabase connection pooling

Use Prisma singleton

Clear build cache if env vars change

🧪 Health Check
If APIs return 500, check:

Database credentials

Prisma client instantiation

Supabase connection pooling

Worker availability

📈 Roadmap
 Organization-level analytics

 Time-based contribution trends

 Alerts & notifications

 Exportable reports

🤝 Contributing
Pull requests are welcome.
For major changes, please open an issue first.

📜 License
MIT License © 2026 GitIntel


---

If you want, next we can:
- Add badges (Vercel, Prisma, Supabase)
- Add screenshots / demo GIFs
- Split README into **docs/** for architecture & API

Just say the word 👌
