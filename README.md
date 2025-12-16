<div align="center">
  <h1 style="margin: 0; padding: 0;">Prime Frontend Monorepo</h1>
</div>
<br />
<div align="center">
  This is a monorepo for the <span style="font-weight: bold;">Diffuse Prime</span> frontend application, which includes multiple packages such as the main frontend application and a shared UI kit.
</div>
<br />
<div align="left">
  <h2 style="margin: 0; padding: 0;">Table of contents</h2>
  <ul>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#workspaces">Workspaces</a></li>
    <li><a href="#configuration">Configuration</a></li>
    <li><a href="#development">Development</a></li>
    <li><a href="#security-considerations-on-repository-level">Security considerations</a></li>
    <li><a href="#license">License</a></li>
  </ul>
</div>

## Overview

A monorepo for the **Diffuse Prime** frontend stack:

- `frontend/`: The main frontend application built with Next.js.
- `ui-kit/`: A shared UI component library built with React, Radix UI, and Tailwind CSS preset.
- `sdk-js/`: A JavaScript SDK for interacting with the Diffuse Prime smart contracts.
- `indexer/`: A backend service for indexing blockchain data.
- `config/`: Shared configuration and settings for the monorepo.

Each package has its own `README.md` file with more details about the specific package.

#### Prerequisites

- Nodejs v18+ (22+ recommended)
- npm v9+ (workspaces support)

## Workspaces

This repository uses [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) to manage multiple packages within a single repository.
But all general scripts you may need are defined in the root `package.json` "scripts" section.

## Configuration

All shared configuration and settings are located in the `config/` package. To edit or extend shared configurations, like chain, assets, and addresses configurations, you can modify the files in this package.
For more details please refer to the [config README](./config/README.md).

## Development

#### Setup

To setup the project, run the following command in the root directory:

```bash
npm ci
npm run setup
```

This will install all dependencies and run necessary setup scripts for each package.

#### Dev command

To start developing, you can use the following command to run all packages in watch mode:

```bash
npm run dev
```

This will start the development servers for all packages and all the source code changes will be reflected automatically. E.g. if you change something in `ui-kit`, the changes will be reflected in `frontend` immediately.

#### Env variables for local development

You may want to override some env variables for local development. You can do this by creating a `frontend/.env.local` file. For more details please refer to frontend's [README](./frontend/README.md) development section.

#### Commitlint

This project uses [commitlint](https://commitlint.js.org/) to enforce a consistent commit message format. Commit messages should follow the configuration defined in `commitlint.config.ts`.

#### Dependency Management with Syncpack

This project uses [Syncpack](https://jamiemason.github.io/syncpack/) to ensure consistent dependency versions across all packages in the monorepo.

Available commands:

- `npm run check:syncpack` - Check for version mismatches and semver range violations
- `npm run fix:syncpack` - Automatically fix version mismatches and semver ranges
- `npm run syncpack:list` - List all dependencies across packages

Syncpack is integrated into the CI pipeline and will fail the build if inconsistencies are detected. The configuration enforces:

- Production dependencies use exact versions (e.g., `1.2.3`)
- Development dependencies use caret ranges (e.g., `^1.2.3`)
- Peer dependencies use specific versions or compatible ranges

## Security considerations (on repository level)

This project implements security measures to protect against common vulnerabilities.

First off, it uses `@lavamoat/allow-scripts` with combination of `ignore-scripts=true` in `.npmrc` to prevent running arbitrary scripts during installation. This is a safeguard against common vector of supply chain attacks. A developer still can run all required scripts on project setup by running `npm run setup` (see [setup](#setup) section).

In addition, all **dependencies** versions (not dev dependencies) are pinned to specific versions in `package.json` to avoid unexpected changes in behavior due to updates of dependencies (or prevent an update to a version with a known vulnerability).

Typically, versions are specified with a caret (`^`) or tilde (`~`) prefix, which allows for minor or patch updates, respectively. However, in this project, we have opted to pin the versions without any prefix (e.g., `"package-name": "1.2.3"`).
This means that only the exact version specified will be used, and no automatic updates will occur.
This is a common practice to ensure stability and security of the project. Alas, this means that you will need to update dependencies manually when needed.

## License

This monorepo contains multiple packages with different licenses.
For more details please refer to the [LICENSE](./LICENSE.md) file.
