import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

type Props = {
    title: string;
    id: number;
    imageSrc: string;
    onClick: (id: number) => void;
    disabled?: boolean;
    active?: boolean;
}

export const Card = ({
    title,
    id,
    imageSrc,
    onClick,
    disabled,
    active,
}: Props) => {

    return (
        <div
            onClick={() => !disabled && onClick(id)}
            className={cn(
                "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col p-3 pb-6 min-h-[217px] min-w-[200px]",
                disabled && "pointer-events-none opacity-50"
            )}
        >
            <div className="min-h-[24px] w-full flex items-center justify-end mb-2">
                {active ? (
                    <div className="rounded-md bg-blue-600 flex items-center justify-center p-1.5">
                        <Check className="text-white stroke-[4] h-4 w-4" />
                    </div>
                ) : (
                    <div className="h-4 w-4 m-1.5"></div>
                )}
            </div>
            <div className="flex-grow flex flex-col items-center">
                <Image
                    src={imageSrc}
                    alt={title}
                    width={90}
                    height={90}
                    layout="intrinsic"
                    className="rounded-lg drop-shadow-md object-cover min-h-5"
                />
                <div className="w-full mt-3 flex-grow flex items-end justify-center">
                    <p className="text-neutral-700 font-bold text-center">
                        {title}
                    </p>
                </div>
            </div>
        </div>
    )
}