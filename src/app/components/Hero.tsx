import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-green-800 h-screen flex items-center">
    <div className="container mx-auto px-4 flex gap-10 items-center">
      {/* Left side content */}
      <div className="text-white space-y-4 max-w-lg">
        <h1 className="text-5xl font-bold">
          GET PAIRED TO ACCELERATORS THAT <span className="text-green-300">WORK FOR YOU</span>
        </h1>
        <p className="text-lg">
          The next big leap in AI is here. ServiceNow AI Agents can learn, reason, take action, and make decisions autonomously. And the best part? You're in control.
        </p>
        <div className="flex space-x-4">
          <Button className="bg-green-500 hover:bg-green-600">Get Started</Button>
          <Button className="bg-transparent border border-green-500 hover:bg-green-600 text-white">Learn More</Button>
        </div>
      </div>
      {/* Right side image */}
      <div className="hidden md:block flex-1">
        <Image src={'/images/hero.jpg'} alt={'Pyramid'} width={900} height={400}/>
      </div>
    </div>
  </div>
  )
}

export default Hero