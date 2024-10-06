"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ComboBoxInput from '@/app/components/ComboBoxInput' // Import your ComboBoxInput component

export default function CompanySignUpPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    industry: '' // This will store the selected industry
  })

  const [industries, setIndustries] = useState([]) // State to hold industries
  const router = useRouter()

  // Fetch industries from the database on component mount
  useEffect(() => {
    async function fetchIndustries() {
      try {
        const res = await fetch('/api/industries') // Create this API to fetch all industries
        const data = await res.json()
        
        // Format the data for ComboBoxInput
        const formattedIndustries = data.map((industry: any) => ({
          label: industry.name, 
          value: industry.name
        }))
        
        setIndustries(formattedIndustries)
      } catch (error) {
        console.error('Error fetching industries:', error)
      }
    }

    fetchIndustries()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleIndustryChange = (selectedIndustry: string) => {
    setFormData({
      ...formData,
      industry: selectedIndustry // Set the selected industry
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/company/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/companypage') // Redirect to company dashboard after signup
      } else {
        console.error('Signup failed')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Company Sign Up</CardTitle>
        <CardDescription>
          Enter your company information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Your Company"
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                onChange={handleChange}
                required
              />
            </div>

            {/* ComboBox for selecting industry */}
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <ComboBoxInput 
                type={{ list: industries, name: "Industry" }} 
                // Pass the selected industry to formData when selected
                onSelect={handleIndustryChange}
              />
            </div>

            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
