"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSpring, animated } from "react-spring";

type ToolbarLink = {
  href: string;
  text: string;
}

const toolbarLinks: ToolbarLink[] = [
  { href: "/", text: "Kyle Sutton" },
  { href: "/career", text: "Career" },
  { href: "/gallery", text: "Gallery" },
  // { href: "/arcade", text: "Arcade"}, TODO add back in once arcade is ready
  { href: "/links", text: "Contact" }
]

const ToolbarLink = (props: ToolbarLink & { variant: "mobile" | "web" }) => {
  const pathName = usePathname();
  return <div className={`${props.variant === "mobile" ? "pl-4 pb-4" : "p-4"} font-semibold ${props.href === pathName ? "accent-color" : ""}`}>
    <Link href={props.href}>{props.text}</Link>
  </div>
}

export const Toolbar = (props: { className: string }) => <>
  <ToolbarMobile className={props.className} />
  <div className={`hidden sm:flex flex-row ${props.className}`}>
    {toolbarLinks.map(l => <ToolbarLink variant="web" {...l} key={l.text} />)}
  </div>
</>

const Hamburger = (props: { onClick: () => void, open: boolean }) => <button className="flex flex-col hamburger h-11 justify-center items-center" onClick={props.onClick}>
  {props.open
    ? <div className="text-6xl">×</div>
    : <>
      <div className="h-1 mb-2 w-8 hamburger-bar" />
      <div className="h-1 mb-2 w-8 hamburger-bar" />
      <div className="h-1 w-8 hamburger-bar" />
    </>
  }
</button>

const ToolbarMobile = (props: { className: string }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const springs = useSpring(
    menuIsOpen ? {
      transform: "translateY(0%)",
      config: {
        friction: 14,
        tension: 120,
        bounce: 0
      }
    } : {
      transform: "translateY(-100%)",
      config: {
        friction: 14,
        tension: 120,
        bounce: 0
      }
    });

  return <div className={`sm:hidden ${props.className}`}>
    <div className="relative z-20 w-full background-color-bg p-2 pl-4"><Hamburger open={menuIsOpen} onClick={() => setMenuIsOpen(isOpen => !isOpen)} /></div>
    <animated.div className="absolute w-full z-10 toolbar-background flex flex-col" style={springs}>
      {toolbarLinks.map(l => <ToolbarLink variant="mobile" {...l} key={l.text} />)}
    </animated.div>
  </div>
}