# Prime frontend monorepo

## Description

This is a monorepo for the **Diffuse Prime** frontend application, which includes multiple packages such as the main frontend application and a shared UI kit.

A monorepo for the **Diffuse Prime** frontend stack:

- `frontend/`: The main frontend application built with Next.js.
- `ui-kit/`: A shared UI component library built with React, Radix UI, and Tailwind CSS preset.
- `sdk-js/`: A JavaScript SDK for interacting with the Diffuse Prime smart contracts.

Each package has its own `README.md` file with more details about the specific package.

#### Prerequisites

- Nodejs v18+ (22+ recommended)
- npm v9+ (workspaces support)

## Workspaces

This repository uses [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) to manage multiple packages within a single repository.

But all general scripts you may need are deifined in the root `package.json` "scripts" section.

## Setup

To setup the project, run the following command in the root directory:

```bash
npm ci
npm run setup
```

This will install all dependencies and run necessary setup scripts for each package.

## Development

To start developing, you can use the following command to run all packages in watch mode:

```bash
npm run dev
```

This will start the development servers for all packages and all the source code changes will be reflected automatically. E.g. if you change something in `ui-kit`, the changes will be reflected in `frontend` immediately.

#### Env variables for local development

You may want to override some env variables for local development. You can do this by creating a `.env.local` file. For more details please refer to frontend's [README](./frontend/README.md) development section.

#### Commitlint

This project uses [commitlint](https://commitlint.js.org/) to enforce a consistent commit message format. Commit messages should follow the configuration defined in `commitlint.config.ts`.

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
