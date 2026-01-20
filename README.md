This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
# GamScholar — User Manual

## Overview

GamScholar is a Next.js application for managing scholarships. Users can browse scholarships, students can apply, donors can create scholarships, and admins manage listings and application status.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Mr-Yusz/gamscholar.git
cd gamscholar
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with required environment variables (database URL, NextAuth secret, etc.). Example variables you might need:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NEXTAUTH_SECRET=your-secret
```

Adjust according to your environment and deployment provider.

## Running Locally

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 or use the deployed login URL: https://gamscholar.vercel.app/auth/login

## Application Flow

- **Home / Scholarships:** Browse available scholarships.
- **Authentication:** Use the Sign up / Login links in the header. After login, you'll be redirected to your dashboard.
- **Dashboard:** Available actions depend on role:
	- **Student:** view and manage your applications.
	- **Donor:** create and edit scholarships, view applicants.
	- **Admin:** publish/unpublish scholarships and update status.
- **Applying:** Open a scholarship and click Apply to submit required documents.

## Theme & Appearance

- Global page background is white; authentication panels use blue shades for emphasis. Colors and variables are defined in `app/globals.css` — update the CSS variables there to change the palette.

## Screenshots

Screenshot placeholders have been removed. To add screenshots to the manual, place image files in `public/screenshots/` and reference them from this README.

## Troubleshooting

- If the dev server fails, check `npm run dev` output for missing env vars or port conflicts.
- If pages look unstyled, ensure Tailwind is installed and the build step ran correctly.

## Contributing

Contributions are welcome. Open issues or pull requests with clear descriptions and follow the repository's coding style.

## License

See the project root for licensing information.
### Overview

### Screenshots

Below are example screenshots. Replace the images in `public/screenshots/` with real captures from the app to update these previews.

- Login page:

	![Login Screenshot](public/screenshots/login-placeholder.svg)

- Signup page:

	![Signup Screenshot](public/screenshots/signup-placeholder.svg)

- Dashboard:

	![Dashboard Screenshot](public/screenshots/dashboard-placeholder.svg)

To capture and add screenshots:

1. Open the deployed app at https://gamscholar.vercel.app/auth/login (or your local `npm run dev` URL).
2. Use your OS screenshot tool or browser devtools to capture the desired area.
3. Save the images to `public/screenshots/` (recommended PNG, 1200×700 for consistency).
4. Commit and push the images to update the README previews.

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
