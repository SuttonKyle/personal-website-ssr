"use client";

import { useState } from "react";
import { useIsomorphicLayoutEffect } from 'react-spring';
import { animated, useTransition } from "@react-spring/web";
import * as O from "effect/Option";
import Image from "next/image";
import { PageHeader, SubHeader } from "../components/Headers";

import "./career.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

type Job = {
    image: O.Option<string>;
    name: string;
    title: O.Option<string>;
    description: string;
    dates: string;
}

const jobs: Job[] = [
    {
        image: O.some("https://s3.amazonaws.com/kylesutton-personal-website-photos/logos%2Fbl-logo.svg"),
        name: "BondLink",
        title: O.some("Functional TypeScript Engineer/Software Engineer II"),
        dates: "2021 - 2024",
        description: `
            In 2021 I joined BondLink, a medium-sized startup that helps digitize the operations of municipal bond issuers and banks and helps connect issuers to
            investors. As my first full-time job after graduating, BondLink gave me a chance to really come into my own as an engineer. Under the mentorship of some
            truly skilled management and senior engineers, I developed better coding practices and really honed my skills in TypeScript and React. I also developed
            skills in, and a deep appreciation for, functional programming with TypeScript using fp-ts, which was the standard at BondLink. In March 2023 I was promoted
            to Software Engineer II, and took on more responsibilities, including mentorship of new team members and independent development on larger features,
            as well as leadership roles on some collaborative projects. BondLink was a great place to work and gave me some of my most valuable experience to date.
        `
    },
    {
        image: O.some("https://s3.amazonaws.com/kylesutton-personal-website-photos/logos%2FairrLogo-inverted-transparent.png"),
        name: "AIRR",
        title: O.some("Fullstack Engineer"),
        dates: "2019 - 2021",
        description: `
            At the end of my sophomore year I joined Airr, an early stage podcast listening startup, as a fullstack engineer. This was my most comprehensive experience with early startup culture,
            working directly with the two cofounders in a tiny one-room office in Cambridge. Here I got more into the details of iOS app development with React
            Native and developed more in-depth skills with MongoDB, Express, and Node.js. I worked with Airr either part-time or full-time for the rest of my college career, from summer 2019
            until a few months after graduation in 2021, and took a semester off during fall 2020 to work full-time. During my work at Airr, I also did some independent pilot
            research on building a recommendation algorithm, which gave me some real-world introduction to machine learning and big data work. Between joining the company and
            my exit in 2021, I witnessed the app go from alpha to beta to full launch, ultimately hitting 50,000 users and 5,000 DAUs, and helped to deal with the issues
            that arose with scaling to such a degree.
        `
    },
    {
        image: O.some("https://s3.amazonaws.com/kylesutton-personal-website-photos/logos%2Fdev.svg"),
        name: "HSA DEV",
        title: O.some("Fullstack Engineer"),
        dates: "2018 - 2019",
        description: `
            While studying Computer Science at Harvard, I had the opportunity to work as a fullstack engineer for HSA DEV, a Harvard student-run development 
            agency that took on various clients and helped make their app or website ideas a reality. I worked part-time during spring 2018 and during my sophomore
            year in 2018-2019, and full time during the summer of 2018, getting a chance to cut my teeth in software engineering and to sample a
            variety of different technologies and stacks, including both Express and GraphQL apis, SQL and noSQL databases, and mobile app development
            with XCode and Android studio. It was also where I learned React and React Native, as well as my first exposure to Node.js for backend development.
        `
    },
    {
        image: O.none(),
        name: "What's Next?",
        title: O.none(),
        dates: "2024 - ?",
        description: `
            I'm currently seeking full-time employment as a Software Engineer, and hoping to find a position where I can both continue to develop
            the skills I already have and learn new ones, all while contributing meaningfully to an interesting product. I love to solve complex problems and
            I thrive in a collaborative environment where I'm surrounded by talented coworkers. I'm excited to find what my next step will be!
        `
    },
]

const otherProjects: Job[] = [
    {
        image: O.some("https://s3.amazonaws.com/kylesutton-personal-website-photos/logos%2Ffig.png"),
        name: "FIG App",
        title: O.some("Contract Software Engineer"),
        dates: "2020",
        description: `
            In 2020 I was approached by FIG, a startup that provides better information about food ingredients to users with dietary restrictions, especially those
            on a low-FODMAP diet for which labeling isn't very widespread or accurate. Since I was only a contract employee at Airr at the time, I decided to take on a short-term contract
            with FIG to independently build an initial version of their API to demonstrate to investors. This involved me migrating their code from Python to TypeScript, then deploying it as a 
            serverless Express API using AWS Lambda and AWS API Gateway. The project gave me a chance to dig deeper into cloud computing and DevOps work with AWS.
        `
    },
    {
        image: O.some("https://s3.amazonaws.com/kylesutton-personal-website-photos/logos%2Fblogwise.png"),
        name: "Blogwise",
        title: O.some("Fullstack Engineer/CTO"),
        dates: "2019",
        description: `
            Towards the end of my sophomore year, I joined a former DEV coworker at his fledgling startup called Blogwise, a company focused on building
            easy-to-use and performant content marketing tools for clients. Here I continued to work with React and was also introduced to Next.js, which
            was my first experience with server-side rendering. I became CTO shortly after joining, but ultimately the business failed to find Product/Market Fit
            and we made the decision to shut it down in June. Still, it gave me my first glimpse of startup life and lent me some experience with the higher-level
            decision-making that goes on in technical management.
        `
    },
]

