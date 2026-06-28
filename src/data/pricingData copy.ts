export type CountryKey = 'czechy' | 'slowacja' | 'rumunia' | 'szwecja' | 'norwegia';

export interface TierItem {
  name: string;
  description: string;
  pricePerDay: number;
  pricePerTrip: number;
  isDeal?: boolean;
}

export interface TierSection {
  cheapest: TierItem[];
  average: TierItem[];
  expensive: TierItem[];
}

export interface CountryData {
  transport: TierSection;
  food: TierSection;
  snacks: TierSection;
  accommodation: TierSection;
  attractions: TierSection;
}

export interface CityInfo {
  name: string;
  region: string;
  coords: [number, number];
}

export const countryNames: Record<CountryKey, string> = {
  czechy: 'Czechy',
  slowacja: 'Słowacja',
  rumunia: 'Rumunia',
  szwecja: 'Szwecja',
  norwegia: 'Norwegia',
};

export const countryCities: Record<CountryKey, CityInfo[]> = {
  czechy: [
    { name: 'Praga', region: 'Czechy Środkowe', coords: [50.0755, 14.4378] },
    { name: 'Brno', region: 'Morawy', coords: [49.1951, 16.6068] },
    { name: 'Ostrawa', region: 'Śląsk Czeski', coords: [49.8209, 18.2625] },
    { name: 'Czeskie Budziejowice', region: 'Południowe Czechy', coords: [48.9747, 14.4747] },
    { name: 'Karlowe Wary', region: 'Zachodnie Czechy', coords: [50.2319, 12.872] },
  ],
  slowacja: [
    { name: 'Poprad', region: 'Tatry/Spisz', coords: [49.0614, 20.298] },
    { name: 'Bratysława', region: 'Zachodnia Słowacja', coords: [48.1486, 17.1077] },
    { name: 'Koszyce', region: 'Wschodnia Słowacja', coords: [48.7164, 21.2611] },
    { name: 'Żylina', region: 'Północna Słowacja', coords: [49.2231, 18.7404] },
    { name: 'Banska Bystrzyca', region: 'Środkowa Słowacja', coords: [48.738, 19.145] },
  ],
  rumunia: [
    { name: 'Kluż-Napoka', region: 'Transylwania', coords: [46.7712, 23.6236] },
    { name: 'Braszów', region: 'Siedmiogród', coords: [45.6427, 25.5887] },
    { name: 'Sybin', region: 'Transylwania Południowa', coords: [45.7931, 24.1513] },
    { name: 'Timiszoara', region: 'Banat', coords: [45.7489, 21.2087] },
    { name: 'Bukareszt', region: 'Wołoszczyzna', coords: [44.4268, 26.1025] },
  ],
  szwecja: [
    { name: 'Sztokholm', region: 'Svealand', coords: [59.3293, 18.0686] },
    { name: 'Goteborg', region: 'Gotaland', coords: [57.7089, 11.9746] },
    { name: 'Malmo', region: 'Skania', coords: [55.605, 13.0038] },
    { name: 'Kiruna', region: 'Lappland', coords: [67.8558, 20.2253] },
    { name: 'Uppsala', region: 'Svealand', coords: [59.8586, 17.6389] },
  ],
  norwegia: [
    { name: 'Oslo', region: 'Østlandet', coords: [59.9139, 10.7522] },
    { name: 'Bergen', region: 'Vestlandet', coords: [60.3913, 5.3221] },
    { name: 'Tromso', region: 'Nord-Norge', coords: [69.6492, 18.9553] },
    { name: 'Trondheim', region: 'Trøndelag', coords: [63.4305, 10.3951] },
    { name: 'Stavanger', region: 'Vestlandet', coords: [58.97, 5.7331] },
  ],
};

export const countryCurrency: Record<CountryKey, string> = {
  czechy: 'CZK',
  slowacja: 'EUR',
  rumunia: 'RON',
  szwecja: 'SEK',
  norwegia: 'NOK',
};

