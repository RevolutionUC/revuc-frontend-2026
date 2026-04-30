"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

{
  /*
  Usage Example:

  <SplitText
  text="RevolutionUC 2026"
  className="text-base sm:text-lg text-foreground/80 leading-relaxed"
  delay={30}
  duration={0.5}
  ease="power3.out"
  splitType="words"
  from={{ opacity: 0, y: 20 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="left"
/>
*/
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

type SplitTag = NonNullable<SplitTextProps["tag"]>;

function parseStartPosition(threshold: number, rootMargin: string): string {
  const startPct = (1 - threshold) * 100;
  const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
  const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
  const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";

  if (marginValue === 0) {
    return `top ${startPct}%`;
  }

  const signPrefix = marginValue < 0 ? "-=" : "+=";
  return `top ${startPct}%${signPrefix}${Math.abs(marginValue)}${marginUnit}`;
}

function getSplitTargets(self: GSAPSplitText, splitType: string): Element[] {
  const candidates: Array<{ enabled: boolean; values?: Element[] }> = [
    { enabled: splitType.includes("chars"), values: self.chars },
    { enabled: splitType.includes("words"), values: self.words },
    { enabled: splitType.includes("lines"), values: self.lines },
  ];

  for (const candidate of candidates) {
    if (candidate.enabled && candidate.values?.length) {
      return candidate.values;
    }
  }

  return self.chars || self.words || self.lines || [];
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current as HTMLElement & {
        _rbsplitInstance?: GSAPSplitText;
      };

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch {}
        el._rbsplitInstance = undefined;
      }

      const start = parseStartPosition(threshold, rootMargin);
      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self: GSAPSplitText) => {
          const targets = getSplitTargets(self, splitType);
          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4,
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onLetterAnimationComplete?.();
              },
              willChange: "transform, opacity",
              force3D: true,
            },
          );
        },
      });
      el._rbsplitInstance = splitInstance;
      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch {}
        el._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        onLetterAnimationComplete,
      ],
      scope: ref,
    },
  );

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };
  const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
  const elementTag: SplitTag = tag === "span" ? "span" : tag || "p";

  return React.createElement(elementTag, { ref, style, className: classes }, text);
};

export default SplitText;
