"use client";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'; // For handling logout redirection

interface Company {
  id: string;
  name: string;
  industryId: string;
}

export default function UserNavbar({ company }: { company: Company | null }) {
  const router = useRouter();
  console.log("FROM NAVBAR:", company);

  // Function to handle logout
  const handleLogout = async () => {
    // Clear JWT token by hitting a logout route (you may need to set up this API route to clear cookies)
    await fetch('/api/logout', {
      method: 'GET',
    });

    // Update the state to clear the company after logout
    document.cookie = "token=; Max-Age=0"; // Clear the cookie
    router.refresh(); // Refresh the page to clear the company state in the app
    router.push('/');
  };

  console.log("Navbar: ", company);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">
        Welcome, {company ? company.name : 'Guest'}!
      </div>
      <div className="flex space-x-4">
        {/* Edit Company Button */}
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
            <form>
              {/* Company Editing Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    defaultValue={company?.name || ""}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>
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
