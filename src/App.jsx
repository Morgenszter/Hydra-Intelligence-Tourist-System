import React, { useState } from 'react';
import { HYDRA_DATABASE } from './HydraMatrix';
import { TitleBar } from './TitleBar';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState("JEDZENIE");
  const [activeBudget, setActiveBudget] = useState("najtaniej");
  const [selectedRows, setSelectedRows] = useState([]);

  const getDisplayPrice = (basePrice) => `${basePrice} PLN (${(basePrice / 0.175).toFixed(0)} CZK)`;

  const handleRowSelection = (name, price) => {
    setSelectedRows(prev => {
      const exists = prev.find(r => r.name === name);
      if (exists) return prev.filter(r => r.name !== name);
      return [...prev, { name, price }];
    });
  };

  const totalSum = selectedRows.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="app-window">
      <TitleBar />
      <div id="three-canvas-container"></div>
      <h1 className="hud-text-3d-heavy tracking-widest text-center mt-4 mb-2">HYDRA INTELLIGENCE</h1>
      <div className="flex-1 flex flex-row relative overflow-hidden h-full">
        <main id="hud-main-content" className="hud-scroll-area flex-1 overflow-y-auto">
          <div className="grid-menu mb-3">
            {Object.keys(HYDRA_DATABASE).map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSelectedRows([]); }} className={`menu-btn ${activeTab === tab ? 'active' : ''}`}>[ {tab} ]</button>
            ))}
          </div>
          <div className="grid-menu budget mb-4">
            {["najtaniej", "srednio", "najdrozej"].map(b => (
              <button key={b} onClick={() => { setActiveBudget(b); setSelectedRows([]); }} className={`menu-btn ${activeBudget === b ? 'active' : ''}`}>| {b.toUpperCase()} |</button>
            ))}
          </div>
          <div className="space-y-2">
            {HYDRA_DATABASE[activeTab]?.[activeBudget]?.map(item => {
              const isSelected = selectedRows.some(r => r.name === item.name);
              return (
                <div key={item.id} onClick={() => handleRowSelection(item.name, item.basePrice)} className={`hud-target-row ${isSelected ? 'selected' : ''}`}>
                  <span>{isSelected ? "[ TARGET LOCK ] > " : "[ ] > "} {item.name}</span>
                  <span className="hud-currency-3d">{getDisplayPrice(item.basePrice)}</span>
                </div>
              );
            })}
          </div>
          <div className="hud-panel-3d mt-6 bg-black/90">
            <div className="text-[10px] font-mono text-[#00DAFF] mb-1">[ KALKULATOR PODSUMOWANIA MISJI ]</div>
            <div className="text-2xl font-mono font-bold tracking-wider text-[#e6f5f5] hud-currency-3d">SUMA: {totalSum.toFixed(0)} PLN</div>
          </div>
        </main>
      </div>
    </div>
  );
}
