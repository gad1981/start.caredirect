import fs from "fs";
import path from "path";

const root = path.resolve("content");

const GUIDE_EN =
  "A printed or online guide: your brand in the guide they keep";

const enCopy = {
  "st-pregnancy":
    `Samples in the box: your product in their hands before the baby arrives · ${GUIDE_EN} · Consented follow-up after registration on the channels that fit · Our online platforms keep the conversation going`,
  "st-natal":
    `Samples in the box: your product in a new mother's first days · ${GUIDE_EN} · Consented follow-up after registration on the channels that fit · Our online platforms keep the conversation going`,
  "st-next":
    `Samples in the box: delivered home as baby starts solid food · ${GUIDE_EN} · Consented follow-up after registration on the channels that fit · Our online platforms keep the conversation going`,
  "st-school":
    `Samples in the box: in children's hands on their first school day · ${GUIDE_EN} · Consented follow-up after registration on the channels that fit · Our online platforms keep the conversation going`,
  "st-high":
    `Samples in their hands: as high school begins · ${GUIDE_EN} · Consented follow-up after registration on the channels that fit · Our online platforms keep the conversation going`,
  "st-uni":
    `Samples in their hands: in their first year · ${GUIDE_EN} · Consented follow-up after registration on the channels that fit · Our online platforms keep the conversation going`,
  "st-silver":
    `Samples in the box: handed over at the annual examination · ${GUIDE_EN} · Consented follow-up after registration on the channels that fit · Our online platform for women 50+ keeps the conversation going`,
  "st-school-xmas":
    `Samples in the Christmas box: in children's hands for the festive school moment · ${GUIDE_EN} · Consented follow-up after registration on the channels that fit · Our online platforms keep the conversation going`,
};

const GUIDE = {
  el: "Έντυπος ή online οδηγός: το brand σας στον οδηγό που κρατούν",
  ro: "Ghid tipărit sau online: brandul tău în ghidul pe care îl păstrează",
  sr: "Štampani ili online vodič: tvoj brend u vodiču koji zadržavaju",
  bg: "Печатен или онлайн наръчник: вашата марка в наръчника, който запазват",
};

