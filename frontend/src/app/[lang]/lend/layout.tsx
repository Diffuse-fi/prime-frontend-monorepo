import { Nav } from "@diffuse/ui-kit";
import { ReactNode } from "react";

export default async function LendLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main>
      <Nav items={[]} />
      {children}
    </main>
  );
}
