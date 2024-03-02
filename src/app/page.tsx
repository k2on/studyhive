import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="">
      <div className="max-w-xl mx-auto pt-4">
        <div className="flex">
           <Input placeholder="Search for a class"/>
           <Button> New</Button>
        </div>
        <div className="pt-8 flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Name</CardTitle>
              <CardDescription>Teacher Name</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Class Name</CardTitle>
              <CardDescription>Teacher Name</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Class Name</CardTitle>
              <CardDescription>Teacher Name</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
