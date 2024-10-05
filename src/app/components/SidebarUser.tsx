import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const SidebarUser = () => {
  return (
    <div className = "position absolute flex flex-col w-[200px] border -r min-h-screen p-4 flex items-center justify-between">
      <div>
        <div>
          Settings
        </div>
        <Link href='/signin'>
            <Button>Logout</Button>
        </Link>
      </div>
      <div className='flex mx-8 my-4'>
      <Image
            src={"/images/servicenow-header-logo.png"}
            width={150}
            height={110}
            alt="logo"
          />
      </div>
    </div>
  )
}

export default SidebarUser