
"use client";

import { motion } from "framer-motion";
import { AceternityLogo } from "./logo";
import React from "react";

interface LidProps {
  scaleX: any;
  scaleY: any;
  rotate: any;
  translate: any;
  src?: string;
}

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src
}: LidProps) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d"
        }}
        className="relative h-[12rem] w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #171717 inset"
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
        >
          <span className="text-white">
            <AceternityLogo />
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top"
        }}
        className="absolute inset-0 h-96 w-[32rem] rounded-2xl bg-[#010101] p-2"
      >
        <div className="absolute inset-0 rounded-lg bg-[#272729]" />
        {src && (
          <img
            src={src}
            alt="screen content"
            className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
          />
        )}
      </motion.div>
    </div>
  );
};
