"use client"

import { courseMaterials } from "~/server/db/schema";
import Link from "next/link";
import { api } from "~/trpc/react"
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";


export function Materials(){
    const {data} = api.materials.getAll.useQuery();

    return data?.map(item) => (
    <Link href={materialsRouter.id}>
    <Card key={item.assignment_name}>
      <CardHeader>
        <CardTitle>{item.assignment_name}</CardTitle>
        <CardDescription>{item.description_name}</CardDescription>
      </CardHeader>
    </Card>
    </Link>
  )
    };