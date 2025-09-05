import * as React from "react";
import { tv } from "@/lib";
import { Heading } from "@/atoms";

const card = tv({
  base: "rounded-lg border border-border bg-bg overflow-hidden",
});

const cardHeader = tv({
  base: "px-4 py-3 border-b border-border bg-bg",
});

const cardBody = tv({
  base: "px-4 py-3 text-body text-text-primary",
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  children?: React.ReactNode;
  cardBodyClassName?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ header, children, className, cardBodyClassName, ...rest }, ref) => {
    return (
      <div ref={ref} className={card({ className })} {...rest}>
        {header ? (
          <div className={cardHeader()}>
            {typeof header === "string" ? <Heading level={3}>{header}</Heading> : header}
          </div>
        ) : null}
        <div className={cardBody({ className: cardBodyClassName })}>{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";
