"use client";
import { useState } from "react";
import React from "react";

import { Button } from "@/components/ui/button";
import ComboBoxInput from "./ComboBoxInput";
import TableProduct from "./TableProduct";
import { ChevronRight } from "lucide-react";

import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface TableElement {
  name: string;
  description: string;
  implemented: boolean;
}

const UserInfo = () => {

  const element: TableElement | null = null;
    const industries = [
        {
          value: "test1",
          label: "test1",
        },
        {
          value: "test2",
          label: "test2",
        },
    ]

    const products = [
      {
        value: "testProduct1",
        label: "testProduct1",
      },
      {
        value: "testProduct2",
        label: "testProduct2",
      },
    ]

    const handleIndustryInput = async (e: React.FormEvent) => {

    }

    const handleProductInput = async (e: React.FormEvent) => {

    }

    const [data, setData] = useState<TableElement[]>()
    return(
        <div className="w-full h-full">
        <Card className="mx-auto w-5/6 h-5/6 my-5">
          <CardHeader>
            <CardTitle className="text-xl">User Info</CardTitle>
            <CardDescription>
              Manage product and industry info
            </CardDescription>
            <div className="grid grid-row-2 gap-y-10">
              <div className="mx-auto">
                Industry
                <div className="flex grid-column-2 gap-x-3">
                  <ComboBoxInput
                    type={{ list: industries, name: "Industries"}}
                    onSelect={handleIndustryInput}/>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
              <div className="mx-auto">
                Products
                <div className="flex grid-column-2 gap-x-3">
                  <ComboBoxInput
                  type={{ list: products, name: "Products"}}
                  onSelect={handleProductInput}/>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4"/>
                  </Button>
                </div>
                <div className="my-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Implemented</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableProduct element={element}/>
                  </Table>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
}

export default UserInfo