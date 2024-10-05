import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const SidebarUser = () => {
  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button size="icon" className='absolute left-3 top-3'>
          <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side={'left'} className='w-[300px]'>
    <div className='grid gap-y-10'>
      <SheetHeader className=''>
        <SheetTitle>Navigation</SheetTitle>
      </SheetHeader>
        <Button>
          Logout
        </Button>
      </div>
    </SheetContent>
  </Sheet>
  )
}

export default SidebarUser