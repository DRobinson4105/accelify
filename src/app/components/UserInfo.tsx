"use client";
import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import ComboBoxInput from "./ComboBoxInput";
import { ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
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

interface Company {
  id: string;
  companyName: string;
  industryId: string;
}

const UserInfo = ({ company }: { company: Company | null }) => {
  const [products, setProducts] = useState<{ value: string; label: string; description: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<TableElement | null>(null);
  const [addedProducts, setAddedProducts] = useState<TableElement[]>([]);
  const [indexTable, setIndexTable] = useState(0);

  // Fetch all available products for ComboBox
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        // Map the fetched products to the structure expected by ComboBoxInput
        const formattedProducts = data.map((product: any) => ({
          value: product.id,
          label: product.name,
          description: product.description,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  // Fetch the company's products when the component mounts
  useEffect(() => {
    async function fetchCompanyProducts() {
      if (!company) return; // Return if no company is provided
      try {
        const res = await fetch(`/api/companyProducts?companyId=${company.id}`);
        const data = await res.json();

        console.log("Fetched company products on frontend:", data); // Log the fetched products

        // Map fetched company products to TableElement structure
        const formattedCompanyProducts = data.map((product: any) => ({
          name: product.product.name,
          description: product.product.description,
          implemented: product.implemented,
        }));

        setAddedProducts(formattedCompanyProducts); // Set fetched products in state
      } catch (error) {
        console.error("Error fetching company products:", error);
      }
    }

    fetchCompanyProducts();
  }, [company]);

  useEffect(() => {
    console.log("Updated addedProducts state:", addedProducts);
  }, [addedProducts]);

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

  // Add product to the table and send to database
  const handleAddProduct = async () => {
    if (selectedProduct && company) {
      const newProduct = {
        name: selectedProduct.name,
        description: selectedProduct.description,
        implemented: false,
      };

      // Add the product to the frontend state
      setAddedProducts((prev) => [...prev, newProduct]);

      // Send a request to add the product to the company in the database
      try {
        const res = await fetch("/api/addProduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: selectedProduct.name,
            companyId: company.id,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to add product to the database");
        }

        setSelectedProduct(null); // Reset the selected product after adding
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  // Handle toggle implemented status
  const toggleImplemented = async (index: number) => {
    const updatedProducts = [...addedProducts];
    const updatedProduct = updatedProducts[index];
    updatedProduct.implemented = !updatedProduct.implemented;

    // Update the frontend state
    setAddedProducts(updatedProducts);

    // Send a request to update the implemented status in the database
    try {
      const res = await fetch("/api/updateProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: updatedProduct.name,
          companyId: company?.id, // Ensure correct company ID
          implemented: updatedProduct.implemented,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const fetchIndex = (index: number) => {
    return (event: React.MouseEvent) => {
      setIndexTable(index);
      event.preventDefault();
    };
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
                  type={{ list: products, name: "Products" }}
                  onSelect={handleProductInput}
                />
                <Button variant="outline" size="icon" onClick={handleAddProduct}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="my-4 border" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Dialog>
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
                        <TableRow key={index} onClick={fetchIndex(index)}>
                          <DialogTrigger asChild>
                            <TableCell>{product.name}</TableCell>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <TableCell>{"..."}</TableCell>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <TableCell>{product.implemented ? "Yes" : "No"}</TableCell>
                          </DialogTrigger>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{addedProducts[indexTable]?.name}</DialogTitle>
                      <DialogDescription>
                        {addedProducts[indexTable]?.description}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default UserInfo;
