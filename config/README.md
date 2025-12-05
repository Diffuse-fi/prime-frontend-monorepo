# Diffuse Prime Configuration Package

## Description

This package provides shared configuration and settings for the Diffuse Prime frontend monorepo. It includes common chain, assets and addresses configurations used across multiple packages in the monorepo.

It is important to provide esm and cjs builds for compatibility with different module systems, e.g. Next.js which requires cjs for certain imports.

## Usage

To use this configuration package in your project, install it as a dependency:

```bash
npm install @diffuse/config
```

Then, import the necessary configurations in your code:

```typescript
import { ASSETS, CHAINS } from "@diffuse/config";
```

This will give you access to the shared assets configuration defined in this package.

## Structure

- `src/assets.ts`: Defines the assets available on different blockchain networks.
- `src/chains.ts`: Defines the supported blockchain networks and their parameters (powered by viem).
- `src/addresses.ts`: Defines commonly used contract addresses to be able to reference them easily.

## License

This package is licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.
