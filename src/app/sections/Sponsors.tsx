"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Sponsor data
const sponsors = [
  { name: "1819", src: "/sponsor logo/1819.png" },
  { name: "Fifth Third", src: "/sponsor logo/Fifth_Third.png" },
  {
    name: "Cincinnati Financial",
    src: "/sponsor logo/Cincinnati_Financial.png",
  },
  { name: "Medpace", src: "/sponsor logo/Medpace.png" },
  { name: "Kinetic Vision", src: "/sponsor logo/Kinetic_Vision.png" },
  { name: "ACM", src: "/sponsor logo/ACM.png" },
  { name: "MLH", src: "/sponsor logo/MLH.png" },
];

export default function Sponsors() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const scaleLayerRef = useRef<HTMLDivElement>(null);
  const panLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Wrap animation in matchMedia for screens 1024px and up (laptop)
      let mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const section = sectionRef.current;
        const pin = pinWrapperRef.current;
        const scaleLayer = scaleLayerRef.current;
        const panLayer = panLayerRef.current;

        if (!section || !pin || !scaleLayer || !panLayer) return;

        const ZOOM = 2.5;
        const SCROLL_LENGTH = 3.5;
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

        const getMetrics = () => {
          const img = panLayer.querySelector("img") as HTMLImageElement | null;
          const baseH = img?.offsetHeight ?? 0;
          const vh = window.innerHeight;

          const startY = vh * 0.35;
          const endY = -vh * 0.45;

          return { vh, startY, endY };
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + window.innerHeight * SCROLL_LENGTH,
            pin: pin,
            scrub: 0.8,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        tl.addLabel("zoom", 0);
        tl.addLabel("panStart", 0.2);
        tl.addLabel("panEnd", 0.75);
        tl.addLabel("zoomOut", 0.85);

        tl.to(scaleLayer, { scale: 1, duration: 0.2, ease: "power1.inOut" }, 0);
        tl.to(
          panLayer,
          { y: () => getMetrics().startY, duration: 0.2, ease: "power1.inOut" },
          "zoom",
        );
        tl.to(
          panLayer,
          { y: () => getMetrics().endY, duration: 0.45, ease: "power1.inOut" },
          "panStart",
        );
        tl.to(
          scaleLayer,
          { scale: INITIAL_SCALE, duration: 0.2, ease: "power1.inOut" },
          "zoomOut",
        );
        tl.to(
          panLayer,
          { y: 0, duration: 0.2, ease: "power1.inOut" },
          "zoomOut",
        );
      });

      // Cleanup is handled automatically by matchMedia
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="sponsors" className="relative w-full">
      {/* Animated: hidden on mobile/tablet, shown on lg and up (lg:block) */}
      <div
        ref={pinWrapperRef}
        className="hidden lg:block relative w-full h-screen overflow-hidden"
      >
        <div
          ref={scaleLayerRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformOrigin: "50% 50%" }}
        >
          <div ref={panLayerRef} className="flex items-center justify-center">
            <Image
              className="opacity-90 select-none"
              src="/suitcase_high_rez.webp"
              width={1920}
              height={3666}
              alt="Suitcase"
              quality={75}
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
      </div>

      {/* Static Suitcase: shown on tablet, hidden on mobile and laptop */}
      <div className="hidden md:flex lg:hidden relative w-full min-h-screen items-center justify-center overflow-hidden py-12 pointer-events-none">
        <Image
          className="opacity-90 select-none"
          src="/suitcase_high_rez.webp"
          width={1920}
          height={3666}
          alt="Suitcase"
          quality={75}
          priority
          unoptimized
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "auto",
            maxHeight: "90vh",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Shown on mobile, hidden on md and up (md:hidden) */}
      <div className="block md:hidden relative w-full min-h-screen py-24 px-6 overflow-hidden flex flex-col items-center">
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-8 text-center">
          <h2 className="text-4xl font-bold text-white drop-shadow-md">
            Sponsors
          </h2>

          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="w-full h-28 px-8 bg-white rounded-2xl shadow-lg flex items-center justify-center"
            >
              <Image
                src={sponsor.src}
                alt={sponsor.name}
                width={300}
                height={120}
                style={{
                  width: "auto",
                  height: "100%",
                  maxHeight: "80px",
                  objectFit: "contain",
                }}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
