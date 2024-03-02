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
    { assignment_name: 'Ex. Test 1', description_name: 'Printing "Hello World", Arrays, ...' },
    { assignment_name: 'Ex. Test 2', description_name: 'Functions, Pointers, ...' },
    // Add more items as needed
  ];


  return (
    <main className="">
      <div className="max-w-xl mx-auto pt-4">
        <div className="flex space-x-2 justify-between">
           <h1 className="3text-xl font-bold">{params.course}</h1>
           <Button>
           <Link href="/new">
           <PlusIcon className="mr-2 h-4 w-4" /> Join Course
           </Link>
           </Button>
        </div>
        <div className="TeacherName">
            Teacher Name
        </div>
        <div className="pt-8 flex flex-col space-y-4">
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
