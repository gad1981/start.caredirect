import JSZip from "jszip";

const base = "http://127.0.0.1:3000";
const checks = [
  ["en", "pregnancy"],
  ["el", "pregnancy"],
  ["ro", "first-foods"],
  ["en", "first-foods"],
  ["bg", "newborn"],
  ["sr", "university"],
];

const countryNeedles = [
  "Greece",
  "Romania",
  "Bulgaria",
  "Serbia",
  "Cyprus",
  "Ελλάδα",
  "Ρουμανία",
  "Βουλγαρία",
  "Σερβία",
  "Κύπρος",
  "România",
  "Srbija",
  "Grčka",
  "Rumunija",
  "Bugarska",
  "Kipar",
  "България",
  "Гърция",
  "Румъния",
  "Сърбия",
  "Кипър",
];

const results = [];

for (const [locale, slug] of checks) {
  const url = `${base}/api/presentation/${locale}/${slug}/`;
  const res = await fetch(url);
  const cd = res.headers.get("content-disposition") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  const zip = await JSZip.loadAsync(buf);
  const ctFile = zip.file("[Content_Types].xml");
  const ct = ctFile ? await ctFile.async("string") : "";
  const masters = [...ct.matchAll(/slideMaster(\d+)/g)].map((m) => m[1]);
  const uniqueMasters = [...new Set(masters)];
  const slideNames = Object.keys(zip.files).filter((f) =>
    /^ppt\/slides\/slide\d+\.xml$/.test(f),
  );
  const countryHits = new Set();
  let hasStart = false;
  let hasCd = false;
  let hasContactTel = false;
  for (const name of slideNames) {
    const xml = await zip.file(name).async("string");
    for (const n of countryNeedles) {
      if (xml.includes(n)) countryHits.add(n);
    }
    if (xml.includes("start-logo")) hasStart = true;
    if (xml.includes("caredirect-logo")) hasCd = true;
    if (xml.includes("Tel.") || xml.includes("Τηλ.") || xml.includes("Тел.")) {
      hasContactTel = true;
    }
  }
  const fnameMatch = cd.match(/filename="([^"]+)"/);
  const fname = fnameMatch ? fnameMatch[1] : "";
  const ok =
    res.status === 200 &&
    uniqueMasters.length === 1 &&
    uniqueMasters[0] === "1" &&
    !fname.includes("greece") &&
    !fname.includes("romania") &&
    countryHits.size >= 2 &&
    hasStart &&
    hasCd &&
    hasContactTel &&
    slideNames.length >= 5;

  results.push({
    locale,
    slug,
    status: res.status,
    size: buf.length,
    slides: slideNames.length,
    fname,
    masters: uniqueMasters.join(","),
    countries: [...countryHits].join("|"),
    hasStart,
    hasCd,
    hasContactTel,
    ok,
  });
}

console.log(JSON.stringify(results, null, 2));
console.log("ALL_OK", results.every((r) => r.ok));
process.exit(results.every((r) => r.ok) ? 0 : 1);
