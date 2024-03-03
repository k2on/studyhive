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

import { JoinButton } from "./JoinButton";

interface Props {
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

  interface Item {
    assignment_name: string;
    description_name: string;
  }

  const items: Item[] = [
    { assignment_name: 'Ex. Exam 1', description_name: 'Fall 2023: Printing "Hello World", Arrays, ...' },
    { assignment_name: 'Ex. Exam 2', description_name: 'Fall 2023: Functions, Pointers, ...' },
    // Add more items as needed
  ];

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
              <Link href={"./new"}>
                <Button className="flex justify-center align-center">
                    <PlusIcon className="mr-2 h-4 w-4 inline-block" /> New
                </Button>
              </Link>
            )}
        </div>
        
        {items.map((item) => (
    
        <Card key={item.assignment_name}>
          <CardHeader>
            <CardTitle>{item.assignment_name}</CardTitle>
            <CardDescription>{item.description_name}</CardDescription>
          </CardHeader>
        </Card>
      ))}
        </div>
      </div>
    </main>
  );
}

<<<<<<< HEAD
||||||| eba5cd7
interface JoinParams {
  course: string
}
async function JoinButton({course  }: JoinParams) {
  noStore();

  const session = await getServerAuthSession();

  const isInCourse = await db.query.usersToCourses.findFirst({
    where: eq(usersToCourses.courseID, course) && eq(usersToCourses.userID, session!.user.id),
  }) !== undefined;

  return isInCourse
  ? (
      <Button>
       <CheckIcon className="mr-2 h-4 w-4 inline-block" /> Joined Course
      </Button>
    )
  : (
    <Button>
      <PlusIcon className="mr-2 h-4 w-4 inline-block" /> Join Course
    </Button>
  )
}
=======
interface JoinParams {
  course: string
}
async function JoinButton({course  }: JoinParams) {
  noStore();

  const session = await getServerAuthSession();

  const isInCourse = await db.query.usersToCourses.findFirst({
    where: eq(usersToCourses.courseID, course) && eq(usersToCourses.userID, session!.user.id),
  }) !== undefined;

  return isInCourse
  ? (
      <Button className="flex justify-center align-center">
       <CheckIcon className="mr-2 h-4 w-4 inline-block" /> Joined Course
      </Button>
    )
  : (
    <Button className="flex justify-center align-center">
      <PlusIcon className="mr-2 h-4 w-4 inline-block" /> Join Course
    </Button>
  )
}
>>>>>>> ee564693c2912a7f889a84b1c7a4c3e4d4ad1103
