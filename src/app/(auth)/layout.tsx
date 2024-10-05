import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";


export default function AuthLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="relative flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-900 to-green-800">
        <Link href={"/"}>
        <button className="absolute top-4 left-4 bg-stone-50 px-4 py-2 h-12 rounded-full">
            <FaArrowLeft/>
        </button>
        </Link>
        
        {children}
      </section>
    )
}