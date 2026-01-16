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
        <Image
          className="absolute top-[10%] right-[-10%] h-64 opacity-70"
          src="/cloud_final1.webp"
          width={500}
          height={256}
          alt=""
          loading="lazy"
          data-speed="0.8"
        />
        <Image
          className="absolute top-[0%] left-[-2%] h-72 opacity-60"
          src="/cloud_final3.webp"
          width={500}
          height={288}
          alt=""
          loading="lazy"
          data-speed="0.5"
        />
        <Image
          className="absolute top-[60%] right-[-8%] h-56 opacity-75"
          src="/cloud_final2.webp"
          width={500}
          height={224}
          alt=""
          loading="lazy"
          data-speed="1.2"
        />
        <Image
          className="absolute top-[20%] left-[-5%] h-60 opacity-65"
          src="/cloud_final4.webp"
          width={500}
          height={500}
          alt=""
          loading="lazy"
          data-speed="0.6"
        />
        <Image
          className="absolute top-[75%] left-[-3%] h-52 opacity-70"
          src="/cloud_final5.webp"
          width={500}
          height={500}
          alt=""
          loading="lazy"
          data-speed="0.9"
        />
      </div>

      <div className="w-full max-w-6xl mx-auto relative z-10 pointer-events-none">
        <div className="max-w-2xl">
          <h1 className="underline  text-[#151477] underline-offset-4 decoration-[#19E363] text-8xl font-semibold">
            Revolution UC
          </h1>
          <p className="py-6 text-3xl text-[#228CF6]">Build. Learn. Grow.</p>
        </div>
      </div>
    </div>
  );
}
