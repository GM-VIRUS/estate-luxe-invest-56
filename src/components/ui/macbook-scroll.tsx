"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { LaptopIcon, MicIcon, MoonIcon, SearchIcon, SunIcon, TableIcon, Volume, Volume1, Volume2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, SkipBack, SkipForward } from "lucide-react";
export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);
  const scaleX = useTransform(scrollYProgress, [0, 0.3], [1.2, isMobile ? 1 : 1.5]);
  const scaleY = useTransform(scrollYProgress, [0, 0.3], [0.6, isMobile ? 1 : 1.5]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  return <div ref={ref} className="flex min-h-[200vh] shrink-0 scale-[0.35] transform flex-col items-center justify-start [perspective:800px] sm:scale-50 md:scale-100 md:py-80 py-[102px]">
      <motion.h2 style={{
      translateY: textTransform,
      opacity: textOpacity
    }} className="mb-20 text-center text-3xl font-bold text-neutral-800 dark:text-white">
        {title || <span>
            This Macbook is built with Tailwindcss. <br /> No kidding.
          </span>}
      </motion.h2>
      {/* Lid */}
      <Lid src={src} scaleX={scaleX} scaleY={scaleY} rotate={rotate} translate={translate} />
      {/* Base area */}
      <div className="relative -z-10 h-[22rem] w-[32rem] overflow-hidden rounded-2xl bg-gray-200 dark:bg-[#272729]">
        {/* above keyboard bar */}
        <div className="relative h-10 w-full">
          <div className="absolute inset-x-0 mx-auto h-4 w-[80%] bg-[#050505]" />
        </div>
        <div className="relative flex">
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
          <div className="mx-auto h-full w-[80%]">
            <Keypad />
          </div>
          <div className="mx-auto h-full w-[10%] overflow-hidden">
            <SpeakerGrid />
          </div>
        </div>
        <Trackpad />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-2 w-20 rounded-tl-3xl rounded-tr-3xl bg-gradient-to-t from-[#272729] to-[#050505]" />
        {showGradient && <div className="absolute inset-x-0 bottom-0 z-50 h-40 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black"></div>}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>;
};
export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src
}: {
  scaleX: any;
  scaleY: any;
  rotate: any;
  translate: any;
  src?: string;
}) => {
  return <div className="relative [perspective:800px]">
      <div style={{
      transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
      transformOrigin: "bottom",
      transformStyle: "preserve-3d"
    }} className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2">
        <div style={{
        boxShadow: "0px 2px 0px 2px #171717 inset"
      }} className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]">
          <span className="text-white">
            <AceternityLogo />
          </span>
        </div>
      </div>
      <motion.div style={{
      scaleX: scaleX,
      scaleY: scaleY,
      rotateX: rotate,
      translateY: translate,
      transformStyle: "preserve-3d",
      transformOrigin: "top"
    }} className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2">
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />
        {src && <img src={src} alt="screen content" className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top" />}
      </motion.div>
    </div>;
};
export const Trackpad = () => {
  return <div className="mx-auto my-1 h-32 w-[40%] rounded-xl" style={{
    boxShadow: "0px 0px 1px 1px #00000020 inset"
  }}></div>;
};
export const Keypad = () => {
  return <div className="mx-1 h-full rounded-md bg-[#050505] p-1">
      {/* First Row */}
      <Row>
        <KBtn className="w-10 items-end justify-start pb-[2px] pl-[4px]" childrenClassName="items-start">
          esc
        </KBtn>
        <KBtn>
          <SunIcon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F1</span>
        </KBtn>

        <KBtn>
          <MoonIcon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F2</span>
        </KBtn>
        <KBtn>
          <TableIcon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F3</span>
        </KBtn>
        <KBtn>
          <SearchIcon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F4</span>
        </KBtn>
        <KBtn>
          <MicIcon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F5</span>
        </KBtn>
        <KBtn>
          <MoonIcon className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F6</span>
        </KBtn>
        <KBtn>
          <SkipBack className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F7</span>
        </KBtn>
        <KBtn>
          <SkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <SkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F8</span>
        </KBtn>
        <KBtn>
          <Volume className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F10</span>
        </KBtn>
        <KBtn>
          <Volume1 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F11</span>
        </KBtn>
        <KBtn>
          <Volume2 className="h-[6px] w-[6px]" />
          <span className="mt-1 inline-block">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
        </KBtn>
      </Row>

      {/* Rest of keyboard rows */}
      <Row>
        {Array.from({
        length: 14
      }).map((_, i) => <KBtn key={i}></KBtn>)}
      </Row>
      <Row>
        {Array.from({
        length: 14
      }).map((_, i) => <KBtn key={i}></KBtn>)}
      </Row>
      <Row>
        {Array.from({
        length: 13
      }).map((_, i) => <KBtn key={i}></KBtn>)}
      </Row>
      <Row>
        {Array.from({
        length: 12
      }).map((_, i) => <KBtn key={i}></KBtn>)}
      </Row>
      <Row>
        {Array.from({
        length: 8
      }).map((_, i) => <KBtn key={i}></KBtn>)}
      </Row>
    </div>;
};
export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) => {
  return <div className={cn("rounded-[4px] p-[0.5px]", backlit && "bg-white/[0.2] shadow-xl shadow-white")}>
      <div className={cn("flex h-6 w-6 items-center justify-center rounded-[3.5px] bg-[#0A090D]", className)} style={{
      boxShadow: "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset"
    }}>
        <div className={cn("flex w-full flex-col items-center justify-center text-[5px] text-neutral-200", childrenClassName, backlit && "text-white")}>
          {children}
        </div>
      </div>
    </div>;
};
export const Row = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">{children}</div>;
};
export const SpeakerGrid = () => {
  return <div className="mt-2 flex h-40 gap-[2px] px-[0.5px]" style={{
    backgroundImage: "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
    backgroundSize: "3px 3px"
  }}></div>;
};
const AceternityLogo = () => {
  return <svg width="66" height="65" viewBox="0 0 66 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white">
      <path d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696" stroke="currentColor" strokeWidth="15" strokeMiterlimit="3.86874" strokeLinecap="round" />
    </svg>;
};