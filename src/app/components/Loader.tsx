"use client";

import { ReactElement } from "react";
import * as O from "effect/Option";
import { useIsomorphicLayoutEffect } from "react-spring";
import { useStableO } from "effect-ts-react-stable-hooks";

type Request<A> = (onError: (err: string) => void, onSuccess: (data: A) => void) => void

export const Loader = <A,>(props: { request: Request<A>, children: (data: A) => ReactElement }) => {
    const [err, setErr] = useStableO<string>(O.none());
    const [data, setData] = useStableO<A>(O.none());
    useIsomorphicLayoutEffect(
        () => props.request(e => setErr(O.some(e)), d => setData(O.some(d))),
        []
    );
    const isLoading = O.isNone(err) && O.isNone(data);
    return <div>
        {isLoading && <div className="w-full flex justify-center h-48 items-center"><div className="loading" /></div>}
        {O.match(err, {
            onNone: () => <></>,
            onSome: err => <div>{err}</div>
        })}
        {O.match(data, {
            onNone: () => <></>,
            onSome: props.children,
        })}
    </div>
}