const locCopy = {
  el: {
    "st-pregnancy":
      `Δείγματα στο κουτί: το προϊόν σας στα χέρια τους πριν έρθει το μωρό · ${GUIDE.el} · Follow-up με συγκατάθεση μετά την εγγραφή, στα κανάλια που ταιριάζουν · Οι online πλατφόρμες μας κρατούν τη συζήτηση ζωντανή`,
    "st-natal":
      `Δείγματα στο κουτί: το προϊόν σας στις πρώτες μέρες μιας νέας μητέρας · ${GUIDE.el} · Follow-up με συγκατάθεση μετά την εγγραφή, στα κανάλια που ταιριάζουν · Οι online πλατφόρμες μας κρατούν τη συζήτηση ζωντανή`,
    "st-next":
      `Δείγματα στο κουτί: παράδοση στο σπίτι όταν το μωρό ξεκινά στερεές · ${GUIDE.el} · Follow-up με συγκατάθεση μετά την εγγραφή, στα κανάλια που ταιριάζουν · Οι online πλατφόρμες μας κρατούν τη συζήτηση ζωντανή`,
    "st-school":
      `Δείγματα στο κουτί: στα χέρια των παιδιών την πρώτη μέρα στο σχολείο · ${GUIDE.el} · Follow-up με συγκατάθεση μετά την εγγραφή, στα κανάλια που ταιριάζουν · Οι online πλατφόρμες μας κρατούν τη συζήτηση ζωντανή`,
    "st-high":
      `Δείγματα στα χέρια τους: καθώς ξεκινά το λύκειο · ${GUIDE.el} · Follow-up με συγκατάθεση μετά την εγγραφή, στα κανάλια που ταιριάζουν · Οι online πλατφόρμες μας κρατούν τη συζήτηση ζωντανή`,
    "st-uni":
      `Δείγματα στα χέρια τους: στο πρώτο τους έτος · ${GUIDE.el} · Follow-up με συγκατάθεση μετά την εγγραφή, στα κανάλια που ταιριάζουν · Οι online πλατφόρμες μας κρατούν τη συζήτηση ζωντανή`,
    "st-silver":
      `Δείγματα στο κουτί: παράδοση στον ετήσιο έλεγχο · ${GUIDE.el} · Follow-up με συγκατάθεση μετά την εγγραφή, στα κανάλια που ταιριάζουν · Η online πλατφόρμα μας για γυναίκες 50+ κρατά τη συζήτηση ζωντανή`,
    "st-school-xmas":
      `Δείγματα στο χριστουγεννιάτικο κουτί: στα χέρια των παιδιών στην εορταστική σχολική στιγμή · ${GUIDE.el} · Follow-up με συγκατάθεση μετά την εγγραφή, στα κανάλια που ταιριάζουν · Οι online πλατφόρμες μας κρατούν τη συζήτηση ζωντανή`,
  },
  ro: {
    "st-pregnancy":
      `Mostre în cutie: produsul tău în mâinile lor înainte să apară bebelușul · ${GUIDE.ro} · Follow-up cu consimțământ după înregistrare, pe canalele potrivite · Platformele noastre online țin conversația vie`,
    "st-natal":
      `Mostre în cutie: produsul tău în primele zile ale mamei · ${GUIDE.ro} · Follow-up cu consimțământ după înregistrare, pe canalele potrivite · Platformele noastre online țin conversația vie`,
    "st-next":
      `Mostre în cutie: livrate acasă când bebelușul începe alimentația solidă · ${GUIDE.ro} · Follow-up cu consimțământ după înregistrare, pe canalele potrivite · Platformele noastre online țin conversația vie`,
    "st-school":
      `Mostre în cutie: în mâinile copiilor în prima zi de școală · ${GUIDE.ro} · Follow-up cu consimțământ după înregistrare, pe canalele potrivite · Platformele noastre online țin conversația vie`,
    "st-high":
      `Mostre în mâinile lor: la începutul liceului · ${GUIDE.ro} · Follow-up cu consimțământ după înregistrare, pe canalele potrivite · Platformele noastre online țin conversația vie`,
    "st-uni":
      `Mostre în mâinile lor: în primul an · ${GUIDE.ro} · Follow-up cu consimțământ după înregistrare, pe canalele potrivite · Platformele noastre online țin conversația vie`,
    "st-silver":
      `Mostre în cutie: predate la controlul anual · ${GUIDE.ro} · Follow-up cu consimțământ după înregistrare, pe canalele potrivite · Platforma noastră online pentru femei 50+ ține conversația vie`,
    "st-school-xmas":
      `Mostre în cutia de Crăciun: în mâinile copiilor la momentul festiv din școală · ${GUIDE.ro} · Follow-up cu consimțământ după înregistrare, pe canalele potrivite · Platformele noastre online țin conversația vie`,
  },
  sr: {
    "st-pregnancy":
      `Uzorci u kutiji: tvoj proizvod u njihovim rukama pre nego što beba stigne · ${GUIDE.sr} · Praćenje uz saglasnost nakon registracije, na kanalima koji odgovaraju · Naše online platforme održavaju razgovor živim`,
    "st-natal":
      `Uzorci u kutiji: tvoj proizvod u prvim danima nove majke · ${GUIDE.sr} · Praćenje uz saglasnost nakon registracije, na kanalima koji odgovaraju · Naše online platforme održavaju razgovor živim`,
    "st-next":
      `Uzorci u kutiji: dostava kući kada beba počne čvrstu hranu · ${GUIDE.sr} · Praćenje uz saglasnost nakon registracije, na kanalima koji odgovaraju · Naše online platforme održavaju razgovor živim`,
    "st-school":
      `Uzorci u kutiji: u rukama dece prvog školskog dana · ${GUIDE.sr} · Praćenje uz saglasnost nakon registracije, na kanalima koji odgovaraju · Naše online platforme održavaju razgovor živim`,
    "st-high":
      `Uzorci u njihovim rukama: na početku srednje škole · ${GUIDE.sr} · Praćenje uz saglasnost nakon registracije, na kanalima koji odgovaraju · Naše online platforme održavaju razgovor živim`,
    "st-uni":
      `Uzorci u njihovim rukama: u prvoj godini · ${GUIDE.sr} · Praćenje uz saglasnost nakon registracije, na kanalima koji odgovaraju · Naše online platforme održavaju razgovor živim`,
    "st-silver":
      `Uzorci u kutiji: uručivanje na godišnjem pregledu · ${GUIDE.sr} · Praćenje uz saglasnost nakon registracije, na kanalima koji odgovaraju · Naša online platforma za žene 50+ održava razgovor živim`,
    "st-school-xmas":
      `Uzorci u božićnoj kutiji: u rukama dece u svečanom školskom trenutku · ${GUIDE.sr} · Praćenje uz saglasnost nakon registracije, na kanalima koji odgovaraju · Naše online platforme održavaju razgovor živim`,
  },
  bg: {
    "st-pregnancy":
      `Мостри в кутията: вашият продукт в ръцете им, преди бебето да се появи · ${GUIDE.bg} · Последваща комуникация със съгласие след регистрация по подходящите канали · Нашите онлайн платформи поддържат разговора жив`,
    "st-natal":
      `Мостри в кутията: вашият продукт в първите дни на новата майка · ${GUIDE.bg} · Последваща комуникация със съгласие след регистрация по подходящите канали · Нашите онлайн платформи поддържат разговора жив`,
    "st-next":
      `Мостри в кутията: доставка до дома, когато бебето започне твърда храна · ${GUIDE.bg} · Последваща комуникация със съгласие след регистрация по подходящите канали · Нашите онлайн платформи поддържат разговора жив`,
    "st-school":
      `Мостри в кутията: в ръцете на децата на първия учебен ден · ${GUIDE.bg} · Последваща комуникация със съгласие след регистрация по подходящите канали · Нашите онлайн платформи поддържат разговора жив`,
    "st-high":
      `Мостри в ръцете им: в началото на гимназията · ${GUIDE.bg} · Последваща комуникация със съгласие след регистрация по подходящите канали · Нашите онлайн платформи поддържат разговора жив`,
    "st-uni":
      `Мостри в ръцете им: през първата година · ${GUIDE.bg} · Последваща комуникация със съгласие след регистрация по подходящите канали · Нашите онлайн платформи поддържат разговора жив`,
    "st-silver":
      `Мостри в кутията: предаване при годишния преглед · ${GUIDE.bg} · Последваща комуникация със съгласие след регистрация по подходящите канали · Нашата онлайн платформа за жени 50+ поддържа разговора жив`,
    "st-school-xmas":
      `Мостри в коледната кутия: в ръцете на децата в празничния училищен момент · ${GUIDE.bg} · Последваща комуникация със съгласие след регистрация по подходящите канали · Нашите онлайн платформи поддържат разговора жив`,
  },
};

