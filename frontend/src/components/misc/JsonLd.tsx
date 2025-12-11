import type { Graph } from "schema-dts";

export function JsonLd({ graph }: { graph: Graph }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph)
          .replaceAll("<", String.raw`\u003c`)
          .replaceAll(">", String.raw`\u003e`)
          .replaceAll("&", String.raw`\u0026`), // Replace <, >, & to prevent XSS
      }}
      suppressHydrationWarning
      type="application/ld+json"
    />
  );
}
