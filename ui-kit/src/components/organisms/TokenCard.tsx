import * as React from "react";
import { cn } from "@/lib/cn";

export interface TokenAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol: string;
  logoUrl?: string;
  chainId?: number;
  size?: number; // px size (default 32)
  showChainBadge?: boolean; // render chain overlay badge
}

type RenderImage = (props: {
  src: string;
  alt: string;
  className: string;
}) => React.ReactNode;

export const TokenAvatar = React.forwardRef<HTMLDivElement, TokenAvatarProps>(
  (
    { symbol, logoUrl, chainId, size = 32, showChainBadge = true, className, ...props },
    ref
  ) => {
    const initials = symbol?.slice(0, 3).toUpperCase();

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full border border-border bg-muted text-foreground overflow-hidden",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        {...props}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={symbol}
            className="w-full h-full object-cover"
            onError={e => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="font-bold">{initials}</span>
        )}

        {showChainBadge && chainId && (
          <span
            className="absolute bottom-0 right-0 rounded-full border border-background bg-background shadow"
            style={{
              width: size * 0.4,
              height: size * 0.4,
              fontSize: size * 0.25,
            }}
          >
            {/* placeholder: chainId as text.
               later swap with <ChainBadge /> */}
            <span className="flex items-center justify-center h-full w-full text-xs">
              {chainId}
            </span>
          </span>
        )}
      </div>
    );
  }
);

TokenAvatar.displayName = "TokenAvatar";
