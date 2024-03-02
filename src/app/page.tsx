import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { PlusIcon } from "lucide-react"

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();


  interface Item {
    class_name: string;
    teacher_name: string;
  }

  const items: Item[] = [
    { class_name: 'Ex. Class 1', teacher_name: 'Teacher 1' },
    { class_name: 'Ex. Class 2', teacher_name: 'Teacher 2' },
    // Add more items as needed
  ];


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
        {items.map((item) => (
        <Card key={item.class_name}>
            <CardHeader>
              <CardTitle>{item.class_name}</CardTitle>
              <CardDescription>{item.teacher_name}</CardDescription>
            </CardHeader>
          </Card>
      ))}
          
        </div>
      </div>
    </main>
  );
}
