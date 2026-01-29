"use client";

import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import gsap from "gsap";
import Image from "next/image";
import AnimatedPlane from "../components/AnimatedPlane";

gsap.registerPlugin(ScrollToPlugin);

export default function HeroSection() {
  return (
    <div
      id="hero"
      className="section w-full h-screen flex items-center px-4 sm:px-6 lg:px-8 relative z-50"
    >
      {/* Plane */}
      <AnimatedPlane />

      {/* Clouds */}
      <div className="absolute inset-0 overflow-y-visible pointer-events-none">
        <div
          className="absolute top-[-5%] right-[80%] w-[200px] sm:w-[350px] lg:w-[500px] h-32 sm:h-48 lg:h-64 opacity-70"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final1.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute top-[10%] left-[8%] w-[100px] sm:w-[150px] lg:w-[200px] h-36 sm:h-56 lg:h-72 opacity-60"
          data-speed="0.8"
        >
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute top-[-10%] left-[25%] w-[80px] sm:w-[120px] lg:w-[150px] h-36 sm:h-56 lg:h-72 opacity-60 scale-x-[-1]"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute top-[-2%] left-[60%] w-[100px] sm:w-[150px] lg:w-[200px] h-36 sm:h-56 lg:h-72 opacity-60"
          data-speed="0.95"
        >
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute top-[7%] left-[70%] w-[120px] sm:w-[180px] lg:w-[250px] h-36 sm:h-56 lg:h-72 opacity-50"
          data-speed="0.95"
        >
          <Image
            src="/cloud_final2.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute bottom-[-25%] left-[5%] w-[300px] sm:w-[500px] lg:w-[800px] h-40 sm:h-60 lg:h-90 opacity-100"
          data-speed="0.8"
        >
          <Image
            src="/cloud_final1.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute bottom-[-20%] left-[-25%] w-[350px] sm:w-[600px] lg:w-[900px] h-40 sm:h-60 lg:h-82 opacity-100"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final2.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute bottom-[0%] left-[-35%] w-[350px] sm:w-[600px] lg:w-[900px] h-40 sm:h-60 lg:h-82 opacity-100"
          data-speed="0.95"
        >
          <Image
            src="/cloud_final4.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute bottom-[-3%] left-[15%] w-[150px] sm:w-[220px] lg:w-[300px] h-40 sm:h-60 lg:h-90 opacity-60"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final1.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute bottom-[-4%] right-[5%] w-[250px] sm:w-[380px] lg:w-[550px] h-40 sm:h-60 lg:h-90 opacity-60"
          data-speed="0.8"
        >
          <Image
            src="/cloud_final2.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute bottom-[-15%] right-[-25%] w-[350px] sm:w-[600px] lg:w-[900px] h-40 sm:h-60 lg:h-90 opacity-100"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final4.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl mx-auto relative pointer-events-none pt-12 sm:pt-20 lg:pt-25 z-40">
        <div className="max-w-2xl">
          <h1 className="underline text-[#151477] underline-offset-4 decoration-[#19E363] text-4xl sm:text-6xl lg:text-8xl font-semibold">
            Revolution UC
          </h1>
          <p className="py-2 sm:py-3 text-xl sm:text-2xl lg:text-3xl text-[#151477] font-medium italic">
            March 28 - 29, 2026
          </p>
          <p className="py-1 sm:py-2 text-xl sm:text-2xl lg:text-3xl text-[#228CF6]">Build. Learn. Grow.</p>
        </div>
      </div>
    </div>
  );
}
