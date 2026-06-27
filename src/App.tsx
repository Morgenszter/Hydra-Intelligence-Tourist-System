import { useState, useEffect } from 'react';
import {
  Shield,
  Route,
  Utensils,
  Cookie,
  BedDouble,
  Mountain,
  Map,
  FolderOpen,
  Zap,
} from 'lucide-react';
import { CountryKey, countryPricing, countryCities, tabLabels } from './data/pricingData';
import HydraIcon from './components/HydraIcon';
import TelemetryBar from './components/TelemetryBar';
import ControlPanel from './components/ControlPanel';
import TabContent from './components/TabContent';
import DealFinder from './components/DealFinder';
import BudgetTotal from './components/BudgetTotal';
import TacticalMap from './components/TacticalMap';
import ExpeditionNotepad from './components/ExpeditionNotepad';
import CurrencyCalculator from './components/CurrencyCalculator';
import RulesAssistant from './components/RulesAssistant';

type TabKey = 'transport' | 'food' | 'snacks' | 'accommodation' | 'attractions' | 'map' | 'expedition';

const tabs: { key: TabKey; icon: React.ReactNode }[] = [
  { key: 'transport', icon: <Route size={14} /> },
  { key: 'food', icon: <Utensils size={14} /> },
  { key: 'snacks', icon: <Cookie size={14} /> },
  { key: 'accommodation', icon: <BedDouble size={14} /> },
  { key: 'attractions', icon: <Mountain size={14} /> },
  { key: 'map', icon: <Map size={14} /> },
  { key: 'expedition', icon: <FolderOpen size={14} /> },
];

