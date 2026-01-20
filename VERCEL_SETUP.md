# Vercel Deployment Fix for NextAuth Error

## The Problem
Error: `CLIENT_FETCH_ERROR - Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

This happens when NextAuth returns HTML error pages instead of JSON, typically due to missing or incorrect environment variables in Vercel.

## Solution: Set Environment Variables in Vercel

### Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add **ALL** of these variables for **Production, Preview, AND Development** environments:

### Required Variables:

```
NEXTAUTH_URL
Value: https://your-actual-domain.vercel.app
(Replace with your actual Vercel URL - NO TRAILING SLASH)

NEXTAUTH_URL_INTERNAL  
Value: https://your-actual-domain.vercel.app
(Same as NEXTAUTH_URL)

NEXTAUTH_SECRET
Value: a1b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123
(Use your existing secret)

DATABASE_URL
Value: postgresql://neondb_owner:npg_24IaSnKBmzgr@ep-damp-bird-ahmtlhqs-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

SMTP_HOST
Value: smtp.gmail.com

SMTP_PORT
Value: 465

SMTP_USER
Value: Yusuphajatta4@gmail.com

SMTP_PASS
Value: qoxemumooacifreg

SMTP_FROM
Value: Yusuphajatta4@gmail.com
```

## Critical Steps:

1. ✅ **Check all variables are set** in Vercel dashboard
2. ✅ **Verify NEXTAUTH_URL** is your production URL (NOT localhost)
3. ✅ **Check all three environments** are selected (Production, Preview, Development)
4. ✅ **Redeploy** after adding variables (Settings → Deployments → Redeploy)
5. ✅ **Clear browser cache** and cookies after redeployment

## How to Verify:

After deployment, open your browser console on your Vercel site and check if the error is gone. If you still see the error:

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Verify EVERY variable is there
3. Click on each variable and confirm it's set for all 3 environments
4. Trigger a new deployment (NOT just redeploy - make a small commit and push)

## Common Mistakes:

❌ NEXTAUTH_URL set to `http://localhost:3000` in production
❌ Variables not selected for all three environments
❌ Trailing slash in NEXTAUTH_URL
❌ NEXTAUTH_SECRET missing or empty
❌ Not redeploying after adding variables

## Code Changes Already Applied:

✅ Added `secret: process.env.NEXTAUTH_SECRET` to auth config
✅ Added proper cookie configuration for production
✅ Added `useSecureCookies` for production environment
✅ Session configuration with proper maxAge

The code is correct. The issue is 100% with environment variables in Vercel.
