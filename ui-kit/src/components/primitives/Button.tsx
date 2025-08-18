import { tv, type VariantProps } from "@/lib/tv";

const button = tv({
  base: "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
  variants: {
    variant: {
      solid: "bg-primary text-primary-foreground hover:opacity-90",
      outline: "border border-border bg-transparent hover:bg-foreground/5",
      ghost: "hover:bg-foreground/5",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-5 text-base",
    },
  },
  defaultVariants: { variant: "solid", size: "md" },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = ({ variant, size, ...props }: ButtonProps) => (
  <button className={button({ variant, size })} {...props} />
);
