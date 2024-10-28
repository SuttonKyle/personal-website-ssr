"use client";

import { useIsomorphicLayoutEffect } from 'react-spring';
import { useSpring, animated, useTransition } from '@react-spring/web'
import { useState } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';

const titles = ["frontend engineer", "full stack engineer", "climber", "runner", "amateur baker"]

export default function Home() {
  const [iAmARendered, setIAmARendered] = useState(false);
  const [slide, setSlide] = useState(0);

  const springs = useSpring(
    !iAmARendered ? {
      y: 30,
      opacity: 0
    } : {
      y: 0,
      opacity: 1,
      delay: 500,
      config: {
        friction: 14,
        tension: 40,
        bounce: 0
      }
    });

  const [transitions, api] = useTransition(slide, () => ({
    from: { opacity: 0, y: 30 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -30 },
  }))

  useIsomorphicLayoutEffect(() => {
    setIAmARendered(true);
    const interval = setInterval(() => flushSync(() => setSlide(slide => (slide + 1) % titles.length)), 3000);
    return () => clearInterval(interval);
  }, []);

  useIsomorphicLayoutEffect(() => {
    api.start()
  }, [slide]);

  return (
    <div className="flex flex-col justify-start h-full md:justify-center mb-4 md:mb-0">
      <div className="flex flex-col md:flex-row h-max xl:mr-12 xl:ml-12">
        <div className="relative h-80 mb-4 md:mb-0 md:h-full w-full">
          <Image
            src="https://s3.amazonaws.com/kylesutton-personal-website-photos/logos%2Fheadshot.JPG"
            alt="headshot"
            width={0}
            height={0}
            sizes={"50vw"}
            fill
            className="object-contain object-center md:object-left-center"
          />
        </div>
        <div className="flex flex-col md:ml-4">
          <div className="text-5xl font-bold">Hi, I&apos;m Kyle!</div>
          <animated.div className="mt-4" style={springs}>
            <div className="mb-4 text-2xl font-bold">
              I am {/^[aeiou]/.test(titles[slide].toLowerCase()) ? "an" : "a"} <div className="inline-block h-6">
                <div className="relative">
                  {transitions((style, idx) => <animated.div style={style} className="absolute w-max">{titles[idx]}</animated.div>)}
                </div>
              </div>
            </div>
            <div className="mb-4">
              I have 3+ years professional software engineering experience and a passion for writing clean, functional code.
              I am first and foremost a frontend engineer specializing in TypeScript and React, but I have done my fair share of full stack engineering with Node.js, Express,
              MongoDB, SQL, and a variety of other technologies, and consider myself somewhat of a jack of all trades. I have a special place in my heart for functional programming, and I believe TypeScript
              can be beautiful if treated with the care it deserves.
              <div className="mt-2">
                <Link className="font-semibold" href="/career">See my career →</Link>
              </div>
            </div>
            <div className="mb-4">
              When I&apos;m not writing code, I spend my weekends in the climbing gym hanging off plastic or better yet, outside hanging off rock or ice.
              I run almost every day, and my second favorite place to be besides outside is in the kitchen.
              <div className="mt-2">
                <Link className="font-semibold" href="/gallery">See my hobbies →</Link>
              </div>
            </div>
            <div>Want to build something together? Let&apos;s connect!
              <div className="mt-2">
                <Link className="font-semibold" href="/links">Get in touch →</Link>
              </div>
            </div>
          </animated.div>
        </div>
      </div>
    </div>
  );
}
