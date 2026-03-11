"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Sponsor data
const sponsors = [
  { tier: "Platinum", names: ["Sponsor 1", "Sponsor 2"] },
  { tier: "Gold", names: ["Sponsor 3", "Sponsor 4", "Sponsor 5"] },
  {
    tier: "Silver",
    names: ["Sponsor 6", "Sponsor 7", "Sponsor 8", "Sponsor 9"],
  },
];

export default function Sponsors() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const scaleLayerRef = useRef<HTMLDivElement>(null);
  const panLayerRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinWrapperRef.current;
      const scaleLayer = scaleLayerRef.current;
      const panLayer = panLayerRef.current;
      const textOverlay = textOverlayRef.current;
      if (!section || !pin || !scaleLayer || !panLayer || !textOverlay) return;

      const ZOOM = 2.5; // Zoom level to fill ~80% of screen
      const SCROLL_LENGTH = 3.5; // Multiplier for scroll distance
      const INITIAL_SCALE = 1 / ZOOM; // Start scaled down so the raster stays high-res

      gsap.set(scaleLayer, {
        scale: INITIAL_SCALE,
        force3D: true,
        willChange: "transform",
      });
      gsap.set(panLayer, {
        force3D: true,
        willChange: "transform",
      });

      // Initially hide text overlay
      gsap.set(textOverlay, { opacity: 0, y: 50 });

      const getMetrics = () => {
        const img = panLayer.querySelector("img") as HTMLImageElement | null;
        const baseH = img?.offsetHeight ?? 0;
        const vh = window.innerHeight;

        // baseH is now the full rendered height (large), so scale pan relative to that
        const panDistance = Math.min(baseH * 0.4, vh * 0.5);

        const startY = 0;
        const endY = -panDistance;

        return { vh, panDistance, startY, endY };
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const { vh } = getMetrics();

            return "+=" + vh * SCROLL_LENGTH;
          },
          pin,
          scrub: 0.8,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // Spread out the animation phases across the longer scroll distance
      tl.addLabel("zoom", 0);
      tl.addLabel("overlayIn", 0.12);
      tl.addLabel("panStart", 0.2);
      tl.addLabel("overlayOut", 0.68); // Later fade out for longer visibility
      tl.addLabel("panEnd", 0.75);
      tl.addLabel("zoomOut", 0.85);

      // Phase 1: 20% - Zoom in on suitcase (scale from INITIAL_SCALE to 1.0)
      // We scale UP to 1.0 (native raster size) instead of past it — always crisp
      tl.to(scaleLayer, { scale: 1, duration: 0.2, ease: "power1.inOut" }, 0);
      tl.to(
        panLayer,
        { y: () => getMetrics().startY, duration: 0.2, ease: "power1.inOut" },
        "zoom",
      );

      // Phase 2: 12% - Fade in text overlay (longer fade in)
      tl.to(
        textOverlay,
        { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
        "overlayIn",
      );

      // Phase 3: 45% - Pan down the suitcase with text
      tl.to(
        panLayer,
        {
          y: () => getMetrics().endY * 0.75,
          duration: 0.45,
          ease: "power1.inOut",
        },
        "panStart",
      );

      // Phase 4: 12% - Fade out text overlay
      tl.to(
        textOverlay,
        { opacity: 0, y: -30, duration: 0.12, ease: "power2.in" },
        "overlayOut",
      );

      // Phase 5: 20% - Zoom out back to original (scale back to INITIAL_SCALE)
      tl.to(
        scaleLayer,
        { scale: INITIAL_SCALE, duration: 0.2, ease: "power1.inOut" },
        "zoomOut",
      );
      tl.to(panLayer, { y: 0, duration: 0.2, ease: "power1.inOut" }, "zoomOut");
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className="relative w-full min-h-screen"
    >
      <div
        ref={pinWrapperRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Suitcase Layer */}
        <div
          ref={scaleLayerRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformOrigin: "50% 50%" }}
        >
          <div ref={panLayerRef} className="flex items-center justify-center">
            <Image
              className="opacity-90 select-none"
              src="/suitcase_sponsors.webp"
              width={1920}
              height={3666}
              alt="Suitcase"
              quality={100}
              priority
              unoptimized
              style={{ width: "1500px", height: "auto" }}
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>
        </div>

        {/* Text Overlay - Sponsors Content */}
        <div
          ref={textOverlayRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          {/*<div className="max-w-4xl mx-auto px-10 py-12 bg-transparent pointer-events-auto">
            <h2 className="text-5xl font-bold text-center mb-10 text-white drop-shadow-lg">
              Our Sponsors
            </h2>

            {sponsors.map((tierGroup) => (
              <div key={tierGroup.tier} className="mb-8 last:mb-0">
                <h3 className="text-2xl font-semibold text-center mb-4 text-white/90 drop-shadow-md">
                  {tierGroup.tier}
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {tierGroup.names.map((name) => (
                    <div
                      key={name}
                      className="px-8 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-white text-lg font-medium hover:bg-white/30 transition-colors drop-shadow-md"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-center text-white/80 mt-8 text-base drop-shadow-md">
              Interested in sponsoring? Contact us!
            </p>
          </div>*/}
        </div>
      </div>
    </section>
  );
}
