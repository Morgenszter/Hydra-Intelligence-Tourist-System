import { TierSection, sectionLabels, tierLabels } from '../data/pricingData';
import TierColumn from './TierColumn';
import { AlertTriangle } from 'lucide-react';

interface TabContentProps {
  sectionKey: 'transport' | 'food' | 'snacks' | 'accommodation' | 'attractions';
  data: TierSection;
  duration: number;
  agents: number;
  selectedItems: Set<string>;
  onToggleItem: (name: string) => void;
}

const tierColors = {
  cheapest: '#39ff14',
  average: '#0a9396',
  expensive: '#e63946',
};

export default function TabContent({
  sectionKey,
  data,
  duration,
  agents,
  selectedItems,
  onToggleItem,
}: TabContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 pb-3 border-b border-[#005f73]">
        <AlertTriangle size={16} className="text-gold-accent" />
        <span className="text-[14px] uppercase tracking-widest text-alpharius-cyan font-bold font-orbitron">
          {sectionLabels[sectionKey]}
        </span>
        <div className="flex-1" />
        <span className="text-[10px] uppercase tracking-wider text-muted-cyan font-orbitron">
          DANE OPERACYJNE // {new Date().getFullYear()}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <TierColumn
          label={tierLabels.cheapest}
          items={data.cheapest}
          duration={duration}
          agents={agents}
          accentColor={tierColors.cheapest}
          selectedItems={selectedItems}
          onToggleItem={onToggleItem}
        />
        <TierColumn
          label={tierLabels.average}
          items={data.average}
          duration={duration}
          agents={agents}
          accentColor={tierColors.average}
          selectedItems={selectedItems}
          onToggleItem={onToggleItem}
        />
        <TierColumn
          label={tierLabels.expensive}
          items={data.expensive}
          duration={duration}
          agents={agents}
          accentColor={tierColors.expensive}
          selectedItems={selectedItems}
          onToggleItem={onToggleItem}
        />
      </div>
    </div>
  );
}
