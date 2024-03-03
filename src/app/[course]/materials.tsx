"use client"

import { courseMaterials } from "~/server/db/schema";
import Link from "next/link";
import { api } from "~/trpc/react"
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useParams } from "next/navigation";
import { Props } from "./page";
import { PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { Input } from "~/components/ui/input";
import { useState } from "react";


export function Materials(){
    const {course} = useParams<Props["params"]>()
    const {data} = api.materials.getAll.useQuery(course);
    const [search, setSearch] = useState("");

    return <div>
      
      <div className="flex space-x-2">
           <Input value={search} onChange={(e) => setSearch(e.target.value)}   placeholder="Search for materials"/>
              <Link href={course + "/new"}>
                <Button className="flex justify-center align-center">
                    <PlusIcon className="mr-2 h-4 w-4 inline-block" /> New
                </Button>
              </Link>
        </div>
      {

    data?.filter(item => item.name?.toLowerCase().includes(search.toLowerCase())).map((item) => (
    <Link href={item.courseID + "/" + item.id}>
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.term}</CardDescription>
      </CardHeader>
    </Card>
    </Link>
  ))}
  </div>
    };