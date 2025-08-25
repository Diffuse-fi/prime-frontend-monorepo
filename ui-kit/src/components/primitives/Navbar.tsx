import React from "react";
import { cn } from "@/lib";
import { forwardRef, HTMLAttributes } from "react";

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** */
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("w-full border-b bg-white/50 backdrop-blur-sm", className)}
      {...props}
    />
  )
);
Navbar.displayName = "Navbar";
