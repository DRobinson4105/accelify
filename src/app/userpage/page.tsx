// src/app/userpage/page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import UserClient from './UserClient'; // The client-side component

// Define the Company interface based on your JWT payload
interface Company {
  id: string;
  companyName: string;
  industryId: string;
}

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export default async function Page() {
  // Get the cookie from server-side
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  let company: Company | null = null;

  if (token) {
    try {
      // Decode the JWT token server-side
      company = jwt.verify(token, SECRET_KEY) as Company;
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  }

  // Pass the decoded company data to a client-side component, now named `initialCompany`
  return (
    <UserClient initialCompany={company} />
  );
}
