import { cn } from "@diffuse/ui-kit/cn";
import { Children, cloneElement, isValidElement, ReactElement } from "react";

type ClassedChild = ReactElement<{ className?: string }>;
type ViewportComponentProps = {
  children: ClassedChild | ClassedChild[];
  displayClassName?: string;
};

export function DesktopOnly({
  children,
  displayClassName = "md:block",
}: ViewportComponentProps) {
  return (
    <ViewportRenderer classToAssign={`hidden ${displayClassName}`}>
      {children}
    </ViewportRenderer>
  );
}

export function MobileOnly({ children }: ViewportComponentProps) {
  return <ViewportRenderer classToAssign="md:hidden">{children}</ViewportRenderer>;
}

function addClassName(el: ClassedChild, extra: string): ClassedChild {
  const merged = cn(el.props.className, extra);
  return cloneElement(el, { className: merged });
}

function ViewportRenderer({
  children,
  classToAssign,
}: ViewportComponentProps & { classToAssign: string }) {
  return Children.map(children, child => {
    if (!isValidElement(child)) return child;

    return addClassName(child as ClassedChild, classToAssign);
  });
}
