import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CheckIcon, PlusIcon } from "lucide-react"
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { courses, usersToCourses } from "~/server/db/schema";
import { useParams } from "next/navigation";

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
           <Link href={"/" + course.id + "/new"}>

           <Button>
           <PlusIcon className="mr-2 h-4 w-4" /> New
           </Button>
           </Link>

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