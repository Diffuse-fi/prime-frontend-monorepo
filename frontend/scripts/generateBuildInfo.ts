import { CHAINS } from "@diffuse/config";
import { resolveAddress } from "@diffuse/sdk-js";
import nextEnv from "@next/env";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { AddressesOverridesSchema } from "@/lib/wagmi/addresses";
import { getContractAddressOverride } from "@/lib/wagmi/getContractAddressOverride";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDir, "..");
const buildPath = resolve(frontendRoot, "public", "build.json");

nextEnv.loadEnvConfig(frontendRoot, false);
const { env } = await import("../src/env");

const require = createRequire(import.meta.url);

async function buildInfo() {
  const pkg = await readFrontendPackageJson();

  const git = readGitInfo();
  const ci = pickCiInfo();
  const runtime = runtimeInfo();
  const viewers = viewerInfo();

  const versions = {
    next: await tryPkgVersion("next"),
    react: await tryPkgVersion("react"),
    reactDom: await tryPkgVersion("react-dom"),
    viem: await tryPkgVersion("viem"),
    wagmi: await tryPkgVersion("wagmi"),
  };

  const app = {
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    name: env.NEXT_PUBLIC_APP_NAME,
  };

  const publicEnv = safePublicEnv();

  const stableFingerprint = {
    appDescription: app.description,
    appName: app.name,
    gitCommitSha: git.commitSha,
    gitDescribe: git.describe,
    nodeEnv: ci.generic.nodeEnv,
    pkgName: pkg.name,
    pkgVersion: pkg.version,
    publicEnv,
    vercelEnv: ci.vercel.env,
    versions,
    viewers: Object.entries(viewers)
      .sort()
      .map(([k, v]) => `${k}:${v}`),
  };

  const buildId = createHash("sha256")
    .update(JSON.stringify(stableFingerprint))
    .digest("hex");

  return {
    app,
    buildId,
    ci,
    generatedAt: new Date().toISOString(),
    git,
    package: pkg,
    publicEnv,
    runtime,
    schemaVersion: 1,
    versions,
    viewers,
  };
}

