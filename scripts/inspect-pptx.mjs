import fs from "fs";
import JSZip from "jszip";

const file = process.argv[2];
const zip = await JSZip.loadAsync(fs.readFileSync(file));
const s1 = await zip.file("ppt/slides/slide1.xml").async("string");
console.log("wrap attrs:", [...s1.matchAll(/\bwrap="[^"]+"/g)].map((m) => m[0]));
console.log("has by:", s1.includes(">by<"));
const rel = await zip.file("ppt/slides/_rels/slide1.xml.rels").async("string");
console.log("notes rel:", rel.includes("notesSlide"));
const notes = await zip.file("ppt/notesSlides/notesSlide1.xml")?.async("string");
console.log("empty note text:", notes?.includes("<a:t></a:t>"));
// look for alpha on lines (sometimes flaky)
let alphaLines = 0;
for (const name of Object.keys(zip.files)) {
  if (!/^ppt\/slides\/slide\d+\.xml$/.test(name)) continue;
  const xml = await zip.file(name).async("string");
  if (/<a:ln[^>]*>[\s\S]*?<a:alpha/.test(xml)) alphaLines++;
}
console.log("slides with alpha on line:", alphaLines);
