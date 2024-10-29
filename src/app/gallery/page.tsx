"use client";

import { Loader } from "../components/Loader";
import { viewAlbum } from "@/util/s3";
import * as O from "effect/Option";
import { useStableO } from "effect-ts-react-stable-hooks";
import Image from "next/image";
import { useState } from "react";
import { useIsomorphicLayoutEffect } from "react-spring";
import { PageHeader, SubHeader } from "../components/Headers";

import "./gallery.css";

const albums = ["skiing", "cooking", "climbing"] as const;

type ViewerProps = { photos: string[], index: number };

const Viewer = (props: ViewerProps & { closeModal: () => void }) => {
    const [index, setIndex] = useState(props.index);

    const viewNext = () => setIndex(i => i + 1 >= props.photos.length ? i : i + 1);
    const viewPrev = () => setIndex(i => i - 1 < 0 ? 0 : i - 1);

    const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "ArrowLeft") {
            viewPrev();
        }
        if (ev.key === "ArrowRight") {
            viewNext();
        }
        if (ev.key === "Escape") {
            props.closeModal();
        }
    };

    useIsomorphicLayoutEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return <div className="absolute z-30 top-0 left-0 right-0 h-screen w-screen viewer-background">
        <Image
            src={props.photos[index]}
            alt={props.photos[index]}
            fill
            className="object-contain"
        />
        {index > 0 && <button className="absolute opacity-0 hover:opacity-100 flex left-0 top-0 bottom-0 flex-col justify-center items-center w-16 text-2xl" onClick={viewPrev}>
            <div className="w-8 h-8 rounded-full flex justify-center items-center viewer-background pr-1">❮</div>
        </button>}
        {index < props.photos.length - 1 && <button className="absolute opacity-0 hover:opacity-100 flex right-0 top-0 bottom-0 flex-col justify-center items-center w-16 text-2xl" onClick={viewNext}>
            <div className="w-8 h-8 rounded-full flex justify-center items-center viewer-background pl-1">❯</div>
        </button>}
        <button className="absolute rounded-full right-4 top-4 w-8 h-8 flex justify-center items-center text-4xl viewer-background" onClick={props.closeModal}>×</button>
    </div >
}

const getAlbumName = (albumName: typeof albums[number]): string => {
    switch (albumName) {
        case "climbing":
            return "Climbing and Hiking";
        case "cooking":
            return "Cooking and Baking";
        case "skiing":
            return "Skiing and Snowboarding";
    }
}

const GalleryPage = () => {
    const [viewerOpen, setViewerOpen] = useStableO<ViewerProps>(O.none())
    return <div>
        <PageHeader className="mb-4">Gallery</PageHeader>
        <div>Here&apos;s a taste of some of the stuff I&apos;ve been up to in my free time! Not all pictures were taken by me, but I try to keep this updated with recent photos when I have them.</div>
        {albums.map(a =>
            <div className="mb-4 mt-4" key={a}>
                <SubHeader className="mb-2">{getAlbumName(a)}</SubHeader>
                <Loader key={a} requestKey={a} request={viewAlbum(a)}>
                    {(photos) => <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))" }}>
                        {photos.map((p, idx) => <button
                            className="relative photo-button"
                            key={p}
                            onClick={() => {
                                setViewerOpen(O.some({ photos, index: idx }));
                                document.body.classList.add("modal-open");
                            }}
                        >
                            <Image
                                src={p}
                                fill
                                alt={p}
                                sizes="99vw"
                                className="object-cover"
                                priority
                            />
                        </button>)}
                    </div>}
                </Loader>
            </div>
        )}
        {O.match(viewerOpen, {
            onNone: () => <></>,
            onSome: props => <Viewer
                {...props}
                closeModal={() => {
                    setViewerOpen(O.none);
                    document.body.classList.remove("modal-open");
                }}
            />
        })}
    </div>;
};

export default GalleryPage