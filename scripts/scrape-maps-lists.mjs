import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  guessCategory,
  listSlug,
  placeKey,
} from "./lib/maps-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const listsPath = path.join(root, "data/lists.json");
const outPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, "data/.scrape-cache.json");

const chromePath =
  process.env.CHROME_PATH || "/usr/local/bin/google-chrome";

async function scrapeList(page, list) {
  await page.goto(list.url, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await new Promise((r) => setTimeout(r, 2500));

  // Expand list panel / scroll place cards into view
  for (let i = 0; i < 18; i++) {
    await page.evaluate(() => {
      const feed =
        document.querySelector('div[role="feed"]') ||
        document.querySelector(".m6QErb.DxyBCb") ||
        document.querySelector(".m6QErb");
      if (feed) feed.scrollTop = feed.scrollHeight;
      window.scrollBy(0, 600);
    });
    await new Promise((r) => setTimeout(r, 450));
  }

  const resolvedUrl = page.url();
  const extracted = await page.evaluate(() => {
    const cards = [
      ...document.querySelectorAll("a.hfpxzc"),
      ...document.querySelectorAll(".Nv2PK a"),
    ];
    const seen = new Set();
    const places = [];
    for (const a of cards) {
      const name =
        a.getAttribute("aria-label")?.trim() ||
        a.querySelector(".fontHeadlineSmall, .qBF1Pd")?.textContent?.trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const card = a.closest(".Nv2PK") || a.parentElement;
      const text = card?.innerText || "";
      const ratingMatch = text.match(/(\d\.\d)\D*?([\d,]+)?/);
      places.push({
        name,
        rating: ratingMatch ? parseFloat(ratingMatch[1]) : null,
        reviewCount: ratingMatch?.[2]
          ? parseInt(ratingMatch[2].replace(/,/g, ""), 10)
          : null,
        subtype: null,
        href: a.href || null,
      });
    }

    // Fallback: list title from h1
    const title =
      document.querySelector("h1")?.textContent?.trim() ||
      document.querySelector(".fontHeadlineLarge")?.textContent?.trim() ||
      null;
    return { title, places };
  });

  const listName = extracted.title || list.name;
  const listId = list.id || listSlug(listName);

  return {
    list: {
      id: listId,
      name: listName,
      url: list.url,
      resolvedUrl,
      category: list.category || null,
    },
    places: extracted.places.map((p) => ({
      name: p.name,
      category: guessCategory(list.category, listName, p.subtype, p.name),
      subtype: p.subtype,
      sourceList: listId,
      sourceListName: listName,
      sourceUrl: list.url,
      rating: p.rating,
      reviewCount: p.reviewCount,
      price: null,
      mapsUrl:
        p.href ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          p.name + " Japan",
        )}`,
      lat: null,
      lng: null,
      neighbourhood: null,
      city: null,
      address: null,
    })),
  };
}

async function main() {
  const lists = JSON.parse(fs.readFileSync(listsPath, "utf8"));
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

  const results = [];
  for (const list of lists) {
    process.stderr.write(`Scraping ${list.name}...\n`);
    try {
      const data = await scrapeList(page, list);
      process.stderr.write(`  → ${data.places.length} places\n`);
      results.push(data);
    } catch (e) {
      process.stderr.write(`  ERR ${e.message}\n`);
      results.push({ list, places: [], error: e.message });
    }
  }

  await browser.close();

  // Flatten + dedupe within each list
  const flat = [];
  const seen = new Set();
  for (const block of results) {
    for (const p of block.places) {
      const key = placeKey(p.sourceList, p.name);
      if (seen.has(key)) continue;
      seen.add(key);
      flat.push(p);
    }
  }

  const payload = {
    scrapedAt: new Date().toISOString(),
    lists: results.map((r) => ({
      ...r.list,
      count: r.places.length,
      error: r.error || null,
    })),
    places: flat,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(
    JSON.stringify(
      {
        outPath,
        lists: payload.lists.map((l) => ({ id: l.id, count: l.count })),
        total: flat.length,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