const mkTransport = (c: number, a: number, e: number): TierSection => ({
  cheapest: [
    { name: 'Autobus miejski', description: 'Bilet dobowy / karnet strefowy', pricePerDay: c * 0.8, pricePerTrip: c * 0.8, isDeal: true },
    { name: 'Tramwaj + metro', description: 'Kombinacja komunikacji miejskiej', pricePerDay: c * 1.0, pricePerTrip: c * 1.0 },
    { name: 'Rower miejski', description: 'Wypożyczenie roweru publicznego', pricePerDay: c * 0.6, pricePerTrip: c * 0.6 },
    { name: 'Przejazd lokalny', description: 'Krótkie odcinki busem', pricePerDay: c * 0.9, pricePerTrip: c * 0.9 },
    { name: 'Karnet turystyczny', description: 'Turystyczny bilet 24h', pricePerDay: c * 1.1, pricePerTrip: c * 1.1 },
  ],
  average: [
    { name: 'Pociąg regionalny', description: 'Połączenie między miastami', pricePerDay: a * 0.9, pricePerTrip: a * 0.9 },
    { name: 'Samochód osobowy', description: 'Paliwo + winieta', pricePerDay: a * 1.1, pricePerTrip: a * 1.1 },
    { name: 'Bus dalekobieżny', description: 'Przewoźnik międzymiastowy', pricePerDay: a * 0.8, pricePerTrip: a * 0.8 },
    { name: 'BlaBlaCar', description: 'Współdzielenie przejazdu', pricePerDay: a * 0.7, pricePerTrip: a * 0.7 },
    { name: 'Taxi lokalne', description: 'Kilka krótkich kursów', pricePerDay: a * 1.2, pricePerTrip: a * 1.2 },
  ],
  expensive: [
    { name: 'Pociąg ekspresowy', description: 'Pendolino / SJ / Vy', pricePerDay: e * 0.9, pricePerTrip: e * 0.9 },
    { name: 'Wynajem auta', description: 'Samochód klasy średniej', pricePerDay: e * 1.2, pricePerTrip: e * 1.2 },
    { name: 'Taxi prywatne', description: 'Transfery door-to-door', pricePerDay: e * 0.8, pricePerTrip: e * 0.8 },
    { name: 'Helikopter', description: 'Lot widokowy / transfer', pricePerDay: e * 1.5, pricePerTrip: e * 1.5 },
    { name: 'Limuzyna z kierowcą', description: 'VIP transport całodniowy', pricePerDay: e * 1.0, pricePerTrip: e * 1.0 },
  ],
});

const mkFood = (c: number, a: number, e: number): TierSection => ({
  cheapest: [
    { name: 'Lidl / Kiwi / Biedronka', description: 'Zakupy w dyskoncie + samodzielne przygotowanie', pricePerDay: c * 0.9, pricePerTrip: c * 0.9, isDeal: true },
    { name: 'Tesco / Albert', description: 'Promocyjne artykuły spożywcze', pricePerDay: c * 1.0, pricePerTrip: c * 1.0 },
    { name: 'Piekarnia + warzywniak', description: 'Lokalne produkty podstawowe', pricePerDay: c * 0.8, pricePerTrip: c * 0.8 },
    { name: 'Street food lokalny', description: 'Kiełbasa / langosz / hot-dog', pricePerDay: c * 0.7, pricePerTrip: c * 0.7 },
    { name: 'Kantyna / bufet', description: 'Obiad w barze mlecznym', pricePerDay: c * 1.1, pricePerTrip: c * 1.1 },
  ],
  average: [
    { name: 'Lunch w bistro', description: 'Daniowy obiad w lokalnej restauracji', pricePerDay: a * 0.9, pricePerTrip: a * 0.9 },
    { name: 'Fast-casual', description: 'Burgery / kebab / azjatyckie', pricePerDay: a * 0.8, pricePerTrip: a * 0.8 },
    { name: 'Kawiarnia + śniadanie', description: 'Brunch w modnej kafejce', pricePerDay: a * 1.1, pricePerTrip: a * 1.1 },
    { name: 'Pizza / pasta', description: 'Włoska w casualowej knajpie', pricePerDay: a * 0.85, pricePerTrip: a * 0.85 },
    { name: 'Pub z kuchnią', description: 'Burger + piwo w pubie', pricePerDay: a * 1.0, pricePerTrip: a * 1.0 },
  ],
  expensive: [
    { name: 'Restauracja fine dining', description: 'Menu degustacyjne 5-7 dań', pricePerDay: e * 1.1, pricePerTrip: e * 1.1 },
    { name: 'Steakhouse premium', description: 'Wagyu / dry-aged stek', pricePerDay: e * 0.9, pricePerTrip: e * 0.9 },
    { name: 'Restauracja z gwiazdką', description: 'Michelin / lokalny odpowiednik', pricePerDay: e * 1.3, pricePerTrip: e * 1.3 },
    { name: 'Kolacja z widokiem', description: 'Rooftop / panorama miasta', pricePerDay: e * 0.8, pricePerTrip: e * 0.8 },
    { name: 'Prywatny kucharz', description: 'Chef w apartamencie / willi', pricePerDay: e * 1.5, pricePerTrip: e * 1.5 },
  ],
});

