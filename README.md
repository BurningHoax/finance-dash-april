<table>
	<tr>
		<td width="100%" align="left">
			<h1><b>FinDash</b></h1>
			<p>
				A finance dashboard focused on clarity, speed, and practical day-to-day money tracking.
			</p>
		</td>
	</tr>
</table>

## 1) Motivation

FinDash started as a focused project to solve a very common problem: most personal finance tools are either too heavy, too noisy, or too rigid for quick everyday use.

The goal here was to build a dashboard that feels lightweight but still gives strong visibility into money flow:

- Understand income vs expenses quickly
- Track transactions with low friction
- Support guest exploration without account lock-in
- Add secure persistence when users sign up

The product direction is simple: actionable finance tracking first, complexity later.

## 2) Tech Stack Used (and Why)

### Framework and Language

- Next.js (App Router)
  - Reliable production deployment path (Vercel)
  - Great routing and API route support in one codebase
  - Strong performance defaults
- TypeScript
  - Better safety for domain models (transactions, auth payloads)
  - Cleaner refactors as features grow

### UI and Styling

- Tailwind CSS + shadcn/ui primitives
  - Fast, consistent UI composition
  - Reusable components with low CSS maintenance
- Lucide React icons
  - Lightweight and clean icon set

### Data and Auth

- Supabase (`@supabase/supabase-js`)
  - Managed auth and Postgres-backed storage
  - Smooth OTP/password-reset flows
  - RLS-friendly for per-user data security
- Zustand
  - Simple global state for transactions and UI flags
  - Less boilerplate than heavier state libraries

### Charts

- Recharts
  - Flexible finance visualizations with clear, maintainable config

## 3) Run the Application

### Prerequisites

- Node.js 20+
- pnpm

### Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE="your-service-role-key"
```
[!WARNING]
>Never upload/expose the environment variables, in case, they get explosed, rotate them.
### Install and run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

### Quality checks

```bash
pnpm lint
pnpm build
```

### Vercel deployment link: Not live yet

Deployment guide will be finalized after production domain is confirmed.

When deploying, update Supabase redirect URLs from localhost to your Vercel/production domain:

- `/reset-password`
- `/transactions`

Keep localhost redirects for local development.

## 4) Future Scope

Planned features in upcoming phases:

- Expense sharing: split bills and shared balances
- Friends graph: add/manage trusted finance collaborators
- In-app chat: discussion around shared expenses
- Trip planning mode: budgets, shared trip pots, and spend tracking

## Project Details

### 👨‍💻 About the Developer

Hi, I am **Nishant Kumar**! I enjoy building full-stack applications and am currently looking for exciting SDE opportunities.

If you liked this project, have feedback, or want to discuss a potential role, feel free to reach out.

📫 **Contact:** [Dev.nishantk@gmail.com](mailto:Dev.nishantk@gmail.com)

### Project timeline

- Start: March 2026 - April 2026

### Notes

This project is intentionally scoped to stay fast and usable. The architecture is prepared for feature expansion, but current implementation prioritizes reliability, readability, and clean UX.