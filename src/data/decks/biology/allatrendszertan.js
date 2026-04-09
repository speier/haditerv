export default {
  id: 'allatrendszertan',
  subject: 'biology',
  subjectLabel: 'Biológia',
  subjectIcon: '🧬',
  title: 'Állatrendszertan',
  description: 'Törzsek, osztályok, életjelenségek és szövetek az állatvilágban',
  icon: '🐾',
  categories: {
    eletjelenseg: { label: 'Életjelenség',  icon: '💡' },
    szovet:       { label: 'Szövet',        icon: '🔬' },
    szivacs:      { label: 'Szivacsok',     icon: '🧽' },
    csalanozo:    { label: 'Csalánozók',     icon: '🪼' },
    tuskesboruk:  { label: 'Tüskésbőrűek',  icon: '⭐' },
    puhatest:     { label: 'Puhatestűek',   icon: '🐌' },
  },
  items: [
    // ── Életjelenségek ──────────────────────────────────────────────
    { id: 'e1',  prompt: 'Sorolj fel 3 önfenntartó életjelenséget!',                      answer: 'Mozgás, táplálkozás, légzés',                          category: 'eletjelenseg' },
    { id: 'e2',  prompt: 'Mi a fajfenntartó életjelenség?',                                answer: 'Szaporodás',                                           category: 'eletjelenseg' },
    { id: 'e3',  prompt: 'Melyik életjelenség felelős az anyagok eltávolításáért?',        answer: 'Kiválasztás',                                          category: 'eletjelenseg' },
    { id: 'e4',  prompt: 'Milyen életjelenség a szabályozás?',                             answer: 'Önfenntartó életjelenség',                             category: 'eletjelenseg' },
    { id: 'e5',  prompt: 'Melyik életjelenség biztosítja a tápanyagok szállítását?',       answer: 'Keringés',                                             category: 'eletjelenseg' },
    { id: 'e6',  prompt: 'Milyen típusú életjelenség a szaporodás?',                       answer: 'Fajfenntartó életjelenség',                            category: 'eletjelenseg' },

    // ── Szövetek ────────────────────────────────────────────────────
    { id: 'sz1', prompt: 'Milyen szövet a zsírszövet?',                                    answer: 'Kötőszövet',                                           category: 'szovet' },
    { id: 'sz2', prompt: 'Sorolj fel 4 szövettípust!',                                    answer: 'Zsírszövet, vérszövet, porcszövet, csontszövet',       category: 'szovet' },
    { id: 'sz3', prompt: 'Mi köti össze a zsírsejteket?',                                  answer: 'Kötőszövet',                                           category: 'szovet' },

    // ── Szivacsok törzse ────────────────────────────────────────────
    { id: 'sv1', prompt: 'Hol élnek a szivacsok?',                                        answer: 'Sós és édes vizek alján',                              category: 'szivacs' },
    { id: 'sv2', prompt: 'Mi a szivacsok jelentősége?',                                   answer: 'A vizek tisztítása',                                   category: 'szivacs' },
    { id: 'sv3', prompt: 'Milyen szövetű állatok a szivacsok?',                            answer: 'Álszövetes állatok',                                   category: 'szivacs' },
    { id: 'sv4', prompt: 'Hogyan működnek a szivacsok sejtjei?',                           answer: 'Egymástól függetlenül végzik az életműködést',         category: 'szivacs' },
    { id: 'sv5', prompt: 'Milyen sejt veszi fel a szivacsok táplálékát?',                  answer: 'Galléros ostoros sejt',                                category: 'szivacs' },
    { id: 'sv6', prompt: 'Mi a vándorsejtek feladata a szivacsoknál?',                     answer: 'A táplálék továbbjuttatása',                           category: 'szivacs' },
    { id: 'sv7', prompt: 'Mivel táplálkoznak a szivacsok?',                                answer: 'Szerves törmelék és plankton',                         category: 'szivacs' },
    { id: 'sv8', prompt: 'Milyen az életmódjuk a szivacsoknak?',                           answer: 'Aljhoz rögzített',                                     category: 'szivacs' },
    { id: 'sv9', prompt: 'Mondj 3 példát szivacsra!',                                     answer: 'Mosdószivacs, tavi szivacs, kémény szivacs',           category: 'szivacs' },

    // ── Csalánozók törzse ───────────────────────────────────────────
    { id: 'cs1', prompt: 'Hol élnek a csalánozók?',                                       answer: 'Sós és édes vizek alján',                              category: 'csalanozo' },
    { id: 'cs2', prompt: 'Milyen az életmódjuk a csalánozóknak?',                          answer: 'Aljhoz rögzült vagy lebegő',                           category: 'csalanozo' },
    { id: 'cs3', prompt: 'Hogyan táplálkoznak a csalánozók?',                              answer: 'Ragadozók',                                            category: 'csalanozo' },
    { id: 'cs4', prompt: 'Milyen két testformája van a csalánozóknak?',                    answer: 'Medúza és hidra',                                      category: 'csalanozo' },
    { id: 'cs5', prompt: 'Melyik csalánozó forma lebeg?',                                  answer: 'Medúza',                                               category: 'csalanozo' },
    { id: 'cs6', prompt: 'Melyik csalánozó forma rögzül az aljhoz?',                       answer: 'Hidra',                                                category: 'csalanozo' },
    { id: 'cs7', prompt: 'Milyen szövetű állatok a csalánozók?',                           answer: 'Valódi szövetes',                                      category: 'csalanozo' },
    { id: 'cs8', prompt: 'Mondj 3 példát csalánozóra!',                                   answer: 'Portugál gálya, kockamedúza, édesvízi medúza',         category: 'csalanozo' },
    { id: 'cs9', prompt: 'Miből épülnek fel a korallok?',                                  answer: 'Meszes vázat képeznek',                                category: 'csalanozo' },

    // ── Tüskésbőrűek törzse ────────────────────────────────────────
    { id: 'tb1', prompt: 'Mondj 3 példát tüskésbőrűre!',                                  answer: 'Tengeri csillag, tengeri sün, tengeri uborka',         category: 'tuskesboruk' },
    { id: 'tb2', prompt: 'Hol élnek a tüskésbőrűek?',                                     answer: 'Sós vízben',                                           category: 'tuskesboruk' },
    { id: 'tb3', prompt: 'Hogyan mozognak a tüskésbőrűek?',                                answer: 'Vízedényrendszer által',                               category: 'tuskesboruk' },

    // ── Puhatestűek törzse ──────────────────────────────────────────
    { id: 'pt1', prompt: 'Mi a puhatestűek közös tulajdonsága?',                           answer: 'Nincs belső szilárd váz',                              category: 'puhatest' },

    // Csigák osztálya
    { id: 'pt2', prompt: 'Mondj 3 csigafajt!',                                            answer: 'Éti csiga, kerti csiga, meztelen csiga',               category: 'puhatest' },
    { id: 'pt3', prompt: 'Mik a csiga testrészei?',                                       answer: 'Fej, hasláb, zsigerzacskó, köpeny, meszes váz',        category: 'puhatest' },
    { id: 'pt4', prompt: 'Miből alakult ki a csiga köpenye?',                              answer: 'Bőrtakaróból',                                         category: 'puhatest' },
    { id: 'pt5', prompt: 'Hogyan mozog a csiga?',                                         answer: 'Bőrizomtömlővel – hasláb',                             category: 'puhatest' },
    { id: 'pt6', prompt: 'Hogyan táplálkozik a csiga?',                                   answer: 'Növényevő, reszelőnyelvvel (apró fogak)',              category: 'puhatest' },
    { id: 'pt7', prompt: 'Hogyan szaporodik a csiga?',                                    answer: 'Petével, hímnős',                                       category: 'puhatest' },
    { id: 'pt8', prompt: 'Milyen keringési rendszere van a csigának?',                     answer: 'Nyílt keringési rendszer',                             category: 'puhatest' },
    { id: 'pt9', prompt: 'Mi kering a csiga testében?',                                   answer: 'Vérnyirok és testfolyadék',                            category: 'puhatest' },

    // Kagylók osztálya
    { id: 'pt10', prompt: 'Mondj 3 kagylófajt!',                                          answer: 'Tavikagyló, kékkagyló, osztriga',                      category: 'puhatest' },
    { id: 'pt11', prompt: 'Mi borítja a kagylók testét?',                                  answer: 'Külső meszes héj',                                     category: 'puhatest' },
    { id: 'pt12', prompt: 'Hogyan mozog a kagyló?',                                       answer: 'Állábbal',                                             category: 'puhatest' },

    // Fejlábúak osztálya
    { id: 'pt13', prompt: 'Mondj 3 fejlábút!',                                            answer: 'Tintahal, polip, kalmár',                              category: 'puhatest' },
    { id: 'pt14', prompt: 'Van-e a fejlábúaknak külső meszes vázuk?',                      answer: 'Nincs külső meszes vázuk',                             category: 'puhatest' },
    { id: 'pt15', prompt: 'Hol élnek a fejlábúak?',                                       answer: 'Tengerben',                                            category: 'puhatest' },
    { id: 'pt16', prompt: 'Hogyan táplálkoznak a fejlábúak?',                              answer: 'Ragadozók',                                            category: 'puhatest' },

    // Törzs-felismerés (vegyes)
    { id: 'pt17', prompt: 'Melyik puhatestű osztály hímnős?',                              answer: 'Csigák osztálya',                                      category: 'puhatest' },
    { id: 'pt18', prompt: 'Melyik törzs állatai álszövetesek?',                            answer: 'Szivacsok törzse',                                     category: 'szivacs' },
    { id: 'pt19', prompt: 'Melyik törzs állatai valódi szövetesek a kettő közül: szivacsok vagy csalánozók?', answer: 'Csalánozók',                    category: 'csalanozo' },
  ],
}
