# Prime frontend monorepo

## Description

## Setup

## Development

## Security considerations (on repository level)

This project implements security measures to protect against common vulnerabilities.

First off, it uses `@lavamoat/allow-scripts` with combination of `ignore-scripts=true` in `.npmrc` to prevent running arbitrary scripts during installation. This is a safeguard against common vector of supply chain attacks. A developer still can run all required scripts on project setup by running `npm run setup` (see [setup](#setup) section).

In addition, all **dependencies** versions (not dev dependencies) are pinned to specific versions in `package.json` to avoid unexpected changes in behavior due to updates of dependencies (or prevent an update to a version with a known vulnerability).
Typically, versions are specified with a caret (`^`) or tilde (`~`) prefix, which allows for minor or patch updates, respectively. However, in this project, we have opted to pin the versions without any prefix (e.g., `"package-name": "1.2.3"`).
This means that only the exact version specified will be used, and no automatic updates will occur.
This is a common practice to ensure stability and security of the project. Alas, this means that you will need to update dependencies manually when needed.
