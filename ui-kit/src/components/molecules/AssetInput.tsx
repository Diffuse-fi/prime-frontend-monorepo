import * as React from "react";
import { Input, type InputProps } from "@/atoms";
import { NumericFormat, NumericFormatProps } from "react-number-format";

export interface TokenInputProps
  extends Omit<InputProps, "right" | "type" | "onChange" | "value" | "defaultValue"> {
  renderAssetImage?: (ctx: { size: "sm" | "md" | "lg" }) => React.ReactNode;
  assetSymbol: string;
  value?: string | number;
  onValueChange?: NumericFormatProps["onValueChange"];
}

export const AssetInput = React.forwardRef<HTMLInputElement, TokenInputProps>(
  (
    { renderAssetImage, size = "md", assetSymbol, value, onValueChange, ...props },
    ref
  ) => {
    const right = (
      <div className="mr-2 flex items-center space-x-1">
        {renderAssetImage ? (
          renderAssetImage({ size })
        ) : (
          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-[color:var(--ui-muted)]" />
        )}
        <span className="text-sm font-medium text-[color:var(--ui-text)]">
          {assetSymbol}
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

AssetInput.displayName = "AssetInput";
