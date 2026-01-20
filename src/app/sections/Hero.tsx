"use client";

import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import gsap from "gsap";
import Image from "next/image";

gsap.registerPlugin(ScrollToPlugin);

export default function HeroSection() {
  return (
    <div
      id="hero"
      className="section w-full h-screen flex items-center px-4 sm:px-6 lg:px-8 relative z-10"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-auto h-64 opacity-70" data-speed="0.8">
          <Image
            src="/cloud_final1.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
        <div className="absolute top-[0%] left-[-2%] w-auto h-72 opacity-60" data-speed="0.5">
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
        <div className="absolute top-[60%] right-[-8%] w-auto h-56 opacity-75" data-speed="1.2">
          <Image
            src="/cloud_final2.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
        <div className="absolute top-[20%] left-[-5%] w-auto h-60 opacity-65" data-speed="0.6">
          <Image
            src="/cloud_final4.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
        <div className="absolute top-[75%] left-[-3%] w-auto h-52 opacity-70" data-speed="0.9">
          <Image
            src="/cloud_final5.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10 pointer-events-none">
        <div className="max-w-2xl">
          <h1 className="underline  text-[#151477] underline-offset-4 decoration-[#19E363] text-8xl font-semibold">
            Revolution UC
          </h1>
          <p className="py-3 text-3xl text-[#151477] font-medium italic">February 21 - 22, 2026</p>
          <p className="py-2 text-3xl text-[#228CF6]">Build. Learn. Grow.</p>
        </div>
      </div>
    </div>
  );
}
