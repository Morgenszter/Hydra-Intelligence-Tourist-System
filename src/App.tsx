import { useState, useEffect, useMemo } from 'react';
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
import { CountryKey, countryPricing, countryNames, countryCities, tabLabels } from './data/pricingData.ts';
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

// Pre-select all "average" items by default
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

  // Reset selected items when country changes, pre-select average tier
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
    <div className="main-container">
      {/* Telemetry Bar */}
      <TelemetryBar />

      {/* Header */}
      <header className="w-full border-b border-[#005f73] bg-dark-panel py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center gap-2">
          <HydraIcon size={80} />
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

      {/* Control Panel */}
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

      {/* Autonomic Decision Banner */}
      {allCustomEmpty && (
        <div className="w-full max-w-[1600px] mx-auto mt-2 px-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-[rgba(57,255,20,0.05)] border border-[#39ff14]/30 rounded-sm">
            <Zap size={12} className="text-gold-accent" />
            <span className="text-[10px] uppercase tracking-wider text-gold-accent font-orbitron">
              [AUTONOMICZNA DECYZJA HYDRY: AKTYWNA]
            </span>
          </div>
        </div>
      )}

      {/* Budget Total (only on transport tab) */}
      {activeTab === 'transport' && (
        <BudgetTotal country={country} duration={duration} agents={agents} selectedItems={selectedItems} />
      )}

      {/* Deal Finder */}
      <DealFinder country={country} duration={duration} agents={agents} />

      {/* Main Dashboard */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-4 min-h-0 flex flex-col">
        <div className="hydra-panel rounded-sm flex flex-col flex-1 min-h-0">
          {/* Tab Bar */}
          <div className="flex border-b border-[#005f73] shrink-0">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] uppercase tracking-widest font-bold transition-all duration-200 cursor-pointer font-orbitron ${
                  activeTab === t.key ? 'hydra-tab-active' : 'hydra-tab-inactive'
                }`}
              >
                {t.icon}
                {tabLabels[t.key]}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto scrollbar-hydra min-h-0">
            {activeTab === 'transport' && (
              <TabContent
                sectionKey="transport"
                data={currentData.transport}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            )}
            {activeTab === 'food' && (
              <TabContent
                sectionKey="food"
                data={currentData.food}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            )}
            {activeTab === 'snacks' && (
              <TabContent
                sectionKey="snacks"
                data={currentData.snacks}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            )}
            {activeTab === 'accommodation' && (
              <TabContent
                sectionKey="accommodation"
                data={currentData.accommodation}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            )}
            {activeTab === 'attractions' && (
              <TabContent
                sectionKey="attractions"
                data={currentData.attractions}
                duration={duration}
                agents={agents}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
              />
            )}
            {activeTab === 'map' && (
              <TacticalMap country={country} city={city} selectedItems={selectedItems} />
            )}
            {activeTab === 'expedition' && (
              <ExpeditionNotepad country={country} />
            )}
          </div>
        </div>
      </main>

      {/* Bottom Utility Grid */}
      <div className="w-full max-w-[1600px] mx-auto px-6 pb-4 shrink-0">
        <div className="grid grid-cols-3 gap-4">
          {/* Module 1: Packing List (simplified view) */}
          <div className="card-block rounded-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 pb-1 border-b border-[#005f73]/30">
              <Zap size={12} className="text-gold-accent" />
              <span className="text-[10px] uppercase tracking-wider text-gold-accent font-bold font-orbitron">
                DYNAMICZNA LISTA PAKOWANIA
              </span>
            </div>
            <span className="text-[11px] text-muted-cyan font-tech">
              Pełna lista dostępna w zakładce EKSPEDYCJA I NOTATNIK. Automatyczna iniekcja sprzętu specjalistycznego dla: {countryNames[country]}.
            </span>
          </div>

          {/* Module 2: Currency Calculator */}
          <div className="card-block rounded-sm">
            <CurrencyCalculator />
          </div>

          {/* Module 3: Rules Assistant */}
          <div className="card-block rounded-sm">
            <RulesAssistant country={country} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#005f73] bg-dark-panel py-2 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6">
          <span className="text-[9px] uppercase tracking-wider text-muted-cyan font-orbitron">
            HYDRA-INTELLIGENCE // SYSTEM KLASYFIKACJI: TAJNY
          </span>
          <span className="text-[9px] uppercase tracking-wider text-muted-cyan font-orbitron">
            {new Date().toLocaleDateString('pl-PL')} // {new Date().toLocaleTimeString('pl-PL')}
          </span>
        </div>
      </footer>
    </div>
  );
}
