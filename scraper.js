// scraping logic
// this file is run by .github/workflows/scrape.yml


import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { fileURLToPath } from "url";

// -------- EVENT MAP --------
const eventMap = {
  "3x3": "333",
  "2x2": "222",
  "3x3 Blindfolded": "333bf",
  "3x3 One-Handed": "333oh",
  "3x3 Fewest Moves": "333fm",
  "3x3 Multi-Blind": "333mbf",
  "4x4": "444",
  "4x4 Blindfolded": "444bf",
  "5x5": "555",
  "5x5 Blindfolded": "555bf",
  "6x6": "666",
  "7x7": "777",
  "Clock": "clock",
  "Megaminx": "minx",
  "Pyraminx": "pyram",
  "Skewb": "skewb",
  "Square-1": "sq1",
};

// -------- EVENT ORDER USED IN TABLE --------
const eventOrder = [
  "333", "222", "444", "555", "666", "777",
  "333bf", "333fm", "333oh", "clock",
  "minx", "pyram", "skewb", "sq1"
];

// -------- UTIL: FLAG CLASS → TWEMOJI URL --------
function twemojiURLFromCountryCode(code) {
  if (!code || code.length !== 2) return "";
  const chars = [...code.toUpperCase()];
  const hex = chars
    .map((c) => (0x1f1e6 + (c.charCodeAt(0) - 65)).toString(16))
    .join("-");
  return `https://twemoji.maxcdn.com/v/latest/72x72/${hex}.png`;
}

// ----------- SCRAPER -----------
async function scrapeKinchJSON() {
  const url = "https://wca.cuber.pro/";

  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    timeout: 20000,
  });

  const $ = cheerio.load(html);
  const countries = [];

  $("table tbody tr").each((i, tr) => {
    const children = $(tr).children();

    const rank = parseInt($(children[0]).text().trim(), 10);

    // ---- Country + Flag ----
    const countryTd = $(children[1]);
    const countryName = countryTd.find("span").text().trim();
    const flagClass = countryTd.find("i.flag").attr("class") || "";
    const flagMatch = flagClass.match(/flag-([a-z]{2})/i);
    const flagCode = flagMatch ? flagMatch[1] : null;

    const flag = flagCode ? twemojiURLFromCountryCode(flagCode) : "";

    // ---- Overall ----
    const overall = parseFloat($(children[2]).text().trim()) || 0;

    // ---- Per-event scores ----
    const scores = {};
    eventOrder.forEach((code, idx) => {
      const scoreTd = $(children[idx + 3]);
      const scoreText = scoreTd.text().trim();
      scores[code] = scoreText ? parseFloat(scoreText) : null;
    });

    countries.push({
      rank,
      country: countryName,
      code: flagCode ? flagCode.toLowerCase() : null,
      flag,
      overall,
      scores,
    });
  });

  return countries;
}

// ----------- WRITE FULL + PER-COUNTRY + TOP X OUTPUT -----------
export async function updateKinchJSON() {
  try {
    console.log("Scraping Kinch data...");
    const data = await scrapeKinchJSON();

    // Ensure ./data exists
    const dataDir = "./data";
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

    // Ensure ./data/countries exists
    const countriesDir = "./data/countries";
    if (!fs.existsSync(countriesDir)) fs.mkdirSync(countriesDir);

    // Write the FULL JSON
    const fullPath = `${dataDir}/kinch.json`;
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`✔ Full Kinch JSON saved to ${fullPath}`);

    // Write ONE JSON per country
    data.forEach((country) => {
      if (!country.code) return;
      const file = `${countriesDir}/${country.code}.json`;
      fs.writeFileSync(file, JSON.stringify(country, null, 2), "utf8");
    });
    console.log(`✔ Per-country JSONs saved to ${countriesDir}/`);

    // -------- Write Top X JSONs --------
    const topXs = [3, 5, 10, 20, 30, 40, 50, 100];
    topXs.forEach((topN) => {
      const topData = data.slice(0, topN);
      const topPath = `${dataDir}/top${topN}.json`;
      fs.writeFileSync(topPath, JSON.stringify(topData, null, 2), "utf8");
      console.log(`✔ Top ${topN} countries JSON saved to ${topPath}`);
    });

  } catch (err) {
    console.error("Error scraping Kinch:", err);
  }
}

// ----------- RUN IF EXECUTED DIRECTLY -----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updateKinchJSON();
}
