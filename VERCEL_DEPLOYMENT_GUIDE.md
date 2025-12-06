# Vercel Deployment Guide

## ✅ Backend Converted to Serverless Functions

Your Express backend has been converted to Vercel serverless functions in the `/api` folder:
- `/api/patients/index.js` - GET all patients, POST new patient
- `/api/patients/[adminNo].js` - GET, PUT, DELETE single patient
- `/api/initialize.js` - Initialize sample data
- `/api/health.js` - Health check endpoint

## 📋 Prerequisites

### 1. Set Up MySQL Database (Choose One Option)

#### Option A: Aiven MySQL (Recommended - Free Tier)
1. Go to https://aiven.io/
2. Sign up for free account
3. Create a new MySQL service
4. Note down these credentials:
   - Host (e.g., `mysql-xxxxx.aivencloud.com`)
   - Port (e.g., `11831`)
   - User (e.g., `avnadmin`)
   - Password
   - Database name: `hospital_management`

#### Option B: PlanetScale (Alternative - Free Tier)
1. Go to https://planetscale.com/
2. Sign up for free account
3. Create a new database
4. Get connection details

#### Option C: Railway MySQL (Alternative)
1. Go to https://railway.app/
2. Create MySQL database
3. Get connection details

### 2. Create Database Tables

Connect to your MySQL database and run the SQL from `backend/setup-database.sql`:

```sql
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adminNo VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(10) NOT NULL,
  bloodGroup VARCHAR(5) NOT NULL,
  contactNo VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  healthIssue TEXT NOT NULL,
  medicines JSON,
  nextAppointment DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 Deploy to Vercel

### Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "Convert backend to Vercel serverless functions"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import your GitHub repository: `Hospital-Management-System`
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```
DB_HOST=your-mysql-host.aivencloud.com
DB_PORT=11831
DB_USER=avnadmin
DB_PASSWORD=your-password-here
DB_NAME=hospital_management
```

**Important**: Replace with your actual MySQL credentials!

### Step 4: Deploy

Click "Deploy" and wait for deployment to complete.

## 🧪 Test Your Deployment

After deployment, test these endpoints:

1. **Health Check**: `https://your-app.vercel.app/api/health`
2. **Get Patients**: `https://your-app.vercel.app/api/patients`
3. **Initialize Data**: POST to `https://your-app.vercel.app/api/initialize`

## 📱 Access Your App

Your full-stack hospital management system will be live at:
`https://your-app.vercel.app`

## 🔧 Local Development

To run locally:

```bash
# Frontend
npm run dev

# Backend (old Express server - still works locally)
cd backend
npm start
```

## ⚠️ Important Notes

1. **Database**: You MUST use an external MySQL database (Aiven, PlanetScale, or Railway)
2. **Environment Variables**: Set them in Vercel dashboard under Settings → Environment Variables
3. **CORS**: Already configured in API functions
4. **Serverless Functions**: Each API route runs independently (no persistent connections)

## 🆘 Troubleshooting

### "Error connecting to server"
- Check environment variables in Vercel
- Verify MySQL database is accessible from internet
- Check MySQL credentials are correct

### "Patient not found" or empty list
- Run the initialize endpoint: POST to `/api/initialize`
- Check database has the patients table created

### Build fails
- Make sure `mysql2` is in package.json dependencies
- Check all API files are in `/api` folder
- Verify vercel.json is in root directory

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MySQL database connection
3. Test API endpoints individually
