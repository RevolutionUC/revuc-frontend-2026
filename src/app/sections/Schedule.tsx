import type { ScheduleItem } from "@/app/schedule/types";
import { createClient } from "@/../utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

const scheduleAccent = "#151477";
const scheduleMuted = "#3056B7";

const formatTime = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
};

const formatTimeRange = (item: ScheduleItem) => {
  const start = formatTime(item.start_time);
  const end = formatTime(item.end_time);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || "Time TBA";
};

const formatDayLabel = (value?: string | null) => {
  if (!value) {
    return "Schedule";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(parsed);
};

const toTimestamp = (value?: string | null) => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return parsed.getTime();
};

const sortSchedule = (items: ScheduleItem[]) => {
  return [...items].sort((a, b) => {
    const timeA = toTimestamp(a.start_time);
    const timeB = toTimestamp(b.start_time);

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    return a.name.localeCompare(b.name);
  });
};

const groupByDay = (items: ScheduleItem[]) => {
  const grouped = new Map<string, ScheduleItem[]>();

  items.forEach((item) => {
    const dayLabel = formatDayLabel(item.start_time);
    if (!grouped.has(dayLabel)) {
      grouped.set(dayLabel, []);
    }
    grouped.get(dayLabel)?.push(item);
  });

  return grouped;
};

const fetchSchedule = async () => {
  noStore();
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("day_of_schedule")
    .select("*")
    .eq("visibility", "public");

  if (error) {
    console.error("Schedule fetch error:", error);
  }

  console.log("Schedule data fetched:", data?.length ?? 0, "public items");

  return {
    data: (data ?? []) as ScheduleItem[],
    error,
  };
};

export default async function ScheduleSection() {
  const { data, error } = await fetchSchedule();
  const sorted = sortSchedule(data);
  const grouped = groupByDay(sorted);
  const hasSchedule = sorted.length > 0 && !error;

  return (
    <section id="schedule" className="section relative w-full overflow-hidden pt-[160px] pb-[200px]">
      <div className="absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <p className="text-sm uppercase tracking-[0.35em] text-white/80">Weekend itinerary</p>
          <h2 className="mt-4 text-4xl font-semibold text-[#151477] sm:text-5xl md:text-6xl">
            Schedule
          </h2>
          <p className="mt-3 max-w-2xl text-base text-[#3056B7] sm:text-lg">
            All workshops, meals, and milestone moments in one place.
          </p>
        </div>

        <div className="rounded-[36px] border border-white/70 bg-[#C5E6FF]/90 shadow-[0_32px_80px_rgba(21,20,119,0.25)]">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {!hasSchedule ? (
              <div className="rounded-[28px] border border-white/70 bg-white/60 px-6 py-10 text-center">
                <p className="text-lg font-semibold text-[#151477]">Schedule coming soon</p>
                <p className="mt-2 text-sm text-[#3056B7]">
                  Check back closer to the event for the full timeline.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Array.from(grouped.entries()).map(([dayLabel, items]) => (
                  <div key={dayLabel} className="overflow-hidden rounded-[28px] border border-white/70">
                    <div className="bg-[#B9DEFF] px-6 py-4">
                      <p className="text-lg font-semibold" style={{ color: scheduleAccent }}>
                        {dayLabel}
                      </p>
                    </div>
                    <div className="divide-y divide-white/70 bg-white/50">
                      {items.map((item) => (
                        <div
                          key={`${item.id}`}
                          className="grid gap-4 px-6 py-5 sm:grid-cols-[160px_1fr] sm:items-start"
                        >
                          <div className="text-sm font-semibold sm:text-base" style={{ color: scheduleAccent }}>
                            {formatTimeRange(item)}
                          </div>
                          <div>
                            <p className="text-base font-semibold" style={{ color: scheduleAccent }}>
                              {item.name || "TBA"}
                            </p>
                            {item.location ? (
                              <p className="mt-2 text-xs uppercase tracking-[0.2em]" style={{ color: scheduleMuted }}>
                                {item.location}
                              </p>
                            ) : null}
                            {typeof item.capacity === "number" ? (
                              <p className="mt-1 text-xs text-[#3056B7]">Capacity: {item.capacity}</p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-xs text-white/70">
            Schedule data is currently unavailable. Please refresh later.
          </p>
        ) : null}
      </div>
    </section>
  );
}