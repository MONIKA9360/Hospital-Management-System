# 🚀 Quick Deployment Steps

## ✅ Code is Ready!

Your backend has been converted to Vercel serverless functions. Now follow these steps:

---

## Step 1: Set Up MySQL Database (5 minutes)

### Using Aiven (Recommended - Free)

1. Go to: https://aiven.io/
2. Click "Sign Up" (use your GitHub or Google account)
3. After login, click "Create Service"
4. Select **MySQL**
5. Choose **Free Plan** (Hobbyist)
6. Select a region close to you
7. Click "Create Service"
8. Wait 2-3 minutes for service to start
9. Click on your service → "Overview" tab
10. Copy these details:
   - **Service URI** (host and port)
   - **User**: avnadmin
   - **Password**: (shown on screen)

### Create Database Table

1. In Aiven, go to "Databases" tab
2. Create database named: `hospital_management`
3. Go to "Query Editor" tab
4. Copy and paste this SQL:

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

5. Click "Run Query"

---

## Step 2: Deploy to Vercel (3 minutes)

1. Go to: https://vercel.com/
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Select: `MONIKA9360/Hospital-Management-System`
5. Configure:
   - Framework: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. Click "Environment Variables" and add:

```
DB_HOST = mysql-xxxxx.aivencloud.com
DB_PORT = 11831
DB_USER = avnadmin
DB_PASSWORD = your-password-from-aiven
DB_NAME = hospital_management
```

**⚠️ Important**: Replace with YOUR actual Aiven credentials!

7. Click "Deploy"
8. Wait 2-3 minutes

---

## Step 3: Test Your App

After deployment completes:

1. Click "Visit" to open your app
2. Login with: `admin1234` / `1234`
3. If no patients show, click "Initialize Sample Data" button
4. Your app is now live! 🎉

---

## 🔗 Your Live URLs

- **App**: `https://your-project-name.vercel.app`
- **API Health**: `https://your-project-name.vercel.app/api/health`
- **API Patients**: `https://your-project-name.vercel.app/api/patients`

---

## 🆘 If Something Goes Wrong

### "Error connecting to server"
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Check all 5 variables are set correctly
3. Redeploy: Deployments → Click "..." → "Redeploy"

### "Patient list is empty"
1. Open: `https://your-app.vercel.app/api/initialize`
2. This will add sample patients
3. Refresh your app

### Build Failed
1. Check Vercel deployment logs
2. Make sure GitHub repo has latest code
3. Try redeploying

---

## 📱 Share Your App

Once deployed, you can share your Vercel URL with anyone!

They can:
- View patient records
- Add new patients
- Generate bills
- Print invoices

No installation needed - just open the link! 🌐
