// import Sponsors from "@/app/sections/Sponsors";
import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Clouds from "@/app/sections/Clouds";
import Prizes from "@/app/sections/Tracks";
import Stats from "@/app/sections/Stats";
import Faq from "@/app/sections/FAQ";
import Footer from "@/app/sections/Footer";
import Sponsors from "./sections/Sponsors";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <Hero />
      <Clouds />
      <About />
      <Stats />
      <Sponsors />
      <Prizes />
      <Faq />
      <Footer />
    </>
  );
}
