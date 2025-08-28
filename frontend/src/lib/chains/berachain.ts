import { berachain as beraDefault } from "wagmi/chains";

export const berachain = {
  ...beraDefault,
  iconUrl:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <circle cx="128" cy="128" r="128" fill="#fbbf24"/>
        <path fill="#111" d="M128 64c-35 0-64 29-64 64s29 64 64 64 64-29 64-64-29-64-64-64zm-28 48a12 12 0 1124 0 12 12 0 01-24 0zm32 52c-16 0-30-10-36-24h72c-6 14-20 24-36 24zm16-40a12 12 0 110-24 12 12 0 010 24z"/>
      </svg>`
    ),
  iconBackground: "#fbbf24",
} as const;
