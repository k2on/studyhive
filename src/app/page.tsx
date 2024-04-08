import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { PlusIcon } from "lucide-react"
import { Courses } from "./courses";
import { Search } from "./search";

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
        <div className="flex justify-between space-x-2">
          <Search />


           <Link href="/new">
           <Button className="flex justify-center align-center">
           <PlusIcon className="mr-2 h-4 w-4 inline-block" /> New
           </Button>
           </Link>
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
