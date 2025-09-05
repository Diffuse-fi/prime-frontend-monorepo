// Update these when making breaking changes to query responses
// so that cached data is not misinterpreted by the app
// Versions has hierarchy to avoid unnecessary cache invalidation or stale data
// e.g. bumping vaultVersion will invalidate lendVersion but not tokensMetaVersion
const vaultsListVersion = "v1";
const tokensMetaVersion = "v1";
const vaultVersion = `v1-${vaultsListVersion}`;
const lendVersion = `v1-${tokensMetaVersion}-${vaultVersion}`;
const allowanceVersion = `v1-${lendVersion}`;
const depositVersion = `v1-${lendVersion}`;
const withdrawVersion = `v1-${lendVersion}`;

export const QV = {
  lend: lendVersion,
  tokensMeta: tokensMetaVersion,
  vaultsList: vaultsListVersion,
  vault: vaultVersion,
  allowance: allowanceVersion,
  deposit: depositVersion,
  withdraw: withdrawVersion,
} as const;
