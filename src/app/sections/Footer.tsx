import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const webTeamMembers = [
    {
      name: "Aniruddhan Ramesh",
      url: "https://www.linkedin.com/in/aniruddhanramesh/",
    },
    {
      name: "Tam Le",
      url: "https://www.linkedin.com/in/tamle06/",
    },
    {
      name: "Samarth Edlabadkar",
      url: "https://www.linkedin.com/in/samarth-edlabadkar/",
    },
    {
      name: "Winnie Duong",
      url: "https://www.linkedin.com/in/uyen-duong-62910028b/",
    },
  ];

  return (
    <footer className="bg-linear-to-r from-[#228CF6] from-1% to-[#151477] to-40% text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
          <div className="text-xs sm:text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} RevolutionUC
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span>Made by</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="text-white hover:cursor-pointer"
              >
                <a
                  href="https://amaandoes.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  Amaan
                </a>
              </Badge>
              <span className="hidden text-white/70 md:inline">//</span>
              <Badge
                variant="outline"
                className="text-white hover:cursor-pointer"
              >
                <a
                  href="https://karthik-rachamolla.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  Karthik
                </a>
              </Badge>
              <span className="hidden text-white/70 md:inline">//</span>

              {/* Mobile-friendly: tap to expand */}
              <details className="group md:hidden">
                <summary className="list-none">
                  <Badge
                    variant="outline"
                    className="inline-flex items-center text-white hover:cursor-pointer"
                  >
                    the Web Team{"<3"}
                  </Badge>
                </summary>
                <div className="mt-3 w-[min(22rem,calc(100vw-2rem))] max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-white/15 bg-[#0c1b4a]/95 p-4 text-xs text-white shadow-lg backdrop-blur-sm">
                  <div className="block text-[11px] uppercase tracking-[0.2em] text-white/70">
                    Web Team
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                    {webTeamMembers.map((member) => (
                      <a
                        key={member.name}
                        href={member.url}
                        className="truncate text-white/90 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {member.name}
                      </a>
                    ))}
                  </div>
                </div>
              </details>

              {/* Desktop: hover/focus tooltip */}
              <span className="group relative hidden items-center md:inline-flex">
                <Badge
                  variant="outline"
                  className="inline-flex items-center text-white hover:cursor-pointer"
                >
                  the Web Team{"<3"}
                </Badge>
                <span className="invisible pointer-events-none absolute bottom-full right-0 z-10 w-[min(22rem,calc(100vw-2rem))] translate-y-2 overflow-hidden rounded-xl border border-white/15 bg-[#0c1b4a]/95 p-4 text-xs text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <span className="absolute bottom-0 right-6 h-2 w-2 translate-y-1/2 rotate-45 border-b border-r border-white/20 bg-[#0c1b4a]/95" />
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-white/70">
                    Web Team
                  </span>
                  <span className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {webTeamMembers.map((member) => (
                      <a
                        key={member.name}
                        href={member.url}
                        className="truncate text-white/90 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {member.name}
                      </a>
                    ))}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