const mkSnacks = (c: number, a: number, e: number): TierSection => ({
  cheapest: [
    { name: 'Trdelnik / Langosz', description: 'Uliczny przysmak regionalny', pricePerDay: c * 0.5, pricePerTrip: c * 0.5, isDeal: true },
    { name: 'Lokalne piwo butelkowe', description: 'Pilsner / Kozel / lokalny browar', pricePerDay: c * 0.6, pricePerTrip: c * 0.6 },
    { name: 'Kawa uliczna', description: 'Kawa z kiosku / food trucka', pricePerDay: c * 0.4, pricePerTrip: c * 0.4 },
    { name: 'Słodycze regionalne', description: 'Czekolada / wafle / pralinki', pricePerDay: c * 0.5, pricePerTrip: c * 0.5 },
    { name: 'Chipsy / orzeszki', description: 'Przekąski z dyskontu', pricePerDay: c * 0.3, pricePerTrip: c * 0.3 },
  ],
  average: [
    { name: 'Degustacja lokalna', description: 'Sery / wędliny / przetwory', pricePerDay: a * 0.8, pricePerTrip: a * 0.8 },
    { name: 'Winiarnia / piwiarnia', description: 'Degustacja trunków regionalnych', pricePerDay: a * 0.9, pricePerTrip: a * 0.9 },
    { name: 'Cukiernia tradycyjna', description: 'Szarlotka / sernik / kremówki', pricePerDay: a * 0.7, pricePerTrip: a * 0.7 },
    { name: 'Lokalny bar mleczny', description: 'Obiad domowy + zupa', pricePerDay: a * 0.85, pricePerTrip: a * 0.85 },
    { name: 'Food hall / hala targowa', description: 'Różne stragany pod jednym dachem', pricePerDay: a * 1.0, pricePerTrip: a * 1.0 },
  ],
  expensive: [
    { name: 'Winiarnia premium', description: 'Wina archiwalne / sommelier', pricePerDay: e * 0.9, pricePerTrip: e * 0.9 },
    { name: 'Czekolateria rzemieślnicza', description: 'Ręcznie robione pralinki', pricePerDay: e * 0.7, pricePerTrip: e * 0.7 },
    { name: 'Restauracja fusion', description: 'Nowoczesna kuchnia molekularna', pricePerDay: e * 1.1, pricePerTrip: e * 1.1 },
    { name: 'Whisky bar', description: 'Single malt / degustacja', pricePerDay: e * 0.8, pricePerTrip: e * 0.8 },
    { name: 'Prywatna degustacja', description: 'Z sommelierem w willi', pricePerDay: e * 1.2, pricePerTrip: e * 1.2 },
  ],
});

