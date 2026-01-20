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
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none ">
        
        <div
          className="absolute top-[-20%] left-[2%] w-[40vh] h-72 opacity-60"
          data-speed="0.5"
        >
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
        <div
          className="absolute top-[7%] right-[10%] w-[30vh] h-56 opacity-40"
          data-speed="1.2"
        >
          <Image
            src="/cloud_final2.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
        <div
          className="absolute top-[0%] left-[5%] w-[40vh] h-60 opacity-65"
          data-speed="0.6"
        >
          <Image
            src="/cloud_final4.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
        <div
          className="absolute top-[55%] left-[-3%] w-auto h-52 opacity-70"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final5.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
        <div
          className="absolute top-[70%] right-[60%] w-[40vh] h-64 opacity-70"
          data-speed="0.8"
        > 
          <Image
            src="/cloud_final1.webp"
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 500px"
            loading="lazy"
          />
        </div>
      </div> */}

      <div className="relative z-10 mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 md:grid-cols-2">
          {/* Left: text */}
          <div className="pointer-events-none mt-48">
            <h1 className="text-[#151477] underline decoration-[#19E363] underline-offset-4 font-semibold leading-[0.95] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
              Revolution UC
            </h1>
            <p className="mt-4 text-[#228CF6] text-2xl sm:text-3xl lg:text-[2.5rem]">
              Build. Learn. Grow.
            </p>
          </div>

          {/* Right: plane */}
          <div className="pointer-events-none absolute right-[-5%] top-[5%] z-10 h-[260px] sm:h-[320px] md:h-[380px] lg:h-[440px] w-[60vw] max-w-[820px]">
            <Image
              src="/plane_with_trail.webp"
              alt=""
              fill
              className="object-contain object-right"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
