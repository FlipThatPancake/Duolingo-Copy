import { Button } from "@/components/ui/button"
import Image from "next/image"

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-b-2 border-slate-200 p-2">

            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/United States.svg" alt="United States" width={32} height={40} className="mr-4 rounded-md" />
                    English
                </Button>
            </div>

        </footer>
    )
}