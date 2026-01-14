# Publishing Guide (Internal)

Instructions for publishing `scalekit-dryrun` to npm.

## Prerequisites

1. npm account with publish access to the `scalekit-dryrun` package (or `@scalekit` org if using scoped package)
2. Node.js 20+
3. Access to the GitHub repo: https://github.com/scalekit-inc/scalekit-dryrun

## First-Time Setup

### 1. Clone the repository

```bash
git clone https://github.com/scalekit-inc/scalekit-dryrun.git
cd scalekit-dryrun
```

### 2. Install dependencies

```bash
npm install
```

### 3. Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

## Publishing a New Version

### 1. Pull latest changes

```bash
git pull origin main
```

### 2. Update version number

Choose the appropriate version bump:

```bash
# Patch release (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# Minor release (new features, backwards compatible): 1.0.0 -> 1.1.0
npm version minor

# Major release (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

This automatically:
- Updates `package.json`
- Creates a git commit
- Creates a git tag

### 3. Push to GitHub

```bash
git push origin main --tags
```

### 4. Publish to npm

```bash
npm publish
```

The `prepublishOnly` script will automatically run `npm run build` before publishing.

### 5. Verify publication

```bash
npm info scalekit-dryrun
```

Or test it:

```bash
npx scalekit-dryrun@latest --help
```

## Publishing a Scoped Package (Optional)

If you want to publish under `@scalekit/dryrun` instead:

### 1. Update package.json

Change the name field:

```json
{
  "name": "@scalekit/scalekit-dryrun"
}
```

### 2. Publish with public access

```bash
npm publish --access public
```

## Checklist Before Publishing

- [ ] All tests pass locally (test both FSA and SSO modes)
- [ ] Version number updated appropriately
- [ ] README is up to date
- [ ] Changes committed and pushed to GitHub
- [ ] No sensitive data in the codebase

## Rollback (if needed)

If you publish a broken version:

```bash
# Unpublish within 72 hours
npm unpublish scalekit-dryrun@<version>

# Or deprecate (preferred for older versions)
npm deprecate scalekit-dryrun@<version> "This version has a critical bug, please use <new-version>"
```

## npm Package Access

To grant publish access to a team member:

```bash
npm access grant read-write <npm-username> scalekit-dryrun
```

## Links

- npm package: https://www.npmjs.com/package/scalekit-dryrun (after first publish)
- GitHub repo: https://github.com/scalekit-inc/scalekit-dryrun
- Scalekit Dashboard: https://app.scalekit.com
