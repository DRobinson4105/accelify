import React from "react";
import { useState } from "react";
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

const TableProduct = ({ element }: { element: TableElement | null }) => {
    const [rows, setRows] = useState(0);
    return(
        <div>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">${element?.name}</TableCell>
              <TableCell>${element?.description}</TableCell>
              <TableCell>${element?.implemented}</TableCell>
            </TableRow>
          </TableBody>
        </div>
    )
}

export default TableProduct;