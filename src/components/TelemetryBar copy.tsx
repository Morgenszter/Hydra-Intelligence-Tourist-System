import { Activity } from 'lucide-react';
import { telemetryFeeds } from '../data/pricingData';

export default function TelemetryBar() {
  return (
    <div className="w-full border-b border-[#005f73] bg-dark-panel py-1.5 px-4">
      <div className="max-w-[1600px] mx-auto flex items-center gap-4 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <Activity size={12} className="text-gold-accent animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-gold-accent font-bold whitespace-nowrap font-orbitron">
            AKTYWNE STRUMIENIE TELEMETRII
          </span>
        </div>
        <div className="flex items-center gap-4 overflow-hidden">
          {telemetryFeeds.map((feed, i) => (
            <span
              key={feed}
              className="telemetry-item text-[10px] text-alpharius-cyan whitespace-nowrap font-tech"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {feed}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
