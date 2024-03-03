import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { courseMaterials, courses } from "~/server/db/schema";
import { AddQuestion, Questions } from "./questions";

export interface Props{
    params: {
        course: string,
        materials: string,
    };
}
export default async function Material({ params }: Props) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, params.course)
    });
    if (!course) return "Course";

    const material = await db.query.courseMaterials.findFirst({
        where: eq(courseMaterials.id, params.materials)
    });
    if (!material) return "Material not found";

    return <div className="max-w-xl mx-auto">
        <div className="flex space-x-2 justify-between">
           <h1 className="text-3xl font-bold">{material.name}</h1>
        </div>
        <div>
            {material.term} - {course.name} - {course.instructorName}
        </div>
        <Questions />
        <AddQuestion />
    </div>
}
