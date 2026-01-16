"use client";

import Image from "next/image";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const GsapScrollTrigger = () => {
  const scrollRef = useRef<any>(null);

  useGSAP(
    () => {
      const boxes = gsap.utils.toArray(scrollRef.current.children);

      boxes.forEach((box: any, index: number) => {
        const direction =
          index === 0 || index === 1 || index === 2 || index === 3 ? 1 : -1;

        gsap.to(box, {
          x: direction * 100 * (index + 3),
          scale: 1.5,
          scrollTrigger: {
            trigger: box,
            start: "bottom bottom",
            end: "top 20%",
            scrub: true,
            //markers: true,
          },
          //ease: "power2.out",
          //markers: true,
        });
      });
    },
    { scope: scrollRef },
  );

  return (
    <main>
      <div id="clouds" className="section absolute top-[45%] left-0 right-0 h-screen z-0 overflow-visible">
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={400}
          height={200}
          priority
          className="absolute top-[-15%] left-[5%] w-[400px] opacity-80"
          data-speed="0.8"
        />
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={800}
          height={400}
          priority
          className="absolute top-[30%] left-[-10%] w-[600px] opacity-70"
          data-speed="0.6"
        />
        <Image
          src="/cloud_final5.webp"
          alt="Cloud"
          width={800}
          height={450}
          priority
          className="absolute top-[10%] right-[-25%] w-[800px] opacity-75"
          data-speed="1.2"
        />
        <Image
          src="/cloud_final4.webp"
          alt="Cloud"
          width={800}
          height={400}
          priority
          className="absolute top-[50%] right-[5%] w-[400px] opacity-80"
          data-speed="0.9"
        />
        <Image
          src="/cloud_final3.webp"
          alt="Cloud"
          width={800}
          height={450}
          priority
          className="absolute top-[50%] left-[15%] w-[400px] opacity-65"
          data-speed="0.7"
        />
      </div>

      <div
        className="h-[70vh] w-full relative flex justify-center overflow-hidden"
        ref={scrollRef}
      >
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box h-110 absolute top-0 left-[60%]"
        />
        <Image
          src="/cloud_final2.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box h-100 absolute top-30 left-[50%]"
        />
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box h-100 absolute top-0 left-[40%]"
        />
        <Image
          src="/cloud_final5.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box h-100 absolute top-0 left-[70%]"
        />
        <Image
          src="/cloud_final4.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box h-150 absolute top-0 right-[50%]"
        />
        <Image
          src="/cloud_final1.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box h-120 absolute top-20 right-[20%]"
        />
        <Image
          src="/cloud_final4.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box h-100 absolute top-10 right-[30%]"
        />
        <Image
          src="/cloud_final5.webp"
          alt="Cloud"
          width={800}
          height={450}
          loading="lazy"
          className="scroll-box h-100 absolute top-0 right-[60%]"
        />
      </div>
    </main>
  );
};

export default GsapScrollTrigger;
