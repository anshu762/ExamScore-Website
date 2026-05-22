# ExamScore

Premium AI-powered exam preparation platform. Get board-specific answers, structured study guides, and strategic insights for IB, AP, Cambridge, CBSE, and ICSE examinations.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui (base-nova)
- **Animation:** Framer Motion
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** Auth.js v5 (NextAuth)
- **AI:** OpenAI SDK (pluggable provider architecture)
- **Validation:** Zod
- **Icons:** lucide-react

## Architecture

```
examscore/
├── app/
│   ├── (marketing)/       # Landing page and marketing routes
│   ├── (dashboard)/       # Dashboard routes (protected)
│   ├── api/               # API route handlers
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles and theme tokens
│   ├── layout.tsx         # Root layout with Spectral font
│   └── page.tsx           # Landing page (server component)
├── components/
│   ├── ui/                # Base UI components
│   ├── shared/            # Shared layout components
│   ├── dashboard/         # Dashboard-specific components
│   ├── landing/           # Landing page components
│   └── forms/             # Form components
├── lib/
│   ├── auth/              # Authentication configuration
│   ├── ai/                # AI provider abstraction layer
│   ├── validators/        # Zod schemas and validation
│   ├── prisma.ts          # Database client singleton
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (NeonDB recommended)
- OpenAI API key (for AI features)

### Setup

1. Clone the repository:
```bash
git clone <repo-url>
cd examscore
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your values:
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
AI_PROVIDER="openai"
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push schema to database |
| `npm run prisma:seed` | Seed database with initial data |
| `npm run prisma:studio` | Open Prisma Studio |

## Features

- **AI-Powered Answers:** Get structured, board-specific responses to academic questions
- **Board-Specific Guidance:** Supports IB, AP, Cambridge, CBSE, and ICSE curricula
- **Progress Tracking:** Monitor accuracy, consistency, and study streaks
- **Smart Organization:** Customizable folders for study materials
- **Adaptive Flashcards:** AI-generated and manual flashcards
- **Strategic Insights:** Personalized study recommendations

## Database Models

- User, Board, AcademicLevel, Subject
- QuestionSession, AIResponse
- Folder, FolderItem, Note, Flashcard
- OnboardingQuiz, GamificationMetric, AnalyticsEvent
- LiveUserCount

## AI Provider Architecture

The AI layer uses a pluggable provider pattern:

```typescript
interface AIProvider {
  name: string;
  generateAnswer(input: AIQuestionInput): Promise<AIResponseOutput>;
}
```

Currently supports OpenAI. Extensible for Anthropic, Google AI, etc.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth.js secret key |
| `AUTH_URL` | Application URL |
| `OPENAI_API_KEY` | OpenAI API key |
| `AI_PROVIDER` | AI provider (default: openai) |

## License

MIT
