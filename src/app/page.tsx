import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { PlusIcon } from "lucide-react"

async function Courses() {
  const courses = await api.courses.getJoined.query();

  return (
    courses.map((course) => (
        <Card key={course.course.id}>
            <CardHeader>
              <CardTitle>{course.course.name}</CardTitle>
              <CardDescription>{course.course.instructorName}</CardDescription>
            </CardHeader>
          </Card>
      ))
  );
}

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  interface Item {
    class_name: string;
    teacher_name: string;
  }


  return (
    <main className="">
      <div className="max-w-xl mx-auto pt-4">
        <div className="flex space-x-2">
           <Input placeholder="Search for a class"/>
           <Button>
           <Link href="/new">
           <PlusIcon className="mr-2 h-4 w-4" /> New
           </Link>
           </Button>
        </div>
        <div className="pt-8 flex flex-col space-y-4">
          {session?.user ?
            <Courses /> :
            <Link href="/api/auth/signin">
              <Button>Login</Button>
            </Link>
          }
        </div>
      </div>
    </main>
  );
}
