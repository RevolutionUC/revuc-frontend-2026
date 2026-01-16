"use client";
import Image from "next/image";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import gsap from "gsap";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollToPlugin);

const scrollToSection = (sectionId: string) => {
  gsap.to(window, {
    scrollTo: `#${sectionId}`,
    duration: 1,
    ease: "power2.inOut",
  });
};

export function NavigationBar() {
  const isMobile = useIsMobile();
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-transparent pointer-events-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer focus:outline-none"
            aria-label="Go to top of page"
          >
            <div className="relative h-10 w-10 sm:h-12 sm:w-12">
              <Image
                src="/revuc_2026_final_logo.png"
                alt="RevolutionUC 2026 logo"
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
          </button>

          {/* Right: Navigation links */}
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList className="flex-wrap gap-2 sm:gap-3">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("about");
                    }}
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [ABOUT]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="#sponsors"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("sponsors");
                    }}
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [SPONSORS]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="#tracks"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("tracks");
                    }}
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [TRACKS]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="#stats"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("stats");
                    }}
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [STATS]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem> */}
              {/* <NavigationMenuItem>
                <NavigationMenuTrigger className=" font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-[#228cf6] focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full data-[state=open]:after:w-full data-[state=open]:bg-transparent">
                  [EVENT]
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-[#228cf6]! border border-[#1a1f3a]/50">
                  <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <ListItem
                      title="Tracks"
                      onClick={() => scrollToSection("tracks")}
                      icon={<TrophyIcon className="size-4" />}
                    >
                      Check out the amazing tracks this year.
                    </ListItem>
                    <ListItem
                      title="Sponsors"
                      onClick={() => scrollToSection("sponsors")}
                      icon={<Building2Icon className="size-4" />}
                    >
                      Meet our amazing sponsors and partners.
                    </ListItem>
                    <ListItem
                      title="Stats"
                      onClick={() => scrollToSection("stats")}
                      icon={<UsersIcon className="size-4" />}
                    >
                      See the numbers behind RevolutionUC.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem> */}

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("faq");
                    }}
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [FAQ]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    className="hover:bg-white text-white font-mono text-sm sm:text-base md:text-lg hover:text-black bg-[#151477] rounded-none"
                    onClick={() => scrollToSection("schedule")}
                  >
                    [SCHEDULE]
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    className="hover:bg-white font-mono text-sm sm:text-base md:text-lg hover:text-black bg-[#19e363] rounded-none"
                    onClick={() => scrollToSection("boarding-pass")}
                  >
                    [REGISTER]
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
