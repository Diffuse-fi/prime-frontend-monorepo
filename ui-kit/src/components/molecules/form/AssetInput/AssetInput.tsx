import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

import { Input, type InputProps } from "@/atoms";

export interface AssetInputProps
  extends Omit<InputProps, "defaultValue" | "onChange" | "right" | "type" | "value"> {
  assetSymbol?: string;
  onValueChange?: NumericFormatProps["onValueChange"];
  renderAssetImage?: (ctx: { size: "lg" | "md" | "sm" }) => React.ReactNode;
  value?: number | string;
}

export const AssetInput = React.forwardRef<HTMLInputElement, AssetInputProps>(
  (
    {
      assetSymbol,
      className,
      onValueChange,
      renderAssetImage,
      size = "md",
      value,
      ...props
    },
    ref
  ) => {
    const displayAssetMeta = renderAssetImage || assetSymbol;
    const right = (
      <div className="mr-2 flex items-center space-x-1">
        {renderAssetImage && renderAssetImage({ size })}
        {assetSymbol && <span className="text-sm font-medium">{assetSymbol}</span>}
      </div>
    );

    return (
      <NumericFormat
        allowLeadingZeros={false}
        allowNegative={false}
        customInput={Input}
        decimalScale={2}
        fixedDecimalScale
        getInputRef={ref}
        inputMode="decimal"
        onValueChange={onValueChange}
        right={displayAssetMeta ? right : undefined}
        size={size}
        thousandSeparator=" "
        type="text"
        value={value}
        valueIsNumericString
        wrapperClassName={className}
        {...props}
      />
    );
  }
);

AssetInput.displayName = "AssetInput";
