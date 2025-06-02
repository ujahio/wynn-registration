## Setup

#### Deployed Site

https://wynn-registration.vercel.app/register/user-info

### Set up Vercel and Neon

This project uses Vercel and Neon for hosting and database management. Follow these steps to set up your environment:

1. Create a new project on [Vercel](https://vercel.com).
2. Connect your GitHub repository to Vercel (or create new repo + project directly from vercel).
3. Naviagate to Dashboard.
4. Navigate to Storage and select Neon Serverless Postgres from Marketplace.
5. Fill out the form to create a new Neon database.

### [Setup Prisma](./PRISMA-SETUP.md)

### Add Environmental Variables

Create a `.env` file in the root directory and add the following variables:

```env
VERIFY_TOKEN_SECRET=
DATABASE_URL=
```

### Add Vercel repository secrets

```env
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
```
