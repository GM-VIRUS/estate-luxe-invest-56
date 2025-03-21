
import React from "react";
import {
  LaptopIcon,
  MicIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  TableIcon,
  Volume,
  Volume1,
  Volume2,
  SkipBack,
  SkipForward
} from "lucide-react";
import { KBtn, Row } from "./keyboard-components";

export const Keypad = () => {
  return (
    <div className="mx-1 h-full rounded-md bg-[#050505] p-1">
      {/* First Row */}
      <Row>
        <KBtn
          className="w-10 items-end justify-start pb-[2px] pl-[4px]"
          childrenClassName="items-start"
        >
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
        {Array.from({ length: 14 }).map((_, i) => (
          <KBtn key={i}></KBtn>
        ))}
      </Row>
      <Row>
        {Array.from({ length: 14 }).map((_, i) => (
          <KBtn key={i}></KBtn>
        ))}
      </Row>
      <Row>
        {Array.from({ length: 13 }).map((_, i) => (
          <KBtn key={i}></KBtn>
        ))}
      </Row>
      <Row>
        {Array.from({ length: 12 }).map((_, i) => (
          <KBtn key={i}></KBtn>
        ))}
      </Row>
      <Row>
        {Array.from({ length: 8 }).map((_, i) => (
          <KBtn key={i}></KBtn>
        ))}
      </Row>
    </div>
  );
};
