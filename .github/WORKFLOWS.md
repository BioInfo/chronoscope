# GitHub Actions Workflows

This document describes the automated workflows configured for the Chronoscope project.

## Workflows Overview

### 1. Auto Create PR on Branch Push (`auto-pr.yml`)

**Trigger**: Pushes to any branch except `main` and `master`

**Purpose**: Automatically creates a pull request when you push changes to a feature branch.

**Behavior**:
- Creates a new PR if one doesn't exist for the branch
- Adds an "auto-generated" label
- Uses branch name to generate PR title
- Adds a PR template with checklist
- Comments on existing PRs when new commits are pushed

**Security**: Uses environment variables to safely handle branch names and prevents command injection.

### 2. Deploy to Vercel (`vercel-deploy.yml`)

**Trigger**: When a PR is merged to `main` or manually via workflow_dispatch

**Purpose**: Automatically deploys the application to Vercel production after PR approval.

**Behavior**:
- Only runs when PR is merged (not just closed)
- Installs dependencies with `npm ci`
- Builds the project with `npm run build`
- Deploys to Vercel production
- Comments on the merged PR with deployment status

**Required Secrets**: See setup instructions below.

---

## Repository Security Settings

### ✅ Yes, Your Repository is Safe for Public Use

**You (the repository owner) have exclusive control over:**

1. **Pull Request Approvals**
   - Only repository collaborators with write access can approve PRs
   - As the owner, only you can merge PRs to `main`
   - External contributors can fork and create PRs, but cannot merge

2. **GitHub Actions**
   - Workflow files can only be modified via approved PRs
   - Actions run with limited permissions (read-only by default)
   - Secrets are never exposed to forks or external PRs
   - Manual workflows (`workflow_dispatch`) require write access

3. **Branch Protection** (Recommended Setup)
   - Protect the `main` branch
   - Require PR reviews before merging
   - Require status checks to pass
   - Enable "Restrict who can push to matching branches"

---

## Setup Instructions

### Step 1: Enable Branch Protection

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable these protections:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

### Step 2: Configure Vercel Integration

#### Option A: Connect Vercel to GitHub (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically deploy on merges to `main`
4. **No secrets needed** - Vercel handles everything

#### Option B: Use GitHub Actions Deployment

If you prefer to use the workflow for deployment:

1. Get your Vercel token:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and get token
   vercel login
   ```

2. Get project IDs:
   ```bash
   cd /path/to/chronoscope
   vercel link
   cat .vercel/project.json
   ```

3. Add secrets to GitHub:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add these repository secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: From `.vercel/project.json`
     - `VERCEL_PROJECT_ID`: From `.vercel/project.json`

### Step 3: Test the Workflows

```bash
# Create a test branch
git checkout -b test/workflow

# Make a change
echo "# Test" >> test.md

# Push the branch
git add test.md
git commit -m "Test workflow automation"
git push -u origin test/workflow

# Check GitHub - a PR should be auto-created!
```

---

## Workflow Permissions

### What External Contributors CAN Do:

- ✅ Fork the repository
- ✅ Create PRs from their forks
- ✅ View public workflows
- ✅ See PR status checks

### What External Contributors CANNOT Do:

- ❌ Push to your repository branches
- ❌ Merge PRs
- ❌ Run workflows that require secrets
- ❌ Modify workflow files (requires approved PR)
- ❌ Access repository secrets
- ❌ Approve PRs
- ❌ Deploy to Vercel

### What YOU (Owner) CAN Do:

- ✅ Everything above
- ✅ Approve and merge PRs
- ✅ Manually trigger workflows
- ✅ Modify workflow files
- ✅ Access and modify secrets
- ✅ Deploy to production

---

## Security Best Practices

### 1. Never Store Secrets in Code

- ✅ Use GitHub Secrets for API keys and tokens
- ✅ Use environment variables in workflows
- ❌ Never commit `.env` files with real secrets
- ✅ Keep `.env.example` for documentation only

### 2. Review All PRs Before Merging

- Even if workflows pass, review the code changes
- Check for suspicious modifications
- Verify the PR author's identity

### 3. Monitor Actions Usage

- Check **Actions** tab regularly for unexpected runs
- Review workflow run logs
- Disable workflows you don't need

### 4. Keep Dependencies Updated

- Regularly update GitHub Actions versions
- Use Dependabot for automated dependency updates
- Review security advisories

---

## Troubleshooting

### PR Not Auto-Created

**Check**:
1. Pushed to a branch other than `main`/`master`?
2. Actions enabled in repository settings?
3. Workflow file syntax correct?

**Debug**:
```bash
# Check Actions tab in GitHub
# View workflow run logs for errors
```

### Vercel Deployment Fails

**Check**:
1. Secrets configured correctly?
2. Build succeeds locally (`npm run build`)?
3. Vercel project exists and is linked?

**Debug**:
```bash
# Test build locally
npm ci
npm run build

# Check Vercel project
vercel ls
```

### External PR Shows "Some checks haven't completed yet"

This is **expected and safe** - external PRs cannot run workflows that access secrets. This protects your credentials.

---

## Disabling Workflows

If you want to disable automated workflows:

1. Go to **Actions** → **Workflows**
2. Select the workflow
3. Click **Disable workflow**

Or delete the workflow file:
```bash
rm .github/workflows/auto-pr.yml
```

---

## Questions?

Open an issue in the repository for questions about workflow configuration or security settings.
