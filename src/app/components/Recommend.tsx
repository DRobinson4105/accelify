"use client";
import { useState } from "react";
import React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const Recommend = () => {
    interface Type {
      list: [];
      name: string;
    }
    return(
        <div className="w-full h-full">
        <Card className="mx-auto w-5/6 h-5/6 my-5">
          <CardHeader>
            <CardTitle className="text-xl">Recommend</CardTitle>
            <CardDescription>
              Get new product recommendations
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
}

export default Recommend