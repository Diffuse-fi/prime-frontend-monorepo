import React from "react";
import { cn } from "@/lib";
import { forwardRef, HTMLAttributes } from "react";

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  wallet?: React.ReactNode;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("w-full border-b bg-white/50 backdrop-blur-sm", className)}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {props.logo}
        {props.navigation}
        {props.wallet}
      </div>
    </nav>
  )
);

Navbar.displayName = "Navbar";
