import Link from "next/link"
import { Button } from "@/components/ui/button"
import SidebarUser from "../components/SidebarUser";
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

export default function page() {
  return (
    <div>
      <UserNavbar/>
      <SidebarUser/>
      <div className="grid grid-rows-2 grid-flow-col gap-y-10 my-5">
      <Card className="mx-auto w-[250px] h-[250px]">
        <CardHeader>
            <CardTitle className="text-xl">Recommend</CardTitle>
              <CardDescription>
                Get new recommendations
              </CardDescription>
          </CardHeader>
        </Card>
        <Card className="mx-auto w-[250px] h-[250px]">
          <CardHeader>
            <CardTitle className="text-xl">History</CardTitle>
            <CardDescription>
              Access previous recommendations
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