function setCardGrid(pages, programId, copy) {
  const page = pages[programId];
  if (!page?.sections) return false;
  const sec = page.sections.find(
    (s) => s.comp === "card-grid" && s.name === "Your brand gets",
  );
  if (!sec) return false;
  sec.copy = copy;
  return true;
}

const enPages = JSON.parse(
  fs.readFileSync(path.join(root, "en/pages.json"), "utf8"),
);
for (const [id, copy] of Object.entries(enCopy)) {
  if (!setCardGrid(enPages, id, copy)) console.warn("EN miss", id);
}
fs.writeFileSync(
  path.join(root, "en/pages.json"),
  JSON.stringify(enPages, null, 1) + "\n",
);

for (const [loc, map] of Object.entries(locCopy)) {
  const pages = JSON.parse(
    fs.readFileSync(path.join(root, loc, "pages.json"), "utf8"),
  );
  for (const [id, copy] of Object.entries(map)) {
    if (!setCardGrid(pages, id, copy)) console.warn(loc, "miss", id);
  }
  fs.writeFileSync(
    path.join(root, loc, "pages.json"),
    JSON.stringify(pages, null, 1) + "\n",
  );
}

function patchHome(file, replacements) {
  let s = fs.readFileSync(file, "utf8");
  for (const [a, b] of replacements) s = s.split(a).join(b);
  fs.writeFileSync(file, s);
}