const Job = (props: { job: Job }) => <div>
    {O.match(props.job.image, {
        onNone: () => <></>,
        onSome: src => <div className="absolute top-12 bottom-12 left-12 w-full">
            <Image
                fill
                src={src}
                alt={`Logo for ${props.job.name}`}
                sizes={"50vw"}
                width={0}
                height={0}
                className="object-contain object-left"
            />
        </div>
    })}
    <div className="relative job-description">
        <div className="text-xl font-semibold">{props.job.name}</div>
        <div className="flex flex-row justify-between">
            {O.match(props.job.title, { onNone: () => <></>, onSome: (title) => <div className="font-semibold">{title}</div> })}
            <div>{props.job.dates}</div>
        </div>
        <div>{props.job.description}</div>
    </div>
</div>

const Timeline = (props: { jobs: Job[] }) => {
    const [slide, setSlide] = useState({ slide: 0, direction: 1 });
    const [transitions, api] = useTransition(slide.slide, () => ({
        from: { opacity: 0, x: slide.direction * 200 },
        enter: { opacity: 1, x: 0 },
        leave: { opacity: 0, x: -1 * slide.direction * 200 },
    }));

    useIsomorphicLayoutEffect(() => {
        api.start();
    }, [slide.slide]);

    const prevSlide = () => setSlide(slide => ({ slide: (((slide.slide - 1) % props.jobs.length) + props.jobs.length) % props.jobs.length, direction: -1 }));

    const nextSlide = () => setSlide(slide => ({ slide: (slide.slide + 1) % props.jobs.length, direction: 1 }));

    return <div className="relative flex-col slideshow justify-end items-center hidden sm:flex">
        {transitions((style, idx) => <animated.div className="absolute bottom-12 top-0 ml-16 mr-16 flex flex-col justify-end" style={style}>
            <Job job={props.jobs[idx]} />
        </animated.div>)
        }
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center w-16">
            <button onClick={prevSlide} className="flex text-4xl justify-center">❮</button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center w-16">
            <button onClick={nextSlide} className="flex text-4xl justify-center">❯</button>
        </div>
        <div className="flex flex-row gap-x-4 mb-4">
            {props.jobs.map((j, idx) => <button key={j.name} onClick={() => setSlide({ slide: idx, direction: 0 })} className={`h-2 w-2 rounded-full ${slide.slide === idx ? "accent-color-bg" : "text-color-bg"}`} />)}
        </div>
    </div>
}

const JobMobile = (props: { job: Job }) => <div className="relative ml-4 mr-4 mb-4 mt-4">
    <div className="flex justify-center w-full">
        {O.match(props.job.image, {
            onNone: () => <></>,
            onSome: src =>
                <>
                    <div className="h-64" />
                    <div className="absolute top-8 right-12 left-12 bottom-0">
                        <Image
                            src={src}
                            alt={`Logo for ${props.job.name}`}
                            sizes={"100vw"}
                            fill
                            className="object-contain object-top"
                        />
                    </div>
                </>
        })}
    </div>
    <div className="relative job-description">
        <div>{props.job.dates}</div>
        <div className="text-xl font-semibold">{props.job.name}</div>
        {O.match(props.job.title, { onNone: () => <></>, onSome: (title) => <div className="font-semibold">{title}</div> })}
        <div>{props.job.description}</div>
    </div>
</div>

const TimelineMobile = (props: { jobs: Job[] }) => {
    return <div className="flex flex-col slideshow sm:hidden">
        {props.jobs.map(j => <JobMobile job={j} key={j.name} />)}
    </div>
}

const CareerPage = () => <div className="flex flex-col gap-y-4">
    <div className="mb-4">
        <PageHeader className="mb-4">My Career</PageHeader>
        <SubHeader className="mb-4">My Career Path</SubHeader>
        <Timeline jobs={jobs} />
        <TimelineMobile jobs={jobs} />
    </div>
    <div>
        <SubHeader className="mb-4">Short Term Projects and Contracts</SubHeader>
        <Timeline jobs={otherProjects} />
        <TimelineMobile jobs={otherProjects} />
    </div>
    <Link href="https://s3.amazonaws.com/kylesutton-personal-website-photos/documents%2FRESUME_KYLE_SUTTON.pdf" target="_blank" className="flex items-center contact-link" download><FontAwesomeIcon className="icon" icon={faFile} />Download my Resume</Link>
</div>;
export default CareerPage;