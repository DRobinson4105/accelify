import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
const Navbar = () => {
  return (
    <nav>
        <div className = "mx-auto justify-between w-screen border flex">
            <div className='flex mx-8 my-4'>
            <Image
                  src={"/images/servicenow-header-logo.png"}
                  width={200}
                  height={100}
                  alt="Kanami"
                />
            </div>
            <div className='gap-x-4 flex mx-3 my-3'>
                <a target="_blank" href="https://devpost.com/software/servicenow-connect">
                    <Button>About us</Button>
                </a>
                <Link href='/signup'>
                    <Button>Sign in</Button>
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar