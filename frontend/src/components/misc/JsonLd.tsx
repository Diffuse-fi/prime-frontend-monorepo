import type { Graph } from "schema-dts";

export function JsonLd({ graph }: { graph: Graph }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"), // Replace < to prevent XSS
      }}
    />
  );
}
