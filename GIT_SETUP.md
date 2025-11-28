# Git Integration Guide

## Step 1: Install Git (if not already installed)

1. Download Git for Windows from: https://git-scm.com/download/win
2. Run the installer and follow the setup wizard
3. Restart your terminal/PowerShell after installation

## Step 2: Initialize Git Repository

Open PowerShell in your project directory and run:

```powershell
# Navigate to your project (if not already there)
cd C:\Users\LENOVO\Desktop\Survey

# Initialize git repository
git init

# Configure your git identity (if not already configured globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Step 3: Add Files to Git

```powershell
# Add all files (respecting .gitignore)
git add .

# Check what will be committed
git status
```

## Step 4: Make Your First Commit

```powershell
# Create initial commit
git commit -m "Initial commit: Survey project with Playwright tests"
```

## Step 5: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name your repository (e.g., "Survey" or "survey-project")
4. **DO NOT** initialize with README, .gitignore, or license (you already have these)
5. Click "Create repository"

## Step 6: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Run these commands:

```powershell
# Add GitHub as remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 7: Verify

Go to your GitHub repository page and verify all your files are there!

## Future Updates

When you make changes to your code:

```powershell
# Stage changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## Troubleshooting

- **If git is not recognized**: Make sure Git is installed and restart your terminal
- **If authentication fails**: You may need to set up a Personal Access Token (Settings → Developer settings → Personal access tokens → Tokens (classic))
- **If push is rejected**: Make sure you've pulled any existing changes first: `git pull origin main`


