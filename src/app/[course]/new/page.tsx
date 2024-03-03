"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "~/trpc/react"
import { v4 } from "uuid"

import Link from "next/link";

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  materialName: z.string().min(2, {
    message: "Material Name must be at least 2 characters.",
  }), term: z.string().min(2, {
    message: "Term must be at least 2 characters.",
  }),
})

interface Props {
  params: {course: string};
}
export default function NewCourseMaterial({ params }: Props) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialName: "",
      term: "",
    },
  })
 
  const router = useRouter()
  const { mutate } = api.materials.create.useMutation({
    onSuccess(data, variables, context) {
      router.push(variables.id)
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate({
      materialName: values.materialName,
      term: values.term,
      id: v4(),
      courseId: params.course,
    })
    console.log(values)
  }
  // ...

  return (
    <div className="max-w-xl mx-auto">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="materialName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Material Name" {...field} />
              </FormControl>
              <FormDescription>
                Please enter the name of the material.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <FormControl>
                <Input placeholder="Enter Term" {...field} />
              </FormControl>
              <FormDescription>
                Please enter term for course material.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  )
}
