import { Container } from "@diffuse/ui-kit/Container";
import { ReactNode } from "react";
import { ClientNavigation, NavigationConfig } from "./ClientNavigation";

interface LayoutWithTabsNavProps {
  children: ReactNode;
  navConfig: NavigationConfig;
}

export function LayoutWithTabsNav({ children, navConfig }: LayoutWithTabsNavProps) {
  return (
    <div className="relative flex grow flex-col gap-12 overflow-scroll">
      <Container className="bg-bg sticky top-0 z-10 mt-5">
        <ClientNavigation
          ariaLabel="Lend page navigation"
          config={navConfig}
          variant="tabs"
        />
      </Container>
      <Container as="main" className="grow pb-5">
        {children}
      </Container>
    </div>
  );
}
