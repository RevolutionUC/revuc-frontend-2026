import SplitText from "@/app/effects/SplitText";
import Image from "next/image";

export default function Sponsors() {
  return (
    <div id="sponsors" className="section w-full h-screen relative overflow-hidden">
      {/* Content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <Image
          className="opacity-70"
          src="/sponsors-suitcase.webp"
          width={512}
          height={512}
          alt=""
          loading="lazy"
          style={{ width: "auto", height: "auto" }}
          data-speed="0.8"
        />
      </div>
      <div className="relative z-20 w-full h-full flex items-start justify-end pt-[10%] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mr-[10%]">
          <SplitText
            text="Sponsors"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
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
        </div>
      </div>
    </div>
  );
}
