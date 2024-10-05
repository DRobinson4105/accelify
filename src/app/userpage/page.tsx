import Link from "next/link"
import { Button } from "@/components/ui/button"
import SidebarUser from "../components/SidebarUser";
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
      <SidebarUser></SidebarUser>
      <div className="grid-rows-2">
        <Card className="mx-auto max-w-sim">
          <CardHeader>
            <CardTitle className="text-xl">History</CardTitle>
            <CardDescription>
              Access previous recommendations
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
        <CardHeader>
            <CardTitle className="text-xl">Recommend</CardTitle>
              <CardDescription>
                Get new recommendations
              </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
