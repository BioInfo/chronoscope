# Security Policy

## 🔒 Repository Security

This repository is configured for safe public use with the following security measures:

### Branch Protection

The `main` branch is protected with:
- Required pull request reviews before merging
- Only repository maintainers can merge PRs
- External contributors cannot push directly to branches

### Access Control

**You (Repository Owner) Control:**
- ✅ Pull request approvals and merges
- ✅ GitHub Actions workflow execution
- ✅ Repository secrets and configuration
- ✅ Branch protection rules
- ✅ Deployment to production

**External Contributors Can:**
- ✅ Fork the repository
- ✅ Submit pull requests from their forks
- ✅ View public workflow definitions

**External Contributors Cannot:**
- ❌ Push to repository branches
- ❌ Merge pull requests
- ❌ Access repository secrets
- ❌ Modify workflow files without approval
- ❌ Trigger deployments

### GitHub Actions Security

All workflows follow security best practices:
- Use environment variables for all inputs
- No command injection vulnerabilities
- Secrets never exposed to external PRs
- Limited permissions (read-only by default)
- Manual workflows require write access

### API Keys and Secrets

- **Gemini API keys** are stored in localStorage (client-side only)
- **Vercel tokens** are stored as GitHub Secrets (encrypted)
- **No secrets** are committed to the repository
- `.env` files are gitignored

---

## 🐛 Reporting Security Vulnerabilities

If you discover a security vulnerability, please **DO NOT** open a public issue.

Instead:

1. **Email the maintainer directly** with details
2. Or use GitHub's [Private Vulnerability Reporting](https://github.com/BioInfo/chronoscope/security/advisories/new)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

---

## 🔐 Security Best Practices for Contributors

### When Contributing Code

- ✅ Never commit API keys, tokens, or secrets
- ✅ Use environment variables for configuration
- ✅ Validate all user inputs
- ✅ Follow secure coding practices
- ✅ Test for XSS and injection vulnerabilities

### When Submitting PRs

- ✅ Review your changes for sensitive data
- ✅ Ensure `.env` files are not included
- ✅ Check for accidentally committed credentials
- ✅ Run `git log` to verify commit history

### When Using GitHub Actions

- ✅ Use environment variables for all inputs
- ✅ Never interpolate untrusted data in run commands
- ✅ Follow the [GitHub Actions security guide](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

## 🛡️ Dependency Security

We monitor dependencies for security vulnerabilities:

- Dependabot alerts enabled
- Regular dependency updates
- Security advisories reviewed

To update dependencies:

```bash
npm audit
npm audit fix
```

---

## 📋 Security Checklist

Before deploying changes:

- [ ] No secrets in code or commits
- [ ] `.env` files properly gitignored
- [ ] All dependencies updated and audited
- [ ] User inputs validated and sanitized
- [ ] XSS protection in place
- [ ] HTTPS used for all external APIs
- [ ] GitHub Actions workflows secured

---

## 🔄 Security Updates

This security policy is reviewed and updated regularly. Last updated: 2025-11-28

---

## 📞 Contact

For security concerns, contact the repository maintainer via GitHub.

---

## ⚖️ Responsible Disclosure

We appreciate security researchers who responsibly disclose vulnerabilities. We commit to:

- Acknowledging your report within 48 hours
- Providing a timeline for fixes
- Crediting you in release notes (if desired)
- Keeping you informed throughout the process

Thank you for helping keep The Chronoscope secure! 🔒
