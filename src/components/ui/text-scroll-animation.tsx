"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
};

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);

  return (
    <motion.span
      className={cn("inline-block text-orange-500", isSpace && "w-4")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};

const CharacterV2 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(distanceFromCenter) * 50, 0]);

  return (
    <motion.img
      src={char}
      alt=""
      className="h-16 w-16 shrink-0 object-contain will-change-transform"
      style={{ x, scale, y, transformOrigin: "center" }}
    />
  );
};

const CharacterV3 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    [0, 0.5, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * 30, 0]
  );
  const blur = useTransform(scrollYProgress, [0, 0.5], [8, 0]);
  const filterValue = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.span
      className={cn("inline-block", isSpace && "w-4")}
      style={{ opacity, y, filter: filterValue }}
    >
      {char}
    </motion.span>
  );
};

// ── V1: Text flies in from sides ──────────────────────────────────────────────
type TextScrollV1Props = {
  text: string;
  className?: string;
};

export function TextScrollV1({ text, className }: TextScrollV1Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const chars = text.split("");
  const centerIndex = Math.floor(chars.length / 2);

  return (
    <ReactLenis root>
      <div ref={containerRef} className={cn("min-h-[200vh] flex items-center justify-center", className)}>
        <div className="sticky top-1/2 -translate-y-1/2 flex flex-wrap justify-center gap-1 text-4xl font-bold overflow-hidden px-8">
          {chars.map((char, i) => (
            <CharacterV1
              key={i}
              char={char}
              index={i}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </ReactLenis>
  );
}

// ── V2: Images fly in from sides ─────────────────────────────────────────────
type TextScrollV2Props = {
  images: string[];
  className?: string;
};

export function TextScrollV2({ images, className }: TextScrollV2Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const centerIndex = Math.floor(images.length / 2);

  return (
    <ReactLenis root>
      <div ref={containerRef} className={cn("min-h-[200vh] flex items-center justify-center", className)}>
        <div className="sticky top-1/2 -translate-y-1/2 flex flex-wrap justify-center gap-4 overflow-hidden px-8">
          {images.map((src, i) => (
            <CharacterV2
              key={i}
              char={src}
              index={i}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </ReactLenis>
  );
}

// ── V3: Text fades + blurs in ─────────────────────────────────────────────────
type TextScrollV3Props = {
  text: string;
  className?: string;
};

export function TextScrollV3({ text, className }: TextScrollV3Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const chars = text.split("");
  const centerIndex = Math.floor(chars.length / 2);

  return (
    <ReactLenis root>
      <div ref={containerRef} className={cn("min-h-[200vh] flex items-center justify-center", className)}>
        <div className="sticky top-1/2 -translate-y-1/2 flex flex-wrap justify-center gap-1 text-4xl font-bold overflow-hidden px-8">
          {chars.map((char, i) => (
            <CharacterV3
              key={i}
              char={char}
              index={i}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </ReactLenis>
  );
}
