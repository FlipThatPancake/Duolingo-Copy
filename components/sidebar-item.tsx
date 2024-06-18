"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
    label: string;
    iconSrc: string;
    href: string;
    imageClassName?: string;
    height?: number;
    width?: number;
};

export const SidebarItem = ({ label, iconSrc, href, imageClassName, width = 28, height = 28 }: Props) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Button
            variant={isActive ? "sidebarOutline" : "sidebar"}
            className="justify-start h-[52px]" asChild>
            <Link href={href}>
                {/* <div className="inline-flex items-center justify-center w-9 h-9 mr-4"> */}
                <Image
                    src={iconSrc}
                    alt={label}
                    height={height} width={width}
                    className={cn(imageClassName || '', "mr-5")}
                />
                {/* </div> */}

                {label}
            </Link>
        </Button>
    )
}

// SidebarItem.defaultProps = {
//     height: 28,
//     width: 28,
// }