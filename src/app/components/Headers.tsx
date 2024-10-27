import { PropsWithChildren } from "react";

export const PageHeader = (props: PropsWithChildren<{ className?: string }>) => <div className={`${props.className} text-4xl font-bold`}>{props.children}</div>;
export const SubHeader = (props: PropsWithChildren<{ className?: string }>) => <div className={`${props.className} text-2xl font-semibold`}>{props.children}</div>