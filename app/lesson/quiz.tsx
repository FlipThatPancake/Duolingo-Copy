"use client";

import { toast } from "sonner";
import { challengeOptions, challenges, lessons } from "@/db/schema";
import { useEffect, useState, useTransition } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize } from "react-use";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";


type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription: any; // TODO: replace with subscription DB type
}

export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
}: Props) => {
    // Fetch width and height for Confetti
    const { width, height } = useWindowSize();

    // router to route/redirect pages (continue button)
    const router = useRouter();

    // Audio
    const [
        correctAudio,
        _c, // not using the second argument
        correctControls,
    ] = useAudio({ src: "/correct.wav" });

    const [
        incorrectAudio,
        _i, // not using the second argument
        incorrectControls,
    ] = useAudio({ src: "/incorrect.wav" });

    const [
        lessonCompleteAudio,
        _l, // not using the second argument
        lessonCompleteControls,
    ] = useAudio({ src: "/success-jingle.mp3" });

    const [pending, startTransition] = useTransition();

    const [lessonId] = useState(initialLessonId);

    const [hearts, setHearts] = useState(initialHearts); // 50 || initialHearts to set hearts to 50
    const [percentage, setPercentage] = useState(initialPercentage); // 50 || percentage to set hearts to 50
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex !== -1 ? uncompletedIndex : 0;
    });

    const [selectedOption, setSelectedOption] = useState<number | undefined>(); // responsible for reaction on selected
    const [status, setStatus] = useState<"none" | "correct" | "wrong">("none"); // status state for reaction on selected

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        };

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        };

        const correctOption = options.find((option) => option.correct);

        if (!correctOption) {
            console.log("No correct option. Error.")
            return;
        }

        if (correctOption && correctOption.id === selectedOption) {
            console.log("Correct option");
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        // if (response?.error === "hearts") {
                        //     console.error("Missing hearts");
                        //     return;
                        // }

                        correctControls.play(); // play sound
                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        // This is a practice
                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));
                        }
                    })
                    .catch(() => toast.error("Something went wrong!"));
                });
        } else {
            console.error("Wrong option");
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            console.error("Missing hearts");
                            return;
                        }

                        incorrectControls.play(); // play sound
                        setStatus("wrong");

                        if (!response?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => toast.error("Something went wrong. Try again."));
            })
        }
    };

    const onSelect = (id: number) => {
        if (status !== "none")
            return;

        setSelectedOption(id);
    }; // triggers on select status on click of answer

    // Lesson completed
    // TODO: remove true
    if (true || !challenge) {

        // TODO: Figure out how to play success sound on lesson complete

        return (
            <>
                <Confetti
                    width={width} // works with useWindowSize
                    height={height} // works with useWindowSize
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image
                        src="/lesson-complete.svg"
                        alt="Lesson completed"
                        className="hidden lg:black"
                        height={100}
                        width={100}
                    />
                    <Image
                        src="/lesson-complete.svg"
                        alt="Lesson completed"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great job! <br /> You&aposve completed the lesson
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant="points"
                            value={challenges.length * 10} // TODO: change magic number 10 to constant
                        />
                        <ResultCard
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")} // Redirects to /learn page
                />
            </>
        )
    }

    const title = challenge.type === "ASSIST"
        ? "Select the correct meaning"
        : challenge.question;

    return (
        <>
            {/* Render audio */}
            {incorrectAudio}
            {correctAudio}
            {lessonCompleteAudio}

            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[800px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-center font-bold text-neutral-700">
                            { title }
                        </h1>
                        <div>
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question} />
                            )}
                            <Challenge
                                options={options}
                                onSelect={onSelect}
                                status={status} // none is default, can be correct or wrong too
                                selectedOption={selectedOption}
                                disabled={false}
                                type={challenge.type}/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
        );
    };