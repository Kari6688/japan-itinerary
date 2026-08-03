import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  makeId,
  parseNeighbourhood,
  placeKey,
  refineCategory,
} from "./lib/maps-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const chromePath =
  process.env.CHROME_PATH || "/usr/local/bin/google-chrome";

const inputPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, "data/.scrape-cache.json");
const outputPath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(root, "data/places.json");
const existingPath = path.join(root, "data/places.json");

async function lookupPlace(page, name, mapsUrl) {
  const url =
    mapsUrl && mapsUrl.includes("google.com/maps")
      ? mapsUrl
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          name + " Japan",
        )}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 400));
    const cur = page.url();
    if (
      /@(-?\d+\.\d+),(-?\d+\.\d+)/.test(cur) ||
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/.test(cur)
    ) {
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 700));
  const cur = page.url();
  let lat = null;
  let lng = null;
  let m = cur.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (m) {
    lat = parseFloat(m[1]);
    lng = parseFloat(m[2]);
  } else {
    m = cur.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) {
      lat = parseFloat(m[1]);
      lng = parseFloat(m[2]);
    }
  }

  const info = await page.evaluate(() => {
    const title = document.querySelector("h1")?.textContent?.trim() || "";
    const buttons = Array.from(
      document.querySelectorAll("button[data-item-id], button[aria-label]"),
    );
    let address = null;
    for (const b of buttons) {
      const label = b.getAttribute("aria-label") || "";
      if (/Address:/i.test(label)) {
        address = label.replace(/^Address:\s*/i, "");
        break;
      }
    }
    if (!address) {
      const addrBtn = document.querySelector('button[data-item-id="address"]');
      if (addrBtn) {
        address =
          addrBtn.getAttribute("aria-label")?.replace(/^Address:\s*/i, "") ||
          addrBtn.innerText;
      }
    }
    const category =
      document.querySelector('button[jsaction*="category"]')?.textContent?.trim() ||
      document.querySelector(".DkEaL")?.textContent?.trim() ||
      null;
    return { title, address, category };
  });

  return { lat, lng, url: cur, ...info };
}

function loadExistingIndex() {
  if (!fs.existsSync(existingPath)) return new Map();
  const existing = JSON.parse(fs.readFileSync(existingPath, "utf8"));
  const byKey = new Map();
  const byName = new Map();
  for (const p of existing) {
    byKey.set(placeKey(p.sourceList, p.name), p);
    const nk = p.name.trim().toLowerCase();
    if (!byName.has(nk) && p.lat != null) byName.set(nk, p);
  }
  return { byKey, byName };
}

async function main() {
  const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const scraped = Array.isArray(raw) ? raw : raw.places || [];
  const { byKey, byName } = loadExistingIndex();

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--lang=en-US,en",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  );

  const out = [];
  let lookedUp = 0;
  let reused = 0;

  for (let i = 0; i < scraped.length; i++) {
    const p = scraped[i];
    const key = placeKey(p.sourceList, p.name);
    const prev = byKey.get(key);
    const nameHit = byName.get(p.name.trim().toLowerCase());

    process.stderr.write(`[${i + 1}/${scraped.length}] ${p.name}... `);

    let lat = prev?.lat ?? null;
    let lng = prev?.lng ?? null;
    let address = prev?.address ?? null;
    let mapsUrl = prev?.mapsUrl ?? p.mapsUrl;
    let neighbourhood = prev?.neighbourhood ?? null;
    let city = prev?.city ?? null;
    let subtype = p.subtype || prev?.subtype || null;
    let rating = p.rating ?? prev?.rating ?? null;
    let reviewCount = p.reviewCount ?? prev?.reviewCount ?? null;

    if (lat == null && nameHit?.lat != null) {
      lat = nameHit.lat;
      lng = nameHit.lng;
      address = address || nameHit.address;
      neighbourhood = neighbourhood || nameHit.neighbourhood;
      city = city || nameHit.city;
      mapsUrl = mapsUrl || nameHit.mapsUrl;
      reused += 1;
      process.stderr.write(`reuse-name ${city}\n`);
    } else if (lat != null) {
      reused += 1;
      process.stderr.write(`reuse ${city}\n`);
    } else {
      try {
        const g = await lookupPlace(page, p.name, p.mapsUrl);
        lat = g.lat;
        lng = g.lng;
        address = g.address || null;
        mapsUrl = g.url?.includes("/maps/")
          ? g.url.split("&g_ep")[0]
          : p.mapsUrl;
        subtype = subtype || g.category || null;
        const nb = parseNeighbourhood(g.address, g.url, g.lat, g.lng);
        neighbourhood = nb.neighbourhood;
        city = nb.city;
        lookedUp += 1;
        process.stderr.write(
          `${neighbourhood}/${city} @${g.lat?.toFixed?.(3)},${g.lng?.toFixed?.(3)}\n`,
        );
      } catch (e) {
        process.stderr.write(`ERR ${e.message}\n`);
        neighbourhood = "Unknown";
        city = "Japan";
      }
    }

    if ((!neighbourhood || neighbourhood === "Unknown") && (lat || address)) {
      const nb = parseNeighbourhood(address, mapsUrl, lat, lng);
      neighbourhood = nb.neighbourhood;
      city = nb.city;
    }

    out.push({
      id: prev?.id || makeId(i + 1, p.name),
      name: p.name,
      category: refineCategory({ ...p, category: p.category || prev?.category }),
      subtype,
      sourceList: p.sourceList,
      sourceListName: p.sourceListName || prev?.sourceListName,
      sourceUrl: p.sourceUrl || prev?.sourceUrl,
      rating,
      reviewCount,
      price: p.price ?? prev?.price ?? null,
      mapsUrl,
      lat,
      lng,
      neighbourhood: neighbourhood || "Unknown",
      city: city || "Japan",
      address,
      notes: prev?.notes ?? null,
      priority: prev?.priority ?? "normal",
    });

    if ((i + 1) % 15 === 0) {
      fs.writeFileSync(outputPath + ".partial", JSON.stringify(out, null, 2));
    }
  }

  await browser.close();
  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2));
  if (fs.existsSync(outputPath + ".partial")) fs.unlinkSync(outputPath + ".partial");

  const withCoords = out.filter((p) => p.lat != null).length;
  const byList = {};
  for (const p of out) byList[p.sourceList] = (byList[p.sourceList] || 0) + 1;
  console.log(
    JSON.stringify({ total: out.length, withCoords, lookedUp, reused, byList }, null, 2),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
