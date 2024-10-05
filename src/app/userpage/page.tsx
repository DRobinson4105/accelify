import Link from "next/link"
import { Button } from "@/components/ui/button"
import UserNavbar from "../components/UserNavbar";
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Define the user type based on what you expect from JWT
interface User {
  id: string;
  email: string;
  name: string;
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'

export default async function Page() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  let user: User | null = null // Use the User type here

  if (token) {
    try {
      // Decode the JWT token and cast the result to User type
      user = jwt.verify(token, SECRET_KEY) as User
    } catch (error) {
      console.error("Error decoding JWT:", error)
    }
  }

  return (
    <div>
      <UserNavbar user={user}/>
      <div className="grid grid-column-2 grid-flow-col gap-y-10 divide-x">
        <div className="w-full">
          <Card className="mx-auto w-[250px] h-[250px] my-5">
            <CardHeader>
              <CardTitle className="text-xl">User Info</CardTitle>
              <CardDescription>
                Manage product and industry info
              </CardDescription>
              <div>

              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="w-full">
          <Card className="mx-auto w-[250px] h-[250px] my-5">
            <CardHeader>
              <CardTitle className="text-xl">Recommend</CardTitle>
              <CardDescription>
                Get new product recommendations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
