import fs from "fs";

/**
 * Insert a printed/online guide card after the first · item when missing.
 * Keeps file formatting by operating on copy string values only.
 */

const GUIDE = {
  en: "A printed or online guide: your brand in the guide they keep",
  el: "Έντυπος ή online οδηγός: το brand σας στον οδηγό που κρατούν",
  ro: "Ghid tipărit sau online: brandul tău în ghidul pe care îl păstrează",
  sr: "Štampani ili online vodič: tvoj brend u vodiču koji zadržavaju",
  bg: "Печатен или онлайн наръчник: вашата марка в наръчника, който запазват",
};

function hasGuide(copy) {
  return /guide|οδηγ|ghid|vodič|наръчник/i.test(copy);
}

function insertGuide(copy, guideItem) {
  if (hasGuide(copy)) return copy;
  const sep = " · ";
  const parts = copy.split(sep);
  if (parts.length >= 1) parts.splice(1, 0, guideItem);
  else parts.push(guideItem);
  return parts.join(sep);
}

for (const locale of ["en", "el", "ro", "sr", "bg"]) {
  const path = `content/${locale}/pages.json`;
  let s = fs.readFileSync(path, "utf8");
  const guideItem = GUIDE[locale];
  let changed = 0;

  // Match "Your brand gets" / localized name then card-grid copy
  // Names stay "Your brand gets" in overlays too for most locales
  s = s.replace(
    /("name": "Your brand gets",\s*\n\s*"comp": "card-grid",\s*\n\s*"copy": ")((?:\\.|[^"\\])*)(")/g,
    (full, pre, copy, post) => {
      const unescaped = copy.replace(/\\"/g, '"');
      const next = insertGuide(unescaped, guideItem);
      if (next === unescaped) return full;
      changed++;
      return pre + next.replace(/"/g, '\\"') + post;
    },
  );

  fs.writeFileSync(path, s, "utf8");
  console.log(locale, "updated", changed);
}
