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
                  src='/kanami.png'
                  width={100}
                  height={100}
                  alt="Kanami"
                />
            </div>
            <div>
                <Link href='/Sign in'>
                    <Button></Button>
                </Link>
                <Link href='/Sign in'>
                    <Button>Sign in</Button>
                </Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar