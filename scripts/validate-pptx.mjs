import fs from "fs";
import JSZip from "jszip";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/validate-pptx.mjs <file.pptx>");
  process.exit(1);
}

const buf = fs.readFileSync(file);
const zip = await JSZip.loadAsync(buf);
const ct = await zip.file("[Content_Types].xml")?.async("string");
if (!ct) {
  console.error("No Content_Types");
  process.exit(1);
}

const overrides = [...ct.matchAll(/PartName="([^"]+)"/g)].map((m) => m[1]);
const missing = overrides.filter((p) => !zip.file(p.replace(/^\//, "")));
const masters = [...new Set([...ct.matchAll(/slideMaster(\d+)/g)].map((m) => m[1]))];

const slideRels = Object.keys(zip.files).filter((f) =>
  /^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/.test(f),
);
const brokenRels = [];
for (const rel of slideRels) {
  const xml = await zip.file(rel).async("string");
  for (const m of xml.matchAll(/Target="([^"]+)"/g)) {
    const target = m[1];
    if (target.startsWith("http")) continue;
    const base = rel.replace(/_rels\/[^/]+\.rels$/, "");
    // resolve ../media/foo relative to ppt/slides/
    const parts = (base + target).split("/");
    const stack = [];
    for (const part of parts) {
      if (part === "..") stack.pop();
      else if (part && part !== ".") stack.push(part);
    }
    const resolved = stack.join("/");
    if (!zip.file(resolved)) brokenRels.push(`${rel} -> ${target} (${resolved})`);
  }
}

console.log(
  JSON.stringify(
    {
      size: buf.length,
      masters,
      missingOverrides: missing,
      brokenRels: brokenRels.slice(0, 30),
      brokenRelCount: brokenRels.length,
      notesSlides: Object.keys(zip.files).filter((f) =>
        f.includes("notesSlides/notesSlide"),
      ).length,
      slideMastersOnDisk: Object.keys(zip.files).filter((f) =>
        f.includes("slideMasters/slideMaster"),
      ),
    },
    null,
    2,
  ),
);

process.exit(missing.length || brokenRels.length || masters.some((m) => m !== "1") ? 2 : 0);
