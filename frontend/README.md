# Diffuse Prime Frontend

## Description

This is the frontend application for the Diffuse Prime protocol. It provides a user interface for interacting with the protocol's features, such as lending, borrowing, and managing positions. The application is built using Next.js and TypeScript. It utilizes the `@diffuse/sdk-js` library to interact with the Diffuse protocol's smart contracts and `@diffuse/ui-kit` for UI components.

You can find more information about sdk and ui-kit in their respective directories:

- [sdk-js](../sdk-js/README.md)
- [ui-kit](../ui-kit/README.md)

## Environment setup

Before running the forntend in production mode, you need to set up the required environment variables. For more information about the required environment variables, see the `src/lib/env/schemas.ts` file and analyze zod schemas defined there.

There is `.env` file in the root of the project that contains all the exisitng environment variables with example or empty values. You can copy this file to `.env.local` and modify the values as needed for your local development environment or override them in your deployment platform (e.g. Vercel) for production.

## Development

To run the frontend in development mode, use the following command:

```bash
npm run dev
```

This will listen only for changes in the `frontend` directory. If you want to run the whole monorepo in development mode, use the `npm run dev` command from the root of the monorepo:

## Chains

Chains configuration is stored in `src/lib/chains/index.ts` file. To add a new chain/remove an existing chain, use native wagmi approach and predefined chains from `wagmi/chains` package or define a custom chain using `defineChain` function from `wagmi`.

## Tokens

Tokens metadata (e.g. logoURIs) is stored in `src/lib/tokens/meta.json` file. The file should follow the [Token List Schema](https://tokenlists.org) format.
We don't have many tokens, so it is much easier (and secure) to maintain a local token metadata list instead of fetching it from a remote source.

To add a new token or change metadata of an existing token, just update the `meta.json` file.

## Internalization and Localization

The frontend supports multiple languages through a localization system. The localization files are stored in the `src/dictionaries` directory, and the available languages are defined in `src/localization.json`. Default language is set to English (`en`) and also can be configured in `src/localization.json`.

To add/remove languages just update the `src/localization.json` array and add/remove the corresponding dictionary files in `src/dictionaries`. Everything else is supposed to work out of the box.

## Security considerations (on application level)

In nextjs the app, we have implemented various security headers to mitigate various attacks in production mode. Headers are specified in `next.config.ts` and `headers.ts` files.

In nextjs we use env variables to store sensitive information. These variables are defined in `.env*` files. Ensure that env varbales are not exposed to the client-side code by prefixing them with `NEXT_PUBLIC_` only when necessary. This is a [common practice](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser) in nextjs to prevent accidental exposure of sensitive information.
Moreover, `.env` files are acceptable only in development mode. In production, you should use environment variables set on the server or in your deployment platform (e.g., Vercel, AWS, etc.) and not rely on `.env` files.

Content security policy (CSP) considerations.
CPS is implemented in the app to mitigate cross-site scripting (XSS) attacks and other code injection attacks. CSP is configured in `middlewares/applyCsp.ts` file.

`productionBrowserSourceMaps` is set to `false` in `next.config.ts` to prevent exposing source maps in production. Source maps can reveal the original source code, which may contain sensitive information or make it easier for attackers to find vulnerabilities.

## Observability and error tracking

TDB

## Testing

TBD

## Deployment

TBD
