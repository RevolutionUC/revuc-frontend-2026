"use client";

import SplitText from "@/app/effects/SplitText";
import Image from "next/image";

export default function About() {
  return (
    // Changed h-screen to min-h-screen and removed overflow-hidden for mobile accessibility
    <div id="about" className="section w-full min-h-screen relative overflow-x-hidden py-20 lg:py-0 lg:h-screen">
      
      {/* Background clouds - reduced opacity and size on mobile to prevent clutter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[2vh] right-[10vw] w-[40vw] max-w-[200px] aspect-square opacity-40 lg:opacity-70 lg:right-[75vw] lg:w-[20vw]" data-speed="0.9">
          <Image src="/cloud_final4.webp" alt="" fill className="object-contain" />
        </div>
        <div className="absolute top-[15vh] left-[-10vw] w-[60vw] max-w-[400px] opacity-20 lg:opacity-30 lg:left-[5vw] lg:w-[35vw]" data-speed="0.8">
          <Image src="/cloud_final1.webp" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* Plane - Shifted higher and smaller on mobile */}
      <div className="absolute left-[-10%] top-[5%] w-[70vw] sm:w-[50vw] lg:top-[50%] lg:left-0 lg:-translate-y-1/2 lg:w-[40vw] max-w-[750px] z-10 opacity-80 lg:opacity-100">
        <Image
          src="/landing-plane.webp"
          alt="Landing Plane"
          width={700}
          height={300}
          className="w-full h-auto"
        />
      </div>

      {/* Panda - Pushed further down and smaller to avoid overlapping text */}
      <div className="absolute right-[-2vw] bottom-[18vh] w-[70vw] sm:w-[50vw] md:w-[40vw] lg:right-[5vw] lg:bottom-[18vh] lg:w-[32vw] max-w-[700px] z-10">
        <Image
          src="/waving-panda.webp"
          alt="Waving Panda"
          width={700}
          height={700}
          className="w-full h-auto object-contain"
        />
      </div>


      {/* Ground */}
      <div
        className="absolute bottom-[14vh] left-0 right-0 h-[18%] lg:bottom-[18vh] lg:h-[23%] bg-linear-to-b from-[#228cf6]/80 to-[#edf6ff] opacity-40"
        style={{ clipPath: "ellipse(100% 100% at 50% 100%)" }}
      />


      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-center lg:items-start justify-center lg:justify-end pt-[15vh] lg:pt-[10vh] px-6 lg:px-8">
        <div className="max-w-2xl lg:mr-[10vw] text-center lg:text-left bg-white/10 backdrop-blur-sm lg:bg-transparent p-6 rounded-2xl">
          <SplitText
            text="About RevolutionUC"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#151477]"
            delay={50}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center" // Responsive textAlign might require a prop update or separate CSS
          />

          <div className="mt-8 lg:mt-12">
             <SplitText
              text="RevolutionUC is a 24-hour in-person student hackathon at the University of Cincinnati organized by ACM@UC. Join 300+ motivated students for a weekend of code and community! Open to all majors and skill levels."
              className="text-base sm:text-lg font-sans text-[#151477] leading-relaxed"
              delay={30}
              duration={0.5}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}