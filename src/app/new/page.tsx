"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const formSchema = z.object({
  courseName: z.string().min(2, {
    message: "Course Name must be at least 2 characters.",
  }), teacherName: z.string().min(2, {
    message: "Teacher Name must be at least 2 characters.",
  }), 
})

export default function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      teacherName: "",
    },
  })
 

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  // ...

  return (
    <div className="max-w-xl mx-auto">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="courseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Course Name" {...field} />
              </FormControl>
              <FormDescription>
                Please enter your desired course name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Teacher Name" {...field} />
              </FormControl>
              <FormDescription>
                Please enter your desired teacher's name.
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
