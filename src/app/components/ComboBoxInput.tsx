"use client";
import React from "react";

import { Button } from "@/components/ui/button";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

    import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Type {
    list: [];
    name: string;
}

const ComboBoxInput = ({type}: {type: Type | null}) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    return (
        <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
              >
            </Button>
          </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search industry..." />
            <CommandList>
              <CommandEmpty>No ${type?.name} found.</CommandEmpty>
              <CommandGroup>
                {type?.list.map((member: any) => (
                <CommandItem
                    key={member.value}
                    value={member.value}
                    onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    }}
                >
                {member.label}
                </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        </Popover>
        </div>
    )
}

export default ComboBoxInput;