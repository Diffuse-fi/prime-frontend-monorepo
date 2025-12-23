import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function generateAbis(contractsRoot: string) {
  const dirs = (await readdir(contractsRoot, { withFileTypes: true }))
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const dir of dirs) {
    const abiJsonPath = path.join(contractsRoot, dir, "abi.json");
    const abiTsPath = path.join(contractsRoot, dir, "abi.ts");

    let abiRaw: string;
    try {
      abiRaw = await readFile(abiJsonPath, "utf8");
    } catch {
      continue;
    }

    const abi = JSON.parse(abiRaw);
    const exportName = `${toCamel(dir)}Abi`;
    const out =
      `import type { Abi } from "viem";\n\n` +
      `export const ${exportName} = ${JSON.stringify(abi, null, 2)} as const satisfies Abi;\n`;

    const formatted = await formatWithPrettier(out, abiTsPath);
    await writeIfChanged(abiTsPath, formatted);
  }
}

function toCamel(input: string) {
  const parts = input.split(/[^a-z0-9]+/i).filter(Boolean);
  if (parts.length === 0) return "abi";
  return (
    parts[0].toLowerCase() +
    parts
      .slice(1)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join("")
  );
}

async function writeIfChanged(filePath: string, next: string) {
  try {
    const prev = await readFile(filePath, "utf8");
    if (prev === next) return;
  } catch {}
  await writeFile(filePath, next, "utf8");
}

async function formatWithPrettier(code: string, filepath: string) {
  const prettier = await import("prettier");
  const resolved = await prettier.resolveConfig(filepath);
  const options = {
    ...(resolved ?? {}),
    filepath,
    parser: "typescript",
  };
  return prettier.format(code, options);
}
