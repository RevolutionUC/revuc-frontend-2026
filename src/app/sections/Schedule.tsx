import type { ScheduleItem } from "@/app/schedule/types";
import { createClient } from "@/../utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

const scheduleAccent = "#151477";
const scheduleMuted = "#228CF6";
const schedulePanelBorder = "#B7D9FF";
const scheduleRow = "#F7FBFF";
const SCHEDULE_TIME_ZONE = "America/New_York";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: SCHEDULE_TIME_ZONE,
});

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  timeZone: SCHEDULE_TIME_ZONE,
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  timeZone: SCHEDULE_TIME_ZONE,
});

type TimeRangeDisplay = {
  time: string;
  startDate: string | null;
  endDate: string | null;
};

const isSameDay = (date1: Date, date2: Date) => {
  const d1 = shortDateFormatter.format(date1);
  const d2 = shortDateFormatter.format(date2);
  return d1 === d2;
};

const formatTime = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return timeFormatter.format(parsed);
};

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatTimeRange = (item: ScheduleItem) => {
  const startParsed = parseDate(item.start_time);
  const endParsed = parseDate(item.end_time);
  const start = formatTime(item.start_time);
  const end = formatTime(item.end_time);

  if (!start && !end) {
    return { time: "Time TBA", startDate: null, endDate: null } satisfies TimeRangeDisplay;
  }

  if (!start || !end) {
    return { time: start || end, startDate: null, endDate: null } satisfies TimeRangeDisplay;
  }

  const isMultiDay = !!(startParsed && endParsed && !isSameDay(startParsed, endParsed));
  if (!isMultiDay) {
    return { time: `${start} - ${end}`, startDate: null, endDate: null } satisfies TimeRangeDisplay;
  }

  return {
    time: `${start} - ${end}`,
    startDate: shortDateFormatter.format(startParsed),
    endDate: shortDateFormatter.format(endParsed),
  } satisfies TimeRangeDisplay;
};

const formatDayLabel = (value?: string | null) => {
  if (!value) {
    return "Schedule";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return dayFormatter.format(parsed);
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

const isShuttleItem = (item: ScheduleItem) => {
  const label = item.name?.trim().toUpperCase() ?? "";
  return label.startsWith("SHUTTLE:");
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
  const mainScheduleItems = sorted.filter((item) => !isShuttleItem(item));
  const shuttleScheduleItems = sorted.filter(isShuttleItem);
  const groupedMain = groupByDay(mainScheduleItems);
  const groupedShuttles = groupByDay(shuttleScheduleItems);
  const hasMainSchedule = mainScheduleItems.length > 0 && !error;
  const hasShuttleSchedule = shuttleScheduleItems.length > 0 && !error;

  const renderGroupedItems = (groups: Map<string, ScheduleItem[]>, keyPrefix = "") => {
    return Array.from(groups.entries()).map(([dayLabel, items]) => (
      <div
        key={`${keyPrefix}${dayLabel}`}
        className="overflow-hidden border"
        style={{ borderColor: schedulePanelBorder }}
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4" style={{ backgroundColor: scheduleAccent }}>
          <p className="text-base font-semibold sm:text-lg" style={{ color: "white" }}>
            {dayLabel}
          </p>
        </div>
        <div className="divide-y divide-[#B7D9FF]" style={{ backgroundColor: scheduleRow }}>
          {items.map((item) => {
            const timeRange = formatTimeRange(item);

            return (
              <div
                key={`${keyPrefix}${item.id}`}
                className="grid grid-cols-[152px_1fr] items-stretch gap-10 px-4 py-3 sm:grid-cols-[170px_1fr] sm:px-6 md:grid-cols-[190px_1fr]"
              >
                <div
                  className="flex flex-col items-start border-r border-[#B7D9FF] pr-4 text-sm font-semibold sm:pr-5 sm:text-base"
                  style={{ color: scheduleAccent }}
                >
                  <span>{timeRange.time}</span>
                  {timeRange.startDate ? (
                    <span style={{ color: scheduleMuted, fontSize: "0.7em", marginTop: "2px" }}>
                      {timeRange.startDate}
                      {timeRange.endDate ? ` - ${timeRange.endDate}` : ""}
                    </span>
                  ) : null}
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
            );
          })}
        </div>
      </div>
    ));
  };

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
            All workshops, meals, and shuttle schedules.
          </p>
        </div>

        <div
          className=""
        >
          {!hasMainSchedule ? (
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
            <div className="space-y-6 sm:space-y-8">{renderGroupedItems(groupedMain)}</div>
          )}

          {hasShuttleSchedule ? (
            <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#228CF6] sm:text-sm">
                Shuttle Schedule
              </p>
              <div className="space-y-6 sm:space-y-8">{renderGroupedItems(groupedShuttles, "shuttle-")}</div>
            </div>
          ) : null}
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
