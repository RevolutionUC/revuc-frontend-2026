import { Suspense } from "react";
import ScheduleSection from "@/app/sections/Schedule";

export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return (
    <div className="min-h-screen pt-16">
      <Suspense fallback={<div className="section relative w-full overflow-hidden pt-[160px] pb-[200px] flex items-center justify-center"><p className="text-[#151477]">Loading schedule...</p></div>}>
        <ScheduleSection />
      </Suspense>
    </div>
  );
}
