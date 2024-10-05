import { Button } from "@/components/ui/button";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <div>
        <Link href='/userpage'>
          <Button>
            Test
          </Button>
        </Link>
      </div>
    </div>
  );
}
