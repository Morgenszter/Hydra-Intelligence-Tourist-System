export const HYDRA_DATABASE = {
  JEDZENIE: {
    najtaniej: [
      { id: "f_n1", name: "Street food lokalny", queryTags: ["Street food"] },
      { id: "f_n2", name: "Kantyny i Bufety", queryTags: ["Kantyna / Bufet"] },
      { id: "f_n3", name: "Bary mleczne", queryTags: ["Bar mleczny"] }
    ],
    srednio: [
      { id: "f_s1", name: "Fast-casual", queryTags: ["Fast food", "Fast-casual"] },
      { id: "f_s2", name: "Pizza & Pasta", queryTags: ["Restauracja (Pizzeria)"] },
      { id: "f_s3", name: "Lunch w bistro", queryTags: ["Bistro"] },
      { id: "f_s4", name: "Pub z kuchnią", queryTags: ["Pub / Tawerna"] },
      { id: "f_s5", name: "Kawiarnia + śniadanie", queryTags: ["Kawiarnia / Śniadaniownia"] }
    ],
    najdrozej: [
      { id: "f_d1", name: "Restauracja tradycyjna", queryTags: ["Restauracja"] },
      { id: "f_d2", name: "Steakhouse premium", queryTags: ["Restauracja (Steakhouse)"] },
      { id: "f_d3", name: "Kolacja z widokiem", queryTags: ["Restauracja (Panoramiczna)"] },
      { id: "f_d4", name: "Fine dining & Michelin", queryTags: ["Fine Dining / Michelin"] }
    ]
  },
  ZAKUPY: {
    najtaniej: [
      { id: "s_n1", name: "Sklep spożywczy / osiedlowy", queryTags: ["Zakupy (Sklep spożywczy)"] },
      { id: "s_n2", name: "Warzywniak / Bazar", queryTags: ["Zakupy (Bazar lokalny)"] },
      { id: "s_n3", name: "Markety sieciowe", queryTags: ["Zakupy (Markety sieciowe)"] },
      { id: "s_n4", name: "Pamiątki", queryTags: ["Zakupy (Pamiątki)"] },
      { id: "s_n5", name: "Piekarnia rzemieślnicza", queryTags: ["Piekarnia rzemieślnicza"] }
    ],
    srednio: [
      { id: "s_s1", name: "Sklep monopolowy", queryTags: ["Zakupy (Monopolowe)"] }
    ],
    najdrozej: [
      { id: "s_d1", name: "Hurtownia (Makro Cash&Carry)", queryTags: ["Zakupy (Hurtownia)"] }
    ]
  },
  NOCLEG: {
    najtaniej: [
      { id: "n_n1", name: "Hostel (Pokoje wieloosobowe)", queryTags: ["Nocleg (Hostel)"] },
      { id: "n_n2", name: "Schronisko turystyczne", queryTags: ["Nocleg (Schronisko)"] }
    ],
    srednio: [
      { id: "n_s1", name: "Pokoje prywatne (Guest House)", queryTags: ["Nocleg (Pensjonat)"] },
      { id: "n_s2", name: "Apartament AirBnB", queryTags: ["Nocleg (Apartament)"] },
      { id: "n_s3", name: "Hotel 2/3-Gwiazdkowy", queryTags: ["Nocleg (Hotel Standard)"] }
    ],
    najdrozej: [
      { id: "n_d1", name: "Hotel 4/5-Gwiazdkowy", queryTags: ["Nocleg (Hotel Premium)"] },
      { id: "n_d2", name: "Ekskluzywne Spa & Wellness", queryTags: ["Nocleg (Resort Spa)"] },
      { id: "n_d3", name: "Prywatna Willa VIP / Lodge", queryTags: ["Nocleg (Willa VIP)"] }
    ]
  },
  TRANSPORT: {
    najtaniej: [
      { id: "t_n1", name: "Autobusy & Tramwaje", queryTags: ["Transport (Komunikacja Miejska)"] },
      { id: "t_n2", name: "Zintegrowana Karta Miejska", queryTags: ["Transport (Karty Miejskie)"] }
    ],
    srednio: [
      { id: "t_s1", name: "Taksówki (Uber/Bolt)", queryTags: ["Transport (Taxi)"] },
      { id: "t_s2", name: "Pociągi regionalne", queryTags: ["Transport (Kolej Regionalna)"] }
    ],
    najdrozej: [
      { id: "t_d1", name: "Wynajem aut (Rent-a-car)", queryTags: ["Transport (Wynajem Aut)"] },
      { id: "t_d2", name: "Prywatny transfer VIP", queryTags: ["Transport (Szofer VIP)"] }
    ]
  },
  ATRAKCJE: {
    najtaniej: [
      { id: "a_n1", name: "Darmowe punkty widokowe", queryTags: ["Atrakcje (Darmowe)"] },
      { id: "a_n2", name: "Szlaki turystyczne", queryTags: ["Atrakcje (Szlaki)"] }
    ],
    srednio: [
      { id: "a_s1", name: "Państwowe muzea i galerie", queryTags: ["Atrakcje (Muzea)"] },
      { id: "a_s2", name: "Zamki, twierdze i pałace", queryTags: ["Atrakcje (Zamki)"] }
    ],
    najdrozej: [
      { id: "a_d1", name: "Prywatne wycieczki z przewodnikiem", queryTags: ["Atrakcje (Przewodnik VIP)"] },
      { id: "a_d2", name: "Bilety na eventy / operę", queryTags: ["Atrakcje (Eventy)"] }
    ]
  }
};