async function maybeWriteBuildInfo() {
  const next = await buildInfo();

  let currRaw: string | undefined;
  try {
    currRaw = await readFile(buildPath, "utf8");
  } catch {}

  if (currRaw) {
    const curr = tryJsonParse(currRaw);
    const a = JSON.stringify(stableCompareShape(curr));
    const b = JSON.stringify(stableCompareShape(next));
    if (a === b) {
      console.info("build.json is up to date.");
      return;
    }
  }

  await writeFile(buildPath, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.info("build.json generated successfully.");
}

function pickCiInfo() {
  const env = process.env;

  const github = {
    actions: env.GITHUB_ACTIONS === "true",
    job: env.GITHUB_JOB,
    ref: env.GITHUB_REF,
    refName: env.GITHUB_REF_NAME,
    repository: env.GITHUB_REPOSITORY,
    runAttempt: env.GITHUB_RUN_ATTEMPT,
    runId: env.GITHUB_RUN_ID,
    runNumber: env.GITHUB_RUN_NUMBER,
    serverUrl: env.GITHUB_SERVER_URL,
    sha: env.GITHUB_SHA,
    workflow: env.GITHUB_WORKFLOW,
  };

  const vercel = {
    deploymentId: env.VERCEL_DEPLOYMENT_ID,
    env: env.VERCEL_ENV,
    gitCommitAuthorLogin: env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN,
    gitCommitAuthorName: env.VERCEL_GIT_COMMIT_AUTHOR_NAME,
    gitCommitMessage: env.VERCEL_GIT_COMMIT_MESSAGE,
    gitCommitRef: env.VERCEL_GIT_COMMIT_REF,
    gitCommitSha: env.VERCEL_GIT_COMMIT_SHA,
    gitProvider: env.VERCEL_GIT_PROVIDER,
    gitPullRequestId: env.VERCEL_GIT_PULL_REQUEST_ID,
    gitRepoOwner: env.VERCEL_GIT_REPO_OWNER,
    gitRepoSlug: env.VERCEL_GIT_REPO_SLUG,
    isVercel: env.VERCEL === "1",
    region: env.VERCEL_REGION,
    url: env.VERCEL_URL,
  };

  const generic = {
    ci: env.CI === "true",
    nodeEnv: env.NODE_ENV,
    tz: env.TZ,
  };

  return { generic, github, vercel };
}

async function readFrontendPackageJson() {
  try {
    const raw = await readFile(resolve(frontendRoot, "package.json"), "utf8");
    const json = JSON.parse(raw);
    return {
      name: typeof json.name === "string" ? json.name : undefined,
      private: typeof json.private === "boolean" ? json.private : undefined,
      repository: json.repository,
      version: typeof json.version === "string" ? json.version : undefined,
    };
  } catch {
    return {};
  }
}

function readGitInfo() {
  const commitSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    trySpawn("git", ["rev-parse", "HEAD"]);

  const branch =
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GITHUB_REF_NAME ||
    trySpawn("git", ["rev-parse", "--abbrev-ref", "HEAD"]);

  const describe = trySpawn("git", ["describe", "--tags", "--always", "--dirty"]);
  const commitDate = trySpawn("git", ["show", "-s", "--format=%cI", "HEAD"]);
  const commitMessage =
    process.env.VERCEL_GIT_COMMIT_MESSAGE ||
    trySpawn("git", ["show", "-s", "--format=%s", "HEAD"]);

  const isDirty = (() => {
    const s = trySpawn("git", ["status", "--porcelain"]);
    if (s === undefined) return;
    return s.length > 0;
  })();

  const remoteUrl =
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`
      : trySpawn("git", ["config", "--get", "remote.origin.url"]);

  return { branch, commitDate, commitMessage, commitSha, describe, isDirty, remoteUrl };
}

function runtimeInfo() {
  return {
    arch: process.arch,
    cpus: os.cpus()?.length,
    hostname: os.hostname(),
    node: process.version,
    platform: process.platform,
  };
}

function safePublicEnv() {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith("NEXT_PUBLIC_")) continue;
    if (typeof value !== "string") continue;

    const upperKey = key.toUpperCase();

    if (
      upperKey.includes("SECRET") ||
      upperKey.includes("TOKEN") ||
      upperKey.includes("PASSWORD") ||
      upperKey.includes("PRIVATE_KEY") ||
      upperKey.includes("MNEMONIC") ||
      upperKey.includes("API_KEY")
    ) {
      continue;
    }

    result[key] = value;
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stableCompareShape(x: any) {
  if (!x || typeof x !== "object") return {};

  return {
    app: x.app,
    buildId: x.buildId,
    ci: {
      generic: { ci: x.ci?.generic?.ci, nodeEnv: x.ci?.generic?.nodeEnv },
      github: {
        actions: x.ci?.github?.actions,
        refName: x.ci?.github?.refName,
        sha: x.ci?.github?.sha,
      },
      vercel: {
        env: x.ci?.vercel?.env,
        gitCommitSha: x.ci?.vercel?.gitCommitSha,
        isVercel: x.ci?.vercel?.isVercel,
      },
    },
    git: {
      branch: x.git?.branch,
      commitSha: x.git?.commitSha,
      describe: x.git?.describe,
    },
    package: x.package,
    publicEnv: x.publicEnv,
    schemaVersion: x.schemaVersion,
    versions: x.versions,
  };
}

function tryJsonParse(s: string) {
  try {
    return JSON.parse(s) as unknown;
  } catch {
    return;
  }
}

async function tryPkgVersion(pkg: string) {
  try {
    const p = require.resolve(`${pkg}/package.json`, { paths: [frontendRoot] });
    const raw = await readFile(p, "utf8");
    const json = JSON.parse(raw) as { version?: string };
    return typeof json.version === "string" ? json.version : undefined;
  } catch {
    return;
  }
}

function trySpawn(cmd: string, args: string[]) {
  try {
    const res = spawnSync(cmd, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    if (res.status !== 0) return;

    return (res.stdout ?? "").trim() || undefined;
  } catch {
    console.warn(`Failed to spawn ${cmd} ${args.join(" ")}`);
    return;
  }
}

function viewerInfo() {
  const viewersMap: Record<string, string> = {};

  const rawOverrides = env.NEXT_PUBLIC_ADDRESSES_OVERRIDES;
  const overrides = rawOverrides
    ? AddressesOverridesSchema.parse(rawOverrides)
    : undefined;

  for (const chain of CHAINS) {
    const addressOverride =
      getContractAddressOverride(chain.id, "Viewer", overrides) ?? undefined;

    const key = `${chain.name} (${chain.id})`;
    viewersMap[key] = resolveAddress({
      addressOverride,
      chainId: chain.id,
      contract: "Viewer",
    });
  }

  return viewersMap;
}

await maybeWriteBuildInfo();
