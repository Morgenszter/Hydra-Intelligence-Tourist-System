import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  HYDRA_DATABASE,
  getLocalGovernmentPppFallback,
  getLocalGovernmentHicpFallback,
  generateLocalesFromOfficialRegistry
} from './services/HydraMatrix';
import { HydraThreeEngine } from './services/ThreeEngine';
import { TitleBar } from './components/TitleBar';
import './index.css';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [targetCountry, setTargetCountry] = useState("Czechy");
  const [selectedLocation, setSelectedLocation] = useState({ miasto: "Praga" });
  const [currentCurrencyCode, setCurrentCurrencyCode] = useState("CZK");
  const [durationDays, setDurationDays] = useState(5);
  const [agentCount, setAgentCount] = useState(2);
  const [transportMode, setTransportMode] = useState("Samochód");
  const [activeTab, setActiveTab] = useState("JEDZENIE");
  const [activeBudget, setActiveBudget] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [notesText, setNotesText] = useState("");
  const [liveDatabase, setLiveDatabase] = useState(null);
  const [inspectedItem, setInspectedItem] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(0.175);
  const [gpsLocation, setGpsLocation] = useState("Wyszukiwanie satelitarne...");
  const [telemetryLog, setTelemetryLog] = useState("PROBING HARDWARE INITIALIZATION...");
  const threeEngineRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setGpsLocation(`LAT: ${pos.coords.latitude.toFixed(4)} | LON: ${pos.coords.longitude.toFixed(4)}`),
        (err) => setGpsLocation("GPS OFFLINE - TRYB OPERACYJNY"),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      const container = document.getElementById('three-canvas-container');
      const scrollContainer = document.getElementById('hud-main-content');
      if (container && scrollContainer) {
        try {
          threeEngineRef.current = new HydraThreeEngine('three-canvas-container', 'hud-main-content');
          invoke('log_telemetry', { message: 'HYDRA OPERATIONAL NATIVE WINDOW OPENED' }).catch(err => console.error(err));
          setTelemetryLog("[ SATELITA 3D ]: POŁĄCZENIE Z KANVASEM USTANOWIONE");
        } catch (err) {
          console.error("[WebGL Crash Safeguard]:", err);
        }
      }
    }, 150);
    return () => {
      clearTimeout(initTimer);
      if (threeEngineRef.current) {
        threeEngineRef.current.dispose();
        threeEngineRef.current = null;
      }
    };
  }, [liveDatabase]);

  useEffect(() => {
    if (threeEngineRef.current && liveDatabase && activeTab && activeBudget) {
      const activeLocales = liveDatabase[activeTab]?.[activeBudget]?.flatMap(card => card.locales) || [];
      const filteredSelected = activeLocales.filter(item =>
        selectedRows.some(row => row.name === item.name)
      );
      threeEngineRef.current.updateMapPoints(filteredSelected);
    } else if (threeEngineRef.current) {
      threeEngineRef.current.updateMapPoints([]);
    }
  }, [selectedRows, liveDatabase, activeTab, activeBudget]);

  useEffect(() => {
    const fetchLiveMacroStatisticalData = async () => {
      let liveRateNBP = 0.175;
      try {
        setTelemetryLog("[ STRUMIEŃ ]: PROBING API NBP WALUTY LIVE...");
        const nbpResponse = await fetch(`https://api.nbp.pl/api/exchangerates/rates/a/${currentCurrencyCode.toLowerCase()}/?format=json`);
        if (nbpResponse.ok) {
          const nbpData = await nbpResponse.json();
          liveRateNBP = nbpData.rates[0].mid;
          setExchangeRate(liveRateNBP);
        }
      } catch (e) {
        setExchangeRate(0.175);
        liveRateNBP = 0.175;
      }

      const pppFactor = getLocalGovernmentPppFallback(targetCountry);
      const hicpIndex = getLocalGovernmentHicpFallback(targetCountry);
      const freshDatabase = {};

      for (const [tabKey, budgets] of Object.entries(HYDRA_DATABASE)) {
        freshDatabase[tabKey] = {};
        for (const [budgetKey, cards] of Object.entries(budgets)) {
          freshDatabase[tabKey][budgetKey] = cards.map(card => {
            const rawLocales = generateLocalesFromOfficialRegistry(targetCountry, card.queryTags, selectedLocation.miasto);
            const computedLocales = rawLocales.map(item => {
              let computedPln = 0;
              let localPrice = 0;
              if (item.baseStatisticalPrice !== 0) {
                localPrice = item.baseStatisticalPrice * (hicpIndex / 100) * (1 / pppFactor);
                computedPln = localPrice * liveRateNBP;
                if (tabKey === "TRANSPORT") {
                  if (transportMode === "Samochód") computedPln *= 1.25;
                  if (transportMode === "Prywatny transfer VIP") computedPln *= 2.0;
                }
                if (tabKey === "NOCLEG") computedPln *= durationDays;
                if (tabKey === "JEDZENIE") computedPln *= (durationDays * agentCount);
              }
              return {
                ...item,
                computedPln: computedPln,
                formattedPrice: item.baseStatisticalPrice === 0 ? "0 PLN (DARMOWE)" : `${computedPln.toFixed(0)} PLN (${(computedPln / liveRateNBP).toFixed(0)} ${currentCurrencyCode})`
              };
            });
            const avgPln = computedLocales.reduce((acc, curr) => acc + curr.computedPln, 0) / (computedLocales.length || 1);
            return {
              ...card,
              daily: tabKey === "NOCLEG" || tabKey === "JEDZENIE" ? (avgPln / durationDays).toFixed(0) : avgPln.toFixed(0),
              total: avgPln.toFixed(0),
              locales: computedLocales.sort((a, b) => a.computedPln - b.computedPln)
            };
          });
        }
      }
      setLiveDatabase(freshDatabase);
      setTelemetryLog("[ TELEMETRIA ]: REJESTRY LIVE ZAKTUALIZOWANE");
    };
    fetchLiveMacroStatisticalData();
  }, [targetCountry, selectedLocation, currentCurrencyCode, durationDays, agentCount, transportMode]);

  const handleBudgetToggle = (budget) => {
    setActiveBudget(activeBudget === budget ? null : budget);
    setSelectedRows([]);
    setInspectedItem(null);
  };

  const handleRowSelection = (name, computedPln) => {
    setSelectedRows(prev => {
      const exists = prev.find(r => r.name === name);
      if (exists) return prev.filter(r => r.name !== name);
      return [...prev, { name, computedPln }];
    });
    if (liveDatabase && activeTab && activeBudget) {
      const activeLocales = liveDatabase[activeTab]?.[activeBudget]?.flatMap(card => card.locales) || [];
      const foundItem = activeLocales.find(loc => loc.name === name);
      if (foundItem) {
        setInspectedItem({ ...foundItem, tab: activeTab });
      }
    }
  };

  const generateLiveUrl = (name) => {
    const d = new Date();
    const timeLock = `checkIn=${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return `https://duckduckgo.com/?q=${encodeURIComponent(`${name} ${timeLock}`)}&ia=web`;
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const calculatedTotalSum = selectedRows.reduce((acc, curr) => acc + curr.computedPln, 0);

  const renderIntelOverlay = () => {
    if (!inspectedItem) return null;
    const localCurrencyValue = inspectedItem.computedPln / exchangeRate;
    return (
      <div className="hud-panel-3d p-3 mt-4 border border-[#005f73] bg-[#000f16]/95">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#00DAFF] font-bold text-[11px] font-mono">[ METADANE WYWIADU POI ]: {inspectedItem.name}</span>
          <button onClick={() => setInspectedItem(null)} className="text-[#00DAFF] font-mono text-[11px] hover:text-red-500">[ ANULUJ ]</button>
        </div>
        <div className="text-[11px] text-[#83c5be] font-mono space-y-1">
          <div>[REJESTR]: {inspectedItem.tab} REAL-TIME OVERWRITE</div>
          <div>[WYCENA KOSZTU]: {inspectedItem.computedPln === 0 ? "0 PLN" : `${inspectedItem.computedPln.toFixed(0)} PLN (${localCurrencyValue.toFixed(0)} ${currentCurrencyCode})`}</div>
          <a href={generateLiveUrl(inspectedItem.name)} target="_blank" rel="noopener noreferrer" className="hud-egress-btn mt-2 inline-block">
            [ URUCHOM TRANSMISJĘ SYSTEMU REZERWACJI LIVE ]
          </a>
        </div>
      </div>
    );
  };

  if (!liveDatabase) {
    return (
      <div className="app-window flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#00DAFF] font-mono text-[14px] font-bold mb-2">HYDRA INTELLIGENCE SYSTEM</div>
          <div className="text-[#3D7585] font-mono text-[11px] animate-pulse">[ CONNECTING FEED STREAM... PRZELICZANIE SKAL PPP I HICP ]</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-window">
      <TitleBar />

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-12 left-4 z-50 menu-btn border px-3 py-1 text-xs font-bold"
        style={{ boxShadow: isSidebarOpen ? '0 0 10px #00daff' : 'none' }}
      >
        {isSidebarOpen ? "[ ZAMKNIJ FILTRY BOCZNE ]" : "[ OTWÓRZ MENU SEKTORA ]"}
      </button>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`hud-panel-3d w-64 absolute top-0 bottom-0 left-0 z-40 transition-all duration-300 overflow-y-auto flex flex-col gap-4 p-3 bg-[#000f16]/95 ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-80 opacity-0 pointer-events-none'}`}>
          <div className="text-[#00DAFF] font-bold text-[11px] font-mono border-b border-[#005f73] pb-2">| SPECYFIKACJA MISJI |</div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-[#3D7585] font-mono">CEL INFILTRACJI (KRAJ):</label>
            <select value={targetCountry} onChange={(e) => setTargetCountry(e.target.value)} className="bg-[#080B0E] border border-[#005f73] text-xs p-1 text-[#fff] outline-none font-mono">
              <option value="Czechy">Czechy</option>
              <option value="Słowacja">Słowacja</option>
              <option value="Rumunia">Rumunia</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-[#3D7585] font-mono">SEKTOR DOCELOWY (MIASTO):</label>
            <input type="text" value={selectedLocation.miasto} onChange={(e) => setSelectedLocation({ miasto: e.target.value })} className="bg-[#080B0E] border border-[#005f73] text-xs p-1 text-[#fff] outline-none font-mono" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-[#3D7585] font-mono">WALUTA OPERACYJNA:</label>
            <input type="text" value={currentCurrencyCode} onChange={(e) => setCurrentCurrencyCode(e.target.value.toUpperCase())} className="bg-[#080B0E] border border-[#005f73] text-xs p-1 text-[#00DAFF] outline-none font-bold font-mono" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-[#3D7585] font-mono">CZAS (DNI):</label>
            <input type="number" min="1" value={durationDays} onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)} className="bg-[#080B0E] border border-[#005f73] text-xs p-1 text-[#fff] outline-none font-mono" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-[#3D7585] font-mono">AGENTÓW:</label>
            <input type="number" min="1" value={agentCount} onChange={(e) => setAgentCount(parseInt(e.target.value) || 1)} className="bg-[#080B0E] border border-[#005f73] text-xs p-1 text-[#fff] outline-none font-mono" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-[#3D7585] font-mono">ŚRODEK TRANSPORTU:</label>
            <select value={transportMode} onChange={(e) => setTransportMode(e.target.value)} className="bg-[#080B0E] border border-[#005f73] text-xs p-1 text-[#fff] outline-none font-mono">
              <option value="Autobusy & Tramwaje">Autobusy & Tramwaje</option>
              <option value="Samochód">Samochód (+25% w sektorze transportu)</option>
              <option value="Prywatny transfer VIP">Prywatny transfer VIP (+100%)</option>
            </select>
          </div>

          <div className="mt-auto pt-2 border-t border-[#005f73]">
            <div className="text-[9px] text-[#3D7585] font-mono mb-1">AGREGATOR KOSZTÓW MISJI</div>
            <div className="text-[#00DAFF] font-bold text-[14px] font-mono">SUMA: {calculatedTotalSum.toFixed(0)} PLN</div>
          </div>
        </aside>

        <main id="hud-main-content" className={`hud-scroll-area p-4 overflow-y-auto border-r border-[#005f73] transition-all duration-300 ${isSidebarOpen ? 'w-1/2 ml-72' : 'w-1/2 ml-0'}`}>
          <div className="mb-3 text-[10px] text-[#3D7585] font-mono">
            [ HUD VECTOR // STATUS GPS: {gpsLocation} ]
          </div>
          <div className="mb-3 text-[10px] text-[#00DAFF] font-mono animate-pulse">
            {telemetryLog}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(HYDRA_DATABASE).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setActiveBudget(null); setInspectedItem(null); setSelectedRows([]); }}
                className={`py-2 text-[10px] font-bold border transition-all font-mono ${activeTab === tab ? 'bg-[#005f73]/40 border-[#00DAFF] text-[#00DAFF]' : 'bg-[#080B0E]/80 border-[#005f73]/40 text-[#3D7585] hover:text-[#fff]'}`}
              >
                [ {tab} ]
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {["najtaniej", "srednio", "najdrozej"].map(budget => (
              <button
                key={budget}
                onClick={() => handleBudgetToggle(budget)}
                className={`py-2 text-[11px] font-bold border transition-all font-mono ${activeBudget === budget ? 'bg-[#005f73]/40 border-[#00DAFF] text-[#00DAFF]' : 'bg-[#080B0E]/80 border-[#005f73]/40 text-[#3D7585] hover:text-[#fff]'}`}
              >
                | {budget.toUpperCase()} |
              </button>
            ))}
          </div>

          {activeTab && activeBudget && liveDatabase[activeTab]?.[activeBudget] && (
            <div className="space-y-4">
              <div className="text-[11px] text-[#00DAFF] font-bold font-mono border-b border-[#005f73] pb-1">
                ZIDENTYFIKOWANE OFERTY SEKTORA ("NAJLEPSZE OFERTY"):
              </div>
              {liveDatabase[activeTab][activeBudget].map(card => (
                <div key={card.id} className="border border-[#005f73]/40 bg-[#080B0E]/60 p-3">
                  <div className="text-[12px] text-[#fff] font-bold font-mono mb-2">{card.name}</div>
                  <div className="text-[10px] text-[#3D7585] font-mono mb-2">
                    ŚREDNIA: {card.daily} PLN // TOTAL: {card.total} PLN
                  </div>
                  {card.locales.map(item => {
                    const isSelected = selectedRows.some(r => r.name === item.name);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleRowSelection(item.name, item.computedPln)}
                        className={`hud-target-row ${isSelected ? 'selected' : ''}`}
                      >
                        <span className="font-mono text-[11px]">
                          {isSelected ? "[ TARGET LOCK ] > " : "[ ] > "} {item.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#00DAFF]">{item.formattedPrice}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {renderIntelOverlay()}

          <div className="mt-6 space-y-2">
            <button onClick={() => toggleAccordion('notatki')} className="w-full bg-[#12181F] text-left px-3 py-2 text-xs font-bold text-[#83c5be] flex justify-between font-mono border border-[#005f73]/40">
              <span>[ NOTATNIK EKSPEDYCJI ]</span>
              <span>{activeAccordion === 'notatki' ? "[-]" : "[+]"}</span>
            </button>
            {activeAccordion === 'notatki' && (
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Taktyczne obserwacje..."
                className="w-full h-24 bg-[#080B0E] border border-[#005f73] text-xs p-2 text-[#fff] outline-none resize-none font-mono"
              />
            )}

            <button onClick={() => toggleAccordion('zasady')} className="w-full bg-[#12181F] text-left px-3 py-2 text-xs font-bold text-[#83c5be] flex justify-between font-mono border border-[#005f73]/40">
              <span>[ PROTOKOŁY REJESTRU SYSTEMOWEGO: {targetCountry.toUpperCase()} ]</span>
              <span>{activeAccordion === 'zasady' ? "[-]" : "[+]"}</span>
            </button>
            {activeAccordion === 'zasady' && (
              <div className="bg-[#080B0E] border border-[#005f73] p-3 text-[11px] text-[#83c5be] font-mono space-y-1">
                <div>{`> Waluta: ${currentCurrencyCode}. Korekta HICP ČSÚ aktywna.`}</div>
                <div>{`> Taryfy miejskie i podatki wliczone w pętlę.`}</div>
                <div>{`> Ograniczenia prędkości: Miasto 50km/h, poza miastem 90km/h, autostrada 130km/h.`}</div>
                <div>{`> Winieta elektroniczna wymagana na autostradach.`}</div>
                <div>{`> Promil alkoholu: 0.0‰ (zero tolerancji).`}</div>
              </div>
            )}
          </div>
        </main>

        <div className={`relative transition-all duration-300 ${isSidebarOpen ? 'w-1/2' : 'w-1/2'}`}>
          <div id="three-canvas-container" className="absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
