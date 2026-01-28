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
      gsap.to(planeRef.current, {
        x: -300,
        y: -200,
        scale: 1.3,
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
        className="absolute top-[40%] right-[-10%] w-200 h-72"
      >
        <Image
          src="/plane.webp"
          alt=""
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
