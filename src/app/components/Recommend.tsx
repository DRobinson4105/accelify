"use client";
import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Company {
  id: string;
  name: string;
  industryId: string;
}

const Recommend = ({ company }: { company: Company }) => {
  const [addedProducts, setAddedProducts] = useState<
    { name: string; category: string; implemented: boolean }[]
  >([]);
  const [industry, setIndustry] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Log to check if company is passed correctly
  console.log("Company passed to component:", company);

  // Fetch the company's industry and products using company.id
  useEffect(() => {
    console.log("useEffect fired, company.id:", company.id); // Check if useEffect is firing

    async function fetchIndustry() {
      console.log("Fetching industry for company using id:", company.id); // Check if fetchIndustry is called
      try {
        const res = await fetch(`/api/companyIndustry?companyId=${company.id}`);
        if (!res.ok) throw new Error(`Failed to fetch industry: ${res.status}`);
        const data = await res.json();
        console.log("Fetched industry:", data.industry); // Log fetched industry
        setIndustry(data.industry); // Set industry name
      } catch (error) {
        console.error("Error fetching company industry:", error);
      }
    }

    async function fetchCompanyProducts() {
      console.log("Fetching company products for:", company.id); // Check if fetchCompanyProducts is called
      try {
        const res = await fetch(`/api/companyProducts?companyId=${company.id}`);
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const data = await res.json();

        console.log("Fetched company products:", data); // Log fetched products

        const formattedCompanyProducts = data.map((product: any) => ({
          name: product.product.name,
          category: product.product.category, // Assuming description is category
          implemented: product.implemented,
        }));

        setAddedProducts(formattedCompanyProducts); // Set fetched products in state
        console.log("Formatted company products:", formattedCompanyProducts); // Log formatted products
      } catch (error) {
        console.error("Error fetching company products:", error);
      }
    }

    if (company.id) {
      fetchIndustry(); // Fetch industry using company.id
      fetchCompanyProducts(); // Fetch products using company.id
    } else {
      console.log("company.id is missing"); // Log if company.id is undefined or null
    }
  }, [company.id]);

  // Fetch recommendations from the Flask API
  const fetchRecommendations = async () => {
    const requestBody = {
      company_name: company.name
    };

    // Log the request body
    console.log("Request body:", requestBody);

    try {
      const res = await fetch("http://localhost:5000/get_recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      setRecommendations(data.accelerators); // Update recommendations state
      console.log("Fetched recommendations:", data.accelerators); // Log the recommendations
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div className="w-full h-full">
      <Card className="mx-auto w-5/6 h-5/6 my-5">
        <CardHeader>
          <CardTitle className="text-xl">Recommend</CardTitle>
          <CardDescription>
            Get new product recommendations for {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>

          {/* Button to get recommendations */}
          <Button onClick={fetchRecommendations} className="mt-4">
            Get Recommendations
          </Button>

          {/* Display Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-4">
              <h3>Recommended Products:</h3>
              <ul>
                {recommendations.map((rec, index) => (
                  <li key={index}>
                    {rec[0]} - {rec[1]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommend;
