"use client";

// Symbols plugin: SymbolsPuckConfigProvider wraps the base PuckConfigProvider
// and registers one palette block per published reusable component at runtime.
import { SymbolsPuckConfigProvider } from "@premast/site-plugin-symbols/editor";
import { puckConfig } from "@/puck.config";

export function PuckProvider({ children }) {
  return (
    <SymbolsPuckConfigProvider puckConfig={puckConfig}>
      {children}
    </SymbolsPuckConfigProvider>
  );
}
