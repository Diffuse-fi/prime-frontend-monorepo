import * as React from "react";
import { Input, type InputProps, type InputSize } from "@/atoms";
import { NumericFormat, NumericFormatProps } from "react-number-format";

export interface TokenInputProps
  extends Omit<InputProps, "right" | "type" | "onChange" | "value" | "defaultValue"> {
  renderTokenImage?: (ctx: { size: InputSize }) => React.ReactNode;
  tokenSymbol: string;
  value?: string | number;
  onValueChange?: NumericFormatProps["onValueChange"];
}

export const TokenInput = React.forwardRef<HTMLInputElement, TokenInputProps>(
  (
    { renderTokenImage, size = "md", tokenSymbol, value, onValueChange, ...props },
    ref
  ) => {
    const right = (
      <div className="mr-2 flex items-center space-x-1">
        {renderTokenImage ? (
          renderTokenImage({ size })
        ) : (
          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-[color:var(--ui-muted)]" />
        )}
        <span className="text-sm font-medium text-[color:var(--ui-text)]">
          {tokenSymbol}
        </span>
      </div>
    );

    return (
      <NumericFormat
        customInput={Input}
        thousandSeparator=" "
        inputMode="decimal"
        getInputRef={ref}
        size={size}
        right={right}
        type="text"
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        allowLeadingZeros={false}
        valueIsNumericString
        value={value}
        onValueChange={onValueChange}
        {...props}
      />
    );
  }
);

TokenInput.displayName = "TokenInput";