const mkAccommodation = (c: number, a: number, e: number): TierSection => ({
  cheapest: [
    { name: 'Hostel wieloosobowy', description: 'Łóżko w dormitorium 8-10 osobowym', pricePerDay: c * 0.9, pricePerTrip: c * 0.9, isDeal: true },
    { name: 'Camping / pole namiotowe', description: 'NorCamp / lokalny kemping', pricePerDay: c * 0.7, pricePerTrip: c * 0.7 },
    { name: 'Pokój prywatny Airbnb', description: 'Współdzielone mieszkanie', pricePerDay: c * 1.1, pricePerTrip: c * 1.1 },
    { name: 'Schronisko turystyczne', description: 'Górskie / leśne schronisko', pricePerDay: c * 0.6, pricePerTrip: c * 0.6 },
    { name: 'Kapsuła hotelowa', description: 'Sleepbox / kapsuła', pricePerDay: c * 1.0, pricePerTrip: c * 1.0 },
  ],
  average: [
    { name: 'Apartament Airbnb', description: 'Całe mieszkanie 2-pokojowe', pricePerDay: a * 0.9, pricePerTrip: a * 0.9 },
    { name: 'Hotel 3-gwiazdkowy', description: 'Standardowy hotel miejski', pricePerDay: a * 1.0, pricePerTrip: a * 1.0 },
    { name: 'Boutique B&B', description: 'Kameralny pensjonat ze śniadaniem', pricePerDay: a * 1.1, pricePerTrip: a * 1.1 },
    { name: 'Apart-hotel', description: 'Hotel z aneksem kuchennym', pricePerDay: a * 0.85, pricePerTrip: a * 0.85 },
    { name: 'Domek letniskowy', description: 'Wynajem domku w okolicy', pricePerDay: a * 0.8, pricePerTrip: a * 0.8 },
  ],
  expensive: [
    { name: 'Hotel 5-gwiazdkowy', description: 'Luksusowy hotel z spa', pricePerDay: e * 1.0, pricePerTrip: e * 1.0 },
    { name: 'Zamek / pałac hotel', description: 'Historyczna rezydencja', pricePerDay: e * 1.2, pricePerTrip: e * 1.2 },
    { name: 'Willa premium', description: 'Prywatna willa z basenem', pricePerDay: e * 1.4, pricePerTrip: e * 1.4 },
    { name: 'Lodge w dziczy', description: 'Ekskluzywny lodge norweski', pricePerDay: e * 0.9, pricePerTrip: e * 0.9 },
    { name: 'Penthouse suite', description: 'Apartament panoramiczny', pricePerDay: e * 1.1, pricePerTrip: e * 1.1 },
  ],
});

const mkAttractions = (c: number, a: number, e: number): TierSection => ({
  cheapest: [
    { name: 'Szlak widokowy', description: 'Darmowy trail / punkt widokowy', pricePerDay: c * 0.5, pricePerTrip: c * 0.5, isDeal: true },
    { name: 'Park narodowy', description: 'Wejście na szlak parkowy', pricePerDay: c * 0.7, pricePerTrip: c * 0.7 },
    { name: 'Plaża / jezioro', description: 'Rekreacja nad wodą', pricePerDay: c * 0.3, pricePerTrip: c * 0.3 },
    { name: 'Spacer po mieście', description: 'Free walking tour / samodzielny', pricePerDay: c * 0.4, pricePerTrip: c * 0.4 },
    { name: 'Biblioteka / galeria', description: 'Darmowe muzea i wystawy', pricePerDay: c * 0.6, pricePerTrip: c * 0.6 },
  ],
  average: [
    { name: 'Zamek / muzeum', description: 'Bilet standardowy + przewodnik audio', pricePerDay: a * 0.9, pricePerTrip: a * 0.9 },
    { name: 'Termy / aquapark', description: 'Wejście na baseny termalne', pricePerDay: a * 1.1, pricePerTrip: a * 1.1 },
    { name: 'Rejs rzeczny', description: 'Statek turystyczny po rzece / fiordzie', pricePerDay: a * 0.8, pricePerTrip: a * 0.8 },
    { name: 'Wycieczka rowerowa', description: 'Wynajem + szlak rowerowy', pricePerDay: a * 0.85, pricePerTrip: a * 0.85 },
    { name: 'Kajakarstwo', description: 'Spływ kajakowy zorganizowany', pricePerDay: a * 1.0, pricePerTrip: a * 1.0 },
  ],
  expensive: [
    { name: 'Rejs fiordowy VIP', description: 'Prywatny rejs z szampanem', pricePerDay: e * 1.0, pricePerTrip: e * 1.0 },
    { name: 'Heli-skiing / skitour', description: 'Ekstremalna ekspedycja górska', pricePerDay: e * 1.5, pricePerTrip: e * 1.5 },
    { name: 'Safari polarne', description: 'Widoki zorzy / wieloryby', pricePerDay: e * 1.3, pricePerTrip: e * 1.3 },
    { name: 'Lot widokowy', description: 'Samolot / helikopter nad fiordami', pricePerDay: e * 1.1, pricePerTrip: e * 1.1 },
    { name: 'Prywatny przewodnik', description: 'Całodzienna ekskluzywna trasa', pricePerDay: e * 0.9, pricePerTrip: e * 0.9 },
  ],
});

