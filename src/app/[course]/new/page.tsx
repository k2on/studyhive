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
  materialName: z.string().min(2, {
    message: "Material Name must be at least 2 characters.",
  }),
  term: z.string().min(2, {
    message: "Term must be at least 2 characters.",
  }),
})

export default function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialName: "",
      term: "",
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