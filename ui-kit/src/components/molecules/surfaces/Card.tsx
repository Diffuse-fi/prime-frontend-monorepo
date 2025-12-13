import * as React from "react";

import { Heading } from "@/atoms";
import { tv } from "@/lib";

const card = tv({
  base: "rounded-lg bg-fg overflow-hidden flex flex-col py-2 border border-border",
});

const cardHeader = tv({
  base: "px-4 py-4",
});

const cardBody = tv({
  base: "px-4 py-3 text-body grow flex flex-col",
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  cardBodyClassName?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ cardBodyClassName, children, className, header, ...rest }, ref) => {
    return (
      <div className={card({ className })} ref={ref} {...rest}>
        {header ? (
          <div className={cardHeader()}>
            {typeof header === "string" ? <Heading level="4">{header}</Heading> : header}
          </div>
        ) : null}
        <div className={cardBody({ className: cardBodyClassName })}>{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";
