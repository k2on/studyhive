"use client"

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";
import { CommandDialog, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from "~/components/ui/command";
import { api } from "~/trpc/react";



export function Search(){
    const [open, setOpen] = React.useState(false);
    const {data} = api.course.getAll.useQuery();
    const router = useRouter();

    return(
    <>
      <Button variant="outline" className="w-full justify-left" onClick={() => setOpen(true)}>
        <SearchIcon className="w-4 h-4 mr-2" />
                Discover New Courses
            </Button>   
        <CommandDialog open={open} onOpenChange={setOpen}>
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup> 
        {data?.map((course) =>
        <CommandItem onSelect={() => router.push(course.id)}>{course.name}</CommandItem>
        )}
      </CommandGroup>
    </CommandList>
  </CommandDialog>
  </>
)};