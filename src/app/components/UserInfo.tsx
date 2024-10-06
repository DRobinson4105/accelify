"use client";
import { useState } from "react";
import React from "react";

import { Button } from "@/components/ui/button";
import ComboBoxInput from "./ComboBoxInput";
import TableProduct from "./TableProduct";

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

interface Type {
    list: [];
    name: string;
}

interface TableElement {
  name: string;
  description: string;
  implemented: boolean;
}

const UserInfo = () => {
    let type: Type | null = null;
    let element: TableElement | null = null
    // const industries = [
    //     {
    //       value: "test1",
    //       label: "test1",
    //     },
    //     {
    //       value: "test2",
    //       label: "test2",
    //     },
    // ]

    // const typeIndustries: Type {
    //     list: industries,
    //     name: "industries"
    //   };

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
                <ComboBoxInput type={type}/>
              </div>
              <div className="mx-auto">
                Products
                <ComboBoxInput type={type}/>
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