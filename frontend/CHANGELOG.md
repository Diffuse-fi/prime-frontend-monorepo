# diffuse-frontend

## 0.4.0

### Minor Changes

- [#226](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/226) [`5b812d7`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/5b812d72c32747e613df99a97177232344bd9105) Thanks [@ukorvl](https://github.com/ukorvl)! - fix strategyIds calculation for lender accruedLenderYield() call

- [#226](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/226) [`5b812d7`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/5b812d72c32747e613df99a97177232344bd9105) Thanks [@ukorvl](https://github.com/ukorvl)! - allow withdrawing from outdated strategies

### Patch Changes

- Updated dependencies [[`5b812d7`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/5b812d72c32747e613df99a97177232344bd9105)]:
  - @diffuse/sdk-js@0.3.1
  - @diffuse/indexer@1.0.1

## 0.3.0

### Minor Changes

- [#219](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/219) [`7015d3f`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/7015d3fbecafd8325ceab0762ec53fd926d22361) Thanks [@ukorvl](https://github.com/ukorvl)! - change leverage slider behavior - now change slider value on leverageed asset amount change (instead of collateral amount change)

- [#207](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/207) [`42c0077`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/42c00774938e54c1cfab8a80c73a4939c0b644a6) Thanks [@ukorvl](https://github.com/ukorvl)! - fix aegis exit finalized step

### Patch Changes

- [#213](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/213) [`723e2b4`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/723e2b459c72a7665801e986f80a6065eee611bf) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - add frontend i18n translation check script

- [#207](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/207) [`42c0077`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/42c00774938e54c1cfab8a80c73a4939c0b644a6) Thanks [@ukorvl](https://github.com/ukorvl)! - add position id to position card

- [#216](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/216) [`efda9b8`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/efda9b89ac5a34ecbea836016a1bbcdff061f937) Thanks [@ukorvl](https://github.com/ukorvl)! - add stringified json env safe parsing

- [#207](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/207) [`42c0077`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/42c00774938e54c1cfab8a80c73a4939c0b644a6) Thanks [@ukorvl](https://github.com/ukorvl)! - filter out outdated strategies

## 0.2.0

### Minor Changes

- [#174](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/174) [`984981c`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/984981c523fa8c54c0eafff907ea0ab19a47644c) Thanks [@ukorvl](https://github.com/ukorvl)! - make indexer_db_url and cron_secret optional

- [#176](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/176) [`397009f`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/397009f5dce826244a971c67bc78237cb285c726) Thanks [@ukorvl](https://github.com/ukorvl)! - implement new borrow preview for aegis strategies

### Patch Changes

- [#176](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/176) [`da3f653`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/da3f653522d0c190763bdece7ca9cfab71c64988) Thanks [@ukorvl](https://github.com/ukorvl)! - add borrow positions type switch

- [#176](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/176) [`b8d13a9`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/b8d13a9b2ce590a6b4786ef2a6ffdb213af7841d) Thanks [@ukorvl](https://github.com/ukorvl)! - for pt as collateral add safe leverage diff leverageAdjustmentForPt, which defaults to 10 in base points

- [#199](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/199) [`16c4e42`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/16c4e42060dae8b2a2293756e53d6a2f5881a3d0) Thanks [@ukorvl](https://github.com/ukorvl)! - add viewers map to build.json

- [#197](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/197) [`24dccd5`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/24dccd522f7aa7df3a164539107c2a97f1fa8161) Thanks [@ukorvl](https://github.com/ukorvl)! - aegis exit flow

- [#147](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/147) [`0708de0`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/0708de08fecfcfa798e072eeab497f72306eada5) Thanks [@ukorvl](https://github.com/ukorvl)! - add NEXT_PUBLIC_API_BASE_URL to work with api

- [#176](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/176) [`b8d13a9`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/b8d13a9b2ce590a6b4786ef2a6ffdb213af7841d) Thanks [@ukorvl](https://github.com/ukorvl)! - add NEXT_PUBLIC_ADDRESSES_OVERRIDES env to override addresses for local testing and staging

- [#176](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/176) [`5fed7fe`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/5fed7fe1818be8090ad8ef5faa1fe286d39ad0e1) Thanks [@ukorvl](https://github.com/ukorvl)! - add generateBuildInfo script to generate publicly available json with build parameters

- [#153](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/153) [`39eefe7`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/39eefe72a6a20ace07992b0801f91b48c620239b) Thanks [@ukorvl](https://github.com/ukorvl)! - new previewBorrow flow

- [#176](https://github.com/Diffuse-fi/prime-frontend-monorepo/pull/176) [`b8d13a9`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/b8d13a9b2ce590a6b4786ef2a6ffdb213af7841d) Thanks [@ukorvl](https://github.com/ukorvl)! - disable (temp) pt token as collateral for aegis strategies

- Updated dependencies [[`9778596`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/97785966c1e59bf5b4489481d02fc4ce885e7e0a), [`9778596`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/97785966c1e59bf5b4489481d02fc4ce885e7e0a), [`24dccd5`](https://github.com/Diffuse-fi/prime-frontend-monorepo/commit/24dccd522f7aa7df3a164539107c2a97f1fa8161)]:
  - @diffuse/config@0.1.1
  - @diffuse/sdk-js@0.3.0
  - @diffuse/indexer@1.0.0
