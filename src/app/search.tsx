"use client"

import { SearchIcon } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { CommandDialog, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from "~/components/ui/command";



export function Search(){
    const [open, setOpen] = React.useState(false)

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
      <CommandGroup heading="Suggestions">
        <CommandItem>Calendar</CommandItem>
        <CommandItem>Search Emoji</CommandItem>
        <CommandItem>Calculator</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
  </>
)};