patchHome(path.join(root, "en/start-home.json"), [
  ["An ad in the BOOM guide", "A printed or online guide"],
  ["An ad in the Natal Guide", "A printed or online guide"],
  ["An ad in the Ladies guide", "A printed or online guide"],
  ["An ad in the printed guide", "A printed or online guide"],
]);
patchHome(path.join(root, "el/start-home.json"), [
  ["Διαφήμιση στον οδηγό BOOM", "Έντυπος ή online οδηγός"],
  ["Διαφήμιση στον Natal Guide", "Έντυπος ή online οδηγός"],
  ["Διαφήμιση στον οδηγό Ladies", "Έντυπος ή online οδηγός"],
  ["Διαφήμιση στον έντυπο οδηγό", "Έντυπος ή online οδηγός"],
]);
patchHome(path.join(root, "ro/start-home.json"), [
  ["O reclamă în ghidul BOOM", "Ghid tipărit sau online"],
  ["O reclamă în Natal Guide", "Ghid tipărit sau online"],
  ["O reclamă în ghidul Natal", "Ghid tipărit sau online"],
  ["O reclamă în ghidul Ladies", "Ghid tipărit sau online"],
  ["O reclamă în ghidul tipărit", "Ghid tipărit sau online"],
]);
patchHome(path.join(root, "sr/start-home.json"), [
  ["Oglas u BOOM vodiču", "Štampani ili online vodič"],
  ["Oglas u Natal Guide", "Štampani ili online vodič"],
  ["Oglas u Ladies vodiču", "Štampani ili online vodič"],
  ["Oglas u štampanom vodiču-u", "Štampani ili online vodič"],
  ["Oglas u štampanom vodiču", "Štampani ili online vodič"],
]);
patchHome(path.join(root, "bg/start-home.json"), [
  ["Реклама в наръчника BOOM", "Печатен или онлайн наръчник"],
  ["Реклама в Natal Guide", "Печатен или онлайн наръчник"],
  ["Реклама в наръчника Ladies", "Печатен или онлайн наръчник"],
  ["Реклама в печатния наръчник", "Печатен или онлайн наръчник"],
]);

// sanity: local names should be gone from Your brand gets
const banned =
  /Babyspace|Myparenthood|Mybabywinner|HeyMaa|Myschoolwinner|START 9|startliceu|UniStart\+|LadiesBook|ladiesbook\.gr|BOOM guide|Natal Guide|Breastfeeding Guide|Σχέσεις/;
for (const loc of ["en", "el", "ro", "sr", "bg"]) {
  const pages = JSON.parse(
    fs.readFileSync(path.join(root, loc, "pages.json"), "utf8"),
  );
  for (const [id, page] of Object.entries(pages)) {
    const sec = page.sections?.find(
      (s) => s.comp === "card-grid" && s.name === "Your brand gets",
    );
    if (sec && banned.test(sec.copy)) {
      console.warn("still local", loc, id, sec.copy.slice(0, 80));
    }
  }
}

console.log("done");
