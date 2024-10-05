import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
const Navbar = () => {
  return (
    <nav>
        <div className = "mx-auto justify-between w-screen border flex">
            <div>
            <Image
                  src={"/images/pfp.jpg"}
                  width={100}
                  height={100}
                  alt="Kanami"
                />
            </div>
            <div className='gap-x-4 flex mx-3 my-3'>
                <Link href='/Sign in'>
                    <Button>About us</Button>
                </Link>
                <Link href='/signup'>
                    <Button>Sign in</Button>
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar