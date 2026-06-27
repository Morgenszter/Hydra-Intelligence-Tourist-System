import { useMemo } from 'react';
import { CountryKey, countryPricing, TierItem } from '../data/pricingData';
import { Wallet, Users } from 'lucide-react';

interface BudgetTotalProps {
  country: CountryKey;
  duration: number;
  agents: number;
  selectedItems: Set<string>;
}

export default function BudgetTotal({ country, duration, agents, selectedItems }: BudgetTotalProps) {
  const { totalBudget, dailyPerAgent, itemCount } = useMemo(() => {
    const data = countryPricing[country];
    const allItems: { item: TierItem; section: string }[] = [];

    (['transport', 'food', 'snacks', 'accommodation', 'attractions'] as const).forEach((section) => {
      const sec = data[section];
      [...sec.cheapest, ...sec.average, ...sec.expensive].forEach((item) => {
        allItems.push({ item, section });
      });
    });

    const safeAgents = Math.max(agents, 1);
    const safeDuration = Math.max(duration, 1);

    let groupDailyTotal = 0;
    let count = 0;

    selectedItems.forEach((name) => {
      const found = allItems.find((a) => a.item.name === name);
      if (found) {
        groupDailyTotal += found.item.pricePerDay * safeAgents;
        count++;
      }
    });

    const dailyPerAgent = count > 0 ? groupDailyTotal / safeAgents : 0;
    const totalBudget = dailyPerAgent * safeAgents * safeDuration;

    return { totalBudget, dailyPerAgent, itemCount: count };
  }, [country, duration, agents, selectedItems]);

  return (
    <div className="w-full max-w-[1600px] mx-auto mt-3 px-6">
      <div className="flex items-center gap-6 p-4 bg-[rgba(57,255,20,0.05)] border border-[#39ff14]/40 rounded-sm">
        <div className="flex items-center gap-2 shrink-0">
          <Wallet size={22} className="text-gold-accent" />
          <span className="text-[12px] uppercase tracking-widest text-gold-accent font-bold font-orbitron">
            CAŁKOWITY BUDŻET SPERSONALIZOWANY
          </span>
        </div>

        <div className="flex items-center gap-4 flex-1">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-muted-cyan font-orbitron">
              Wybrane pozycje
            </span>
            <span className="text-[14px] font-bold text-alpharius-cyan font-tech">
              {itemCount}
            </span>
          </div>
          <div className="w-px h-6 bg-[#005f73]" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-muted-cyan font-orbitron">
              Dzienny koszt / agent
            </span>
            <span className="text-[16px] font-bold text-gold-accent font-tech">
              {dailyPerAgent.toFixed(0)} PLN
            </span>
          </div>
          <div className="w-px h-6 bg-[#005f73]" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-muted-cyan font-orbitron">
              Całkowity budżet
            </span>
            <span className="text-[24px] font-bold text-gold-accent font-tech">
              {totalBudget.toFixed(0)} PLN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-cyan shrink-0">
          <Users size={12} />
          <span className="text-[10px] font-tech">
            {agents} AGENTÓW × {duration} DNI
          </span>
        </div>
      </div>
    </div>
  );
}
