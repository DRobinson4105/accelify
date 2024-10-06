"use client";
import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import ComboBoxInput from "./ComboBoxInput";
import { ChevronRight } from "lucide-react";
import { Pencil } from "lucide-react";
import { TrashIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // For the toggle

import {
  Dialog,
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // For delete confirmation dialog
  const [editImplemented, setEditImplemented] = useState(false);

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

  const handleEditProduct = async () => {
    const updatedProducts = [...addedProducts];
    updatedProducts[indexTable].implemented = editImplemented;

    setAddedProducts(updatedProducts);

    try {
      const res = await fetch("/api/updateProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: updatedProducts[indexTable].name,
          companyId: company?.id,
          implemented: editImplemented,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update product status");
      }

      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleDeleteProduct = async () => {
    const productToDelete = addedProducts[indexTable];
    const updatedProducts = addedProducts.filter((_, i) => i !== indexTable);

    setAddedProducts(updatedProducts);

    try {
      const res = await fetch("/api/deleteProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: productToDelete.name,
          companyId: company?.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      setDeleteDialogOpen(false); // Close delete dialog after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const fetchIndex = (index: number) => {
    return (event: React.MouseEvent) => {
      setIndexTable(index);
      setEditImplemented(addedProducts[index].implemented);
      setEditDialogOpen(true);
      event.preventDefault();
    };
  };

  const confirmDelete = (index: number) => {
    setIndexTable(index); // Set the index for the product to delete
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">Name</TableHead>
                      <TableHead className="w-[30px]">Description</TableHead>
                      <TableHead className="w-[30px]">Implemented</TableHead>
                      <TableHead className="w-[30px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addedProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[30px]">{product.name}</TableCell>
                        <TableCell className="w-[30px]">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="text-left">
                                {product.description.length > 30
                                  ? `${product.description.slice(0, 30)}...`
                                  : product.description}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{product.name}</DialogTitle>
                                <DialogDescription>{product.description}</DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="w-[30px]">{product.implemented ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-x-6">
                            <Button variant="outline" size="icon" className="h-8 w-8 mx-2" onClick={fetchIndex(index)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 mx-2" onClick={() => confirmDelete(index)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Toggle the "Implemented" status for {addedProducts[indexTable]?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <div className="flex items-center">
              <label className="mr-2">Implemented:</label>
              <Switch checked={editImplemented} onCheckedChange={setEditImplemented} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {addedProducts[indexTable]?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserInfo;