function getDefaultSelected(country: CountryKey): Set<string> {
  const data = countryPricing[country];
  const selected = new Set<string>();
  (['transport', 'food', 'snacks', 'accommodation', 'attractions'] as const).forEach((section) => {
    data[section].average.forEach((item) => selected.add(item.name));
  });
  return selected;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('transport');
  const [country, setCountry] = useState<CountryKey>('czechy');
  const [city, setCity] = useState<string>(countryCities.czechy[0].name);
  const [duration, setDuration] = useState<number>(7);
  const [agents, setAgents] = useState<number>(2);
  const [transport, setTransport] = useState<string>('Samochód');
  const [customLimits, setCustomLimits] = useState<{ cheapest: number | null; average: number | null; expensive: number | null }>({
    cheapest: null,
    average: null,
    expensive: null,
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => getDefaultSelected('czechy'));

  const currentData = countryPricing[country];

  useEffect(() => {
    setSelectedItems(getDefaultSelected(country));
    setCity(countryCities[country][0].name);
  }, [country]);

  const handleToggleItem = (name: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const allCustomEmpty = customLimits.cheapest === null && customLimits.average === null && customLimits.expensive === null;

  return (
    <div className="w-full min-h-screen bg-[#030708] text-[#f0fbfb] p-4 md:p-8 flex flex-col items-center overflow-y-auto">
      {/* Pasek Telemetrii */}
      <TelemetryBar />

      {/* Nagłówek HUD */}
      <header className="w-full max-w-[1600px] border border-[#005f73] bg-dark-panel py-4 rounded-sm mb-4 shadow-[0_0_15px_rgba(0,95,115,0.3)] shrink-0">
        <div className="flex flex-col items-center gap-2">
          <HydraIcon size={64} />
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-gold-accent" />
            <h1 className="text-[22px] font-bold uppercase tracking-[0.25em] text-gold-accent font-orbitron">
              HYDRA-INTELLIGENCE
            </h1>
            <Shield size={18} className="text-gold-accent" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-cyan font-orbitron">
            System Analizy Kosztów Operacyjnych // Wersja 4.2.1
          </p>
        </div>
      </header>

      {/* Główny układ danych */}
      <div className="w-full max-w-[1600px] flex flex-col gap-4">
        
        {/* Panel Sterowania Formularzami */}
        <section className="border border-[#005f73] bg-dark-panel p-4 rounded-sm shadow-[0_0_15px_rgba(0,95,115,0.2)] shrink-0">
          <ControlPanel
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            duration={duration}
            setDuration={setDuration}
            agents={agents}
            setAgents={setAgents}
            transport={transport}
            setTransport={setTransport}
            customLimits={customLimits}
            setCustomLimits={setCustomLimits}
          />
          
          {allCustomEmpty && (
            <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-[rgba(57,255,20,0.05)] border border-[#39ff14]/30 rounded-sm w-fit">
              <Zap size={12} className="text-gold-accent" />
              <span className="text-[10px] uppercase tracking-wider text-gold-accent font-orbitron">
                [AUTONOMICZNA DECYZJA HYDRY: AKTYWNA]
              </span>
            </div>
          )}
        </section>

        {/* Nawigacja 7 Kart na Samej Górze */}
        <nav className="flex flex-wrap border border-[#005f73] bg-dark-panel rounded-sm overflow-hidden shadow-[0_0_15px_rgba(0,95,115,0.2)] shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-widest font-bold transition-all duration-200 cursor-pointer font-orbitron border-r border-[#005f73] last:border-0 ${
                activeTab === t.key 
                  ? 'bg-[#005f73]/40 text-[#39ff14] border-b-2 border-b-[#39ff14]' 
                  : 'bg-transparent text-[#8ec3c3] hover:bg-[#005f73]/10'
              }`}
            >
              {t.icon}
              {tabLabels[t.key]}
            </button>
          ))}
        </nav>

        {/* CAŁKOWICIE IZOLOWANE EKRANY OPERACYJNE (WYSYŁANE NA OSOBNE WIDOKI) */}
        <section className="w-full border border-[#005f73] bg-dark-panel rounded-sm p-6 shadow-[0_0_20px_rgba(0,95,115,0.3)] min-h-[450px] flex flex-col">
          
          {/* EKRAN 1: TRANSPORT */}
          {activeTab === 'transport' && (
            <div className="flex flex-col gap-6 flex-1">
              <BudgetTotal country={country} duration={duration} agents={agents} selectedItems={selectedItems} />
              <DealFinder country={country} duration={duration} agents={agents} />
              <div className="border-t border-[#005f73]/40 pt-4">
                <TabContent
                  sectionKey="transport"
                  data={currentData.transport}
                  duration={duration}
                  agents={agents}
                  selectedItems={selectedItems}
                  onToggleItem={handleToggleItem}
                />
              </div>
            </div>
          )}

          {/* EKRAN 2: JEDZENIE I SKLEPY */}
          {activeTab === 'food' && (
            <div className="flex flex-col gap-4 flex-1">
              <TabContent
                sectionKey="food"
                data={currentData.food}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            </div>
          )}

          {/* EKRAN 3: LOKALNE SMAKOŁYKI */}
          {activeTab === 'snacks' && (
            <div className="flex flex-col gap-4 flex-1">
              <TabContent
                sectionKey="snacks"
                data={currentData.snacks}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            </div>
          )}

          {/* EKRAN 4: NOCLEG */}
          {activeTab === 'accommodation' && (
            <div className="flex flex-col gap-4 flex-1">
              <TabContent
                sectionKey="accommodation"
                data={currentData.accommodation}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            </div>
          )}

          {/* EKRAN 5: ATRAKCJE */}
          {activeTab === 'attractions' && (
            <div className="flex flex-col gap-4 flex-1">
              <TabContent
                sectionKey="attractions"
                data={currentData.attractions}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            </div>
          )}

          {/* EKRAN 6: DEDYKOWANA MAPA PANORAMICZNA */}
          {activeTab === 'map' && (
            <div className="w-full h-[650px] rounded-sm overflow-hidden border border-[#005f73]/60 relative flex flex-col flex-1">
              <TacticalMap country={country} city={city} selectedItems={selectedItems} />
            </div>
          )}

          {/* EKRAN 7: PAMIĘĆ EXPEDYCJI I NOTATNIK */}
          {activeTab === 'expedition' && (
            <div className="w-full flex-1 flex flex-col">
              <ExpeditionNotepad country={country} />
            </div>
          )}
        </section>

        {/* Globalne Narzędzia pomocnicze (Wyciągnięte na sam dół jako niezależny segment) */}
        <footer className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 pb-8 shrink-0">
          <div className="border border-[#005f73] bg-dark-panel p-5 rounded-sm shadow-[0_0_15px_rgba(0,95,115,0.2)]">
            <CurrencyCalculator country={country} />
          </div>
          <div className="border border-[#005f73] bg-dark-panel p-5 rounded-sm shadow-[0_0_15px_rgba(0,95,115,0.2)]">
