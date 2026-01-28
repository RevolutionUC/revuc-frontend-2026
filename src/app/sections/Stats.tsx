import Image from "next/image";

export default function Stats() {
  return (
    <section id="stats" className="section relative w-full overflow-hidden">
      <div className="relative w-full h-[1250px] sm:h-[1320px] md:h-[1400px]">
        {/* LEFT – 24 hours */}
        <div className="absolute left-[-20%] sm:left-[-18%] top-[4%] z-20">
          <Image
            src="/24_hours_grain.webp"
            alt="24 hours"
            width={2200}
            height={1300}
            className="h-auto w-[clamp(720px,68vw,1120px)]"
            priority={false}
          />
        </div>

        {/* RIGHT – 60+ */}
        <div className="absolute right-[-12%] sm:right-[-10%] top-[26%] z-30">
          <Image
            src="/60+_grain.webp"
            alt="60+ projects"
            width={2100}
            height={1200}
            className="h-auto w-[clamp(600px,58vw,1040px)]"
          />
        </div>

        {/* LEFT – 870+ */}
        <div className="absolute left-[-18%] sm:left-[-16%] top-[30%] z-20">
          <Image
            src="/870+_grain.webp"
            alt="870+ registrants"
            width={2800}
            height={1800}
            className="h-auto w-[clamp(920px,82vw,1500px)]"
          />
        </div>

        {/* RIGHT – 300+ */}
        <div className="absolute right-[-10%] sm:right-[-8%] top-[56%] z-20">
          <Image
            src="/300+_grain.webp"
            alt="300+ participants"
            width={2100}
            height={1200}
            className="h-auto w-[clamp(600px,56vw,1020px)]"
          />
        </div>
      </div>
    </section>
  );
}
