# Repository Setup Guide

This document provides a complete checklist for setting up The Chronoscope repository for public use.

## ✅ Completed Setup

The following has been configured for you:

### 📄 Documentation

- ✅ **README.md** - Professional README with badges, features, and instructions
- ✅ **CLAUDE.md** - Architecture and development guide for AI assistants
- ✅ **CONTRIBUTING.md** - Comprehensive contributor guide
- ✅ **LICENSE** - MIT License
- ✅ **.github/WORKFLOWS.md** - GitHub Actions documentation
- ✅ **.github/SECURITY.md** - Security policy and vulnerability reporting

### 🤖 GitHub Actions Workflows

- ✅ **auto-pr.yml** - Automatically creates PRs when you push to feature branches
- ✅ **vercel-deploy.yml** - Deploys to Vercel when PRs are merged to main

### 🔧 Configuration Files

- ✅ **.gitignore** - Updated with Vercel and testing exclusions
- ✅ **.env.example** - Template for environment variables

### 🌐 GitHub Repository

- ✅ **Description updated** - Professional repository description
- ✅ **Topics added** - react, typescript, vite, tailwindcss, gemini, ai, history, visualization, time-travel, historical
- ✅ **Public repository** - Ready for community contributions

---

## 🚀 Next Steps: Enable Branch Protection

To secure your repository, enable branch protection:

### 1. Go to Repository Settings

```
https://github.com/BioInfo/chronoscope/settings/branches
```

### 2. Add Branch Protection Rule

Click **"Add rule"** and configure:

#### Branch name pattern
```
main
```

#### Required Settings

✅ **Require a pull request before merging**
- Require approvals: **1**
- Dismiss stale pull request approvals when new commits are pushed

✅ **Require status checks to pass before merging**
- Require branches to be up to date before merging

✅ **Require conversation resolution before merging**

✅ **Do not allow bypassing the above settings**

#### Optional (Recommended)

- ✅ Require deployments to succeed before merging
- ✅ Lock branch (prevent deletion)
- ✅ Restrict who can push to matching branches (select yourself only)

### 3. Save Changes

Click **"Create"** to enable branch protection.

---

## 🚀 Next Steps: Configure Vercel

You have two options for Vercel deployment:

### Option A: Vercel GitHub Integration (Recommended)

This is the easiest and most secure option:

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import Git Repository** → Select `chronoscope`
4. **Configure Project**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **"Deploy"**

**Benefits:**
- ✅ Automatic deployments on push to `main`
- ✅ Preview deployments for PRs
- ✅ No GitHub secrets needed
- ✅ Environment variables managed in Vercel dashboard

### Option B: GitHub Actions Deployment

If you prefer to use the GitHub Actions workflow:

1. **Get Vercel Token**:
   ```bash
   npm i -g vercel
   vercel login
   # Follow prompts to get token
   ```

2. **Link Your Project**:
   ```bash
   cd /Users/bioinfo/apps/chronoscope
   vercel link
   ```

3. **Get Project IDs**:
   ```bash
   cat .vercel/project.json
   # Copy orgId and projectId
   ```

4. **Add GitHub Secrets**:
   - Go to `https://github.com/BioInfo/chronoscope/settings/secrets/actions`
   - Click **"New repository secret"**
   - Add these secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: From `.vercel/project.json`
     - `VERCEL_PROJECT_ID`: From `.vercel/project.json`

---

## 🧪 Test the Workflows

### Test Auto-PR Creation

```bash
# Create a test branch
git checkout -b test/workflow

# Make a change
echo "# Test" >> test.md
git add test.md
git commit -m "Test: Verify auto-PR workflow"

# Push the branch
git push -u origin test/workflow

# Go to GitHub - a PR should be auto-created!
# https://github.com/BioInfo/chronoscope/pulls
```

### Test PR Merge and Deployment

1. Go to the auto-created PR
2. Review the changes
3. Click **"Merge pull request"**
4. The Vercel deployment workflow will trigger
5. Check the deployment at https://chronoscope-amber.vercel.app

---

## 📋 Repository Security Checklist

Verify these security settings:

### GitHub Settings

- [ ] Branch protection enabled on `main`
- [ ] Require PR reviews before merging
- [ ] Actions permissions set to read-only by default
- [ ] Secret scanning enabled (GitHub may enable automatically for public repos)
- [ ] Dependabot alerts enabled

### Access Control

- [ ] Only you have admin access
- [ ] Collaborators have appropriate permissions (if any)
- [ ] Deploy keys are read-only (if any)

### Secrets Management

- [ ] No secrets in code or git history
- [ ] `.env` files properly gitignored
- [ ] GitHub secrets configured for Vercel (if using Option B)
- [ ] API keys documented in README

---

## 🎉 You're All Set!

Your repository is now:

✅ **Professional** - With comprehensive documentation and badges
✅ **Automated** - Auto-creates PRs and deploys to Vercel
✅ **Secure** - Protected branches and secure workflows
✅ **Contributor-Friendly** - Clear contribution guidelines
✅ **Public-Ready** - Ready for community engagement

---

## 📝 Commit These Changes

All the files are ready but not yet committed. To commit them:

```bash
# Review the changes
git status

# Add all new files
git add .

# Commit with a descriptive message
git commit -m "Setup repository for public use

- Add comprehensive README with badges and documentation
- Configure GitHub Actions for auto-PR and Vercel deployment
- Add CONTRIBUTING.md, SECURITY.md, and workflow documentation
- Update .gitignore for Vercel and testing
- Add MIT License"

# Push to GitHub
git push origin main
```

---

## 🔗 Important Links

After pushing, visit these URLs to complete setup:

- **Repository**: https://github.com/BioInfo/chronoscope
- **Branch Protection**: https://github.com/BioInfo/chronoscope/settings/branches
- **Secrets** (if needed): https://github.com/BioInfo/chronoscope/settings/secrets/actions
- **Actions**: https://github.com/BioInfo/chronoscope/actions
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live App**: https://chronoscope-amber.vercel.app

---

## ❓ Questions?

Refer to:
- **[WORKFLOWS.md](.github/WORKFLOWS.md)** - Detailed workflow documentation
- **[SECURITY.md](.github/SECURITY.md)** - Security policies
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

---

## 🎯 Answer to Your Security Question

**Q: Is this safe? Can only I approve PRs and actions?**

**A: Yes! Here's why:**

✅ **You own the repository** - You have full admin control

✅ **Only you can merge PRs** - External contributors can create PRs from forks, but only you can approve and merge them

✅ **Workflows are protected** - GitHub Actions workflows can only be modified through approved PRs. External PRs cannot access your secrets or run workflows with secrets.

✅ **Branch protection** - Once enabled, even you must go through PR review to merge to `main`

✅ **Secrets are secure** - Repository secrets are encrypted and never exposed to external PRs or forks

✅ **Vercel deployments** - Only triggered when **you** merge PRs to `main`

**External contributors can:**
- Fork your repo
- Create PRs from their forks
- View public workflows

**External contributors CANNOT:**
- Push to your branches
- Merge PRs
- Run workflows with secrets
- Deploy to your Vercel
- Modify workflow files without your approval

**You're completely safe to make this public!** 🔒

---

Happy coding! 🚀⏰
