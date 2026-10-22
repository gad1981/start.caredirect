import fs from "fs";
import path from "path";

const root = path.resolve(".");
const en = JSON.parse(
  fs.readFileSync(path.join(root, "content/en/insights.json"), "utf8"),
);

const countries = {
  el: {
    Greece: "Ελλάδα",
    Romania: "Ρουμανία",
    Bulgaria: "Βουλγαρία",
    Serbia: "Σερβία",
    Cyprus: "Κύπρος",
  },
  ro: {
    Greece: "Grecia",
    Romania: "România",
    Bulgaria: "Bulgaria",
    Serbia: "Serbia",
    Cyprus: "Cipru",
  },
  sr: {
    Greece: "Grčka",
    Romania: "Rumunija",
    Bulgaria: "Bugarska",
    Serbia: "Srbija",
    Cyprus: "Kipar",
  },
  bg: {
    Greece: "Гърция",
    Romania: "Румъния",
    Bulgaria: "България",
    Serbia: "Сърбия",
    Cyprus: "Кипър",
  },
};

const cityTweaks = {
  el: [
    ["Athens", "Αθήνα"],
    ["Thessaloniki", "Θεσσαλονίκη"],
    ["Patras", "Πάτρα"],
    ["Bucharest", "Βουκουρέστι"],
    ["Sofia", "Σόφια"],
    ["Belgrade", "Βελιγράδι"],
    ["Nicosia", "Λευκωσία"],
    ["Limassol", "Λεμεσός"],
  ],
  ro: [
    ["Athens", "Atena"],
    ["Thessaloniki", "Salonic"],
    ["Bucharest", "București"],
    ["Belgrade", "Belgrad"],
  ],
  sr: [
    ["Athens", "Atina"],
    ["Thessaloniki", "Solun"],
    ["Bucharest", "Bukurešt"],
    ["Sofia", "Sofija"],
    ["Belgrade", "Beograd"],
    ["Nicosia", "Nikozija"],
    ["Limassol", "Limasol"],
  ],
  bg: [
    ["Athens", "Атина"],
    ["Thessaloniki", "Солун"],
    ["Patras", "Патра"],
    ["Bucharest", "Букурещ"],
    ["Sofia", "София"],
    ["Belgrade", "Белград"],
    ["Nicosia", "Никозия"],
    ["Limassol", "Лимасол"],
  ],
};

