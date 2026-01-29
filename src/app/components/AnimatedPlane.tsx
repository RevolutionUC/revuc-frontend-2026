"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedPlane() {
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (planeRef.current) {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      
      gsap.to(planeRef.current, {
        x: isMobile ? -100 : isTablet ? -200 : -300,
        y: isMobile ? -80 : isTablet ? -140 : -200,
        scale: isMobile ? 1.6 : isTablet ? 1.5 : 1.3,
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "+=500",
          scrub: 1,
          pin: "#hero",
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-y-visible pointer-events-none z-30">
      <div
        ref={planeRef}
        className="absolute top-[40%] right-[-10%] w-50 h-32 sm:w-40 sm:h-32 md:w-70 md:h-50 lg:w-200 lg:h-72"
      >
        <Image
          src="/plane.webp"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
