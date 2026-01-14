"use client";

import SplitText from "@/app/effects/SplitText";
import Image from "next/image";

export default function About() {
  return (
    <div id="about" className="section w-full h-screen relative overflow-hidden">
      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[23%] bg-linear-to-b from-bg-[#EDF6FF] to-bg-[#] opacity-40"
        style={{
          clipPath: "ellipse(100% 100% at 50% 100%)",
        }}
      />

      {/* Plane */}
      <div className="absolute left-[5%] top-[40%] w-[500px] md:w-[600px] lg:w-[750px] z-10">
        <Image
          src="/landing-plane.webp"
          alt="Landing Plane"
          width={700}
          height={300}
          className="w-full h-auto"
        />
      </div>

      {/* Panda */}
      <div className="absolute right-[5%] bottom-[3%] w-[400px] md:w-[450px] lg:w-[600px] z-10">
        <Image
          src="/waving-panda.webp"
          alt="Waving Panda"
          width={600}
          height={800}
          className="w-full h-auto"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-start justify-end pt-[10%] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mr-[10%]">
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
