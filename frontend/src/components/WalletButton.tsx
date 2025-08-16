import { WalletButton as WalletButtonRainbowKit } from "@rainbow-me/rainbowkit";

export default function WalletButton() {
  return (
    <WalletButtonRainbowKit.Custom>
      {({ ready, connect }) => {
        return (
          <button type="button" disabled={!ready} onClick={connect}>
            Connect Rainbow
          </button>
        );
      }}
    </WalletButtonRainbowKit.Custom>
  );
}
