import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const translations = {
  "common.apr": "APR",
  "lend.strategiesList.asset": "Asset",
  "lend.strategiesList.endDate": "End date",
};

const translate = (key: string) => translations[key as keyof typeof translations] ?? key;

vi.mock("next-intl", () => ({
  useTranslations: () => translate,
}));

vi.mock("@/components/misc/images/AssetImage", () => ({
  AssetImage: () => <span aria-hidden="true" />,
}));

import { StrategiesList } from "./StrategiesList";

const strategies = [
  {
    apr: 100n,
    endDate: 1_700_000_000n,
    token: {
      address: "0x0000000000000000000000000000000000000001",
      logoURI: "",
      symbol: "AAA",
    },
  },
  {
    apr: 300n,
    endDate: 1_600_000_000n,
    token: {
      address: "0x0000000000000000000000000000000000000002",
      logoURI: "",
      symbol: "BBB",
    },
  },
  {
    apr: 200n,
    endDate: 1_800_000_000n,
    token: {
      address: "0x0000000000000000000000000000000000000003",
      logoURI: "",
      symbol: "CCC",
    },
  },
].map(strategy => ({
  ...strategy,
  balance: 0n,
  id: 0n,
  isDisabled: false,
  maxLeverage: 0,
  minLeverage: 0,
  name: "",
  pool: "0x0",
}));

describe("<StrategiesList />", () => {
  it("sorts rows by APR and end date when clicking table headers", async () => {
    const user = userEvent.setup();
    render(<StrategiesList strategies={strategies} />);

    const getAssetOrder = () => {
      const rows = within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row");
      return rows.map(
        row => within(row).getAllByRole("cell")[0].textContent?.trim().slice(-3) ?? ""
      );
    };

    expect(getAssetOrder()).toEqual(["AAA", "BBB", "CCC"]);

    const aprHeader = screen.getByRole("columnheader", { name: "APR" });
    await user.click(aprHeader);
    expect(getAssetOrder()).toEqual(["BBB", "CCC", "AAA"]);

    await user.click(aprHeader);
    expect(getAssetOrder()).toEqual(["AAA", "CCC", "BBB"]);

    const endDateHeader = screen.getByRole("columnheader", { name: "End date" });
    await user.click(endDateHeader);
    expect(getAssetOrder()).toEqual(["CCC", "AAA", "BBB"]);
  });
});
