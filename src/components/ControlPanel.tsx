import { MapPin, Calendar, Users, ChevronDown, Car, Wallet } from 'lucide-react';
import { CountryKey, countryNames, countryCities, transportModes } from '../data/pricingData';

interface ControlPanelProps {
  country: CountryKey;
  setCountry: (c: CountryKey) => void;
  city: string;
  setCity: (c: string) => void;
  duration: number;
  setDuration: (d: number) => void;
  agents: number;
  setAgents: (a: number) => void;
  transport: string;
  setTransport: (t: string) => void;
  customLimits: { cheapest: number | null; average: number | null; expensive: number | null };
  setCustomLimits: (l: { cheapest: number | null; average: number | null; expensive: number | null }) => void;
}

export default function ControlPanel({
  country,
  setCountry,
  city,
  setCity,
  duration,
  setDuration,
  agents,
  setAgents,
  transport,
  setTransport,
  customLimits,
  setCustomLimits,
}: ControlPanelProps) {
  const cities = countryCities[country];

  const handleCountryChange = (c: CountryKey) => {
    setCountry(c);
    setCity(countryCities[c][0].name);
  };

  return (
    <div className="w-full border-b border-[#005f73] bg-dark-panel py-3 px-6">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-end gap-6">
        {/* Country */}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <label className="text-[10px] uppercase tracking-widest text-muted-cyan font-bold font-orbitron">
            Cel Infiltracji
          </label>
          <div className="relative">
            <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-accent" />
            <select
              value={country}
              onChange={(e) => handleCountryChange(e.target.value as CountryKey)}
              className="w-full appearance-none bg-[#0a1118] border border-[#005f73] text-alpharius-cyan text-[12px] py-2 pl-8 pr-7 rounded-sm focus:outline-none focus:border-[#39ff14] cursor-pointer font-tech"
            >
              {(Object.keys(countryNames) as CountryKey[]).map((c) => (
                <option key={c} value={c} className="bg-[#0a1118] text-alpharius-cyan">
                  {countryNames[c]}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-cyan pointer-events-none" />
          </div>
        </div>

        {/* City */}
        <div className="flex flex-col gap-1 min-w-[240px]">
          <label className="text-[10px] uppercase tracking-widest text-muted-cyan font-bold font-orbitron">
            Wybór Sektora
          </label>
          <div className="relative">
            <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-accent" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none bg-[#0a1118] border border-[#005f73] text-alpharius-cyan text-[12px] py-2 pl-8 pr-7 rounded-sm focus:outline-none focus:border-[#39ff14] cursor-pointer font-tech"
            >
              {cities.map((c) => (
                <option key={c.name} value={c.name} className="bg-[#0a1118] text-alpharius-cyan">
                  {c.name} ({c.region})
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-cyan pointer-events-none" />
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[10px] uppercase tracking-widest text-muted-cyan font-bold font-orbitron">
            Czas Trwania [dni]
          </label>
          <div className="relative">
            <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-accent" />
            <input
              type="number"
              min={1}
              max={90}
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Math.min(90, parseInt(e.target.value) || 1)))}
              className="w-full bg-[#0a1118] border border-[#005f73] text-gold-accent text-[12px] py-2 pl-8 pr-2 rounded-sm focus:outline-none focus:border-[#39ff14] font-tech"
            />
          </div>
        </div>

        {/* Agents */}
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[10px] uppercase tracking-widest text-muted-cyan font-bold font-orbitron">
            Liczba Agentów
          </label>
          <div className="relative">
            <Users size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-accent" />
            <input
              type="number"
              min={1}
              max={50}
              value={agents}
              onChange={(e) => setAgents(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="w-full bg-[#0a1118] border border-[#005f73] text-gold-accent text-[12px] py-2 pl-8 pr-2 rounded-sm focus:outline-none focus:border-[#39ff14] font-tech"
            />
          </div>
        </div>

        {/* Transport */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-[10px] uppercase tracking-widest text-muted-cyan font-bold font-orbitron">
            Środek Transportu
          </label>
          <div className="relative">
            <Car size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-accent" />
            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              className="w-full appearance-none bg-[#0a1118] border border-[#005f73] text-alpharius-cyan text-[12px] py-2 pl-8 pr-7 rounded-sm focus:outline-none focus:border-[#39ff14] cursor-pointer font-tech"
            >
              {transportModes.map((t) => (
                <option key={t} value={t} className="bg-[#0a1118] text-alpharius-cyan">
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-cyan pointer-events-none" />
          </div>
        </div>

        {/* Custom Budget Limits */}
        <div className="flex items-end gap-3 ml-auto">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase tracking-wider text-muted-cyan font-bold font-orbitron">Limit NAJTANIEJ</label>
            <div className="relative">
              <Wallet size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gold-accent" />
              <input
                type="number"
                placeholder="AUTONOMICZNA"
                value={customLimits.cheapest ?? ''}
                onChange={(e) => setCustomLimits({ ...customLimits, cheapest: e.target.value ? parseInt(e.target.value) : null })}
                className="w-[110px] bg-[#0a1118] border border-[#005f73] text-gold-accent text-[11px] py-1.5 pl-6 pr-2 rounded-sm focus:outline-none focus:border-[#39ff14] font-tech"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase tracking-wider text-muted-cyan font-bold font-orbitron">Limit ŚREDNIO</label>
            <div className="relative">
              <Wallet size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gold-accent" />
              <input
                type="number"
                placeholder="AUTONOMICZNA"
                value={customLimits.average ?? ''}
                onChange={(e) => setCustomLimits({ ...customLimits, average: e.target.value ? parseInt(e.target.value) : null })}
                className="w-[110px] bg-[#0a1118] border border-[#005f73] text-gold-accent text-[11px] py-1.5 pl-6 pr-2 rounded-sm focus:outline-none focus:border-[#39ff14] font-tech"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase tracking-wider text-muted-cyan font-bold font-orbitron">Limit NAJDROŻEJ</label>
            <div className="relative">
              <Wallet size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gold-accent" />
              <input
                type="number"
                placeholder="AUTONOMICZNA"
                value={customLimits.expensive ?? ''}
                onChange={(e) => setCustomLimits({ ...customLimits, expensive: e.target.value ? parseInt(e.target.value) : null })}
                className="w-[110px] bg-[#0a1118] border border-[#005f73] text-gold-accent text-[11px] py-1.5 pl-6 pr-2 rounded-sm focus:outline-none focus:border-[#39ff14] font-tech"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
