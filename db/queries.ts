import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { courses, userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

interface UserProgressData {
    userId: string;
    userName: string;
    userImageSrc: string;
    activeCourseId: number | null;
    hearts: number;
    points: number;
    activeCourse: { id: number; title: string; imageSrc: string; } | null;
}

export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db.query.userProgress.findMany({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true,
        }
        },
    );

    return data
})


export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();
    return data;
})

export const getCourseById = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        // TODO: Populate units and lessons
    });

    return data;
});