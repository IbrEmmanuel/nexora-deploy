# NexoraGrid

**AI-powered business infrastructure SaaS platform** — unifying analytics, automation, team collaboration, and intelligent insights into a single, scalable workspace.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Backend | NestJS, GraphQL (Apollo), REST |
| Databases | PostgreSQL (primary), MongoDB (analytics/logs), Redis (cache/queues) |
| Auth | JWT + Refresh Tokens, OAuth (Google, GitHub) |
| AI | OpenAI GPT-4o, Anthropic Claude |
| Billing | Stripe |
| Storage | AWS S3 |
| Monorepo | Turborepo + npm workspaces |
| Containers | Docker + Docker Compose |

---

## Project Structure

```
nexoragrid/
├── frontend/          # Next.js 14 App Router
│   ├── src/
│   │   ├── app/       # App Router pages & layouts
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   ├── common/
│   │   └── main.ts
│   └── package.json
├── shared/            # Shared types & utilities
│   ├── src/
│   └── package.json
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Docker & Docker Compose

### 1. Clone and install

```bash
git clone https://github.com/your-org/nexoragrid.git
cd nexoragrid
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start infrastructure

```bash
# Start databases only
docker-compose up postgres mongodb redis -d

# Or start everything
docker-compose up -d
```

### 4. Run database migrations

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 5. Start development servers

```bash
# From root — starts all workspaces in parallel
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql
- pgAdmin: http://localhost:5050 (with `--profile tools`)
- Redis Commander: http://localhost:8081 (with `--profile tools`)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services in development mode |
| `npm run build` | Build all packages |
| `npm run lint` | Lint all packages |
| `npm run test` | Run all tests |
| `npm run clean` | Clean all build artifacts |

---

## Architecture Overview

### Multi-tenancy
NexoraGrid uses a **schema-per-tenant** approach in PostgreSQL for strong data isolation, with a shared MongoDB cluster for cross-tenant analytics.

### AI Integration
The AI assistant module connects to OpenAI GPT-4o for natural language queries, automated report generation, and workflow suggestions. All AI interactions are logged and auditable.

### Real-time
WebSocket subscriptions via GraphQL (Apollo) power live dashboards, notifications, and collaborative features.

### Queue System
Bull queues backed by Redis handle background jobs: email delivery, report generation, AI batch processing, and webhook dispatch.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT © NexoraGrid
