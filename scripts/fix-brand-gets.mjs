import fs from "fs";
import path from "path";

const root = path.resolve("content");
const headings = {
  el: "Τι κερδίζει το brand σας",
  ro: "Ce primește brandul tău",
  sr: "Šta tvoj brend dobija",
  bg: "Какво получава вашата марка",
};

for (const [loc, old] of Object.entries(headings)) {
  const f = path.join(root, loc, "pages.json");
  let s = fs.readFileSync(f, "utf8");
  const needle = `"name": "${old}"`;
  const before = s.split(needle).length - 1;
  s = s.split(needle).join(`"name": "Your brand gets"`);
  fs.writeFileSync(f, s);
  console.log(loc, "replaced", before);
}

for (const loc of ["en", "el", "ro", "sr", "bg"]) {
  for (const file of fs.readdirSync(path.join(root, loc)).filter((x) =>
    x.endsWith(".json"),
  )) {
    const n = (
      fs.readFileSync(path.join(root, loc, file), "utf8").match(/Σχέσεις/g) ||
      []
    ).length;
    if (n) console.log("sxeseis", `${loc}/${file}`, n);
  }
}
