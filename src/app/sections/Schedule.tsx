import type { ScheduleItem } from "@/app/schedule/types";
import { createClient } from "@/../utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

const scheduleAccent = "#151477";
const scheduleMuted = "#228CF6";
const schedulePanel = "#EDF6FF";
const schedulePanelBorder = "#B7D9FF";
const scheduleRow = "#F7FBFF";
const scheduleHeader = "#D9ECFF";

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
    <section id="schedule" className="section relative w-full overflow-hidden pt-[150px] pb-[100px]">
      <div className="absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <p className="text-sm uppercase tracking-[0.35em] text-[#228CF6]">Weekend itinerary</p>
          <h2 className="mt-4 text-4xl font-semibold text-[#151477] sm:text-5xl md:text-6xl">
            Schedule
          </h2>
          <p className="mt-3 max-w-2xl text-base text-[#151477]/80 sm:text-lg">
            All workshops, meals, and milestone moments in one place.
          </p>
        </div>

        <div className="">
          {!hasSchedule ? (
            <div
              className="rounded-[28px] border px-6 py-10 text-center"
              style={{
                borderColor: schedulePanelBorder,
                backgroundColor: scheduleRow,
              }}
            >
              <p className="text-lg font-semibold text-[#151477]">Schedule coming soon</p>
              <p className="mt-2 text-sm text-[#228CF6]">
                Check back closer to the event for the full timeline.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Array.from(grouped.entries()).map(([dayLabel, items]) => (
                <div
                  key={dayLabel}
                  className="overflow-hidden rounded-[28px] border"
                  style={{ borderColor: schedulePanelBorder }}
                >
                  <div className="px-6 py-4" style={{ backgroundColor: scheduleAccent }}>
                    <p className="text-lg font-semibold" style={{ color: "white" }}>
                      {dayLabel}
                    </p>
                  </div>
                  <div className="divide-y divide-[#B7D9FF]" style={{ backgroundColor: scheduleRow }}>
                    {items.map((item) => (
                        <div
                          key={`${item.id}`}
                          className="grid gap-2 px-6 py-3 sm:grid-cols-[160px_1fr] sm:items-stretch"
                        >
                          <div
                            className="border-b border-[#B7D9FF] pb-2 text-sm font-semibold sm:flex sm:items-start sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4 sm:text-base"
                            style={{ color: scheduleAccent }}
                          >
                            {formatTimeRange(item)}
                          </div>
                        <div>
                          <p className="text-base font-semibold" style={{ color: scheduleAccent }}>
                            {item.name || "TBA"}
                          </p>
                            {item.location ? (
                              <p className="mt-1 text-xs uppercase tracking-[0.2em]" style={{ color: scheduleMuted }}>
                                {item.location}
                              </p>
                            ) : null}
                          {typeof item.capacity === "number" ? (
                            <p className="mt-1 text-xs" style={{ color: scheduleMuted }}>
                              Capacity: {item.capacity}
                            </p>
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

        {error ? (
          <p className="mt-4 text-xs text-[#151477]/70">
            Schedule data is currently unavailable. Please refresh later.
          </p>
        ) : null}
      </div>
    </section>
  );
}
