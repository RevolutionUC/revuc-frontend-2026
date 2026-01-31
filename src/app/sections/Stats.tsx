import Image from "next/image";

export default function Stats() {
  return (
    <section id="stats" className="section relative w-full overflow-hidden">
      <div className="relative w-full h-auto sm:h-[1250px] md:h-[1400px]">
        {/* MOBILE – rearranged: 24 left, 60 right, 870 left, 300 right */}
        <div className="sm:hidden flex flex-col items-center gap-0 py-0 relative">
          <div className="w-full px-0 max-w-xl z-10 -mb-16 transform -translate-x-38">
            <Image
              src="/24_hours_grain.webp"
              alt="24 hours"
              width={820}
              height={492}
              className="w-full h-auto"
              priority={false}
              sizes="(max-width: 640px) 100vw, 820px"
            />
          </div>

          <div className="w-full px-0 max-w-xl -mt-60 transform translate-x-28 z-40">
            <Image
              src="/60+_grain.webp"
              alt="60+ projects"
              width={880}
              height={528}
              className="w-full h-auto"
              sizes="(max-width: 640px) 100vw, 880px"
            />
          </div>

          <div className="w-full px-0 max-w-[1200px] -mt-85 transform -translate-x-32 z-30">
            <Image
              src="/870+_grain.webp"
              alt="870+ registrants"
              width={1200}
              height={800}
              className="w-full h-auto scale-105"
              sizes="(max-width: 640px) 100vw, 1200px"
            />
          </div>

          <div className="w-full px-0 max-w-xl -mt-85 transform translate-x-24 z-40">
            <Image
              src="/300+_grain.webp"
              alt="300+ participants"
              width={880}
              height={528}
              className="w-full h-auto"
              sizes="(max-width: 640px) 100vw, 880px"
            />
          </div>
        </div>

        {/* DESKTOP / TABLET – overlays (hidden on xs) */}
        <div className="hidden sm:block">
          {/* LEFT – 24 hours */}
          <div className="absolute left-[-6%] sm:left-[-18%] top-[4%] z-20">
            <Image
              src="/24_hours_grain.webp"
              alt="24 hours"
              width={2200}
              height={1300}
              className="h-auto w-[clamp(280px,68vw,1120px)]"
              priority={false}
            />
          </div>

          {/* RIGHT – 60+ */}
          <div className="absolute right-[-4%] sm:right-[-10%] top-[20%] z-30">
            <Image
              src="/60+_grain.webp"
              alt="60+ projects"
              width={2100}
              height={1200}
              className="h-auto w-[clamp(260px,58vw,1040px)]"
            />
          </div>

          {/* LEFT – 870+ */}
          <div className="absolute left-[-6%] sm:left-[-16%] top-[25%] z-20">
            <Image
              src="/870+_grain.webp"
              alt="870+ registrants"
              width={2800}
              height={1800}
              className="h-auto w-[clamp(320px,82vw,1500px)]"
            />
          </div>

          {/* RIGHT – 300+ */}
          <div className="absolute right-[-4%] sm:right-[-8%] top-[46%] z-20">
            <Image
              src="/300+_grain.webp"
              alt="300+ participants"
              width={2100}
              height={1200}
              className="h-auto w-[clamp(260px,56vw,1020px)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
