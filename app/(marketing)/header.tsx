import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";

export const Header = () => (
    // Header section
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">

        {/* Header elements */}
        <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">

            {/* Logo */}
            <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                <Image src="/mascot_default_blue.svg" height={40} width={40} alt="Mascot" />
                <h1 className="text-2xl font-extrabold text-blue-500 tracking-wide">
                    MideaLingo
                </h1>
            </div>

            {/* Login / Signup / User */}
            <ClerkLoading>
                <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
                <SignedIn>
                    {/* User is Signed in */}
                    <UserButton afterSignOutUrl="/"/>
                </SignedIn>
                <SignedOut>
                    {/* User is Signed out */}
                    <SignInButton mode="modal">
                        <Button size="lg" variant="ghost">
                            Login
                        </Button>
                    </SignInButton>
                </SignedOut>
            </ClerkLoaded>

        </div>
    </header>
)