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

Open https://gamscholar.vercel.app/auth/login with your browser to see the deployed app.

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

## User Manual

### Overview

GamScholar is a Next.js application for managing scholarships. Users may browse scholarships, students can apply, donors can create scholarships, and admins manage listings and application status.

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with required environment variables (database URL, auth secrets, etc.) as defined in your deployment or local environment.

### Running Locally

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 to use the app.

### Using the App

- Home / Scholarships: Browse available scholarships.
- Authentication: Use the Sign up / Login links in the header. After login, you'll be redirected to your dashboard.
- Dashboard: Available actions depend on role:
	- Student: view and manage your applications.
	- Donor: create and edit scholarships, view applicants.
	- Admin: publish/unpublish scholarships and update status.
- Applying: Open a scholarship and click Apply to submit required documents.

### Theme & Appearance

- Global page background is white; authentication panels use blue shades for emphasis. Colors and variables are defined in `app/globals.css` — update the CSS variables there to change the palette.

### Troubleshooting

- If the dev server fails, check `npm run dev` output for missing env vars or port conflicts.
- If pages look unstyled, ensure Tailwind is installed and the build step ran correctly.

### Contributing

Contributions are welcome. Open issues or pull requests with clear descriptions and follow the repository's coding style.

### License

See the project root for licensing information.
