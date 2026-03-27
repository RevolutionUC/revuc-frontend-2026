"use client";

import Image from "next/image";

// Sponsor data
const sponsors = [
  { name: "1819", src: "/sponsor logo/1819.png" },
  { name: "Fifth Third", src: "/sponsor logo/Fifth_Third.png" },
  {
    name: "Cincinnati Financial",
    src: "/sponsor logo/Cincinnati_Financial.png",
  },
  { name: "Medpace", src: "/sponsor logo/Medpace.png" },
  { name: "Kinetic Vision", src: "/sponsor logo/Kinetic_Vision.png" },
  { name: "Featherless AI", src: "/sponsor logo/featherlessai.png" },
  { name: "IEEE", src: "/sponsor logo/IEEE.png" },
  { name: "Kloob", src: "/sponsor logo/Kloob.png" },
  { name: "ACM", src: "/sponsor logo/ACM.png" },
  { name: "MLH", src: "/sponsor logo/MLH.png" },
];

export default function Sponsors() {
  return (
    <section id="sponsors" className="relative w-full">
      <div className="hidden md:flex relative w-full min-h-screen items-center justify-center overflow-hidden py-12 pointer-events-none">
        <Image
          className="opacity-90 select-none w-full max-w-[620px] lg:max-w-[900px] xl:max-w-[1100px] 2xl:max-w-[1300px] h-auto"
          src="/final_sponsors.webp"
          width={1920}
          height={3666}
          alt="Suitcase"
          quality={75}
          priority
          unoptimized
          style={{
            height: "auto",
            maxHeight: "300vh",
            objectFit: "contain",
          }}
          sizes="(min-width: 1536px) 1300px, (min-width: 1280px) 1100px, (min-width: 1024px) 900px, 620px"
        />
      </div>

      {/* Shown on mobile, hidden on md and up (md:hidden) */}
      <div className="block md:hidden relative w-full min-h-screen py-24 px-6 overflow-hidden flex flex-col items-center">
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-8 text-center">
          <h2 className="text-4xl font-bold text-white drop-shadow-md">
            Sponsors
          </h2>

          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="w-full h-28 px-8 bg-white rounded-2xl shadow-lg flex items-center justify-center"
            >
              <Image
                src={sponsor.src}
                alt={sponsor.name}
                width={300}
                height={120}
                style={{
                  width: "auto",
                  height: "100%",
                  maxHeight: "80px",
                  objectFit: "contain",
                }}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
