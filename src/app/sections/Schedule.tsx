// import SplitText from "@/app/effects/SplitText";
import Image from "next/image";
export default function Schedule() {
  return (
    <div id="schedule" className="section w-full h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center pt-[10%] px-4 sm:px-6 lg:px-8">
        <div className="font-mono text-4xl flex flex-col items-center">
          This section is under construction.
          <br />
          <span className="underline underline-offset-4 font-semibold decoration-[#19E363] ">
            Mr. Panda is very busy right now!
          </span>
          <Image
            src="/panda_construction.webp"
            alt="Panda under construction"
            width={400}
            height={400}
            style={{ height: "auto" }}
            className="hover:scale-105 hover:rotate-12 transition-all hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
