import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database...");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);


        await db.insert(schema.courses).values([
            {
                // id: 1, // id optional as courses table schema utilizes serial (auto increment). If integer, then need to pass id
                id: 1,
                title: "Microwave Oven Parts",
                imageSrc: "/microwave-oven.svg",
            },
            {
                id: 2,
                title: "Range Oven Parts",
                imageSrc: "/range-oven.svg",
            },
            {
                id: 3,
                title: "Vacuum Cleaner Parts",
                imageSrc: "/vacuum-cleaner.svg",
            },
            {
                id: 4,
                title: "Microwave Oven Manufacturing Process",
                imageSrc: "/factory.svg",
            }
        ]);

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1, // Microwave Oven Parts
                title: "Introduction",
                description: "Learn about the microwave ovens",
                order: 1,
            },
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1, // Unit 1 (Introduction)
                title: "Microwave Oven Basics",
                order: 1,
            },
            {
                id: 2,
                unitId: 1, // Unit 1 (Introduction)
                title: "Microwave Oven Components",
                order: 2,
            },
                        {
                id: 3,
                unitId: 1, // Unit 1 (Introduction)
                title: "Oven Features",
                order: 3,
            },
                                    {
                id: 4,
                unitId: 1, // Unit 1 (Introduction)
                title: "Foods",
                order: 4,
            },
                                                {
                id: 5,
                unitId: 1, // Unit 1 (Introduction)
                title: "Testing",
                order: 5,
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1, // Lesson 1 (Microwave Oven Basics)
                type: "SELECT",
                order: 1,
                question: 'Which is a microwave oven?',
            },
            {
                id: 2,
                lessonId: 1, // Lesson 2 (Microwave Oven Components)
                type: "SELECT",
                order: 1,
                question: 'Which is a magnetron?',
            }
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                id: 1,
                challengeId: 1, // Which is a microwave?
                text: "Microwave",
                correct: true,
                imageSrc: "/microwave-oven.svg",
                audioSrc: "/microwave-oven.mp3",
            },
            {
                id: 2,
                challengeId: 1,
                text: "Range oven",
                correct: false,
                imageSrc: "/range-oven.svg",
                audioSrc: "/range-oven.mp3",
            },
            {
                id: 3,
                challengeId: 1,
                text: "Vacuum cleaner",
                correct: false,
                imageSrc: "/vacuum-cleaner.svg",
                audioSrc: "/vacuum-cleaner.mp3",
            },
        ])

        console.log("Seeding finished.")
    } catch (error) {
        console.error(error);
        throw new Error("Failed to seed the database")
    }
}

main();