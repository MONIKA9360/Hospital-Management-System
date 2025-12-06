# 🚀 Deploy to Vercel with PostgreSQL

## ✅ Your Project is Ready!

I've converted your backend from MySQL to PostgreSQL to work with Vercel Postgres.

---

## Step 1: Push Code to GitHub (1 minute)

Run these commands in your terminal:

```bash
npm install pg
git add .
git commit -m "Convert to PostgreSQL for Vercel deployment"
git push origin main
```

---

## Step 2: Deploy to Vercel (3 minutes)

### A. Import Project

1. Go to: **https://vercel.com/**
2. Click **"Add New"** → **"Project"**
3. Select your repository: **"Hospital-Management-System"**
4. Click **"Import"**

### B. Configure Build Settings

- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### C. Click "Deploy"

Wait 2-3 minutes for initial deployment.

---

## Step 3: Add Vercel Postgres Database (2 minutes)

### A. Create Database

1. After deployment, go to your project dashboard
2. Click **"Storage"** tab at the top
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose **"Continue"** (Hobby - Free plan)
6. Database name: `hospital-db` (or any name you like)
7. Region: Select closest to you
8. Click **"Create"**

### B. Connect Database

Vercel will automatically add the `POSTGRES_URL` environment variable to your project!

---

## Step 4: Initialize Database Tables (1 minute)

### A. Go to Vercel Postgres Dashboard

1. In your project, click **"Storage"** tab
2. Click on your **"hospital-db"** database
3. Click **"Query"** tab

### B. Run Setup SQL

Copy and paste this SQL and click **"Run Query"**:

```sql
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  "adminNo" VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL,
  "bloodGroup" VARCHAR(5) NOT NULL,
  "contactNo" VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  "healthIssue" TEXT NOT NULL,
  medicines JSONB DEFAULT '[]',
  "nextAppointment" DATE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_no ON patients("adminNo");
CREATE INDEX IF NOT EXISTS idx_created_at ON patients("createdAt");
```

Click **"Run Query"** button.

---

## Step 5: Redeploy (1 minute)

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## Step 6: Test Your App! 🎉

1. Click **"Visit"** to open your app
2. Login with: `admin1234` / `1234`
3. Click **"Initialize Sample Data"** button to add test patients
4. Your app is now live!

---

## 🔗 Your Live URLs

- **App**: `https://your-project.vercel.app`
- **API Health**: `https://your-project.vercel.app/api/health`
- **API Patients**: `https://your-project.vercel.app/api/patients`

---

## 🆘 Troubleshooting

### "Error connecting to server"
1. Make sure Postgres database is created
2. Check that `POSTGRES_URL` is in Environment Variables
3. Redeploy the project

### "Patient list is empty"
1. Click "Initialize Sample Data" button in the app
2. Or visit: `https://your-app.vercel.app/api/initialize`

### "Table doesn't exist"
1. Go to Storage → Your Database → Query tab
2. Run the CREATE TABLE SQL again

---

## 💰 Cost

**Everything is FREE!**
- Vercel Hobby Plan: Free
- Vercel Postgres: Free (up to 256 MB)
- Perfect for your hospital management system

---

## 📊 What Changed from MySQL?

- ✅ Database: MySQL → PostgreSQL
- ✅ Driver: mysql2 → pg
- ✅ Query syntax: `?` → `$1, $2, $3`
- ✅ Everything else works the same!

Your app functionality remains identical - just the database backend changed.

---

## 🎯 Next Steps

1. Share your Vercel URL with others
2. Add more patients
3. Generate bills and invoices
4. Everything works online now!

**Start with Step 1 - push your code to GitHub!**
