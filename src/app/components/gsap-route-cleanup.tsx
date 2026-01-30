"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

type GsapRouteCleanupContextValue = {
  killBeforeNavigate: () => void;
  registerKill: (fn: () => void) => void;
};

const GsapRouteCleanupContext =
  createContext<GsapRouteCleanupContextValue | null>(null);

export function useGsapRouteCleanup() {
  const ctx = useContext(GsapRouteCleanupContext);
  return ctx;
}

export function GsapRouteCleanupProvider({
  children,
}: {
  children: ReactNode;
}) {
  const killRef = useRef<() => void>(() => {});

  const killBeforeNavigate = useCallback(() => {
    killRef.current();
  }, []);

  const registerKill = useCallback((fn: () => void) => {
    killRef.current = fn;
  }, []);

  return (
    <GsapRouteCleanupContext.Provider
      value={{ killBeforeNavigate, registerKill }}
    >
      {children}
    </GsapRouteCleanupContext.Provider>
  );
}
