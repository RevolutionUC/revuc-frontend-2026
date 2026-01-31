import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import React from "react";

// FAQ data
const FAQS: {
  id: string;
  question: string;
  answer: React.ReactNode;
}[] = [
  {
    id: "in-person",
    question: "Is RevolutionUC 2026 in-person or virtual?",
    answer:
      "RevolutionUC 2026 is an in-person only event. Unfortunately, we won't be providing a virtual option this year.",
  },
  {
    id: "location",
    question: "Where is the hackathon?",
    answer: (
      <>
        This year we will be completely in-person at the{" "}
        <a
          href="https://innovation.uc.edu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#19E363] underline"
        >
          1819 Innovation Hub
        </a>{" "}
        of the University of Cincinnati, located at 2900 Reading Rd, Cincinnati,
        OH 45206.
      </>
    ),
  },
  {
    id: "how-long",
    question: "How long does RevolutionUC last?",
    answer:
      "Hacking at RevolutionUC lasts for 24 hours, with additional time before and after for introductions and presentations.",
  },
  {
    id: "cost",
    question: "How much does RevolutionUC cost?",
    answer:
      "The hackathon is completely free for participants. Food, swag, and workshops are all provided.",
  },
  {
    id: "who-can-attend",
    question: "Who can attend the hackathon?",
    answer:
      "The event is open to all students that are 18+, regardless of major or experience level. Beginners are welcome!",
  },
  {
    id: "under-18",
    question: "Can I attend if I'm under 18 years old?",
    answer:
      "Unfortunately, the hackathon is only open to participants who are 18 or older. If you're under 18, you won't be able to attend this year, but we hope to welcome you in future events once you meet the age requirement.",
  },
  {
    id: "experience-level",
    question: "What if I don't have much experience?",
    answer:
      "No experience is required. We'll have mentors, workshops, and resources to help you get started.",
  },
  {
    id: "teams-register",
    question: "How do teams register?",
    answer:
      "Teams are typically 2–4 people. You can come with a team or form one during the event.",
  },
  {
    id: "no-team",
    question: "What if I don't have a team?",
    answer:
      "That's okay! We will host a team formation event after the opening ceremony.",
  },
  {
    id: "what-to-bring",
    question: "What should I bring?",
    answer:
      "Bring your laptop, charger, and anything else you need to be comfortable (snacks, water bottle, etc.).",
  },
  {
    id: "travel",
    question: "Will there be travel reimbursements?",
    answer:
      "Unfortunately, we are unable to offer travel reimbursements at this time.",
  },
  {
    id: "code-of-conduct",
    question: "Is there a Code of Conduct?",
    answer: (
      <>
        Absolutely! We operate under the{" "}
        <a
          href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#19E363] underline"
        >
          Major League Hacking Code of Conduct
        </a>{" "}
        to ensure an inclusive environment.
      </>
    ),
  },
  {
    id: "schedule-when",
    question: "When will the schedule and sponsors be released?",
    answer:
      "They will released when we're nearing the event itself. You know. To build suspense?",
  },
  {
    id: "more-questions",
    question: "What if I have more questions?",
    answer: (
      <>
        Send us an email at{" "}
        <a
          href="mailto:info@revolutionuc.com"
          className="text-[#19E363] underline"
        >
          info@revolutionuc.com
        </a>
        . We're always happy to help!
      </>
    ),
  },
];

const itemClass = "border-white/10";
const triggerClass = "px-4 py-4 text-base font-medium text-white sm:px-6 sm:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#19E363]";
const contentClass = "px-4 py-4 text-left text-sm text-blue-50 sm:px-6 sm:text-base";

// Pixelated dot texture style
const pixelTextureStyle = {
  background: `radial-gradient(circle at center, rgba(80, 180, 255, 0.5) 1px, transparent 1px)`,
  backgroundSize: "10px 10px",
};

function FaqItem({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: React.ReactNode;
}) {
  return (
    <AccordionItem value={id} className={itemClass}>
      <div className="relative overflow-hidden bg-[#151477]">
        {/* Pixelated texture for question */}
        <div
          className="absolute inset-0 pointer-events-none"
          // style={pixelTextureStyle}
        />
        <AccordionTrigger className={`relative z-10 ${triggerClass}`}>
          <span className="flex-1 text-left">{question}</span>
        </AccordionTrigger>
      </div>
      <div className="relative overflow-hidden bg-[#228CF6]">
        {/* Pixelated texture for answer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={pixelTextureStyle}
        />
        <AccordionContent className={`relative z-10 ${contentClass}`}>
          {answer}
        </AccordionContent>
      </div>
    </AccordionItem>
  );
}

export default function Faq() {
  return (
    <div id="faq" className="section w-full h-auto relative overflow-visible pb-40 sm:pb-[250px]">
      <div className="relative z-20 flex h-full w-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-5xl overflow-hidden px-4 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-linear-to-b from-[#228CF6] to-[#1656C1]" />

          {/* Pixelated dot texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            // style={pixelTextureStyle}
          />

          {/* Content */}
          <div className="relative z-10">
            <p className="text-left text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Frequently asked questions
            </p>

            <div className="mt-6 overflow-hidden border border-white/15 bg-white/5">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq) => (
                  <FaqItem key={faq.id} {...faq} />
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar with panda */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] sm:h-[100px] z-10 bg-gradient-to-r from-[#228CF6] from-1% to-[#151477] to-40%">
        <div className="absolute bottom-6 sm:bottom-[-20px] right-2 sm:right-[5%] md:right-[10%] h-[120px] sm:h-[200px] md:h-[330px] w-auto pointer-events-none select-none">
          <Image
            src="/panda-bench.webp"
            alt="Panda on bench"
            width={450}
            height={350}
            className="h-full w-auto object-contain"
            sizes="(max-width: 640px) 240px, (max-width: 768px) 330px, 450px"
          />
        </div>
      </div>
    </div>
  );
}
