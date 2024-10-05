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