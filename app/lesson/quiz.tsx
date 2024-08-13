"use client";

import { challengeOptions, challenges } from "@/db/schema";
import { useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";

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

    const onSelect = (id: number) => {
        if (status !== "none")
            return;

        setSelectedOption(id);
    }; // triggers on select status on click of answer

    const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question;

    return (
        <>
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
                disabled={!selectedOption}
                status={status}
                onCheck={() => { }}
            />
        </>
        );
    };