export const countryPricing: Record<CountryKey, CountryData> = {
  czechy: {
    transport: mkTransport(25, 70, 200),
    food: mkFood(40, 90, 220),
    snacks: mkSnacks(20, 50, 150),
    accommodation: mkAccommodation(60, 150, 400),
    attractions: mkAttractions(15, 60, 250),
  },
  slowacja: {
    transport: mkTransport(22, 60, 180),
    food: mkFood(35, 80, 200),
    snacks: mkSnacks(18, 45, 130),
    accommodation: mkAccommodation(50, 130, 350),
    attractions: mkAttractions(12, 50, 220),
  },
  rumunia: {
    transport: mkTransport(18, 50, 150),
    food: mkFood(30, 70, 180),
    snacks: mkSnacks(15, 40, 120),
    accommodation: mkAccommodation(45, 110, 300),
    attractions: mkAttractions(10, 45, 200),
  },
  szwecja: {
    transport: mkTransport(60, 150, 400),
    food: mkFood(80, 180, 450),
    snacks: mkSnacks(40, 100, 300),
    accommodation: mkAccommodation(120, 300, 800),
    attractions: mkAttractions(30, 100, 400),
  },
  norwegia: {
    transport: mkTransport(80, 200, 550),
    food: mkFood(100, 250, 600),
    snacks: mkSnacks(50, 130, 350),
    accommodation: mkAccommodation(150, 400, 1000),
    attractions: mkAttractions(40, 150, 550),
  },
};

export const tabLabels: Record<string, string> = {
  transport: 'KOSZT I WYPROWADZENIE',
  food: 'JEDZENIE I SKLEPY',
  snacks: 'LOKALNE SMAKOŁYKI',
  accommodation: 'NOCLEG',
  attractions: 'ATRAKCJE',
  map: 'MAPA TAKTYCZNA',
  expedition: 'EKSPEDYCJA I NOTATNIK',
};

export const sectionLabels: Record<string, string> = {
  transport: 'TRANSPORT LOKALNY I LOGISTYKA',
  food: 'OFERTY GASTRONOMICZNE I SKLEPOWE',
  snacks: 'TRADYCYJNE PRZYSMAKI I KULTURA SMAKU',
  accommodation: 'REKOMENDACJE ZAKWATEROWANIA',
  attractions: 'PROGRAM OPERACJI I ATRAKCJE',
};

export const tierLabels = {
  cheapest: 'NAJTANIEJ',
  average: 'ŚREDNIO',
  expensive: 'NAJDROŻEJ',
};

export const telemetryFeeds = [
  'Numbeo',
  'Tolls.eu',
  'IDOS.cz',
  'Cp.sk',
  'Autogari.ro',
  'Resrobot.se',
  'Entur.no',
  'NorCamp',
  'Booking.com',
];

export const transportModes = ['Samochód', 'Pociąg', 'Samolot', 'Autobus międzynarodowy'];

