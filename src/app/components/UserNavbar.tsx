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

// // src/app/dashboard/page.tsx
// import { cookies } from 'next/headers'
// import jwt from 'jsonwebtoken'

// const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'

// export default async function DashboardPage() {
//   // Retrieve the cookie
//   const cookieStore = cookies()
//   const token = cookieStore.get('token')?.value

//   // If no token, redirect to login or show an error
//   if (!token) {
//     return <p>Please log in to access the dashboard.</p>
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, SECRET_KEY) as { id: string, email: string }

//     // Now you can access the user info from the decoded token
//     const userId = decoded.id
//     const userEmail = decoded.email

//     return (
//       <div>
//         <h1>Welcome to your dashboard, {userEmail}!</h1>
//         {/* You can now use the userId or other user data */}
//       </div>
//     )
//   } catch (error) {
//     console.error('Invalid token:', error)
//     return <p>Invalid token. Please log in again.</p>
//   }
// }
