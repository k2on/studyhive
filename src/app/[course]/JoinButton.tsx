"use client";
import { eq } from "drizzle-orm";
import { BabyIcon, BeanIcon, CheckIcon, NutIcon, PencilRulerIcon, PlusIcon } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { usersToCourses } from "~/server/db/schema";
import { api } from "~/trpc/react";

interface JoinParams {
  course: string
}
export function JoinButton({ course }: JoinParams) {
  noStore();

  const util = api.useUtils();
  const { data, isLoading } = api.course.isInCourse.useQuery({ courseID: course });
  const { mutate: join } = api.course.joinCourse.useMutation({ onSuccess() {
    util.course.isInCourse.invalidate();
  }});
  const { mutate: leave } = api.course.leaveCourse.useMutation({ onSuccess() {
    util.course.isInCourse.invalidate();
  }});

  if (isLoading) {
    return (
    <Button disabled>
      <PencilRulerIcon className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </Button>
    )
  }

  return data
  ? (
    <Button onClick={() => { leave({ courseID: course }) }}>
      <CheckIcon className="mr-2 h-4 w-4 inline-block" /> Joined Course
    </Button>
    )
  : (
    <Button onClick={() => { join({ courseID: course }) }}>
      <PlusIcon className="mr-2 h-4 w-4 inline-block" /> Join Course
    </Button>
  )
}
