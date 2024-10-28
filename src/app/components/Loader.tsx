"use client";

import { ReactElement } from "react";
import * as O from "effect/Option";
import useSWR from "swr";
import { Effect } from "effect";

export const Loader = <A,>(props: { request: Effect.Effect<A, string>, requestKey: string, children: (data: A) => ReactElement }) => {
    const { isLoading, error, data } = useSWR(props.requestKey, () => Effect.runPromise(props.request));
    return <div>
        {isLoading && <div className="w-full flex justify-center h-48 items-center"><div className="loading" /></div>}
        {O.match(O.fromNullable(error), {
            onNone: () => <></>,
            onSome: err => <div>{err}</div>
        })}
        {O.match(O.fromNullable(data), {
            onNone: () => <></>,
            onSome: props.children,
        })}
    </div>
}