# 🔧 Google OAuth Setup Instructions

## Problem
Getting "Error 401: invalid_client" and "no registered origin" when trying to sign in with Google.

## Solution

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Select your project or create a new one
3. Enable the Google+ API (if not already enabled)

### Step 2: Configure OAuth 2.0 Client
1. Navigate to **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID or create a new one
3. Click **Edit** (pencil icon)

### Step 3: Add Authorized Origins
In the **Authorized JavaScript origins** section, add these URLs:

```
http://localhost:3000
http://localhost:5173
http://localhost:5174
http://localhost:5175
http://127.0.0.1:3000
http://127.0.0.1:5173
http://127.0.0.1:5174
http://127.0.0.1:5175
```

### Step 4: Add Redirect URIs
In the **Authorized redirect URIs** section, add these URLs:

```
http://localhost:5174/auth/callback
http://localhost:5173/auth/callback
http://localhost:3000/auth/callback
```

### Step 5: Save Configuration
1. Click **Save** at the bottom
2. Wait a few minutes for changes to propagate

### Step 6: Test Authentication
1. Go to `http://localhost:5175/auth`
2. Click "Continue with Google"
3. Should now work without errors

## Current Client ID
Use the Client ID stored in your `client/.env` file as `VITE_GOOGLE_CLIENT_ID`.

## Alternative: Create New OAuth Client
If you can't edit the existing client:

1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Choose **Web application**
3. Add the origins and redirect URIs from above
4. Copy the new Client ID
5. Update the `GOOGLE_CLIENT_ID` in your `.env` file

## Verification
After setup, the auth page will show a green checkmark instead of the yellow warning.

## Production Setup
For production, add your actual domain:
- Origins: `https://yourdomain.com`
- Redirect URIs: `https://yourdomain.com/auth`