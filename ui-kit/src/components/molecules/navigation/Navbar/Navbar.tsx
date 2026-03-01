import React from "react";
import { forwardRef, HTMLAttributes } from "react";

import { cn } from "@/lib";

import { Container } from "../../../atoms";

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  wallet?: React.ReactNode;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className, logo, navigation, wallet, ...props }, ref) => (
    <header
      className={cn("bg-fg border-border w-full border-b", className)}
      ref={ref}
      {...props}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        {logo}
        {navigation}
        <div>{wallet}</div>
      </Container>
    </header>
  )
);

Navbar.displayName = "Navbar";
