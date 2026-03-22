import Image from "next/image";

type TeamMember = {
  name: string;
  title: string;
  image: string;
};

const leads: TeamMember[] = [
  { name: "Lead Member 01", title: "Executive Director", image: "/team-placeholder.svg" },
  { name: "Lead Member 02", title: "Operations Lead", image: "/team-placeholder.svg" },
  { name: "Lead Member 03", title: "Sponsorship Lead", image: "/team-placeholder.svg" },
  { name: "Lead Member 04", title: "Marketing Lead", image: "/team-placeholder.svg" },
  { name: "Lead Member 05", title: "Design Lead", image: "/team-placeholder.svg" },
  { name: "Lead Member 06", title: "Engineering Lead", image: "/team-placeholder.svg" },
];

const organizers: TeamMember[] = [
  { name: "Organizer 01", title: "Logistics Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 02", title: "Logistics Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 03", title: "Partnerships Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 04", title: "Partnerships Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 05", title: "Marketing Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 06", title: "Marketing Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 07", title: "Design Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 08", title: "Design Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 09", title: "Tech Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 10", title: "Tech Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 11", title: "Experience Organizer", image: "/team-placeholder.svg" },
  { name: "Organizer 12", title: "Experience Organizer", image: "/team-placeholder.svg" },
];

function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <article
          key={`${member.name}-${member.title}`}
          className="group overflow-hidden border border-[#9dcfff]/70 bg-white/90 shadow-[0_10px_30px_rgba(21,20,119,0.12)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-[#edf6ff] via-[#d8ebff] to-[#c1e0ff]">
            <Image
              src={member.image}
              alt={`${member.name} portrait placeholder`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="border-t border-[#b9dbff] px-5 py-4">
            <h3 className="text-xl font-semibold text-[#151477]">{member.name}</h3>
            <p className="mt-1 text-sm font-medium tracking-wide text-[#228CF6] uppercase">
              {member.title}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/cloud_final1.webp"
          alt=""
          width={500}
          height={320}
          className="absolute -top-10 -left-28 w-[320px] opacity-60 sm:w-[460px]"
        />
        <Image
          src="/cloud_final4.webp"
          alt=""
          width={500}
          height={320}
          className="absolute top-[22%] -right-20 w-[260px] opacity-70 sm:w-[360px]"
        />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="overflow-hidden border border-[#9dcfff] bg-linear-to-r from-[#edf6ff]/95 to-[#d8ebff]/95 p-7 shadow-[0_20px_50px_rgba(21,20,119,0.15)] sm:p-10">
          <p className="font-mono text-sm tracking-[0.18em] text-[#228CF6] uppercase">[About RevolutionUC]</p>
          <h1 className="mt-3 text-4xl font-bold text-[#151477] sm:text-5xl lg:text-6xl">Built by students, for students.</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#1e3f92] sm:text-lg">
            RevolutionUC is a 24-hour in-person hackathon at the University of Cincinnati hosted by ACM@UC.
            Students from every major come together to build projects, meet teammates, attend workshops, and
            grow their technical and professional skills in one intense, fun weekend.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="border border-[#b9dbff] bg-white/70 px-4 py-3 text-[#151477]">24 Hours of Hacking</div>
            <div className="border border-[#b9dbff] bg-white/70 px-4 py-3 text-[#151477]">Workshops + Mentorship</div>
            <div className="border border-[#b9dbff] bg-white/70 px-4 py-3 text-[#151477]">Community + Career Growth</div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 w-full max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h2 className="text-3xl font-bold text-[#151477] sm:text-4xl">Leads</h2>
          <p className="font-mono text-sm text-[#228CF6]">{leads.length} members</p>
        </div>
        <TeamGrid members={leads} />
      </section>

      <section className="relative z-10 mx-auto mt-14 w-full max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h2 className="text-3xl font-bold text-[#151477] sm:text-4xl">Organizers</h2>
          <p className="font-mono text-sm text-[#228CF6]">{organizers.length} members</p>
        </div>
        <TeamGrid members={organizers} />
      </section>
    </main>
  );
}
