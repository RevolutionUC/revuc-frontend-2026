"use client";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useGsapRouteCleanup } from "@/app/components/gsap-route-cleanup";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";

gsap.registerPlugin(ScrollToPlugin);

const DESKTOP_LINK_CLASS =
  "cursor-pointer font-mono text-sm sm:text-base md:text-lg text-white bg-transparent hover:bg-transparent focus:bg-transparent relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full";

const MOBILE_LINK_CLASS =
  "w-full text-left cursor-pointer font-mono text-sm text-white bg-transparent relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#19E363] after:transition-all after:duration-300 hover:after:w-full";

const HOME_SECTION_LINKS = [
  { id: "home", label: "[HOME]" },
  { id: "about", label: "[ABOUT]" },
  { id: "tracks", label: "[TRACKS]" },
  { id: "faq", label: "[FAQ]" },
] as const;

function DesktopSectionLinks({
  onSectionClick,
}: {
  onSectionClick: (sectionId: string) => void;
}) {
  return HOME_SECTION_LINKS.map((link) => (
    <NavigationMenuItem key={link.id}>
      <NavigationMenuLink asChild>
        <a
          href={`#${link.id}`}
          onClick={(e) => {
            e.preventDefault();
            onSectionClick(link.id);
          }}
          className={DESKTOP_LINK_CLASS}
        >
          {link.label}
        </a>
      </NavigationMenuLink>
    </NavigationMenuItem>
  ));
}

