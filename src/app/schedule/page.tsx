import { getSchedule } from "@/lib/schedule";
import { format } from "date-fns"; // Run 'npm install date-fns'

export default async function Schedule() {
  const events = await getSchedule();

  // Grouping events by date 
  const groupedEvents = events.reduce((groups, event) => {
    const date = format(new Date(event.startTime), "EEEE, MMMM do");
    if (!groups[date]) groups[date] = [];
    groups[date].push(event);
    return groups;
  }, {} as Record<string, typeof events>);

  return (
    <div id="schedule" className="section w-full min-h-screen relative bg-slate-900 py-20">
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 className="text-4xl font-bold mb-10 text-center">RevolutionUC Schedule</h1>
        
        {events.length === 0 ? (
          <div className="text-center text-xl text-slate-400">Coming soon</div>
        ) : (
          Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <div key={date} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-2">{date}</h2>
              <div className="space-y-4">
                {dayEvents.map((event) => (
                  <div key={event.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="w-24 flex-shrink-0 font-mono text-cyan-400">
                      {format(new Date(event.startTime), "p")}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-300">
                          {event.type}
                        </span>
                        {event.location && <span className="text-xs text-slate-400">@ {event.location}</span>}
                      </div>
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      {event.description && <p className="text-sm text-slate-400 mt-1">{event.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}