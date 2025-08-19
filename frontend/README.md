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

## Internalization and Localization

The frontend supports multiple languages through a localization system. The localization files are stored in the `src/dictionaries` directory, and the available languages are defined in `src/localization.json`. Default language is set to English (`en`) and also can be configured in `src/localization.json`.

To add/remove languages just update the `src/localization.json` array and add/remove the corresponding dictionary files in `src/dictionaries`. Everything else is supposed to work out of the box.

## Observability and error tracking

TDB

## Testing

To run tests, use the following command:

```bash
npm run test
```
