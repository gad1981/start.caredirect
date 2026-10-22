import fs from "fs";
import path from "path";

const root = path.resolve("content");

/** Every card must be "Title: body" so the UI always shows title + text below. */
const enCopy = {
  "st-marriage":
    "Samples in the box: delivered home as they set up house · Consented follow-up: after registration, on the channels that fit · Online communities: Care Direct keeps the conversation going",
  "st-pet":
    "Samples in the box: in new owners' hands as routines form · Consented follow-up: after registration, on the channels that fit · Online communities: Care Direct keeps the conversation going",
  "st-pregnancy":
    "Samples in the box: your product in their hands before the baby arrives · An ad in the printed guide: a guide they keep and use · Consented follow-up: after registration, on the channels that fit · Online platforms: keep the conversation going",
  "st-natal":
    "Samples in the box: your product in a new mother's first days · An ad in the printed guide: a guide she keeps and uses · Consented follow-up: after registration, on the channels that fit · Online platforms: keep the conversation going",
  "st-luxury":
    "Educational material: in the Luxury Moments kit · Regular-size products: mothers experience your brand through trial · Promotional materials: at a sentimental moment · Core target: upper-class new mothers in private suites",
  "st-next":
    "Samples in the box: delivered home as baby starts solid food · Consented follow-up: after registration, on the channels that fit · Online platforms: keep the conversation going",
  "st-school":
    "Samples in the box: in children's hands on their first school day · Consented follow-up: after registration, on the channels that fit · Online platforms: keep the conversation going",
  "st-teen":
    "Samples in the box: the first products she chooses for herself · Home delivery: by courier to her door · Consented follow-up: after registration, on the channels that fit · Online communities: Care Direct keeps the conversation going",
  "st-high":
    "Samples in their hands: as high school begins · Consented follow-up: after registration, on the channels that fit · Interactive web guide: for their first year",
  "st-uni":
    "Samples in their hands: in their first year · Consented follow-up: after registration, on the channels that fit · Digital student guide: keeps the conversation going",
  "st-army":
    "Samples in their hands: on their first day of service · Consented follow-up: after registration, on the channels that fit · Online communities: Care Direct keeps the conversation going",
  "st-silver":
    "Samples in the box: handed over at the annual examination · An ad in the printed guide: a guide they keep · Consented follow-up: after registration, on the channels that fit · Online platform: for women 50+, keeps the conversation going",
  "st-seniors":
    "Samples in the box: at home and where seniors gather · Consented follow-up: after registration, on the channels that fit · Online communities: Care Direct keeps the conversation going",
  "st-school-xmas":
    "Samples in the Christmas box: in children's hands for the festive school moment · Consented follow-up: after registration, on the channels that fit · Online platforms: keep the conversation going",
};

