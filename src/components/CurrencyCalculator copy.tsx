import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';

interface RateData {
  code: string;
  rate: number;
  name: string;
}

const CURRENCIES: RateData[] = [
  { code: 'CZK', rate: 5.85, name: 'KORONA CZESKA' },
  { code: 'NOK', rate: 0.38, name: 'KORONA NORWESKA' },
  { code: 'SEK', rate: 0.41, name: 'KORONA SZWEDZKA' },
  { code: 'RON', rate: 0.91, name: 'LEJ RUMUŃSKI' },
  { code: 'EUR', rate: 4.35, name: 'EURO' },
];

export default function CurrencyCalculator() {
  const [plnAmount, setPlnAmount] = useState<number>(1000);
  const [rates, setRates] = useState<RateData[]>(CURRENCIES);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Try NBP API
      const response = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json');
      if (response.ok) {
        const data = await response.json();
        const table = data[0];
        const updated = table.effectiveDate || new Date().toISOString().split('T')[0];
        setLastUpdate(updated);

        const newRates = CURRENCIES.map((c) => {
          const found = table.rates.find((r: any) => r.code === c.code);
          if (found) {
            return { ...c, rate: found.mid };
          }
          return c;
        });
        setRates(newRates);
      } else {
        throw new Error('NBP API unavailable');
      }
    } catch {
      setError('[SYSTEM]: BRAK POŁĄCZENIA Z NBP - UŻYTO DANYCH REZERWOWYCH');
      setLastUpdate(new Date().toISOString().split('T')[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 pb-2 border-b border-[#005f73]">
        <TrendingUp size={14} className="text-gold-accent" />
        <span className="text-[12px] uppercase tracking-widest text-alpharius-cyan font-bold font-orbitron">
          KALKULATOR WALUTOWY LIVE // NBP
        </span>
        <div className="flex-1" />
        <button
          onClick={fetchRates}
          disabled={loading}
          className="flex items-center gap-1 px-2 py-1 bg-[rgba(57,255,20,0.1)] border border-[#39ff14] text-gold-accent text-[10px] uppercase font-bold rounded-sm hover:bg-[rgba(57,255,20,0.2)] font-orbitron disabled:opacity-50"
        >
          <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
          ODŚWIEŻ
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[11px] text-gold-accent font-tech bg-[rgba(57,255,20,0.05)] border border-[#39ff14]/30 px-3 py-1.5 rounded-sm">
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-[10px] uppercase tracking-wider text-muted-cyan font-bold font-orbitron">
          Kwota PLN:
        </label>
        <input
          type="number"
          value={plnAmount}
          onChange={(e) => setPlnAmount(Math.max(0, parseFloat(e.target.value) || 0))}
          className="w-[140px] bg-[#0a1118] border border-[#005f73] text-gold-accent text-[14px] py-1.5 px-3 rounded-sm focus:outline-none focus:border-[#39ff14] font-tech"
        />
        <span className="text-[10px] text-muted-cyan font-tech">
          Ostatnia aktualizacja: {lastUpdate || '---'}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {rates.map((r) => {
          const converted = plnAmount / r.rate;
          return (
            <div
              key={r.code}
              className="flex flex-col gap-1 p-3 bg-[rgba(3,7,9,0.94)] border border-[#005f73]/40 rounded-sm"
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-cyan font-orbitron">
                {r.name}
              </span>
              <span className="text-[11px] text-alpharius-cyan font-tech">
                1 {r.code} = {r.rate.toFixed(4)} PLN
              </span>
              <span className="text-[18px] font-bold text-gold-accent font-tech">
                {converted.toFixed(2)} {r.code}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
