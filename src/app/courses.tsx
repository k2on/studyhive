"use client"
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";



export function Courses() {
    const {data} = api.course.getJoined.useQuery();
  
    return (
      data?.map((course) => (
        <Link href={course.id}> 
        <Card key={course.id}>
              <CardHeader>
                <CardTitle>📚 {course.name}</CardTitle>
                <CardDescription>🧑‍🏫 {course.instructorName}</CardDescription>
              </CardHeader>
            </Card> 
        </Link>
        ))
    );
  }
  
