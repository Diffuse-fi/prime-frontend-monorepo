# Diffuse Prime UI Kit

## Desription

This is a ESM-only package of reusable, customizable, and accessible React components built with TypeScript, Radix-ui and Tailwind CSS.
Under the hood it follows Atomic Design principles and uses Radix UI for accessibility and complicated headless components.

## Requirements

- React 19+
- Tailwind CSS 4+
- Node 18+

## Usage

Install the package:

```bash
npm install @diffuse/ui-kit
```

Import the components you need:

```tsx
import { Button, Card, Dialog } from "@diffuse/ui-kit";
```

### SSR

Some components of the package require the use of React's client-side rendering (hooks in particular). When you want to use some components only server-side, you need to import them from a subpath. This is needed because the whole bundle has imports from `react` and `react-dom` which are not available server-side, but the components themselves may not use them.

So, in your server-side code, do:

```tsx
import { Heading } from "@diffuse/ui-kit/heading"; // SSR compatible (will not throw error)
import { Heading } from "@diffuse/ui-kit"; // Will throw error on SSR because of hooks usage in other components in the bundle
```

In client-side code, you can import from the main package safely:

```tsx
import { Heading } from "@diffuse/ui-kit"; // Will work fine on client-side
```

### Tailwind integration

To use the components styles, you need to have Tailwind CSS set up in your project. If you haven't done this yet, follow the [official Tailwind CSS installation guide](https://tailwindcss.com/docs/installation).

Then, add the UI Kit's Tailwind configuration to your tailwind css file (usually `src/index.css` or `src/tailwind.css`):

```css
@import "tailwindcss";

/* !important Add this line to let Tailwind process the UI Kit's classes */
/* Adjust the path if needed */
@source "../../../node_modules/@diffuse/ui-kit";

/* Also you want to import tailiwnd preset from the package */
/* The preset contains default colors, sizes, etc. */
@import "@diffuse/ui-kit/preset.css";

/* Override ui-kit theme variables here if needed */
@theme {
  /* --color-primary: #7c3aed; */
}
```

The above configuration will let Tailwind process the styles from the UI Kit package and make them available in your project.

## Development

To run the project locally, clone the repository and install the dependencies:

```bash
npm ci
```

Then, start the development server:

```bash
npm run dev
```

This will start a local development server and rebuild the package on any source code changes.
