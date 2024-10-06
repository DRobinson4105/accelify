"use client";

import { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import Recommend from "../components/Recommend";
import UserInfo from "../components/UserInfo";

// Define the Company interface based on your JWT payload
interface Company {
  id: string;
  companyName: string;
  industryId: string;
}

export default function UserClient({ initialCompany }: { initialCompany: Company | null }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set the initial company info passed from the server
    setCompany(initialCompany);
    setLoading(false);
  }, [initialCompany]);

  // If we're still loading, we can show a loading indicator or nothing
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UserNavbar company={company} />
      <div className="grid grid-column-2 grid-flow-col h-[650px] divide-x">
        <UserInfo />
        <Recommend />
      </div>
    </div>
  );
}
