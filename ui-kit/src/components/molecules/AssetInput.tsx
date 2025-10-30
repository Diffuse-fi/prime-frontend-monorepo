import * as React from "react";
import { Input, type InputProps } from "@/atoms";
import { NumericFormat, NumericFormatProps } from "react-number-format";

export interface AssetInputProps
  extends Omit<InputProps, "right" | "type" | "onChange" | "value" | "defaultValue"> {
  renderAssetImage?: (ctx: { size: "sm" | "md" | "lg" }) => React.ReactNode;
  assetSymbol?: string;
  value?: string | number;
  onValueChange?: NumericFormatProps["onValueChange"];
}

export const AssetInput = React.forwardRef<HTMLInputElement, AssetInputProps>(
  (
    {
      renderAssetImage,
      size = "md",
      assetSymbol,
      value,
      onValueChange,
      className,
      ...props
    },
    ref
  ) => {
    const displayAssetMeta = renderAssetImage || assetSymbol;
    const right = (
      <div className="mr-2 flex items-center space-x-1">
        {renderAssetImage && renderAssetImage({ size })}
        <span className="text-sm font-medium">{assetSymbol}</span>
      </div>
    );

    return (
      <NumericFormat
        customInput={Input}
        thousandSeparator=" "
        inputMode="decimal"
        getInputRef={ref}
        size={size}
        right={displayAssetMeta ? right : undefined}
        type="text"
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        allowLeadingZeros={false}
        valueIsNumericString
        value={value}
        onValueChange={onValueChange}
        wrapperClassName={className}
        {...props}
      />
    );
  }
);

AssetInput.displayName = "AssetInput";
