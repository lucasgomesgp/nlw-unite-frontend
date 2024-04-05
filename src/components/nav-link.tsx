import { ComponentProps } from "react";

interface NavLinkProps extends ComponentProps<"a"> {
    children: string;
}
export function NavLink(props: NavLinkProps) {
    return (
        <a className="text-sm font-medium text-zinc-300" {...props}>
            {props.children}
        </a>
    );
}