const locCopy = {
  el: {
    "st-marriage":
      "Δείγματα στο κουτί: παράδοση στο σπίτι καθώς στήνουν το σπίτι · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online κοινότητες: η Care Direct κρατά τη συζήτηση ζωντανή",
    "st-pet":
      "Δείγματα στο κουτί: στα χέρια νέων ιδιοκτητών καθώς διαμορφώνονται οι συνήθειες · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online κοινότητες: η Care Direct κρατά τη συζήτηση ζωντανή",
    "st-pregnancy":
      "Δείγματα στο κουτί: το προϊόν σας στα χέρια τους πριν έρθει το μωρό · Διαφήμιση στον έντυπο οδηγό: έναν οδηγό που κρατούν και χρησιμοποιούν · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online πλατφόρμες: κρατούν τη συζήτηση ζωντανή",
    "st-natal":
      "Δείγματα στο κουτί: το προϊόν σας στις πρώτες μέρες μιας νέας μητέρας · Διαφήμιση στον έντυπο οδηγό: έναν οδηγό που κρατά και χρησιμοποιεί · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online πλατφόρμες: κρατούν τη συζήτηση ζωντανή",
    "st-luxury":
      "Εκπαιδευτικό υλικό: στο kit Luxury Moments · Προϊόντα κανονικού μεγέθους: οι μητέρες δοκιμάζουν το brand σας · Προωθητικό υλικό: σε μια συναισθηματική στιγμή · Κεντρικό κοινό: νέες μητέρες σε ιδιωτικές σουίτες",
    "st-next":
      "Δείγματα στο κουτί: παράδοση στο σπίτι όταν το μωρό ξεκινά στερεές · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online πλατφόρμες: κρατούν τη συζήτηση ζωντανή",
    "st-school":
      "Δείγματα στο κουτί: στα χέρια των παιδιών την πρώτη μέρα στο σχολείο · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online πλατφόρμες: κρατούν τη συζήτηση ζωντανή",
    "st-teen":
      "Δείγματα στο κουτί: τα πρώτα προϊόντα που διαλέγει μόνη της · Παράδοση στο σπίτι: με courier · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online κοινότητες: η Care Direct κρατά τη συζήτηση ζωντανή",
    "st-high":
      "Δείγματα στα χέρια τους: καθώς ξεκινά το λύκειο · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Διαδραστικός web οδηγός: για την πρώτη τους χρονιά",
    "st-uni":
      "Δείγματα στα χέρια τους: στο πρώτο τους έτος · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Ψηφιακός φοιτητικός οδηγός: κρατά τη συζήτηση ζωντανή",
    "st-army":
      "Δείγματα στα χέρια τους: την πρώτη μέρα της θητείας · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online κοινότητες: η Care Direct κρατά τη συζήτηση ζωντανή",
    "st-silver":
      "Δείγματα στο κουτί: παράδοση στον ετήσιο έλεγχο · Διαφήμιση στον έντυπο οδηγό: έναν οδηγό που κρατούν · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online πλατφόρμα: για γυναίκες 50+, κρατά τη συζήτηση ζωντανή",
    "st-seniors":
      "Δείγματα στο κουτί: στο σπίτι και εκεί όπου συγκεντρώνονται ηλικιωμένοι · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online κοινότητες: η Care Direct κρατά τη συζήτηση ζωντανή",
    "st-school-xmas":
      "Δείγματα στο χριστουγεννιάτικο κουτί: στα χέρια των παιδιών στην εορταστική σχολική στιγμή · Follow-up με συγκατάθεση: μετά την εγγραφή, στα κανάλια που ταιριάζουν · Online πλατφόρμες: κρατούν τη συζήτηση ζωντανή",
  },
  ro: {
    "st-marriage":
      "Mostre în cutie: livrate acasă pe măsură ce își amenajează casa · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Comunități online: Care Direct ține conversația vie",
    "st-pet":
      "Mostre în cutie: în mâinile noilor proprietari pe măsură ce se formează rutinele · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Comunități online: Care Direct ține conversația vie",
    "st-pregnancy":
      "Mostre în cutie: produsul tău în mâinile lor înainte să apară bebelușul · O reclamă în ghidul tipărit: un ghid pe care îl păstrează și îl folosesc · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Platforme online: țin conversația vie",
    "st-natal":
      "Mostre în cutie: produsul tău în primele zile ale mamei · O reclamă în ghidul tipărit: un ghid pe care îl păstrează și îl folosește · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Platforme online: țin conversația vie",
    "st-luxury":
      "Material educativ: în kitul Luxury Moments · Produse în format normal: mamele încearcă brandul tău · Materiale promoționale: într-un moment sentimental · Public-țintă: mame noi din suite private",
    "st-next":
      "Mostre în cutie: livrate acasă când bebelușul începe alimentația solidă · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Platforme online: țin conversația vie",
    "st-school":
      "Mostre în cutie: în mâinile copiilor în prima zi de școală · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Platforme online: țin conversația vie",
    "st-teen":
      "Mostre în cutie: primele produse pe care le alege singură · Livrare la domiciliu: prin curier · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Comunități online: Care Direct ține conversația vie",
    "st-high":
      "Mostre în mâinile lor: la începutul liceului · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Ghid web interactiv: pentru primul lor an",
    "st-uni":
      "Mostre în mâinile lor: în primul an · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Ghid digital pentru studenți: ține conversația vie",
    "st-army":
      "Mostre în mâinile lor: în prima zi de serviciu · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Comunități online: Care Direct ține conversația vie",
    "st-silver":
      "Mostre în cutie: predate la controlul anual · O reclamă în ghidul tipărit: un ghid pe care îl păstrează · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Platformă online: pentru femei 50+, ține conversația vie",
    "st-seniors":
      "Mostre în cutie: acasă și acolo unde se adună seniorii · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Comunități online: Care Direct ține conversația vie",
    "st-school-xmas":
      "Mostre în cutia de Crăciun: în mâinile copiilor la momentul festiv din școală · Follow-up cu consimțământ: după înregistrare, pe canalele potrivite · Platforme online: țin conversația vie",
  },
  sr: {
    "st-marriage":
      "Uzorci u kutiji: dostava kući dok uređuju dom · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online zajednice: Care Direct održava razgovor živim",
    "st-pet":
      "Uzorci u kutiji: u rukama novih vlasnika dok se formiraju rutine · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online zajednice: Care Direct održava razgovor živim",
    "st-pregnancy":
      "Uzorci u kutiji: tvoj proizvod u njihovim rukama pre nego što beba stigne · Oglas u štampanom vodiču: vodič koji zadržavaju i koriste · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online platforme: održavaju razgovor živim",
    "st-natal":
      "Uzorci u kutiji: tvoj proizvod u prvim danima nove majke · Oglas u štampanom vodiču: vodič koji ona zadržava i koristi · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online platforme: održavaju razgovor živim",
    "st-luxury":
      "Edukativni materijal: u kompletu Luxury Moments · Proizvodi regularne veličine: majke isprobavaju tvoj brend · Promotivni materijali: u emotivnom trenutku · Ciljna publika: nove majke u privatnim apartmanima",
    "st-next":
      "Uzorci u kutiji: dostava kući kada beba počne čvrstu hranu · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online platforme: održavaju razgovor živim",
    "st-school":
      "Uzorci u kutiji: u rukama dece prvog školskog dana · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online platforme: održavaju razgovor živim",
    "st-teen":
      "Uzorci u kutiji: prvi proizvodi koje sama bira · Dostava kući: kurirom · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online zajednice: Care Direct održava razgovor živim",
    "st-high":
      "Uzorci u njihovim rukama: na početku srednje škole · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Interaktivni veb vodič: za prvu godinu",
    "st-uni":
      "Uzorci u njihovim rukama: u prvoj godini · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Digitalni studentski vodič: održava razgovor živim",
    "st-army":
      "Uzorci u njihovim rukama: na prvi dan službe · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online zajednice: Care Direct održava razgovor živim",
    "st-silver":
      "Uzorci u kutiji: uručivanje na godišnjem pregledu · Oglas u štampanom vodiču: vodič koji zadržavaju · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online platforma: za žene 50+, održava razgovor živim",
    "st-seniors":
      "Uzorci u kutiji: kod kuće i tamo gde se stariji okupljaju · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online zajednice: Care Direct održava razgovor živim",
    "st-school-xmas":
      "Uzorci u božićnoj kutiji: u rukama dece u svečanom školskom trenutku · Praćenje uz saglasnost: nakon registracije, na kanalima koji odgovaraju · Online platforme: održavaju razgovor živim",
  },
  bg: {
    "st-marriage":
      "Мостри в кутията: доставка до дома, докато си устройват дома · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн общности: Care Direct поддържа разговора жив",
    "st-pet":
      "Мостри в кутията: в ръцете на новите собственици, докато се оформят навиците · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн общности: Care Direct поддържа разговора жив",
    "st-pregnancy":
      "Мостри в кутията: вашият продукт в ръцете им, преди бебето да се появи · Реклама в печатния наръчник: наръчник, който те пазят и използват · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн платформи: поддържат разговора жив",
    "st-natal":
      "Мостри в кутията: вашият продукт в първите дни на новата майка · Реклама в печатния наръчник: наръчник, който тя пази и използва · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн платформи: поддържат разговора жив",
    "st-luxury":
      "Образователни материали: в комплекта Luxury Moments · Продукти в пълен размер: майките изпробват вашата марка · Промоционални материали: в емоционален момент · Основна аудитория: нови майки в частни апартаменти",
    "st-next":
      "Мостри в кутията: доставка до дома, когато бебето започне твърда храна · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн платформи: поддържат разговора жив",
    "st-school":
      "Мостри в кутията: в ръцете на децата на първия учебен ден · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн платформи: поддържат разговора жив",
    "st-teen":
      "Мостри в кутията: първите продукти, които избира сама · Доставка до дома: с куриер · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн общности: Care Direct поддържа разговора жив",
    "st-high":
      "Мостри в ръцете им: в началото на гимназията · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Интерактивен уеб наръчник: за първата им година",
    "st-uni":
      "Мостри в ръцете им: през първата година · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Дигитален студентски наръчник: поддържа разговора жив",
    "st-army":
      "Мостри в ръцете им: в първия ден на службата · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн общности: Care Direct поддържа разговора жив",
    "st-silver":
      "Мостри в кутията: предаване при годишния преглед · Реклама в печатния наръчник: наръчник, който те пазят · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн платформа: за жени 50+, поддържа разговора жив",
    "st-seniors":
      "Мостри в кутията: у дома и там, където се събират възрастни хора · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн общности: Care Direct поддържа разговора жив",
    "st-school-xmas":
      "Мостри в коледната кутия: в ръцете на децата в празничния училищен момент · Последваща комуникация със съгласие: след регистрация, по подходящите канали · Онлайн платформи: поддържат разговора жив",
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

function assertTitleBody(copy, loc, id) {
  for (const chunk of copy.split("·").map((s) => s.trim()).filter(Boolean)) {
    if (!chunk.includes(":")) {
      console.warn("missing colon", loc, id, chunk);
    }
  }
}

const enPages = JSON.parse(
  fs.readFileSync(path.join(root, "en/pages.json"), "utf8"),
);
for (const [id, copy] of Object.entries(enCopy)) {
  assertTitleBody(copy, "en", id);
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
    assertTitleBody(copy, loc, id);
    if (!setCardGrid(pages, id, copy)) console.warn(loc, "miss", id);
  }
  fs.writeFileSync(
    path.join(root, loc, "pages.json"),
    JSON.stringify(pages, null, 1) + "\n",
  );
}

console.log("done");
