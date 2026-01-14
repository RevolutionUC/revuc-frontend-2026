import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function Faq() {
  return (
    <div id="faq" className="section w-full h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-20 flex h-full w-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl bg-gradient-to-b from-[#228CF6] to-[#1656C1] px-4 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <p className="text-left text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </p>

          <div className="mt-6 overflow-hidden border border-white/15 bg-white/5">
            <Accordion type="single" collapsible>
              <AccordionItem value="who-can-attend" className="border-white/10 bg-[#151477]">
                <AccordionTrigger className="px-4 py-3 text-base font-medium text-white sm:px-6 sm:text-lg">
                  <span className="flex-1 text-left">Who can attend the hackathon?</span>
                </AccordionTrigger>
                <AccordionContent className="bg-[#228CF6] px-4 py-3 text-left text-sm text-blue-50 sm:px-6 sm:text-base">
                  The event is open to all students, regardless of major or experience level.
                  Beginners are welcome!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="do-i-need-experience" className="border-white/10 bg-[#151477]">
                <AccordionTrigger className="px-4 py-3 text-base font-medium text-white sm:px-6 sm:text-lg">
                  <span className="flex-1 text-left">Do I need prior hacking experience?</span>
                </AccordionTrigger>
                <AccordionContent className="bg-[#228CF6] px-4 py-3 text-left text-sm text-blue-50 sm:px-6 sm:text-base">
                  No experience is required. We&apos;ll have mentors, workshops, and resources to
                  help you get started.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="team-size" className="border-white/10 bg-[#151477]">
                <AccordionTrigger className="px-4 py-3 text-base font-medium text-white sm:px-6 sm:text-lg">
                  <span className="flex-1 text-left">How big can teams be?</span>
                </AccordionTrigger>
                <AccordionContent className="bg-[#228CF6] px-4 py-3 text-left text-sm text-blue-50 sm:px-6 sm:text-base">
                  Teams are typically 2–4 people. You can come with a team or form one during the
                  event.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="what-should-i-bring" className="border-white/10 bg-[#151477]">
                <AccordionTrigger className="px-4 py-3 text-base font-medium text-white sm:px-6 sm:text-lg">
                  <span className="flex-1 text-left">What should I bring?</span>
                </AccordionTrigger>
                <AccordionContent className="bg-[#228CF6] px-4 py-3 text-left text-sm text-blue-50 sm:px-6 sm:text-base">
                  Bring your laptop, charger, and anything else you need to be comfortable (snacks,
                  water bottle, etc.).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cost-to-attend" className="border-white/10 bg-[#151477]">
                <AccordionTrigger className="px-4 py-3 text-base font-medium text-white sm:px-6 sm:text-lg">
                  <span className="flex-1 text-left">How much does it cost to attend?</span>
                </AccordionTrigger>
                <AccordionContent className="bg-[#228CF6] px-4 py-3 text-left text-sm text-blue-50 sm:px-6 sm:text-base">
                  The hackathon is completely free for participants. Food, swag, and workshops are
                  all provided.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      {/* Bottom color bar */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-[#151477] sm:h-6 lg:h-32">
        <p className="text-center">panda sits here</p>
      </div>
    </div>
  );
}
