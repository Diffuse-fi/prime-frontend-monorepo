# Diffuse Prime UI Kit

## Desription

## Requirements

## Usage

### SSR

Some components of the package require the use of React's client-side rendering (hooks in particular). When you want to use some components only server-side, you need to import them from a subpath. This is needed because the whole bundle has imports from `react` and `react-dom` which are not available server-side, but the components themselves may not use them.

So, in your server-side code, do:

```tsx
import { Heading } from "defuse-prime/heading"; // SSR compatible (will not throw error)
import { Heading } from "defuse-prime"; // Will throw error on SSR because of hooks usage in other components in the bundle
```

In client-side code, you can import from the main package:

```tsx
import { Heading } from "defuse-prime"; // Will work fine on client-side
```

### Tailwind integration
