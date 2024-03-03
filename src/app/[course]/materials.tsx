"use client"

import { courseMaterials } from "~/server/db/schema";
import Link from "next/link";
import { api } from "~/trpc/react"
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useParams } from "next/navigation";
import { Props } from "./page";


export function Materials(){
    const {course} = useParams<Props["params"]>()
    const {data} = api.materials.getAll.useQuery(course);

    return data?.map((item) => (
    <Link href={item.id}>
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.courseID}</CardDescription>
      </CardHeader>
    </Card>
    </Link>
  ))
    };