import React, { useState, useEffect } from 'react';

export const TitleBar = ({ gpsLocation }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onStateChange) {
      const unsubscribe = window.electronAPI.onStateChange((state) => {
        setIsMaximized(state); 
      });
      
      return () => unsubscribe(); 
    }
  }, []);

  return (
    <div className="title-bar flex justify-between items-center h-[32px] bg-[#12181F] border-b border-[#005f73] select-none">
      <div style={{paddingLeft: '15px', fontSize: '0.8rem', color: '#005f73'}} className="font-mono">
        GPS: {gpsLocation}
      </div>
      
      {/* Dynamiczne Logo PBR w centrum */}
      <div className="hydra-main-logo mx-auto"></div>

      {/* Srebrne kontrolki okna po prawej stronie */}
      <div className="window-controls flex h-full">
        <button 
          onClick={() => window.electronAPI?.minimize()} 
          className="w-[45px] h-full flex items-center justify-center font-mono text-[11px] text-[#e6f5f5] hover:bg-[#005f73] transition-colors"
        >
          [ _ ]
        </button>
        <button 
          onClick={() => window.electronAPI?.maximize()} 
          className="w-[45px] h-full flex items-center justify-center font-mono text-[11px] text-[#e6f5f5] hover:bg-[#005f73] transition-colors"
        >
          {isMaximized ? "[ ⧉ ]" : "[ ▢ ]"}
        </button>
        <button 
          onClick={() => window.electronAPI?.close()} 
          className="w-[45px] h-full flex items-center justify-center font-mono text-[11px] text-[#e6f5f5] hover:bg-red-600 transition-colors"
        >
          [ X ]
        </button>
      </div>
    </div>
  );
};