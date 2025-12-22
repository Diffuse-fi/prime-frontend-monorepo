# Releasing

This repo uses **Changesets** to track and version workspace packages (including `frontend`).  
We **do not publish to npm**. Releases are created on GitHub for the **frontend app** only.

## What gets versioned

- Workspace packages (`sdk-js`, `ui-kit`, `frontend`, etc.) get bumped via Changesets.
- The **root `package.json` is not versioned** and is not part of releases.

## Workflow overview

There are two GitHub Actions workflows:

1. **Release PR** (`.github/workflows/release-pr.yaml`)  
   Runs on every push to `main`. If there are pending changesets, it creates/updates a PR that:
   - runs `changeset version`
   - bumps package versions
   - updates per-package `CHANGELOG.md` files
   - deletes consumed `.changeset/*.md` files
     When the PR is merged it may trigger releases in the next step if `frontend` was changed.

2. **Frontend Release** (`.github/workflows/release-frontend.yaml`)  
   Runs on every push to `main`. If `frontend/package.json` changed in that push, it:
   - reads the new frontend version from `frontend/package.json`
   - creates a git tag: `frontend-vX.Y.Z`
   - creates a GitHub Release using **auto-generated release notes**

## Day-to-day: adding a changeset

When you make changes that should be released:

1. Create a changeset on your branch:
   ```bash
   npm run changeset:add
   ```

For more details on creating changesets, please refer to the [Changesets documentation](https://github.com/changesets/changesets)
