"use client";

import SplitText from "@/app/effects/SplitText";
import Image from "next/image";

export default function About() {
  return (
    <div id="about" className="section w-full h-screen relative overflow-hidden">
      {/* Background clouds - using viewport units and better responsive sizing */}
      <div className="absolute inset-0 overflow-y-visible pointer-events-none">
        <div
          className="absolute top-[1vh] right-[75vw] w-[20vw] min-w-[150px] max-w-[300px] aspect-300/256 opacity-70"
          data-speed="0.9"
        >
          <Image
            src="/cloud_final4.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div
          className="absolute top-[2vh] left-[5vw] w-[35vw] min-w-[300px] max-w-[800px] aspect-700/288 opacity-30"
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
          className="absolute top-[5vh] right-[2vw] w-[10vw] min-w-[100px] max-w-[150px] aspect-150/288 opacity-60"
          data-speed="1"
        >
          <Image
            src="/cloud_final3.webp"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Plane - scale with viewport but keep constraints */}
      <div className="absolute left-0 top-[50%] -translate-y-1/2 w-[60vw] sm:w-[50vw] md:w-[45vw] lg:w-[40vw] max-w-[750px] min-w-[300px] z-10">
        <Image
          src="/landing-plane.webp"
          alt="Landing Plane"
          width={700}
          height={300}
          className="w-full h-auto"
        />
      </div>

      {/* Panda - scale with viewport */}
      <div className="absolute right-[2vw] sm:right-[5vw] bottom-[10vh] sm:bottom-[15vh] w-[50vw] sm:w-[40vw] md:w-[35vw] lg:w-[30vw] max-w-[600px] min-w-[250px] z-10">
        <Image
          src="/waving-panda.webp"
          alt="Waving Panda"
          width={512}
          height={512}
          className="w-full h-auto object-contain"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 35vw, 30vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-start justify-end pt-[10vh] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mr-[5vw] lg:mr-[10vw]">
          <SplitText
            text="About RevolutionUC"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#151477]"
            delay={50}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
          />

          <SplitText
            text="RevolutionUC is a 24-hour in-person student hackathon at the University of Cincinnati that is organized by ACM@UC. We invite you to join 300+ motivated students for an awesome weekend of code, community, and self-improvement! You don't have to have to be a computer science major or engineering student to attend. It's a learning experience for students of all skill levels!"
            className="text-base font-sans text-[#151477] sm:text-lg leading-relaxed pt-12"
            delay={30}
            duration={0.5}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
          />
        </div>
      </div>
    </div>
  );
}
