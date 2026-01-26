"use client";
// import Sponsors from "@/app/sections/Sponsors";
import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Clouds from "@/app/sections/Clouds";
import BoardingPass from "@/app/sections/BoardingPass";
import Prizes from "@/app/sections/Tracks";
import Stats from "@/app/sections/Stats";
import Faq from "@/app/sections/FAQ";
import FlairCursor from "./components/FlairCursor";
// import Schedule from "@/app/sections/Schedule";

const Home = () => {
  return (
    <>
      <FlairCursor />
      <Hero />
      <Clouds />
      <About />
      <BoardingPass />
      <Stats />
      {/*<Sponsors />*/}
      <Prizes />
      <Faq />
      {/*<Schedule />*/}
    </>
  );
};

export default Home;