export const countryRules: Record<CountryKey, {
  speedLimits: string;
  vignette: string;
  fines: string;
  alcoholHours: string;
}> = {
  czechy: {
    speedLimits: 'Miasto: 50km/h | Poza miastem: 90km/h | Autostrada: 130km/h',
    vignette: 'Winieta elektroniczna: 10 dni 310 CZK / 30 dni 440 CZK',
    fines: 'Przekroczenie +20km/h: 2000-5000 CZK | +50km/h: odebranie prawa jazdy',
    alcoholHours: 'Alkohol w sklepach: 6:00-22:00 | Promil: 0.0‰ (zero tolerancji)',
  },
  slowacja: {
    speedLimits: 'Miasto: 50km/h | Poza miastem: 90km/h | Autostrada: 130km/h',
    vignette: 'Winieta e-sticker: 10 dni 12 EUR / roczna 50 EUR',
    fines: 'Przekroczenie +20km/h: 60-650 EUR | +50km/h: odebranie prawa jazdy',
    alcoholHours: 'Alkohol w sklepach: 6:00-22:00 | Promil: 0.0‰ (zero tolerancji)',
  },
  rumunia: {
    speedLimits: 'Miasto: 50km/h | Poza miastem: 90km/h | Autostrada: 130km/h',
    vignette: 'Rovinieta: 7 dni 3 EUR / 30 dni 7 EUR / 90 dni 13 EUR',
    fines: 'Przekroczenie +50km/h: 1300-2900 RON | Brak winiety: 4000-8000 RON',
    alcoholHours: 'Alkohol w sklepach: całodobowo | Promil: 0.0‰ (zero tolerancji)',
  },
  szwecja: {
    speedLimits: 'Miasto: 30-50km/h | Droga krajowa: 70-90km/h | Autostrada: 110km/h',
    vignette: 'Brak winiet - darmowe autostrady',
    fines: 'Przekroczenie +30km/h: 4000-8000 SEK | +50km/h: więzienie do 6 miesięcy',
    alcoholHours: 'Systembolaget: pon-pt 10:00-18:00, sob 10:00-15:00 | Promil: 0.2‰',
  },
  norwegia: {
    speedLimits: 'Miasto: 30-50km/h | Droga krajowa: 80km/h | Autostrada: 110km/h',
    vignette: 'Brak winiet - darmowe autostrady',
    fines: 'Przekroczenie +20km/h: 8000-12000 NOK | +50km/h: więzienie',
    alcoholHours: 'Vinmonopolet: pon-pt 10:00-18:00, sob 10:00-15:00 | Promil: 0.2‰',
  },
};

export const packingListDefaults: Record<CountryKey, string[]> = {
  czechy: ['Paszport / dowód osobisty', 'Karta EKUZ', 'Gotówka CZK', 'Adapter EU', 'Kurtka przeciwdeszczowa', 'Buty trekkingowe', 'Kamera / powerbank', 'Bilet na komunikację miejską'],
  slowacja: ['Paszport / dowód osobisty', 'Karta EKUZ', 'Gotówka EUR', 'Adapter EU', 'Kurtka górska', 'Rakiety śnieżne (zima)', 'Aparat / dron', 'Mapa Tatr'],
  rumunia: ['Paszport / dowód osobisty', 'Karta EKUZ', 'Gotówka RON', 'Adapter EU', 'Repelent na komary', 'Lekarstwa na alergię', 'Latarka / powerbank', 'Mapa Transylwanii'],
  szwecja: ['Paszport / dowód osobisty', 'Karta EKUZ', 'Gotówka SEK', 'Adapter EU', 'Ciepła kurtka polarowa', 'Okulary przeciwsłoneczne', 'Termos / prowiant', 'GPS / kompas'],
  norwegia: ['Paszport / dowód osobisty', 'Karta EKUZ', 'Gotówka NOK', 'Adapter EU', 'Kurtka przeciwwiatrowa', 'Rakiety śnieżne', 'Aparat podwodny', 'Mapa fiordów'],
};

export const dealBriefs: Record<CountryKey, string> = {
  czechy: 'Najlepszy stosunek jakości do ceny oferuje transport miejski w Pradze – zintegrowany system PID obejmuje metro, tramwaje i busy w jednym karnecie.',
  slowacja: 'W Tatrach Słowackich najkorzystniejszym wyborem jest wynajem roweru elektrycznego w połączeniu z lokalnymi busami PKS, co eliminuje koszty parkingowe.',
  rumunia: 'W Transylwanii najbardziej opłacalne jest wynajęcie samochodu z lokalnej wypożyczalni – ceny paliwa są najniższe w UE, a drogi górskie bezpłatne.',
  szwecja: 'W Sztokholmie karta SL Access 72h obejmuje metro, autobusy, promy archipelagowe i pociągi podmiejskie – najtańszy sposób na zwiedzanie regionu.',
  norwegia: 'W Norwegii najkorzystniejszą opcją jest zakup karty Bergen Card lub Oslo Pass – zawiera transport publiczny i wejścia do muzeów w cenie poniżej pojedynczych biletów.',
};
