# Contributing to The Chronoscope

Thank you for your interest in contributing to The Chronoscope! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- 🐛 **Report Bugs** - Submit detailed bug reports
- ✨ **Suggest Features** - Propose new features or enhancements
- 📝 **Improve Documentation** - Help make our docs better
- 🗺️ **Add Waypoints** - Contribute new historical moments
- 🎨 **Enhance UI/UX** - Improve the user interface
- 🧪 **Write Tests** - Add unit or integration tests
- 🔧 **Fix Issues** - Pick up open issues and fix them

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/chronoscope.git
cd chronoscope
```

### 3. Set Up Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### 4. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 5. Make Your Changes

Follow the code style and architecture guidelines below.

### 6. Test Your Changes

```bash
# Build the project
npm run build

# Test in production mode
npm run preview
```

### 7. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "Add feature: detailed description of what you did"
```

**Good commit messages:**
- ✅ `Add waypoint: D-Day landing at Normandy`
- ✅ `Fix: Coordinate validation for southern hemisphere`
- ✅ `Improve: Scene rendering performance`
- ✅ `Docs: Update API configuration instructions`

**Avoid:**
- ❌ `Update stuff`
- ❌ `Fix bug`
- ❌ `Changes`

### 8. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 9. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the PR

**The repository will automatically create a formatted PR for you!**

---

## 📋 Pull Request Guidelines

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's TypeScript style
- [ ] All existing tests pass (when tests are added)
- [ ] New features include appropriate type definitions
- [ ] UI changes are responsive (mobile, tablet, desktop)
- [ ] No console errors or warnings
- [ ] Code is self-documenting or includes comments for complex logic
- [ ] Commits are clear and descriptive

### PR Description Template

Your PR should include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots for UI changes
```

---

## 🎨 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define types in `src/types/index.ts` for domain concepts
- Avoid `any` - use proper types or `unknown`
- Use functional components with hooks

**Example:**
```typescript
// ✅ Good
interface LocationData {
  latitude: number;
  longitude: number;
}

function getLocation(coords: LocationData): string {
  return `${coords.latitude}, ${coords.longitude}`;
}

// ❌ Avoid
function getLocation(coords: any) {
  return coords.lat + ', ' + coords.lng;
}
```

### React Components

- Use functional components
- Use hooks for state and effects
- Keep components focused and single-purpose
- Extract complex logic to utility functions

**Example:**
```typescript
// ✅ Good
export function Waypoint({ data }: { data: WaypointData }) {
  const { jumpToWaypoint } = useChronoscope();

  return (
    <button onClick={() => jumpToWaypoint(data.coordinates)}>
      {data.name}
    </button>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme (chrono-* classes)
- Ensure responsive design with mobile-first approach
- Use semantic HTML elements

**Example:**
```tsx
// ✅ Good - Responsive with semantic HTML
<article className="p-4 bg-chrono-dark border border-chrono-border rounded-lg
                    hover:border-chrono-blue transition-colors
                    md:p-6 lg:p-8">
  <h2 className="text-lg md:text-xl font-bold text-chrono-text">
    {title}
  </h2>
</article>
```

---

## 🗺️ Adding New Waypoints

Waypoints are curated historical moments. To add a new waypoint:

### 1. Choose a Significant Historical Moment

Good waypoints:
- Have historical significance
- Occurred at a specific time and place
- Can be visualized effectively
- Provide educational value

### 2. Add to `src/data/waypoints.ts`

```typescript
{
  id: 'unique-id',
  name: 'Display Name',
  icon: 'LucideIconName', // From lucide-react
  category: 'achievement' | 'conflict' | 'disaster' | 'culture' | 'discovery',
  coordinates: {
    spatial: {
      latitude: 0.0,
      longitude: 0.0,
    },
    temporal: {
      year: 1969,
      month: 7,
      day: 20,
      hour: 20,
      minute: 17,
    },
  },
  previewData: {
    // Fill in all required fields
    // See existing waypoints as examples
  },
}
```

### 3. Verify Accuracy

- Double-check historical dates and times
- Verify coordinates (use Google Maps or similar)
- Ensure descriptions are factual
- Test the waypoint in the application

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported in [Issues](https://github.com/BioInfo/chronoscope/issues)
2. Try to reproduce the bug consistently
3. Test in the latest version

### Creating a Bug Report

Include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Numbered steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, device type
- **Console Errors**: Any errors from browser console

**Template:**
```markdown
## Bug Description
Brief description

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- OS: macOS 14.0
- Device: Desktop

## Console Errors
```
Error message here
```

## Screenshots
[Attach screenshots]
```

---

## 💡 Suggesting Features

### Creating a Feature Request

Include:

- **Problem**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions you've considered
- **Additional Context**: Mockups, examples, use cases

---

## 🏗️ Architecture Guidelines

### Project Structure

```
src/
├── components/     # UI components (presentational)
├── context/        # State management with React Context
├── data/           # Static data (waypoints, constants)
├── services/       # External API integrations
├── types/          # TypeScript type definitions
└── utils/          # Pure utility functions
```

### Key Principles

1. **Separation of Concerns**
   - UI components in `components/`
   - Business logic in `context/` and `utils/`
   - External APIs in `services/`

2. **State Management**
   - Use `ChronoscopeContext` for global state
   - Use local state for component-specific state
   - Actions flow through the reducer

3. **Type Safety**
   - Define all domain types in `types/index.ts`
   - Use strict TypeScript checking
   - Avoid type assertions unless necessary

4. **Pure Functions**
   - Utilities should be pure functions
   - Scene generation is deterministic
   - Easy to test and reason about

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

---

## 📝 Documentation

### Updating Documentation

When you make changes, update relevant docs:

- **README.md** - User-facing features and setup
- **CLAUDE.md** - Architecture and development guide
- **WORKFLOWS.md** - CI/CD and automation
- **Code Comments** - Complex logic and algorithms

---

## ❓ Questions?

- **General Questions**: [Open a Discussion](https://github.com/BioInfo/chronoscope/discussions)
- **Bug Reports**: [Create an Issue](https://github.com/BioInfo/chronoscope/issues)
- **Feature Requests**: [Create an Issue](https://github.com/BioInfo/chronoscope/issues)

---

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Accept criticism gracefully
- Prioritize project and community health

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Spam or promotional content

---

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to The Chronoscope! 🚀⏰
