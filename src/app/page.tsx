"use client";
// import Sponsors from "@/app/sections/Sponsors";
import { Suspense } from "react";
import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Clouds from "@/app/sections/Clouds";
import BoardingPass from "@/app/sections/BoardingPass";
import Prizes from "@/app/sections/Tracks";
import Stats from "@/app/sections/Stats";
import Faq from "@/app/sections/FAQ";

const Home = () => {
  return (
    <>
      <Hero />
      <Clouds />
      <About />
      <Suspense fallback={<div>Loading...</div>}>
        <BoardingPass />
      </Suspense>
      <Stats />
      <Prizes />
      <Faq />
    </>
  );
};

export default Home;