function UserMenu({
  session,
  onSignOut,
}: {
  session: NonNullable<ReturnType<typeof authClient.useSession>["data"]>;
  onSignOut: () => Promise<void>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
          aria-label="User menu"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || session.user.email || "User"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border-2 border-white"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#19e363] flex items-center justify-center text-white font-mono font-semibold text-sm">
              {(session.user.name || session.user.email || "U")[0].toUpperCase()}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {session.user.name || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {session.user.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function usePendingSectionScroll(
  pathname: string,
  triggerScrollToSection: (sectionId: string) => void,
) {
  useEffect(() => {
    const consumeStoredSectionScroll = () => {
      const targetSection = sessionStorage.getItem("scrollToSection");
      if (!targetSection) return;
      sessionStorage.removeItem("scrollToSection");
      triggerScrollToSection(targetSection);
    };

    if (pathname === "/") {
      consumeStoredSectionScroll();
    }
  }, [pathname, triggerScrollToSection]);

  useEffect(() => {
    const consumeStoredSectionScroll = () => {
      if (pathname !== "/") return;
      const targetSection = sessionStorage.getItem("scrollToSection");
      if (!targetSection) return;
      sessionStorage.removeItem("scrollToSection");
      triggerScrollToSection(targetSection);
    };

    window.addEventListener("revuc-scroll-to-section", consumeStoredSectionScroll);
    return () => {
      window.removeEventListener("revuc-scroll-to-section", consumeStoredSectionScroll);
    };
  }, [pathname, triggerScrollToSection]);
}

function useAutoCloseMobileMenu(isMobile: boolean | undefined, mobileOpen: boolean, close: () => void) {
  useEffect(() => {
    if (!isMobile && mobileOpen) {
      close();
    }
  }, [isMobile, mobileOpen, close]);
}

export function NavigationBar() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const gsapCleanup = useGsapRouteCleanup();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const triggerScrollToSection = useCallback((sectionId: string) => {
    // Delay to ensure the page has fully rendered
    setTimeout(() => {
      gsap.to(window, {
        scrollTo: `#${sectionId}`,
        duration: 1,
        ease: "power2.inOut",
      });
    }, 100);
  }, []);

  usePendingSectionScroll(pathname, triggerScrollToSection);
  useAutoCloseMobileMenu(isMobile, mobileOpen, () => setMobileOpen(false));

  const scrollToSection = useCallback((sectionId: string) => {
    if (pathname !== "/") {
      // Store the target section and navigate to home page
      sessionStorage.setItem("scrollToSection", sectionId);
      gsapCleanup?.killBeforeNavigate();
      router.push("/");
    } else {
      gsap.to(window, {
        scrollTo: `#${sectionId}`,
        duration: 1,
        ease: "power2.inOut",
      });
    }
  }, [pathname, gsapCleanup, router]);

  const handleMobileScroll = useCallback((sectionId: string) => {
    setMobileOpen(false);
    scrollToSection(sectionId);
  }, [scrollToSection]);

  const handleRegisterClick = useCallback(() => {
    scrollToSection("boarding-pass");
  }, [scrollToSection]);

  const _handleMobileNavigate = useCallback((path: string) => {
    setMobileOpen(false);
    gsapCleanup?.killBeforeNavigate();
    router.push(path);
  }, [gsapCleanup, router]);

  const handleScheduleClick = useCallback(() => {
    gsapCleanup?.killBeforeNavigate();
    router.push("/schedule");
  }, [gsapCleanup, router]);

  const desktopAuthNode = isPending ? (
    <NavigationMenuItem>
      <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
    </NavigationMenuItem>
  ) : session?.user ? (
    <NavigationMenuItem>
      <UserMenu session={session} onSignOut={handleSignOut} />
    </NavigationMenuItem>
  ) : (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Button
          className="hover:bg-white font-mono hover:cursor-pointer text-sm sm:text-base md:text-lg hover:text-black bg-[#19e363] rounded-none"
          onClick={handleRegisterClick}
        >
          [REGISTER]
        </Button>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-transparent pointer-events-auto">
      {/* MLH Trust Badge */}
      <a
        id="mlh-trust-badge"
        className="block fixed top-0 left-6 sm:left-6 lg:left-[50px] w-[10%] max-w-[100px] min-w-[60px] z-10000"
        href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-white.svg"
          alt="Major League Hacking 2026 Hackathon Season"
          className="w-full"
        />
      </a>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 pr-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <button
            type="button"
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer focus:outline-none pl-4"
            aria-label="Go to top of page"
          ></button>

          {/* Mobile: Hamburger */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="sm:hidden h-10 w-10 rounded-md bg-transparent text-white hover:bg-transparent focus-visible:ring-2 focus-visible:ring-[#19E363]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>

          {/* Right: Navigation links */}
          <NavigationMenu viewport={isMobile} className="hidden sm:flex">
            <NavigationMenuList className="flex-wrap gap-2 sm:gap-3">
              <DesktopSectionLinks onSectionClick={scrollToSection} />

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    className="hover:bg-white hover:cursor-pointer text-white font-mono text-sm sm:text-base md:text-lg hover:text-black bg-[#151477] rounded-none"
                    onClick={handleScheduleClick}
                  >
                    [SCHEDULE]
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {desktopAuthNode}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile: Dropdown panel */}
          {mobileOpen ? (
            <div
              id="mobile-navigation"
              className="absolute left-0 right-0 top-full mt-3 rounded-md border border-[#1d1c88] bg-[#151477] shadow-xl sm:hidden"
            >
              <div className="flex flex-col gap-2 px-4 py-4">
                <button
                  type="button"
                  className={MOBILE_LINK_CLASS}
                  onClick={() => handleMobileScroll("home")}
                >
                  [HOME]
                </button>
                <button
                  type="button"
                  className={MOBILE_LINK_CLASS}
                  onClick={() => handleMobileScroll("about")}
                >
                  [ABOUT]
                </button>
                <button
                  type="button"
                  className={MOBILE_LINK_CLASS}
                  onClick={() => handleMobileScroll("tracks")}
                >
                  [TRACKS]
                </button>
                <button
                  type="button"
                  className={MOBILE_LINK_CLASS}
                  onClick={() => handleMobileScroll("faq")}
                >
                  [FAQ]
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-start rounded-none border border-white/20 bg-[#151477] text-white font-mono text-sm hover:bg-white hover:text-black"
                  onClick={() => _handleMobileNavigate("/schedule")}
                >
                  [SCHEDULE]
                </button>

                {isPending ? (
                  <div className="h-10 w-24 bg-white/20 animate-pulse rounded" />
                ) : session?.user ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-white">
                      <p className="text-sm font-medium">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-white/70 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setMobileOpen(false);
                        await handleSignOut();
                      }}
                      className="w-full text-left font-mono text-sm text-red-200 hover:text-red-100"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Button
                    className="w-full justify-start rounded-none bg-[#19e363] text-black font-mono text-sm hover:bg-white"
                    onClick={() => {
                      setMobileOpen(false);
                      handleRegisterClick();
                    }}
                  >
                    [REGISTER]
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
