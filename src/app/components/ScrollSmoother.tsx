"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGsapRouteCleanup } from "./gsap-route-cleanup";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function ScrollSmootherWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const smootherRef = useRef<ReturnType<typeof ScrollSmoother.create> | null>(
    null
  );
  const [recreateKey, setRecreateKey] = useState(0);
  const ctx = useGsapRouteCleanup();

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    smootherRef.current = ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
    });

    ctx?.registerKill(() => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      smootherRef.current?.kill();
      smootherRef.current = null;
      setRecreateKey((k) => k + 1);
    });

    return () => {
      smootherRef.current?.kill();
      smootherRef.current = null;
    };
  }, [recreateKey]); // eslint-disable-line react-hooks/exhaustive-deps -- ctx.registerKill is stable

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
