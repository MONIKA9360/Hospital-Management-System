# Fix for Vercel Deployment

## Problem
The password `Monika@2025` contains `@` symbol which conflicts with the PostgreSQL URL format.

## Solution
URL-encode the password in the connection string.

### Current (Wrong):
```
postgresql://postgres:Monika@2025@db.bpgoiotgsaywvapuicbg.supabase.co:5432/postgres
```

### Fixed (Correct):
```
postgresql://postgres:Monika%402025@db.bpgoiotgsaywvapuicbg.supabase.co:5432/postgres
```

## Steps to Fix:

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Find `POSTGRES_URL`
3. Click "Edit"
4. Replace the value with:
   ```
   postgresql://postgres:Monika%402025@db.bpgoiotgsaywvapuicbg.supabase.co:5432/postgres
   ```
   (Note: `@` is replaced with `%40`)
5. Click "Save"
6. Go to Deployments → Redeploy

## URL Encoding Reference:
- `@` = `%40`
- `#` = `%23`
- `$` = `%24`
- `%` = `%25`
- `&` = `%26`
