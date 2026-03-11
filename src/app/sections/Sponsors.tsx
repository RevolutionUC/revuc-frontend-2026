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
      const INITIAL_SCALE = 1 / ZOOM; 

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
        
        const startY = vh * 0.35; 
        const endY = -vh * 0.35; 

        return { vh, startY, endY };
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

      tl.addLabel("zoom", 0);
      tl.addLabel("overlayIn", 0.12);
      tl.addLabel("panStart", 0.2);
      tl.addLabel("overlayOut", 0.68); 
      tl.addLabel("panEnd", 0.75);
      tl.addLabel("zoomOut", 0.85);

      // Phase 1: 20% - Zoom in on suitcase
      tl.to(scaleLayer, { scale: 1, duration: 0.2, ease: "power1.inOut" }, 0);
      tl.to(
        panLayer,
        { y: () => getMetrics().startY, duration: 0.2, ease: "power1.inOut" },
        "zoom",
      );

      // Phase 2: 12% - Fade in text overlay
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

      // Phase 5: 20% - Zoom out back to original
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
              style={{
                width: "1500px",
                height: "auto",
                maxHeight: "350vh",
                objectFit: "contain",
              }}
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>
        </div>

        {/* Text Overlay - Sponsors Content */}
        <div
          ref={textOverlayRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
        </div>
      </div>
    </section>
  );
}
