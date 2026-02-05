import { Badge } from "@/components/ui/badge";
export default function Footer() {
  const webTeamMembers = [
    {
      name: "Aniruddhan Ramesh",
      url: "https://linkedin.com/in/placeholder-aniruddhan-ramesh",
    },
    {
      name: "Tam Le",
      url: "https://linkedin.com/in/placeholder-tam-le",
    },
    {
      name: "Samarth Edlabadkar",
      url: "https://linkedin.com/in/placeholder-samarth-edlabadkar",
    },
    {
      name: "Winnie Duong",
      url: "https://linkedin.com/in/placeholder-winnie-duong",
    },
  ];

  return (
    <footer className="bg-linear-to-r from-[#228CF6] from-1% to-[#151477] to-40% text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} RevolutionUC
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span>Made by</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="hover:cursor-pointer text-white"
              >
                <a href="https://amaandoes.tech" target="_blank">
                  Amaan
                </a>
              </Badge>
              <span className="text-white/70">//</span>
              <Badge
                variant="outline"
                className="hover:cursor-pointer text-white"
              >
                <a href="https://karthik-rachamolla.vercel.app" target="_blank">
                  Karthik
                </a>
              </Badge>
              <span className="text-white/70">//</span>
              <span className="relative inline-flex items-center">
                <Badge
                  variant="outline"
                  className="peer inline-flex items-center text-white hover:cursor-pointer"
                >
                  the Web Team{"<3"}
                </Badge>
                <span className="pointer-events-none absolute left-1/2 bottom-full z-10 mb-3 w-72 -translate-x-1/2 rounded-xl border border-white/15 bg-[#0c1b4a]/95 p-4 text-xs text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 peer-hover:pointer-events-auto peer-hover:opacity-100 peer-focus-visible:pointer-events-auto peer-focus-visible:opacity-100 hover:pointer-events-auto hover:opacity-100">
                  <span className="absolute left-1/2 bottom-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-white/20 bg-[#0c1b4a]/95" />
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-white/70">
                    Web Team
                  </span>
                  <span className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {webTeamMembers.map((member) => (
                      <a
                        key={member.name}
                        href={member.url}
                        className="pointer-events-auto truncate text-white/90 transition hover:text-white"
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
          <div className="text-sm">
            <a>twitter</a>
            <a>ig</a>
            <a>linkedin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
