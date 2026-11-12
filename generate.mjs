import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
const root = new URL("./", import.meta.url);
const registry = YAML.parse(await readFile(new URL("registry.yaml", root), "utf8"));
if (registry.version !== 1 || !Array.isArray(registry.types)) throw Error("Invalid registry");
const ids = new Set();
for (const type of registry.types) {
  if (!/^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/.test(type.id) || ids.has(type.id)) throw Error(`Invalid/duplicate content type ${type.id}`);
  ids.add(type.id);
  if (!type.name || !type.mimeTypes?.length || !type.extensions?.length) throw Error(`Incomplete ${type.id}`);
  if (type.mimeTypes.some(m => !/^[\w.+-]+\/[\w.+-]+$/.test(m))) throw Error(`Invalid MIME type in ${type.id}`);
  if (type.extensions.some(e => !/^[a-z0-9]+$/.test(e))) throw Error(`Invalid extension in ${type.id}`);
  for (const [name, table] of Object.entries(type.tables ?? {})) {
    if (!/^[a-z][a-z0-9_]*$/.test(name) || !table.required || !Object.keys(table.required).length) throw Error(`Invalid table in ${type.id}`);
  }
}
const result = JSON.stringify(registry, null, 2) + "\n";
const target = new URL("registry.json", root);
if (process.argv.includes("--check")) {
  if (await readFile(target, "utf8") !== result) throw Error("registry.json is out of date; run npm run generate");
} else await writeFile(target, result);
console.log(`Validated ${registry.types.length} content types in ${fileURLToPath(root)}`);