/** Shared English source phrases -> locale. Keep longest phrases first. */
const shared = [
  [
    "expecting mothers / year",
    {
      el: "μέλλουσες μητέρες / έτος",
      ro: "viitoare mame / an",
      sr: "buduće majke / godišnje",
      bg: "бъдещи майки / година",
    },
  ],
  [
    "new mothers / year",
    {
      el: "νέες μητέρες / έτος",
      ro: "mame noi / an",
      sr: "nove majke / godišnje",
      bg: "нови майки / година",
    },
  ],
  [
    "Prenatal volume to confirm",
    {
      el: "Όγκος prenatal προς επιβεβαίωση",
      ro: "Volum prenatal de confirmat",
      sr: "Prenatalni obim za potvrdu",
      bg: "Пренатален обем за потвърждение",
    },
  ],
  [
    "Volume to confirm",
    {
      el: "Όγκος προς επιβεβαίωση",
      ro: "Volum de confirmat",
      sr: "Obim za potvrdu",
      bg: "Обем за потвърждение",
    },
  ],
  [
    "and clinics nationwide",
    {
      el: "και κλινικές σε όλη τη χώρα",
      ro: "și clinici la nivel național",
      sr: "i klinike širom zemlje",
      bg: "и клиники в цялата страна",
    },
  ],
  [
    "and maternity network — expanding",
    {
      el: "και δίκτυο μαιευτηρίων — επεκτείνεται",
      ro: "și rețeaua de maternități — în expansiune",
      sr: "i mreža porodilišta — u širenju",
      bg: "и мрежа от родилни клиники — в разширяване",
    },
  ],
  [
    "Public & private maternity clinics nationwide",
    {
      el: "Δημόσια & ιδιωτικά μαιευτήρια σε όλη τη χώρα",
      ro: "Maternități publice și private la nivel național",
      sr: "Javna i privatna porodilišta širom zemlje",
      bg: "Държавни и частни родилни клиники в цялата страна",
    },
  ],
  [
    "Maternity clinics nationwide",
    {
      el: "Μαιευτήρια σε όλη τη χώρα",
      ro: "Maternități la nivel național",
      sr: "Porodilišta širom zemlje",
      bg: "Родилни клиники в цялата страна",
    },
  ],
  [
    "Maternity clinics — expanding",
    {
      el: "Μαιευτήρια — επεκτείνεται",
      ro: "Maternități — în expansiune",
      sr: "Porodilišta — u širenju",
      bg: "Родилни клиники — в разширяване",
    },
  ],
  [
    "Gyn & maternity clinics · 3rd trimester",
    {
      el: "Γυναικολογικές & μαιευτικές κλινικές · 3ο τρίμηνο",
      ro: "Clinici de ginecologie și maternități · trimestrul 3",
      sr: "Ginekološke i porodilišne klinike · treći trimestar",
      bg: "Гинекологични и родилни клиники · 3-ти триместър",
    },
  ],
  [
    "Gyn & maternity clinics",
    {
      el: "Γυναικολογικές & μαιευτικές κλινικές",
      ro: "Clinici de ginecologie și maternități",
      sr: "Ginekološke i porodilišne klinike",
      bg: "Гинекологични и родилни клиники",
    },
  ],
  [
    "Handed 2–3 days after birth",
    {
      el: "Παράδοση 2–3 ημέρες μετά τον τοκετό",
      ro: "Înmânat la 2–3 zile după naștere",
      sr: "Uručeno 2–3 dana nakon porođaja",
      bg: "Предава се 2–3 дни след раждането",
    },
  ],
  [
    "2–3 days after birth",
    {
      el: "2–3 ημέρες μετά τον τοκετό",
      ro: "La 2–3 zile după naștere",
      sr: "2–3 dana nakon porođaja",
      bg: "2–3 дни след раждането",
    },
  ],
  [
    "Neonatology & Pediatrics associations",
    {
      el: "Ενώσεις νεογνολογίας & παιδιατρικής",
      ro: "Asociații de neonatologie și pediatrie",
      sr: "Udruženja neonatologije i pedijatrije",
      bg: "Асоциации по неонатология и педиатрия",
    },
  ],
  [
    "Association of Pediatricians",
    {
      el: "Ένωση Παιδιάτρων",
      ro: "Asociația Pediatrilor",
      sr: "Udruženje pedijatara",
      bg: "Асоциация на педиатрите",
    },
  ],
  [
    "Pediatrics & neonatology specialists",
    {
      el: "Ειδικοί παιδιατρικής & νεογνολογίας",
      ro: "Specialiști în pediatrie și neonatologie",
      sr: "Specijalisti pedijatrije i neonatologije",
      bg: "Специалисти по педиатрия и неонатология",
    },
  ],
  [
    "BOOM guide (printed)",
    {
      el: "Οδηγός BOOM (έντυπος)",
      ro: "Ghidul BOOM (tipărit)",
      sr: "BOOM vodič (štampani)",
      bg: "Наръчник BOOM (печатен)",
    },
  ],
  [
    "Printed with the first-days box",
    {
      el: "Έντυπο με το κουτί πρώτων ημερών",
      ro: "Tipărit cu cutia primelor zile",
      sr: "Štampano uz kutiju prvih dana",
      bg: "Печатен с кутията за първите дни",
    },
  ],
  [
    "Printed with the box",
    {
      el: "Έντυπο με το κουτί",
      ro: "Tipărit cu cutia",
      sr: "Štampano uz kutiju",
      bg: "Печатен с кутията",
    },
  ],
  [
    "With the box · doctor collaboration",
    {
      el: "Με το κουτί · συνεργασία με γιατρούς",
      ro: "Cu cutia · colaborare cu medicii",
      sr: "Uz kutiju · saradnja sa lekarima",
      bg: "С кутията · сътрудничество с лекари",
    },
  ],
  [
    "Private-suite mothers / year (premium cut of Natal)",
    {
      el: "Μητέρες σε ιδιωτικές σουίτες / έτος (premium κομμάτι του Natal)",
      ro: "Mame din suite private / an (segment premium din Natal)",
      sr: "Majke u privatnim apartmanima / godišnje (premium deo Natal)",
      bg: "Майки в частни апартаменти / година (премиум част от Natal)",
    },
  ],
  [
    "Athens & Thessaloniki private clinics",
    {
      el: "Ιδιωτικές κλινικές Αθήνας & Θεσσαλονίκης",
      ro: "Clinici private din Atena și Salonic",
      sr: "Privatne klinike u Atini i Solunu",
      bg: "Частни клиники в Атина и Солун",
    },
  ],
  [
    "Private suites & private rooms",
    {
      el: "Ιδιωτικές σουίτες & ιδιωτικά δωμάτια",
      ro: "Suite și rezerve private",
      sr: "Privatni apartmani i privatne sobe",
      bg: "Частни апартаменти и самостоятелни стаи",
    },
  ],
  [
    "Private suites",
    {
      el: "Ιδιωτικές σουίτες",
      ro: "Suite private",
      sr: "Privatni apartmani",
      bg: "Частни апартаменти",
    },
  ],
  [
    "Luxury Moments kit guide",
    {
      el: "Οδηγός kit Luxury Moments",
      ro: "Ghidul kitului Luxury Moments",
      sr: "Vodič kompleta Luxury Moments",
      bg: "Наръчник на комплекта Luxury Moments",
    },
  ],
  [
    "Exclusive printed kit",
    {
      el: "Αποκλειστικό έντυπο kit",
      ro: "Kit tipărit exclusiv",
      sr: "Ekskluzivni štampani komplet",
      bg: "Ексклузивен печатен комплект",
    },
  ],
  [
    "Premium private rooms — to confirm",
    {
      el: "Premium ιδιωτικά δωμάτια — προς επιβεβαίωση",
      ro: "Rezerve private premium — de confirmat",
      sr: "Premium privatne sobe — za potvrdu",
      bg: "Премиум самостоятелни стаи — за потвърждение",
    },
  ],
  [
    "Private clinics — expanding",
    {
      el: "Ιδιωτικές κλινικές — επεκτείνεται",
      ro: "Clinici private — în expansiune",
      sr: "Privatne klinike — u širenju",
      bg: "Частни клиники — в разширяване",
    },
  ],
  [
    "private clinics",
    {
      el: "ιδιωτικές κλινικές",
      ro: "clinici private",
      sr: "privatne klinike",
      bg: "частни клиники",
    },
  ],
  [
    "Families at first solids — volume to confirm",
    {
      el: "Οικογένειες στο ξεκίνημα στερεών — όγκος προς επιβεβαίωση",
      ro: "Familii la diversificare — volum de confirmat",
      sr: "Porodice na početku čvrste hrane — obim za potvrdu",
      bg: "Семейства при захранване — обем за потвърждение",
    },
  ],
  [
    "Delivered home nationwide",
    {
      el: "Παράδοση στο σπίτι σε όλη τη χώρα",
      ro: "Livrat la domiciliu la nivel național",
      sr: "Dostava kući širom zemlje",
      bg: "Доставка до дома в цялата страна",
    },
  ],
  [
    "Delivered home",
    {
      el: "Παράδοση στο σπίτι",
      ro: "Livrat la domiciliu",
      sr: "Dostava kući",
      bg: "Доставка до дома",
    },
  ],
  [
    "Baby ~6 months · home delivery",
    {
      el: "Μωρό ~6 μηνών · παράδοση στο σπίτι",
      ro: "Bebeluş ~6 luni · livrare la domiciliu",
      sr: "Beba ~6 meseci · dostava kući",
      bg: "Бебе ~6 месеца · доставка до дома",
    },
  ],
  [
    "First-foods content via parent platforms",
    {
      el: "Περιεχόμενο first foods μέσω parent platforms",
      ro: "Conținut first foods pe platformele pentru părinți",
      sr: "Sadržaj first foods preko platformi za roditelje",
      bg: "Съдържание first foods чрез платформи за родители",
    },
  ],
  [
    "Box delivered home",
    {
      el: "Κουτί με παράδοση στο σπίτι",
      ro: "Cutie livrată la domiciliu",
      sr: "Kutija dostavljena kući",
      bg: "Кутия с доставка до дома",
    },
  ],
  [
    "Printed guide + home box",
    {
      el: "Έντυπος οδηγός + κουτί στο σπίτι",
      ro: "Ghid tipărit + cutie la domiciliu",
      sr: "Štampani vodič + kutija kući",
      bg: "Печатен наръчник + кутия до дома",
    },
  ],
  [
    "First-grade families — volume to confirm",
    {
      el: "Οικογένειες Α΄ Δημοτικού — όγκος προς επιβεβαίωση",
      ro: "Familii de clasa I — volum de confirmat",
      sr: "Porodice prvog razreda — obim za potvrdu",
      bg: "Семейства от 1. клас — обем за потвърждение",
    },
  ],
  [
    "First-grade families — confirmed live market",
    {
      el: "Οικογένειες Α΄ Δημοτικού — επιβεβαιωμένη ζωντανή αγορά",
      ro: "Familii de clasa I — piață live confirmată",
      sr: "Porodice prvog razreda — potvrđeno aktivno tržište",
      bg: "Семейства от 1. клас — потвърден активен пазар",
    },
  ],
  [
    "First-grade families — expanding",
    {
      el: "Οικογένειες Α΄ Δημοτικού — επεκτείνεται",
      ro: "Familii de clasa I — în expansiune",
      sr: "Porodice prvog razreda — u širenju",
      bg: "Семейства от 1. клас — в разширяване",
    },
  ],
  [
    "Primary schools nationwide",
    {
      el: "Δημοτικά σχολεία σε όλη τη χώρα",
      ro: "Școli primare la nivel național",
      sr: "Osnovne škole širom zemlje",
      bg: "Начални училища в цялата страна",
    },
  ],
  [
    "Primary schools — expanding",
    {
      el: "Δημοτικά σχολεία — επεκτείνεται",
      ro: "Școli primare — în expansiune",
      sr: "Osnovne škole — u širenju",
      bg: "Начални училища — в разширяване",
    },
  ],
  [
    "First day of 1st grade (age 6)",
    {
      el: "Πρώτη μέρα Α΄ Δημοτικού (ηλικία 6)",
      ro: "Prima zi de clasa I (6 ani)",
      sr: "Prvi dan prvog razreda (uzrast 6)",
      bg: "Първи учебен ден в 1. клас (6 години)",
    },
  ],
  [
    "First day of 1st grade",
    {
      el: "Πρώτη μέρα Α΄ Δημοτικού",
      ro: "Prima zi de clasa I",
      sr: "Prvi dan prvog razreda",
      bg: "Първи учебен ден в 1. клас",
    },
  ],
  [
    "School guide — Greece edition to confirm",
    {
      el: "School guide — έκδοση Ελλάδας προς επιβεβαίωση",
      ro: "Ghid școlar — ediția Grecia de confirmat",
      sr: "Školski vodič — izdanje za Grčku za potvrdu",
      bg: "Училищен наръчник — издание Гърция за потвърждение",
    },
  ],
  [
    "Box on the first school day",
    {
      el: "Κουτί την πρώτη σχολική μέρα",
      ro: "Cutie în prima zi de școală",
      sr: "Kutija prvog školskog dana",
      bg: "Кутия на първия учебен ден",
    },
  ],
  [
    "Printed guide + school-day box",
    {
      el: "Έντυπος οδηγός + κουτί σχολικής ημέρας",
      ro: "Ghid tipărit + cutie în ziua de școală",
      sr: "Štampani vodič + kutija školskog dana",
      bg: "Печатен наръчник + кутия за учебния ден",
    },
  ],
  [
    "Elementary families · Christmas school period",
    {
      el: "Οικογένειες δημοτικού · χριστουγεννιάτικη σχολική περίοδος",
      ro: "Familii din primar · perioada școlară de Crăciun",
      sr: "Porodice osnovaca · božićni školski period",
      bg: "Семейства от началното училище · коледен учебен период",
    },
  ],
  [
    "Elementary families — expanding",
    {
      el: "Οικογένειες δημοτικού — επεκτείνεται",
      ro: "Familii din primar — în expansiune",
      sr: "Porodice osnovaca — u širenju",
      bg: "Семейства от началното училище — в разширяване",
    },
  ],
  [
    "Festive edition of First Grade",
    {
      el: "Εορταστική έκδοση First Grade",
      ro: "Ediție festivă First Grade",
      sr: "Svečano izdanje First Grade",
      bg: "Празнично издание First Grade",
    },
  ],
  [
    "Christmas school period",
    {
      el: "Χριστουγεννιάτικη σχολική περίοδος",
      ro: "Perioada școlară de Crăciun",
      sr: "Božićni školski period",
      bg: "Коледен учебен период",
    },
  ],
  [
    "Christmas school kit",
    {
      el: "Χριστουγεννιάτικο σχολικό kit",
      ro: "Kit școlar de Crăciun",
      sr: "Božićni školski komplet",
      bg: "Коледен училищен комплект",
    },
  ],
  [
    "Seasonal multi-brand box",
    {
      el: "Εποχιακό multi-brand κουτί",
      ro: "Cutie sezonieră multi-brand",
      sr: "Sezonska multi-brand kutija",
      bg: "Сезонна multi-brand кутия",
    },
  ],
  [
    "Girls at start of puberty — volume to confirm",
    {
      el: "Κορίτσια στην αρχή της εφηβείας — όγκος προς επιβεβαίωση",
      ro: "Fete la începutul pubertății — volum de confirmat",
      sr: "Devojčice na početku puberteta — obim za potvrdu",
      bg: "Момичета в началото на пубертета — обем за потвърждение",
    },
  ],
  [
    "Girls at start of puberty — expanding",
    {
      el: "Κορίτσια στην αρχή της εφηβείας — επεκτείνεται",
      ro: "Fete la începutul pubertății — în expansiune",
      sr: "Devojčice na početku puberteta — u širenju",
      bg: "Момичета в началото на пубертета — в разширяване",
    },
  ],
  [
    "Courier to the home",
    {
      el: "Courier στο σπίτι",
      ro: "Curier la domiciliu",
      sr: "Kurir do kuće",
      bg: "Куриер до дома",
    },
  ],
  [
    "Care Direct communities",
    {
      el: "Κοινότητες Care Direct",
      ro: "Comunitățile Care Direct",
      sr: "Care Direct zajednice",
      bg: "Общности на Care Direct",
    },
  ],
  [
    "Teen Girl kit guide",
    {
      el: "Οδηγός kit Teen Girl",
      ro: "Ghidul kitului Teen Girl",
      sr: "Vodič kompleta Teen Girl",
      bg: "Наръчник на комплекта Teen Girl",
    },
  ],
  [
    "Home box + follow-up",
    {
      el: "Κουτί στο σπίτι + follow-up",
      ro: "Cutie la domiciliu + follow-up",
      sr: "Kutija kući + praćenje",
      bg: "Кутия до дома + последваща комуникация",
    },
  ],
  [
    "First-year high-school students — volume to confirm",
    {
      el: "Μαθητές Α΄ Λυκείου — όγκος προς επιβεβαίωση",
      ro: "Elevi în anul I de liceu — volum de confirmat",
      sr: "Učenici prve godine srednje — obim za potvrdu",
      bg: "Ученици от първа година в гимназията — обем за потвърждение",
    },
  ],
  [
    "First-year high-school students — live with START 9",
    {
      el: "Μαθητές Α΄ Λυκείου — live με START 9",
      ro: "Elevi în anul I de liceu — live cu START 9",
      sr: "Učenici prve godine srednje — uživo sa START 9",
      bg: "Ученици от първа година в гимназията — live със START 9",
    },
  ],
  [
    "First-year high-school students — expanding",
    {
      el: "Μαθητές Α΄ Λυκείου — επεκτείνεται",
      ro: "Elevi în anul I de liceu — în expansiune",
      sr: "Učenici prve godine srednje — u širenju",
      bg: "Ученици от първа година в гимназията — в разширяване",
    },
  ],
  [
    "High schools nationwide",
    {
      el: "Λύκεια σε όλη τη χώρα",
      ro: "Licee la nivel național",
      sr: "Srednje škole širom zemlje",
      bg: "Гимназии в цялата страна",
    },
  ],
  [
    "High schools — expanding",
    {
      el: "Λύκεια — επεκτείνεται",
      ro: "Licee — în expansiune",
      sr: "Srednje škole — u širenju",
      bg: "Гимназии — в разширяване",
    },
  ],
  [
    "Entering high school · ages 15–16",
    {
      el: "Είσοδος στο λύκειο · ηλικίες 15–16",
      ro: "Intrarea la liceu · 15–16 ani",
      sr: "Upis u srednju školu · 15–16 godina",
      bg: "Начало на гимназията · 15–16 г.",
    },
  ],
  [
    "Entering high school",
    {
      el: "Είσοδος στο λύκειο",
      ro: "Intrarea la liceu",
      sr: "Upis u srednju školu",
      bg: "Начало на гимназията",
    },
  ],
  [
    "START 9 interactive web guide",
    {
      el: "Διαδραστικός web οδηγός START 9",
      ro: "Ghid web interactiv START 9",
      sr: "Interaktivni veb vodič START 9",
      bg: "Интерактивен уеб наръчник START 9",
    },
  ],
  [
    "START 9 web guide",
    {
      el: "Web οδηγός START 9",
      ro: "Ghid web START 9",
      sr: "Veb vodič START 9",
      bg: "Уеб наръчник START 9",
    },
  ],
  [
    "Samples in school + digital guide",
    {
      el: "Δείγματα στο σχολείο + digital οδηγός",
      ro: "Mostre în școală + ghid digital",
      sr: "Uzorci u školi + digitalni vodič",
      bg: "Мостри в училище + дигитален наръчник",
    },
  ],
  [
    "First-year students — volume to confirm",
    {
      el: "Πρωτοετείς φοιτητές — όγκος προς επιβεβαίωση",
      ro: "Studenți din anul I — volum de confirmat",
      sr: "Studenti prve godine — obim za potvrdu",
      bg: "Студенти от първа година — обем за потвърждение",
    },
  ],
  [
    "First-year students — expanding",
    {
      el: "Πρωτοετείς φοιτητές — επεκτείνεται",
      ro: "Studenți din anul I — în expansiune",
      sr: "Studenti prve godine — u širenju",
      bg: "Студенти от първа година — в разширяване",
    },
  ],
  [
    "First-year students — live with UniStart+",
    {
      el: "Πρωτοετείς φοιτητές — live με UniStart+",
      ro: "Studenți din anul I — live cu UniStart+",
      sr: "Studenti prve godine — uživo sa UniStart+",
      bg: "Студенти от първа година — live с UniStart+",
    },
  ],
  [
    "University sampling activations (2024+) — results to confirm",
    {
      el: "University sampling activations (2024+) — αποτελέσματα προς επιβεβαίωση",
      ro: "Activări de sampling universitar (2024+) — rezultate de confirmat",
      sr: "Univerzitetski sampling (2024+) — rezultati za potvrdu",
      bg: "Университетски sampling активации (2024+) — резултати за потвърждение",
    },
  ],
  [
    "Universities nationwide",
    {
      el: "Πανεπιστήμια σε όλη τη χώρα",
      ro: "Universități la nivel național",
      sr: "Univerziteti širom zemlje",
      bg: "Университети в цялата страна",
    },
  ],
  [
    "Universities — expanding",
    {
      el: "Πανεπιστήμια — επεκτείνεται",
      ro: "Universități — în expansiune",
      sr: "Univerziteti — u širenju",
      bg: "Университети — в разширяване",
    },
  ],
  [
    "Belgrade and campus cities",
    {
      el: "Βελιγράδι και πόλεις campus",
      ro: "Belgrad și orașe universitare",
      sr: "Beograd i univerzitetski gradovi",
      bg: "Белград и университетски градове",
    },
  ],
  [
    "Campus activations · first independent purchases",
    {
      el: "Campus activations · πρώτες ανεξάρτητες αγορές",
      ro: "Activări pe campus · primele achiziții independente",
      sr: "Kampus aktivacije · prve samostalne kupovine",
      bg: "Кампус активации · първи самостоятелни покупки",
    },
  ],
  [
    "Campus activations",
    {
      el: "Campus activations",
      ro: "Activări pe campus",
      sr: "Kampus aktivacije",
      bg: "Кампус активации",
    },
  ],
  [
    "UniStart+ digital student guidebook",
    {
      el: "Ψηφιακός φοιτητικός οδηγός UniStart+",
      ro: "Ghid digital UniStart+ pentru studenți",
      sr: "Digitalni studentski vodič UniStart+",
      bg: "Дигитален студентски наръчник UniStart+",
    },
  ],
  [
    "UniStart+ digital guidebook",
    {
      el: "Ψηφιακός οδηγός UniStart+",
      ro: "Ghid digital UniStart+",
      sr: "Digitalni vodič UniStart+",
      bg: "Дигитален наръчник UniStart+",
    },
  ],
  [
    "Campus samples + digital guide",
    {
      el: "Δείγματα στο campus + digital οδηγός",
      ro: "Mostre pe campus + ghid digital",
      sr: "Uzorci na kampusu + digitalni vodič",
      bg: "Мостри в кампуса + дигитален наръчник",
    },
  ],
  [
    "Campus samples",
    {
      el: "Δείγματα στο campus",
      ro: "Mostre pe campus",
      sr: "Uzorci na kampusu",
      bg: "Мостри в кампуса",
    },
  ],
  [
    "Recruits on service day — volume to confirm",
    {
      el: "Νεοσύλλεκτοι την ημέρα κατάταξης — όγκος προς επιβεβαίωση",
      ro: "Recruți în ziua încorporării — volum de confirmat",
      sr: "Regruti na dan stupanja — obim za potvrdu",
      bg: "Военни новобранци в деня на постъпване — обем за потвърждение",
    },
  ],
  [
    "Military camps nationwide",
    {
      el: "Στρατόπεδα σε όλη τη χώρα",
      ro: "Unități militare la nivel național",
      sr: "Vojni kampovi širom zemlje",
      bg: "Военни лагери в цялата страна",
    },
  ],
  [
    "Recruitment day hand-over",
    {
      el: "Παράδοση την ημέρα κατάταξης",
      ro: "Predare în ziua încorporării",
      sr: "Uručivanje na dan regrutacije",
      bg: "Предаване в деня на постъпване",
    },
  ],
  [
    "Camp kit materials",
    {
      el: "Υλικό kit στρατοπέδου",
      ro: "Materiale kit pentru unitate",
      sr: "Materijali kompleta za kamp",
      bg: "Материали за комплект в лагера",
    },
  ],
  [
    "Samples on recruitment day",
    {
      el: "Δείγματα την ημέρα κατάταξης",
      ro: "Mostre în ziua încorporării",
      sr: "Uzorci na dan regrutacije",
      bg: "Мостри в деня на постъпване",
    },
  ],
  [
    "Not live in this market yet",
    {
      el: "Δεν είναι ακόμα live σε αυτή την αγορά",
      ro: "Încă nu este live pe această piață",
      sr: "Još nije aktivno na ovom tržištu",
      bg: "Все още не е активен на този пазар",
    },
  ],
  [
    "Newlywed households — volume to confirm",
    {
      el: "Νεόνυμφα νοικοκυριά — όγκος προς επιβεβαίωση",
      ro: "Gospodării de proaspăt căsătoriți — volum de confirmat",
      sr: "Domaćinstva mladenaca — obim za potvrdu",
      bg: "Домакинства на младоженци — обем за потвърждение",
    },
  ],
  [
    "Newlywed households — expanding",
    {
      el: "Νεόνυμφα νοικοκυριά — επεκτείνεται",
      ro: "Gospodării de proaspăt căsătoriți — în expansiune",
      sr: "Domaćinstva mladenaca — u širenju",
      bg: "Домакинства на младоженци — в разширяване",
    },
  ],
  [
    "Courier as couples set up house",
    {
      el: "Courier καθώς στήνουν το σπίτι",
      ro: "Curier pe măsură ce își amenajează casa",
      sr: "Kurir dok parovi uređuju dom",
      bg: "Куриер докато двойките си устройват дома",
    },
  ],
  [
    "Courier home delivery",
    {
      el: "Παράδοση στο σπίτι με courier",
      ro: "Livrare la domiciliu prin curier",
      sr: "Kurirska dostava kući",
      bg: "Доставка до дома с куриер",
    },
  ],
  [
    "Marriage / first-home guide",
    {
      el: "Οδηγός γάμου / πρώτου σπιτιού",
      ro: "Ghid căsătorie / prima casă",
      sr: "Vodič za brak / prvi dom",
      bg: "Наръчник за брак / първи дом",
    },
  ],
  [
    "Home box",
    {
      el: "Κουτί στο σπίτι",
      ro: "Cutie la domiciliu",
      sr: "Kutija kući",
      bg: "Кутия до дома",
    },
  ],
  [
    "New pet owners · 200 top Attica vets reached (Swiffer 2018 proof)",
    {
      el: "Νέοι ιδιοκτήτες κατοικιδίων · 200 κορυφαίοι κτηνίατροι Αττικής (Swiffer 2018)",
      ro: "Noi proprietari de animale · 200 de veterinari de top din Attica (Swiffer 2018)",
      sr: "Novi vlasnici ljubimaca · 200 vrhunskih veterinara Atike (Swiffer 2018)",
      bg: "Нови собственици на любимци · 200 топ ветеринари в Атика (Swiffer 2018)",
    },
  ],
  [
    "New pet owners — expanding",
    {
      el: "Νέοι ιδιοκτήτες κατοικιδίων — επεκτείνεται",
      ro: "Noi proprietari de animale — în expansiune",
      sr: "Novi vlasnici ljubimaca — u širenju",
      bg: "Нови собственици на любимци — в разширяване",
    },
  ],
  [
    "Athens/Attica vets · adoption organisations",
    {
      el: "Κτηνίατροι Αθήνας/Αττικής · οργανώσεις υιοθεσίας",
      ro: "Veterinari Atena/Attica · organizații de adopție",
      sr: "Veterinari Atina/Atika · organizacije za udomljavanje",
      bg: "Ветеринари Атина/Атика · организации за осиновяване",
    },
  ],
  [
    "Vets & adoption partners · first weeks home",
    {
      el: "Κτηνίατροι & συνεργάτες υιοθεσίας · πρώτες εβδομάδες στο σπίτι",
      ro: "Veterinari și parteneri de adopție · primele săptămâni acasă",
      sr: "Veterinari i partneri za udomljavanje · prve nedelje kod kuće",
      bg: "Ветеринари и партньори за осиновяване · първите седмици у дома",
    },
  ],
  [
    "Vets & adoption partners",
    {
      el: "Κτηνίατροι & συνεργάτες υιοθεσίας",
      ro: "Veterinari și parteneri de adopție",
      sr: "Veterinari i partneri za udomljavanje",
      bg: "Ветеринари и партньори за осиновяване",
    },
  ],
  [
    "First weeks with a new pet",
    {
      el: "Πρώτες εβδομάδες με νέο κατοικίδιο",
      ro: "Primele săptămâni cu un animal nou",
      sr: "Prve nedelje sa novim ljubimcem",
      bg: "Първите седмици с нов любимец",
    },
  ],
  [
    "New-pet care materials",
    {
      el: "Υλικό φροντίδας νέου κατοικιδίου",
      ro: "Materiale de îngrijire pentru animal nou",
      sr: "Materijali nege za novog ljubimca",
      bg: "Материали за грижа за нов любимец",
    },
  ],
  [
    "Vet / adoption hand-over box",
    {
      el: "Κουτί παράδοσης σε κτηνίατρο / υιοθεσία",
      ro: "Cutie predată la veterinar / adopție",
      sr: "Kutija kod veterinara / udomljavanja",
      bg: "Кутия при ветеринар / осиновяване",
    },
  ],
  [
    "Women 50+ at menopause start — volume to confirm",
    {
      el: "Γυναίκες 50+ στην είσοδο εμμηνόπαυσης — όγκος προς επιβεβαίωση",
      ro: "Femei 50+ la debutul menopauzei — volum de confirmat",
      sr: "Žene 50+ na početku menopauze — obim za potvrdu",
      bg: "Жени 50+ в началото на менопаузата — обем за потвърждение",
    },
  ],
  [
    "Gynaecology clinics nationwide",
    {
      el: "Γυναικολογικές κλινικές σε όλη τη χώρα",
      ro: "Clinici de ginecologie la nivel național",
      sr: "Ginekološke klinike širom zemlje",
      bg: "Гинекологични клиники в цялата страна",
    },
  ],
  [
    "Annual examination hand-over",
    {
      el: "Παράδοση στον ετήσιο έλεγχο",
      ro: "Predare la controlul anual",
      sr: "Uručivanje na godišnjem pregledu",
      bg: "Предаване при годишния преглед",
    },
  ],
  [
    "Printed Ladies guide",
    {
      el: "Έντυπος οδηγός Ladies",
      ro: "Ghid Ladies tipărit",
      sr: "Štampani Ladies vodič",
      bg: "Печатен Ladies наръчник",
    },
  ],
  [
    "Clinic box + LadiesBook",
    {
      el: "Κουτί κλινικής + LadiesBook",
      ro: "Cutie la clinică + LadiesBook",
      sr: "Kutija u klinici + LadiesBook",
      bg: "Кутия в клиниката + LadiesBook",
    },
  ],
  [
    "People starting retirement — volume to confirm",
    {
      el: "Άνθρωποι στην έναρξη συνταξιοδότησης — όγκος προς επιβεβαίωση",
      ro: "Persoane la începutul pensionării — volum de confirmat",
      sr: "Ljudi na početku penzije — obim za potvrdu",
      bg: "Хора в началото на пенсионирането — обем за потвърждение",
    },
  ],
  [
    "People starting retirement — expanding",
    {
      el: "Άνθρωποι στην έναρξη συνταξιοδότησης — επεκτείνεται",
      ro: "Persoane la începutul pensionării — în expansiune",
      sr: "Ljudi na početku penzije — u širenju",
      bg: "Хора в началото на пенсионирането — в разширяване",
    },
  ],
  [
    "Home + senior community venues",
    {
      el: "Σπίτι + χώροι κοινότητας ηλικιωμένων",
      ro: "Domiciliu + locuri de întâlnire pentru seniori",
      sr: "Dom + mesta okupljanja starijih",
      bg: "Дом + места за възрастни хора",
    },
  ],
  [
    "Home + community venues",
    {
      el: "Σπίτι + χώροι κοινότητας",
      ro: "Domiciliu + locuri comunitare",
      sr: "Dom + mesta zajednice",
      bg: "Дом + обществени места",
    },
  ],
  [
    "Home delivery & community places",
    {
      el: "Παράδοση στο σπίτι & χώροι κοινότητας",
      ro: "Livrare la domiciliu și locuri comunitare",
      sr: "Dostava kući i mesta zajednice",
      bg: "Доставка до дома и обществени места",
    },
  ],
  [
    "Home & community",
    {
      el: "Σπίτι & κοινότητα",
      ro: "Domiciliu și comunitate",
      sr: "Dom i zajednica",
      bg: "Дом и общност",
    },
  ],
  [
    "Seniors life-stage materials",
    {
      el: "Υλικό σταδίου ζωής Seniors",
      ro: "Materiale pentru etapa Seniors",
      sr: "Materijali životne faze Seniors",
      bg: "Материали за етапа Seniors",
    },
  ],
  [
    "Home / venue box",
    {
      el: "Κουτί σπιτιού / χώρου",
      ro: "Cutie domiciliu / locație",
      sr: "Kutija za dom / prostor",
      bg: "Кутия за дом / място",
    },
  ],
  [
    "— expanding",
    {
      el: "— επεκτείνεται",
      ro: "— în expansiune",
      sr: "— u širenju",
      bg: "— в разширяване",
    },
  ],
];

