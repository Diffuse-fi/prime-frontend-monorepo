# Defuse Prime Frontend

## Description

## Environment setup

Before running the forntend ensure that you have the following environment variables set:

- `ORIGIN`: The base URL of your application, e.g., `https://example.com` (for production only).

There is `.env.example` file in the root of the project that contains all the required environment variables. You can copy it to `.env.local` and fill in the values.

## Development

To run the frontend in development mode, use the following command:

```bash
npm run dev
```

## Chains

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

To run tests, use the following command:

```bash
npm run test
```
