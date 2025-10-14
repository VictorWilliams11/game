# Google OAuth Setup Guide for CBT Practice App

This guide will help you set up Google OAuth authentication for your CBT practice app.

## Prerequisites

- A Google account
- Access to your Supabase project dashboard
- Your app deployed or running locally

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 1.2 Create a New Project (or select existing)

1. Click the project dropdown at the top
2. Click **"New Project"**
3. Enter project name: `CBT Practice App` (or any name)
4. Click **"Create"**

### 1.3 Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and click **"Enable"**

### 1.4 Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in the required fields:
   - **App name:** CBT Practice App
   - **User support email:** Your email
   - **Developer contact email:** Your email
5. Click **"Save and Continue"**
6. Skip "Scopes" (click **"Save and Continue"**)
7. Skip "Test users" (click **"Save and Continue"**)
8. Click **"Back to Dashboard"**

### 1.5 Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**
4. Fill in:
   - **Name:** CBT Practice App Web Client
   - **Authorized JavaScript origins:**
     - `https://cbt.campusgist.com` (your production domain)
     - `http://localhost:3000` (for local testing)
   - **Authorized redirect URIs:**
     - `https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback`
     - Replace `[YOUR-SUPABASE-PROJECT-REF]` with your actual Supabase project reference
5. Click **"Create"**
6. **Copy the Client ID and Client Secret** (you'll need these for Supabase)

---

## Step 2: Configure Supabase

### 2.1 Go to Supabase Dashboard

1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your CBT Practice App project

### 2.2 Enable Google Provider

1. In the left sidebar, go to **"Authentication"** → **"Providers"**
2. Find **"Google"** in the list
3. Toggle it **ON**
4. Fill in the fields:
   - **Client ID:** Paste the Client ID from Google Cloud Console
   - **Client Secret:** Paste the Client Secret from Google Cloud Console
5. Click **"Save"**

### 2.3 Get Your Redirect URL

1. In the same page, you'll see **"Callback URL (for OAuth)"**
2. Copy this URL (it looks like: `https://xxxxx.supabase.co/auth/v1/callback`)
3. Make sure this URL is added to your Google OAuth credentials (Step 1.5)

---

## Step 3: Update Your App Configuration

### 3.1 Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

\`\`\`env
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

### 3.2 No Code Changes Needed

The Google OAuth buttons are already added to your login and sign-up pages. No additional code changes are required.

---

## Step 4: Test Google OAuth

### 4.1 Test Sign Up

1. Go to your app: `https://cbt.campusgist.com/auth/sign-up`
2. Click **"Continue with Google"**
3. Select your Google account
4. Grant permissions
5. You should be redirected to the dashboard

### 4.2 Test Login

1. Go to: `https://cbt.campusgist.com/auth/login`
2. Click **"Continue with Google"**
3. Select your Google account
4. You should be logged in and redirected to the dashboard

---

## Troubleshooting

### Issue 1: "Redirect URI mismatch" error

**Solution:**
- Make sure the redirect URI in Google Cloud Console exactly matches your Supabase callback URL
- Format: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
- No trailing slashes

### Issue 2: "Access blocked: This app's request is invalid"

**Solution:**
- Make sure you've enabled the Google+ API in Google Cloud Console
- Check that your OAuth consent screen is properly configured
- Verify your authorized JavaScript origins include your domain

### Issue 3: User redirected but not logged in

**Solution:**
- Check browser console for errors
- Verify your Supabase environment variables are correct
- Make sure the callback route exists: `app/auth/callback/route.ts`

### Issue 4: "This app isn't verified"

**Solution:**
- This is normal for apps in testing mode
- Click **"Advanced"** → **"Go to [App Name] (unsafe)"**
- For production, you'll need to verify your app with Google (optional)

---

## Production Checklist

Before going live:

- [ ] Update authorized JavaScript origins to include production domain
- [ ] Update authorized redirect URIs to include production Supabase URL
- [ ] Remove localhost URLs from Google OAuth credentials
- [ ] Test Google login on production domain
- [ ] (Optional) Submit app for Google verification if you want the "verified" badge

---

## Additional Notes

### User Profile Creation

When users sign up with Google:
- Their profile is automatically created in the `profiles` table
- Default role is `student`
- Email and name are pulled from their Google account
- To make someone an admin, manually update their role in the database

### Security

- Never commit your Google Client Secret to version control
- Store it securely in environment variables
- Rotate credentials if they're ever exposed

---

## Need Help?

If you encounter issues:
1. Check the Supabase logs: Dashboard → Logs → Auth
2. Check browser console for JavaScript errors
3. Verify all URLs match exactly (no typos, trailing slashes, etc.)
4. Make sure Google+ API is enabled

---

**Congratulations!** Your Google OAuth is now set up. Users can sign up and log in with their Google accounts.
