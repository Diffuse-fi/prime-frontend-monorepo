import type { Graph } from "schema-dts";

export function JsonLd({ graph }: { graph: Graph }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph)
          .replace(/</g, "\\u003c")
          .replace(/>/g, "\\u003e")
          .replace(/&/g, "\\u0026"), // Replace <, >, & to prevent XSS
      }}
    />
  );
}
