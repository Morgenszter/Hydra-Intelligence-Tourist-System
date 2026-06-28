import React from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function TitleBar() {
  const appWindow = getCurrentWindow();

  return (
    <div className="title-bar">
      <div className="flex items-center gap-2 px-3 text-[#00DAFF] font-mono text-[10px] select-none">
        <span className="animate-pulse text-red-500 font-bold">●</span>
        <span>[ LIVE FEEDS // SATELLITE INTERACTION CORE v2.1 ]</span>
        <span className="text-[#3D7585]">| [ SYSTEM STATUS: OPERATIONAL ]</span>
      </div>
      <div className="window-controls">
        <button onClick={() => appWindow.minimize()}>[ _ ]</button>
        <button onClick={() => appWindow.toggleMaximize()}>[ ▢ ]</button>
        <button onClick={() => appWindow.close()} className="hover:bg-red-700! hover:text-white!">[ X ]</button>
      </div>
    </div>
  );
}
