import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import UserNavbar from "../components/UserNavbar";
import Recommend from "../components/Recommend";
import UserInfo from "../components/UserInfo";
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
      <div className="grid grid-column-2 grid-flow-col h-[650px] divide-x">
        <UserInfo/>
        <Recommend/>
      </div>
      <UserNavbar user={user}/>
    </div>
  )
}
