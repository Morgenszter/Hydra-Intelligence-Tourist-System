/// <reference types="vite/client" />

declare global {
  interface Window {
    L: unknown;
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      onStateChange: (callback: (isMaximized: boolean) => void) => () => void;
    };
  }
}

export {};
