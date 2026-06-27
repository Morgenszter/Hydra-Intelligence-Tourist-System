export default function HydraIcon({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="hydraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#39ff14" />
          <stop offset="100%" stopColor="#0a9396" />
        </linearGradient>
      </defs>
      {/* Center body */}
      <ellipse cx="60" cy="75" rx="14" ry="22" fill="url(#hydraGrad)" filter="url(#glow)" opacity="0.9" />
      {/* Left neck */}
      <path d="M50 68 Q40 50 30 30" stroke="#39ff14" strokeWidth="3" fill="none" filter="url(#glow)" />
      {/* Center neck */}
      <path d="M60 65 Q60 45 60 22" stroke="#39ff14" strokeWidth="3" fill="none" filter="url(#glow)" />
      {/* Right neck */}
      <path d="M70 68 Q80 50 90 30" stroke="#39ff14" strokeWidth="3" fill="none" filter="url(#glow)" />
      {/* Left head */}
      <ellipse cx="28" cy="26" rx="7" ry="9" fill="#39ff14" filter="url(#glow)" />
      <circle cx="26" cy="24" r="1.5" fill="#070d14" />
      <circle cx="30" cy="24" r="1.5" fill="#070d14" />
      {/* Center head */}
      <ellipse cx="60" cy="18" rx="8" ry="10" fill="#39ff14" filter="url(#glow)" />
      <circle cx="57" cy="16" r="1.8" fill="#070d14" />
      <circle cx="63" cy="16" r="1.8" fill="#070d14" />
      {/* Right head */}
      <ellipse cx="92" cy="26" rx="7" ry="9" fill="#39ff14" filter="url(#glow)" />
      <circle cx="90" cy="24" r="1.5" fill="#070d14" />
      <circle cx="94" cy="24" r="1.5" fill="#070d14" />
      {/* Spikes / scales on body */}
      <path d="M46 82 L42 90 L50 88 Z" fill="#0a9396" opacity="0.7" />
      <path d="M60 88 L56 96 L64 94 Z" fill="#0a9396" opacity="0.7" />
      <path d="M74 82 L70 90 L78 88 Z" fill="#0a9396" opacity="0.7" />
      {/* Circuit lines */}
      <line x1="20" y1="100" x2="100" y2="100" stroke="#005f73" strokeWidth="0.5" opacity="0.5" />
      <line x1="30" y1="104" x2="90" y2="104" stroke="#005f73" strokeWidth="0.5" opacity="0.5" />
      <line x1="40" y1="108" x2="80" y2="108" stroke="#005f73" strokeWidth="0.5" opacity="0.5" />
      {/* Hexagon frame */}
      <polygon
        points="60,4 108,32 108,80 60,108 12,80 12,32"
        stroke="#005f73"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