export const getLocalGovernmentPppFallback = (country) => country === "Czechy" ? 0.89 : 1.0;
export const getLocalGovernmentHicpFallback = (country) => country === "Czechy" ? 114.2 : 100.0;

export const generateLocalesFromOfficialRegistry = (country, tags, city) => {
  const locales = [];
  let idCounter = 1;

  tags.forEach(tag => {
    if (tag === "Street food") {
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Wenceslas Square Sausage", baseStatisticalPrice: 42, category: "Street food" });
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Old Town Trdelník Kiosk", baseStatisticalPrice: 50, category: "Street food" });
    } else if (tag === "Zakupy (Markety sieciowe)") {
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Lidl - Na Příkopę", baseStatisticalPrice: 68, category: "Markety sieciowe" });
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Albert Supermarket", baseStatisticalPrice: 72, category: "Markety sieciowe" });
    } else if (tag === "Nocleg (Hostel)") {
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Prague Old Town Hostel", baseStatisticalPrice: 70, category: "Hostel" });
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Hostel Downtown", baseStatisticalPrice: 75, category: "Hostel" });
    } else if (tag === "Pub / Tawerna") {
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "U Pinkasů Brewery", baseStatisticalPrice: 170, category: "Pub z kuchnią" });
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Lokál U Bílé kuželky", baseStatisticalPrice: 190, category: "Pub z kuchnią" });
    } else if (tag === "Restauracja") {
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Restaurace Mlejnice", baseStatisticalPrice: 310, category: "Restauracja tradycyjna" });
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "U Medvídků Beer Hall", baseStatisticalPrice: 330, category: "Restauracja tradycyjna" });
    } else if (tag === "Atrakcje (Zamki)") {
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Zamek na Hradczanach (Pražský hrad)", baseStatisticalPrice: 155, category: "Zamki i pałace" });
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: "Wyszehrad (Vyšehrad)", baseStatisticalPrice: 165, category: "Zamki i pałace" });
    } else if (tag === "Atrakcje (Darmowe)" || tag === "Atrakcje (Szlaki)") {
      locales.push({ id: `loc_${tag}_${idCounter++}`, name: tag === "Atrakcje (Darmowe)" ? "Darmowy Punkt Widokowy Letná" : "Szlak Turystyczny Divoká Šárka", baseStatisticalPrice: 0, category: "Darmowe Atrakcje" });
    } else {
      locales.push({ id: `loc_gen_${tag}_${idCounter}`, name: `Oficjalny Punkt - ${tag}`, baseStatisticalPrice: 100, category: "Ogólne" });
    }
  });

  return locales;
};
