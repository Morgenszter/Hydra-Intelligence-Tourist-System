import { CountryKey, countryRules } from '../data/pricingData';
import { AlertTriangle, Gauge, Receipt, Gavel, Wine } from 'lucide-react';

interface RulesAssistantProps {
  country: CountryKey;
}

export default function RulesAssistant({ country }: RulesAssistantProps) {
  const rules = countryRules[country];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 pb-2 border-b border-[#005f73]">
        <AlertTriangle size={14} className="text-gold-accent" />
        <span className="text-[12px] uppercase tracking-widest text-alpharius-cyan font-bold font-orbitron">
          ASYSTENT PRZEPISÓW I OGRANICZEŃ
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2 p-3 bg-[rgba(3,7,9,0.94)] border border-[#005f73]/40 rounded-sm">
          <div className="flex items-center gap-2">
            <Gauge size={14} className="text-gold-accent" />
            <span className="text-[11px] uppercase tracking-wider text-gold-accent font-bold font-orbitron">
              OGRANICZENIA PRĘDKOŚCI
            </span>
          </div>
          <span className="text-[12px] text-alpharius-cyan font-tech leading-relaxed">
            {rules.speedLimits}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-3 bg-[rgba(3,7,9,0.94)] border border-[#005f73]/40 rounded-sm">
          <div className="flex items-center gap-2">
            <Receipt size={14} className="text-gold-accent" />
            <span className="text-[11px] uppercase tracking-wider text-gold-accent font-bold font-orbitron">
              WINIETY I OPŁATY
            </span>
          </div>
          <span className="text-[12px] text-alpharius-cyan font-tech leading-relaxed">
            {rules.vignette}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-3 bg-[rgba(3,7,9,0.94)] border border-[#005f73]/40 rounded-sm">
          <div className="flex items-center gap-2">
            <Gavel size={14} className="text-[#e63946]" />
            <span className="text-[11px] uppercase tracking-wider text-[#e63946] font-bold font-orbitron">
              KARY I MANDATY
            </span>
          </div>
          <span className="text-[12px] text-alpharius-cyan font-tech leading-relaxed">
            {rules.fines}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-3 bg-[rgba(3,7,9,0.94)] border border-[#005f73]/40 rounded-sm">
          <div className="flex items-center gap-2">
            <Wine size={14} className="text-gold-accent" />
            <span className="text-[11px] uppercase tracking-wider text-gold-accent font-bold font-orbitron">
              ALKOHOL I MONOPOL
            </span>
          </div>
          <span className="text-[12px] text-alpharius-cyan font-tech leading-relaxed">
            {rules.alcoholHours}
          </span>
        </div>
      </div>
    </div>
  );
}
