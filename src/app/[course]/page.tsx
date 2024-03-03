import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { getServerAuthSession } from "~/server/auth";
import { PlusIcon } from "lucide-react"
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { courses } from "~/server/db/schema";
import { Materials } from "./materials";

import { JoinButton } from "./JoinButton";

export interface Props {
    params: {course: string};
}

export default async function Course({params }: Props) {
  noStore();

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, params.course)
  })

if (!course) {
    return "course not found"
}

const session = await getServerAuthSession();



  return (
    <main className="">
      <div className="max-w-xl mx-auto pt-4">
        <div className="flex space-x-2 justify-between">
           <h1 className="text-3xl font-bold">{course.name}</h1>
           {session && session.user && <JoinButton course={course.id} />}
        </div>
        <div className="TeacherName">
            {course.instructorName}
        </div>
        <div className="pt-8 flex flex-col space-y-4">
        <div className="flex space-x-2">
           <Input placeholder="Search for class materials"/>
           {session?.user && (
              <Link href={course.id + "/new"}>
                <Button className="flex justify-center align-center">
                    <PlusIcon className="mr-2 h-4 w-4 inline-block" /> New
                </Button>
              </Link>
            )}
        </div>
        
        <Materials />
        </div>
      </div>
    </main>
  );
}
