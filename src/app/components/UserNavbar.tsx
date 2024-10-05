"use client"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // For handling logout redirection

interface User {
  id: string;
  email: string;
  name: string;
}

export default function UserNavbar({ user }: { user: User | null }) {
  const router = useRouter();

  // Function to handle logout
  const handleLogout = async () => {
    // Clear JWT token (you may want to hit a logout API route to clear cookies)
    await fetch('/api/logout', {
      method: 'GET',
    });

    // Redirect to login page after logout
    router.push('/signin');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">
        Welcome, {user ? user.name : 'Guest'}!
      </div>
      <div className="flex space-x-4">
        {/* Edit Company Button with Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Edit Company</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Company Information</DialogTitle>
              <DialogDescription>
                Update your company details below.
              </DialogDescription>
            </DialogHeader>
            {/* Add form for editing company details */}
            <form>
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium">
                    Company Address
                  </label>
                  <input
                    id="companyAddress"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>
                {/* Additional fields for company details */}
                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Logout Button */}
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