function translateString(s, loc) {
  if (!s || s === "—") return s;
  let out = s;
  for (const [src, dict] of shared) {
    if (out.includes(src)) out = out.split(src).join(dict[loc]);
  }
  for (const [a, b] of cityTweaks[loc] || []) {
    if (out.includes(a)) out = out.split(a).join(b);
  }
  return out;
}

const leftover = [];
for (const loc of ["el", "ro", "sr", "bg"]) {
  const out = {};
  for (const [prog, rows] of Object.entries(en)) {
    out[prog] = rows.map((row) => {
      const r = { ...row };
      r.country = countries[loc][row.country] || row.country;
      for (const k of ["reach", "cities", "channels", "app", "guide", "tirage"]) {
        r[k] = translateString(row[k], loc);
      }
      return r;
    });
  }
  fs.writeFileSync(
    path.join(root, "content", loc, "insights.json"),
    JSON.stringify(out, null, 2) + "\n",
  );
  for (const [prog, rows] of Object.entries(out)) {
    for (const row of rows) {
      for (const [k, v] of Object.entries(row)) {
        if (
          typeof v === "string" &&
          v !== "—" &&
          /\b(volume to confirm|expanding|nationwide|Delivered|Printed|Home box|Not live)\b/i.test(
            v,
          )
        ) {
          leftover.push(`${loc}:${prog}.${row.country}.${k}=${v}`);
        }
      }
    }
  }
}

console.log("wrote insights overlays");
console.log("possible leftovers", leftover.length);
leftover.slice(0, 30).forEach((x) => console.log(" ", x));
