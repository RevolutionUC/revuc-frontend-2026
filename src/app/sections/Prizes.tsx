import SplitText from "@/app/effects/SplitText";
import Image from "next/image";

const prizeData = [
  { title: "Prize Track 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { title: "Prize Track 2", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { title: "Prize Track 3", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { title: "Prize Track 4", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { title: "Prize Track 5", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { title: "Prize Track 6", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];

export default function Prizes() {
  return (
    <div id="prizes" className="section w-full min-h-screen relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <Image
        src="/white-shirt.webp"
        alt=""
        width={500}
        height={500}
        className="absolute top-[10%] right-[0%] rotate-20"
        aria-hidden="true"
        data-speed="0.9"
      />
      <Image
        src="/sock.webp"
        alt=""
        width={500}
        height={500}
        className="absolute top-[6%] right-[-8%] scale-x-[-1]"
        aria-hidden="true"
        data-speed="1.1"
      />
      <Image
        src="/sock.webp"
        alt=""
        width={500}
        height={500}
        className="absolute top-[15%] right-[-12%] scale-x-[-1]"
        aria-hidden="true"
        data-speed="1.1"
      />
      <Image
        src="/pants.webp"
        alt=""
        width={500}
        height={500}
        className="absolute bottom-[5%] left-[0%] rotate-10"
        aria-hidden="true"
        data-speed="0.8"
      />

      <Image
        src="/shirt.webp"
        alt=""
        width={500}
        height={500}
        className="absolute bottom-[-5%] left-[-8%] rotate-[-15deg]"
        aria-hidden="true"
        data-speed="0.75"
      />

       <Image
        src="/fixed_boarding_pass.webp"
        alt=""
        width={300}
        height={300}
        className="absolute bottom-[-4%] right-[10%] rotate-[-15deg]"
        aria-hidden="true"
        data-speed="0.8"
      />

       <Image
        src="/fixed_boarding_pass.webp"
        alt=""
        width={300}
        height={300}
        className="absolute bottom-[0%] right-[9%] rotate-[-7deg]"
        aria-hidden="true"
        data-speed="0.8"
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto">
        <div className="mt-16 mb-16 overflow-visible">
          <SplitText
            text="Prizes"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight overflow-visible"
            delay={50}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>

        {/* Prize cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prizeData.map((prize, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <h3 className="text-2xl font-bold text-[#003D7A] mb-3 relative inline-block">
                {prize.title}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#00D68F] transition-all duration-300 group-hover:w-full" />
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {prize.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
