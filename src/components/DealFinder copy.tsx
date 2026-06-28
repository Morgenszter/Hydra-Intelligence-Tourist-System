import { useMemo } from 'react';
import { CountryKey, countryPricing, TierItem, dealBriefs } from '../data/pricingData';
import { Sparkles, TrendingDown, FileText } from 'lucide-react';

interface DealFinderProps {
  country: CountryKey;
  duration: number;
  agents: number;
}

interface BestDeal {
  category: string;
  item: TierItem;
  savings: number;
}

export default function DealFinder({ country, duration, agents }: DealFinderProps) {
  const bestDeal = useMemo((): BestDeal | null => {
    const data = countryPricing[country];
    const categories = [
      { key: 'transport', label: 'TRANSPORT' },
      { key: 'food', label: 'JEDZENIE' },
      { key: 'snacks', label: 'SMAKOŁYKI' },
      { key: 'accommodation', label: 'NOCLEG' },
      { key: 'attractions', label: 'ATRAKCJE' },
    ] as const;

    let best: BestDeal | null = null;

    for (const cat of categories) {
      const section = data[cat.key];
      const allItems = [...section.cheapest, ...section.average, ...section.expensive];
      for (const item of allItems) {
        if (item.isDeal) {
          const avgPrice =
            (section.cheapest.reduce((s, i) => s + i.pricePerDay, 0) / section.cheapest.length +
             section.average.reduce((s, i) => s + i.pricePerDay, 0) / section.average.length +
             section.expensive.reduce((s, i) => s + i.pricePerDay, 0) / section.expensive.length) /
            3;
          const savings = (avgPrice - item.pricePerDay) * agents * duration;
          if (!best || savings > best.savings) {
            best = { category: cat.label, item, savings };
          }
        }
      }
    }
    return best;
  }, [country, duration, agents]);

  if (!bestDeal) return null;

  const total = bestDeal.item.pricePerDay * agents * duration;

  return (
    <div className="w-full max-w-[1600px] mx-auto mt-3 px-6">
      <div className="deal-highlight rounded-sm bg-[rgba(57,255,20,0.05)] p-3 flex items-center gap-4">
        <div className="shrink-0">
          <Sparkles size={22} className="text-gold-accent animate-pulse" />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-gold-accent font-bold bg-[rgba(57,255,20,0.15)] px-2 py-0.5 rounded-sm font-orbitron">
              [WYKRYTO OKAZYJNĄ CENĘ]
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-cyan font-orbitron">
              {bestDeal.category}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-alpharius-cyan font-medium font-tech truncate">
              {bestDeal.item.name}
            </span>
            <span className="text-[11px] text-muted-cyan font-tech truncate">
              — {bestDeal.item.description}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <FileText size={11} className="text-muted-cyan shrink-0" />
            <span className="text-[11px] text-muted-cyan font-tech italic">
              {dealBriefs[country]}
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1 text-gold-accent">
            <TrendingDown size={13} />
            <span className="text-[11px] font-bold font-tech">
              -{bestDeal.savings.toFixed(0)} PLN
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-muted-cyan font-orbitron">
              Cena całkowita
            </span>
            <span className="text-[16px] font-bold text-gold-accent font-tech">
              {total.toFixed(0)} PLN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
