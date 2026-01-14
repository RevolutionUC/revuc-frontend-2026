"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import gsap from "gsap";
import { TrophyIcon, UsersIcon, Building2Icon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [ABOUT]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full data-[state=open]:after:w-full data-[state=open]:bg-transparent">
                  [EVENT]
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-[#050b24] border border-[#1a1f3a]/50">
                  <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <ListItem
                      title="Prizes"
                      onClick={() => scrollToSection("prizes")}
                      icon={<TrophyIcon className="size-4" />}
                    >
                      Check out the amazing prizes and awards.
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
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("faq");
                    }}
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [FAQ]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="#schedule"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("schedule");
                    }}
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [SCHEDULE]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a
                    href="#register"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("boarding-pass");
                    }}
                    className="cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    [REGISTER]
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}

function ListItem({
  title,
  children,
  href,
  onClick,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  title: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  const content = (
    <div className="group grid gap-1 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white">
      <div className="flex items-center gap-2 text-sm font-medium leading-none text-white/90 group-hover:text-white">
        {icon}
        {title}
      </div>
      <p className="text-white/70 line-clamp-2 text-sm leading-snug group-hover:text-white/90">
        {children}
      </p>
    </div>
  );

  if (onClick) {
    return (
      <li {...props}>
        <button
          type="button"
          onClick={onClick}
          className="w-full text-left cursor-pointer outline-none"
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href || "#"} className="outline-none">
          {content}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
