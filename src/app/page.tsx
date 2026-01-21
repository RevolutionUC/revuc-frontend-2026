"use client";
import { useEffect } from "react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import gsap from "gsap";
// import Sponsors from "@/app/sections/Sponsors";
import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Clouds from "@/app/sections/Clouds";
import BoardingPass from "@/app/sections/BoardingPass";
import Prizes from "@/app/sections/Tracks";
import Stats from "@/app/sections/Stats";
import Faq from "@/app/sections/FAQ";
import Schedule from "@/app/sections/Schedule";

gsap.registerPlugin(ScrollToPlugin);

const Home = () => {
  // Handle hash navigation when page loads
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1); // Remove the #
      // Wait for page to fully render, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          gsap.to(window, {
            scrollTo: `#${sectionId}`,
            duration: 1,
            ease: "power2.inOut",
          });
        }
      }, 300);
    }
  }, []);

  return (
    <>
      <Hero />
      <Clouds />
      <About />
      <BoardingPass />
      <Stats />
      {/*<Sponsors />*/}
      <Prizes />
      <Faq />
      <Schedule />
    </>
  );
};

export default Home;
