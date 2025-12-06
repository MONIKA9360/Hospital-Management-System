# Push to GitHub - Step by Step Guide

## Step 1: Install Git

### Download Git:
Go to: https://git-scm.com/download/win

1. Download "64-bit Git for Windows Setup"
2. Run the installer
3. Use default settings (just click Next)
4. Finish installation

### Verify Installation:
Open a **NEW** terminal and run:
```bash
git --version
```

Should show: `git version 2.x.x`

---

## Step 2: Configure Git (First Time Only)

Open terminal and run these commands:

```bash
git config --global user.name "MONIKA0360"
git config --global user.email "your-email@example.com"
```

Replace with your actual email used on GitHub.

---

## Step 3: Initialize Git Repository

In your project folder, run:

```bash
git init
git add .
git commit -m "Initial commit: Hospital Management System"
```

---

## Step 4: Connect to GitHub

Run this command (from your GitHub page):

```bash
git remote add origin https://github.com/MONIKA0360/HEALTH_CARE.git
git branch -M main
git push -u origin main
```

---

## Step 5: Enter GitHub Credentials

When prompted:
- **Username:** MONIKA0360
- **Password:** Use Personal Access Token (not your GitHub password)

### How to Create Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Hospital Project"
4. Select scopes: ✅ repo (all)
5. Click "Generate token"
6. Copy the token (save it somewhere safe!)
7. Use this token as password when pushing

---

## Quick Commands (After Git is Installed):

```bash
# Navigate to your project
cd "C:\Users\monik\OneDrive\Attachments\Desktop\ui hospital-management"

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Hospital Management System"

# Add remote
git remote add origin https://github.com/MONIKA0360/HEALTH_CARE.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Important Notes:

⚠️ **Your .env file will NOT be pushed** (it's in .gitignore)
✅ This is good for security (passwords won't be public)

⚠️ **node_modules will NOT be pushed** (it's in .gitignore)
✅ This is good (saves space, others can run `npm install`)

---

## After Pushing:

Your GitHub repository will have:
- ✅ All source code
- ✅ Frontend components
- ✅ Backend server
- ✅ Documentation
- ✅ README files
- ❌ .env file (hidden for security)
- ❌ node_modules (too large)

Others can clone and run:
```bash
git clone https://github.com/MONIKA0360/HEALTH_CARE.git
cd HEALTH_CARE
npm install
cd backend
npm install
```

---

## Troubleshooting:

### "git not found":
- Install Git from https://git-scm.com/download/win
- Restart terminal after installation

### "Permission denied":
- Use Personal Access Token instead of password
- Get token from: https://github.com/settings/tokens

### "Repository not found":
- Check repository URL is correct
- Make sure repository is created on GitHub

---

## Next Steps:

1. Install Git (if not installed)
2. Open terminal in project folder
3. Run the commands above
4. Enter your GitHub credentials
5. Done! Your code is on GitHub! 🎉
