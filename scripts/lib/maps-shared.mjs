export function slug(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "place"
  );
}

export function listSlug(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "list"
  );
}

export function guessCategory(listCategory, listName, subtype, name) {
  if (listCategory) return listCategory;
  const ln = String(listName || "").toLowerCase();
  const st = `${subtype || ""} ${name || ""}`.toLowerCase();
  if (/dessert|sweet|bakery|ice cream|parfait|bar|drink|sake|wine|cocktail/.test(ln)) {
    return "food";
  }
  if (/matcha|cafe|coffee/.test(ln)) return "cafe";
  if (/shop|store|mall|market|ceramic|bookstore|book/.test(ln)) return "shopping";
  if (/temple|shrine|museum|galler/.test(ln)) return "culture";
  if (/temple|shrine|buddhist|shinto/.test(st)) return "temple";
  if (/museum|gallery|art/.test(st)) return "museum";
  if (/garden|park|forest|scenic/.test(st)) return "nature";
  if (/cafe|coffee|matcha|tea/.test(st)) return "cafe";
  if (/ramen|sushi|izakaya|noodle|restaurant|food|bar|bakery|dessert|sweet/.test(st)) {
    return "food";
  }
  return "culture";
}

export function refineCategory(p) {
  if (p.category === "food" || p.category === "shopping" || p.category === "cafe") {
    return p.category;
  }
  const s = `${p.subtype || ""} ${p.name || ""}`.toLowerCase();
  if (/temple|shrine|buddhist|shinto|jingu|\bji\b/.test(s)) return "temple";
  if (/museum|gallery|art/.test(s)) return "museum";
  if (/garden|park|forest|scenic/.test(s)) return "nature";
  if (/cafe|coffee|matcha|tea/.test(s)) return "cafe";
  if (/shop|store|ceramic|bookstore|book/.test(s)) return "shopping";
  return p.category || "culture";
}

export function parseNeighbourhood(address, url, lat, lng) {
  const knownAreas = [
    ["Asakusa", "Taito", "Tokyo"],
    ["Ueno", "Taito", "Tokyo"],
    ["Yanaka", "Taito", "Tokyo"],
    ["Shibuya", "Shibuya", "Tokyo"],
    ["Harajuku", "Shibuya", "Tokyo"],
    ["Ebisu", "Shibuya", "Tokyo"],
    ["Daikanyama", "Shibuya", "Tokyo"],
    ["Shimokitazawa", "Setagaya", "Tokyo"],
    ["Sangenjaya", "Setagaya", "Tokyo"],
    ["Shinjuku", "Shinjuku", "Tokyo"],
    ["Kabukicho", "Shinjuku", "Tokyo"],
    ["Kagurazaka", "Shinjuku", "Tokyo"],
    ["Ginza", "Chuo", "Tokyo"],
    ["Nihonbashi", "Chuo", "Tokyo"],
    ["Tsukiji", "Chuo", "Tokyo"],
    ["Roppongi", "Minato", "Tokyo"],
    ["Aoyama", "Minato", "Tokyo"],
    ["Omotesando", "Minato", "Tokyo"],
    ["Akasaka", "Minato", "Tokyo"],
    ["Azabu", "Minato", "Tokyo"],
    ["Meguro", "Meguro", "Tokyo"],
    ["Nakameguro", "Meguro", "Tokyo"],
    ["Ikebukuro", "Toshima", "Tokyo"],
    ["Akihabara", "Chiyoda", "Tokyo"],
    ["Kanda", "Chiyoda", "Tokyo"],
    ["Nakano", "Nakano", "Tokyo"],
    ["Koenji", "Suginami", "Tokyo"],
    ["Kichijoji", "Musashino", "Tokyo"],
    ["Jiyugaoka", "Meguro", "Tokyo"],
    ["Gotanda", "Shinagawa", "Tokyo"],
    ["Kuramae", "Taito", "Tokyo"],
    ["Arashiyama", "Ukyo", "Kyoto"],
    ["Gion", "Higashiyama", "Kyoto"],
    ["Pontocho", "Nakagyo", "Kyoto"],
    ["Kawaramachi", "Nakagyo", "Kyoto"],
    ["Nishiki", "Nakagyo", "Kyoto"],
    ["Kiyomizu", "Higashiyama", "Kyoto"],
    ["Fushimi", "Fushimi", "Kyoto"],
    ["Uji", "Uji", "Kyoto"],
    ["Philosopher", "Sakyo", "Kyoto"],
    ["Namba", "Osaka", "Osaka"],
    ["Umeda", "Osaka", "Osaka"],
    ["Dotonbori", "Osaka", "Osaka"],
    ["Shinsaibashi", "Osaka", "Osaka"],
    ["Tennoji", "Osaka", "Osaka"],
  ];

  const text = `${address || ""} ${url || ""}`;
  for (const [area, , city] of knownAreas) {
    if (new RegExp(area, "i").test(text)) return { neighbourhood: area, city };
  }

  let city = null;
  let neighbourhood = null;
  const tokyo =
    text.match(/([A-Za-z\-]+)\s+City,\s*Tokyo/i) ||
    text.match(/([A-Za-z\-]+)-ku,\s*Tokyo/i);
  if (tokyo) {
    neighbourhood = tokyo[1];
    city = "Tokyo";
  }
  const kyoto =
    text.match(/([A-Za-z\-]+)\s+Ward,\s*Kyoto/i) ||
    text.match(/Kyoto,\s*([A-Za-z\-]+)/i);
  if (kyoto && !city) {
    neighbourhood = kyoto[1];
    city = "Kyoto";
  }
  const osaka = text.match(/([A-Za-z\-]+)\s+(?:Ward|City),\s*Osaka/i);
  if (osaka && !city) {
    neighbourhood = osaka[1];
    city = "Osaka";
  }
  if (/Tokyo/i.test(text)) city = city || "Tokyo";
  if (/Kyoto/i.test(text)) city = city || "Kyoto";
  if (/Osaka/i.test(text)) city = city || "Osaka";
  if (/Nagoya/i.test(text)) city = city || "Nagoya";
  if (/Fukuoka/i.test(text)) city = city || "Fukuoka";
  if (/Kamakura/i.test(text)) city = city || "Kamakura";

  if (!city && lat && lng) {
    if (lat > 35.4 && lat < 35.9 && lng > 139.4 && lng < 139.95) city = "Tokyo";
    else if (lat > 34.85 && lat < 35.12 && lng > 135.6 && lng < 135.9) city = "Kyoto";
    else if (lat > 34.55 && lat < 34.8 && lng > 135.35 && lng < 135.65) city = "Osaka";
  }

  return {
    neighbourhood: neighbourhood || city || "Japan",
    city: city || "Japan",
  };
}

export function placeKey(sourceList, name) {
  return `${sourceList}::${String(name).trim().toLowerCase()}`;
}

export function makeId(index, name) {
  return `${String(index).padStart(3, "0")}-${slug(name)}`;
}
