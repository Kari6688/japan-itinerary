export type Traveller = {
  id: "karima" | "ryan";
  name: string;
  handle: string;
  days: string;
  window: string;
  emoji: string;
  accent: string;
  soft: string;
  top3: string[];
};

export type Stay = {
  dates: string;
  place: string;
  city: string;
  who: "both" | "karima";
};

export type DayPlan = {
  date: string;
  title: string;
  who: "both" | "karima" | "ryan-leaves";
  bullets: string[];
};

export type Neighbourhood = {
  name: string;
  vibe: string;
};

export const travellers: Traveller[] = [
  {
    id: "karima",
    name: "Karima",
    handle: "@karima",
    days: "14 days",
    window: "3–17 · Tokyo → Kyoto → Tokyo",
    emoji: "🧸",
    accent: "#2E29EB",
    soft: "rgba(46, 41, 235, 0.1)",
    top3: [
      "Uji matcha + tea house Taiga Takahashi",
      "Kyoto ceramics haul",
      "Vintage hunt — Nakameguro Margiela flats",
    ],
  },
  {
    id: "ryan",
    name: "Ryan",
    handle: "@ryan",
    days: "~9 days (7½ on the ground)",
    window: "Arrive 3 morning · leave 10–11 morning",
    emoji: "🦊",
    accent: "#E07830",
    soft: "rgba(224, 120, 48, 0.12)",
    top3: ["History museum", "Kamakura", "TBD"],
  },
];

export const stays: Stay[] = [
  { dates: "3–5", place: "Shinjuku hotel", city: "Tokyo", who: "both" },
  { dates: "5–8", place: "Celestine Hotel Ginza", city: "Tokyo", who: "both" },
  { dates: "8–13", place: "Kabin Taka", city: "Kyoto", who: "both" },
  { dates: "13–15", place: "Ebisu Airbnb", city: "Tokyo", who: "karima" },
  { dates: "15–17", place: "Tokyu Stay Shimbashi", city: "Tokyo", who: "karima" },
];

/** Compact overview for the landing dropdown */
export const shortItinerary = [
  {
    label: "Together",
    detail: "Sat 3 → ~Tue 10/11 · Tokyo base, then Kyoto",
  },
  {
    label: "Tokyo",
    detail: "Shinjuku → Ginza/Ueno → frolic days · hotels through the 8th",
  },
  {
    label: "Kyoto",
    detail: "Train Thu 8 · Kiyomizu, Philosopher’s Path, Arashiyama, ceramics",
  },
  {
    label: "Ryan leaves",
    detail: "Morning of the 10th or 11th",
  },
  {
    label: "Karima solo",
    detail: "Uji matcha · optional Osaka · Tokyo shopping · fly 17th",
  },
];

export const days: DayPlan[] = [
  {
    date: "Sat 3",
    title: "Arrive Tokyo · Shinjuku",
    who: "both",
    bullets: [
      "Flight into Tokyo — morning arrival",
      "Check in Shinjuku hotel (stay through the 5th)",
      "Day 1 — ease into Shinjuku",
    ],
  },
  {
    date: "Sun 4",
    title: "Ginza · Tokyo Station",
    who: "both",
    bullets: ["Day 2 — Ginza and Tokyo Station area"],
  },
  {
    date: "Mon 5",
    title: "Ueno · move to Ginza",
    who: "both",
    bullets: [
      "Check out Shinjuku hotel",
      "Day 3 — Ueno National Museum",
      "Check in Celestine Hotel Ginza (5–8)",
    ],
  },
  {
    date: "Tue 6",
    title: "Frolic in Tokyo",
    who: "both",
    bullets: ["Day 4 — open Tokyo wander"],
  },
  {
    date: "Wed 7",
    title: "More Tokyo",
    who: "both",
    bullets: ["Day 5 — frolic in Tokyo", "Still at Celestine Ginza"],
  },
  {
    date: "Thu 8",
    title: "Tokyo → Kyoto",
    who: "both",
    bullets: [
      "Check out Celestine Hotel Ginza",
      "Morning train to Kyoto",
      "Check in Kabin Taka (8–13)",
      "Kiyomizu-dera + Philosopher’s Path",
    ],
  },
  {
    date: "Fri 9",
    title: "Kyoto days",
    who: "both",
    bullets: [
      "Ceramics shopping",
      "Arashiyama Bamboo Forest (go early) + Arashiyama park",
    ],
  },
  {
    date: "Sat 10",
    title: "Kyoto · Ryan’s last stretch",
    who: "both",
    bullets: [
      "More Kyoto time",
      "Ryan may leave this morning or the 11th morning",
    ],
  },
  {
    date: "Sun 11",
    title: "Kyoto (solo if Ryan left)",
    who: "karima",
    bullets: ["Buffer Kyoto day · soft plans"],
  },
  {
    date: "Mon 12",
    title: "Uji day trip",
    who: "karima",
    bullets: [
      "Matcha mission",
      "Tea house Taiga Takahashi",
      "Optional second look at Arashiyama if energy allows",
    ],
  },
  {
    date: "Tue 13",
    title: "Kyoto → Tokyo (via Osaka?)",
    who: "karima",
    bullets: [
      "Check out Kabin Taka",
      "Optional Osaka stop, then back to Tokyo",
      "Check in Ebisu Airbnb (13–15)",
      "Shop til you drop — Amomento, vintage (bags), Margiela flats, design books, pantry stuff",
    ],
  },
  {
    date: "Wed 14",
    title: "Ebisu / design day",
    who: "karima",
    bullets: ["Explore the area", "Design museums", "Check events / concert?"],
  },
  {
    date: "Thu 15",
    title: "Move to Shimbashi",
    who: "karima",
    bullets: [
      "Check in Tokyu Stay Shimbashi — Ginza area (15–17)",
      "Neighbourhood hop: Shimbashi, Jimbocho, Yanaka, Asakusa, Shimokitazawa",
    ],
  },
  {
    date: "Fri 16",
    title: "Explore",
    who: "karima",
    bullets: ["Open explore day — leftovers from the neighbourhood list"],
  },
  {
    date: "Sat 17",
    title: "Depart",
    who: "karima",
    bullets: [
      "Checkout",
      "Last food run",
      "Train to the airport",
      "Flight toward Taipei (overnight / next-day timing — confirm 12:25am vs 12:40pm)",
    ],
  },
];

export const tokyoNeighbourhoods: Neighbourhood[] = [
  { name: "Nakameguro", vibe: "Good vintage — Margiela flats!!" },
  { name: "Shimokitazawa", vibe: "Vintage boutiques / cafes" },
  { name: "Kappabashi", vibe: "Kitchen stuff" },
  { name: "Hatagaya", vibe: "Homeware + design stores" },
  { name: "Jiyugaoka", vibe: "Cool stuff" },
  { name: "Sangenjaya", vibe: "Chill vibes" },
  { name: "Yanaka", vibe: "Tokyo’s old town" },
  { name: "Gakugei-daigaku", vibe: "Creative + local charm" },
];
