#!/usr/bin/env node
/**
 * Sync Google Maps saved lists → data/places.json
 *
 * Google Maps does not push webhooks when you add a spot.
 * Run this script (locally or via GitHub Actions) after editing lists,
 * or on a schedule, to refresh the app data.
 *
 * Usage:
 *   node scripts/sync-maps.mjs
 *   node scripts/sync-maps.mjs --scrape-only
 *   node scripts/sync-maps.mjs --from-cache data/.scrape-cache.json
 */
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cachePath = path.join(root, "data/.scrape-cache.json");
const placesPath = path.join(root, "data/places.json");
const metaPath = path.join(root, "data/sync-meta.json");

const args = process.argv.slice(2);
const scrapeOnly = args.includes("--scrape-only");
const fromCacheIdx = args.indexOf("--from-cache");
const fromCache =
  fromCacheIdx >= 0 ? path.resolve(args[fromCacheIdx + 1]) : null;

function run(cmd, cmdArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${cmdArgs.join(" ")} exited ${code}`));
    });
  });
}

async function main() {
  if (!fromCache) {
    await run("node", ["scripts/scrape-maps-lists.mjs", cachePath]);
  } else {
    fs.copyFileSync(fromCache, cachePath);
  }

  if (scrapeOnly) {
    console.log("Scrape-only complete:", cachePath);
    return;
  }

  const input = fromCache || cachePath;
  await run("node", ["scripts/geocode-places.mjs", input, placesPath]);

  const places = JSON.parse(fs.readFileSync(placesPath, "utf8"));
  const byList = {};
  const byCity = {};
  for (const p of places) {
    byList[p.sourceList] = (byList[p.sourceList] || 0) + 1;
    byCity[p.city] = (byCity[p.city] || 0) + 1;
  }
  const meta = {
    lastSyncedAt: new Date().toISOString(),
    totalPlaces: places.length,
    withCoordinates: places.filter((p) => p.lat != null).length,
    byList,
    byCity,
    allowedCities: ["Tokyo", "Osaka", "Uji", "Kyoto", "Kamakura"],
    note: "Only spots in Tokyo, Osaka, Uji, Kyoto, and Kamakura are kept. Google Maps has no push API for saved lists — re-run pnpm sync:maps (or the GitHub Action) after adding spots.",
  };
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log("Sync complete:", meta);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
