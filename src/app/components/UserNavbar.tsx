import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
const UserNavbar = () => {
  return (
    <nav>
        <div className = "mx-auto justify-between w-screen border flex">
            <div className='flex mx-8 my-4'>
            </div>
            <div className='gap-x-4 flex mx-3 my-3'>
                <Link href="">
                    <Button>Sigma</Button>
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default UserNavbar