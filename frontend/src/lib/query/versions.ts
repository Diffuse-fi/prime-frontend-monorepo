// Update these when making breaking changes to query responses
// so that cached data is not misinterpreted by the app
// Versions has hierarchy to avoid unnecessary cache invalidation or stale data
// e.g. bumping vaultVersion will invalidate lendVersion but not assetsMetaVersion
const viewerDataVersion = "v1";
const assetsMetaVersion = "v1";
const vaultVersion = `v1-${viewerDataVersion}`;
const lendVersion = `v1-${assetsMetaVersion}-${vaultVersion}`;
const allowanceVersion = `v1-${lendVersion}`;
const depositVersion = `v1-${lendVersion}`;
const withdrawVersion = `v1-${lendVersion}`;
const lenderPositionVersion = `v1-${lendVersion}`;
const borrowVersion = `v1-${vaultVersion}`;
const borrowerPositionVersion = `v1-${borrowVersion}`;

export const QV = {
  lend: lendVersion,
  assetsMeta: assetsMetaVersion,
  viewerData: viewerDataVersion,
  vault: vaultVersion,
  allowance: allowanceVersion,
  deposit: depositVersion,
  withdraw: withdrawVersion,
  lenderPositions: lenderPositionVersion,
  borrow: borrowVersion,
  borrowerPositions: borrowerPositionVersion,
} as const;
