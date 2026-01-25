"use client";

import { useEffect } from "react";
import gsap from "gsap";

const IMAGE_URLS: string[] = [
  "./shirt.webp",
  "./sock.webp",
  "./white-shirt.webp",
  "./pants.webp",
//   "./boarding_pass.webp",
];

export default function FlairCursor() {
  useEffect(() => {
    let flairEls: HTMLImageElement[] = [];
    let index = 0;
    let mousePos = { x: 0, y: 0 };
    let lastMousePos = { x: 0, y: 0 };
    const gap = 100;
    const maxImages = 7;

    function createImage() {
      if (flairEls.length >= maxImages) {
        const oldestImg = flairEls.shift();
        if (oldestImg) {
          gsap.killTweensOf(oldestImg);
          oldestImg.remove();
        }
      }

      const img = document.createElement("img");
      img.src = IMAGE_URLS[index % IMAGE_URLS.length];
      img.className = "flair";
      img.style.position = "fixed";
      img.style.pointerEvents = "none";
      img.style.opacity = "0";
      img.style.width = "200px"; // Adjust size as needed
      img.style.height = "auto"; 
      document.body.appendChild(img);
      flairEls.push(img);
      index++;
      return img;
    }

    function playAnimation(img: HTMLImageElement, velocityX: number, velocityY: number) {
      const moveX = velocityX * 0.5;
      const moveY = velocityY * 0.5;

      const tl = gsap.timeline();
      tl.fromTo(
        img,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, ease: "power2.out", duration: 0.15 }
      ).to(
        img,
        {
          x: moveX,
          y: moveY,
          ease: "power3.out",
          duration: 1,
        }
      ).to(
        img,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.15,
        }
      );
    }

    function animateImage() {
      const velocityX = mousePos.x - lastMousePos.x;
      const velocityY = mousePos.y - lastMousePos.y;
      
      const img = createImage();
      gsap.set(img, {
        left: mousePos.x,
        top: mousePos.y,
        xPercent: -50,
        yPercent: -50,
      });
      playAnimation(img, velocityX, velocityY);
    }

    function onMouseMove(e: MouseEvent) {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      const dist = Math.hypot(
        lastMousePos.x - mousePos.x,
        lastMousePos.y - mousePos.y
      );
      if (dist > gap) {
        animateImage();
        lastMousePos = { ...mousePos };
      }
    }

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      flairEls.forEach((el) => el.remove());
      gsap.killTweensOf("*");
    };
  }, []);

  return null;
}
