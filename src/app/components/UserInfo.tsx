"use client";
import { useState, useEffect } from "react";
import React from "react";

import { Button } from "@/components/ui/button";
import ComboBoxInput from "./ComboBoxInput";
import { ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableElement {
  name: string;
  description: string;
  implemented: boolean;
}

const UserInfo = () => {
  const [products, setProducts] = useState<{ value: string; label: string; description: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<TableElement | null>(null);
  const [addedProducts, setAddedProducts] = useState<TableElement[]>([]);

  // Fetch products from the database when the component mounts
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products"); // Call the API route we just created
        const data = await res.json();

        // Map the fetched products to the structure expected by ComboBoxInput
        const formattedProducts = data.map((product: any) => ({
          value: product.id, // Assuming `id` is the unique identifier for the product
          label: product.name,
          description: product.description,
        }));

        setProducts(formattedProducts); // Set the fetched products in state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  // Handle product selection from ComboBox
  const handleProductInput = (productValue: string) => {
    const selected = products.find((product) => product.value === productValue);
    if (selected) {
      setSelectedProduct({
        name: selected.label,
        description: selected.description,
        implemented: false,
      });
    }
  };

  // Add product to the table
  const handleAddProduct = () => {
    if (selectedProduct) {
      setAddedProducts((prev) => [...prev, selectedProduct]);
      setSelectedProduct(null); // Reset the selected product after adding
    }
  };

  return (
    <div className="w-full h-full">
      <Card className="mx-auto w-5/6 h-5/6 my-5">
        <CardHeader>
          <CardTitle className="text-xl">User Info</CardTitle>
          <CardDescription>Manage product and industry info</CardDescription>
          <div className="flex-col gap-y-10">
            <div className="mx-auto flex flex-col">
              Products
              <div className="flex grid-column-2 gap-x-3">
                <ComboBoxInput
                  type={{ list: products, name: "Products" }} // Pass the fetched products to ComboBoxInput
                  onSelect={handleProductInput}
                />
                <Button variant="outline" size="icon" onClick={handleAddProduct}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="my-4 border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Implemented</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addedProducts.map((product, index) => (
                      <TableRow key={index} onClick={}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{"..."}</TableCell>
                        <TableCell>{product.implemented ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default UserInfo;
