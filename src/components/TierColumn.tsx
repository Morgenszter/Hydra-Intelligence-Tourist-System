import { TierItem } from '../data/pricingData';
import { Zap, CheckSquare, Square } from 'lucide-react';

interface TierColumnProps {
  label: string;
  items: TierItem[];
  duration: number;
  agents: number;
  accentColor?: string;
  selectedItems: Set<string>;
  onToggleItem: (name: string) => void;
}

export default function TierColumn({
  label,
  items,
  duration,
  agents,
  accentColor = '#0a9396',
  selectedItems,
  onToggleItem,
}: TierColumnProps) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2 pb-2 border-b border-[#005f73]">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
        />
        <span
          className="text-[12px] uppercase tracking-widest font-bold font-orbitron"
          style={{ color: accentColor }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const daily = item.pricePerDay * agents;
          const total = item.pricePerTrip * agents * duration;
          const isDeal = item.isDeal;
          const isSelected = selectedItems.has(item.name);

          return (
            <div
              key={item.name}
              onClick={() => onToggleItem(item.name)}
              className={`relative p-3 rounded-sm transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'selected-item'
                  : isDeal
                    ? 'deal-highlight bg-[rgba(57,255,20,0.06)]'
                    : 'bg-[rgba(3,7,9,0.94)] border border-[#005f73]/40 hover:border-[#005f73]'
              }`}
            >
              {isDeal && (
                <div className="absolute -top-2 -right-1 flex items-center gap-1 bg-gold-accent text-[#070d14] text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm font-orbitron">
                  <Zap size={10} />
                  OKAZJA
                </div>
              )}
              <div className="flex items-start gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleItem(item.name);
                  }}
                  className="shrink-0 mt-0.5 text-gold-accent hover:scale-110 transition-transform"
                >
                  {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                </button>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="text-[13px] font-medium text-alpharius-cyan truncate font-tech">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-muted-cyan leading-tight font-tech">
                    {item.description}
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-between mt-2 pt-2 border-t border-[#005f73]/30">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-muted-cyan font-orbitron">
                    Dziennie
                  </span>
                  <span className="text-[14px] font-bold text-gold-accent font-tech">
                    {daily.toFixed(0)} PLN
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-wider text-muted-cyan font-orbitron">
                    Całkowicie
                  </span>
                  <span className="text-[16px] font-bold text-gold-accent font-tech">
                    {total.toFixed(0)} PLN
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
