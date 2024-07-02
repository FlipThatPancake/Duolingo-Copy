import { Button } from "@/components/ui/button"
import { ClerkLoaded, ClerkLoading, SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <>

      {/* Hero Section */}
      <div className="max-w-[998px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">

        {/* Hero picture */}
        <div className="relative w-[240px] h-[240px] lg:w-[320px] lg:h-[320px] mb-8 lg:mb-0 lg:mr-8">
          <Image src="/friends.svg" alt="friends" fill />
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center gap-y-8">
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
            Learn, practice, and master English with MideaLingo.
          </h1>

          {/* Hero buttons */}
          <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
            {/* Clerk loading animation */}
            <ClerkLoading>
              <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            </ClerkLoading>

            {/* If Clerk loaded */}
            <ClerkLoaded>

              {/* If user is Signed out */}
              <SignedOut>
                <SignUpButton mode="modal">
                <Button size="lg" variant="secondary" className="w-full">
                  Get Started
                  </Button>
                </SignUpButton>

                <SignInButton mode="modal">
                <Button size="lg" variant="primaryOutline" className="w-full">
                  I already have an account
                  </Button>
                </SignInButton>
              </SignedOut>

              {/* If user is Signed in */}
              <SignedIn>
                <Button size="lg" variant="secondary" className="w-full" asChild>
                  <Link href="/learn">
                    Continue Learning
                  </Link>
                </Button>
              </SignedIn>
            </ClerkLoaded>
          </div>

        </div>
      </div>
    </>
  )
}
