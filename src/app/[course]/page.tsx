import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { PlusIcon } from "lucide-react"

interface Props{
    params: {course: string};
}
export default async function Course({params }: Props) {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
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
           <h1 className="text-3xl font-bold">{params.course}</h1>
           <Button>
           <PlusIcon className="mr-2 h-4 w-4" /> Join Course
           </Button>
        </div>
        <div className="TeacherName">
            Teacher Name
        </div>
        <div className="pt-8 flex flex-col space-y-4">
        <div className="flex space-x-2">
           <Input placeholder="Search for class materials"/>
           <Button>
           <Link href="/new">
           <PlusIcon className="mr-2 h-4 w-4" /> New
           </Link>
           </Button>
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
