import { useState } from 'react';
import React from 'react';
import heroImage from "../assets/heroImage.png"; // Import your hero image
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log("Rendering Layout Component");

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e7f0e4] to-[#cde7d6]">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div className="h-60 w-60 bg-transparent" />
        </div>
        <div className="mx-auto max-w-7xl py-16 sm:py-32 lg:py-40 flex flex-col items-center md:flex-row md:justify-center md:gap-10">
    
          <div className="flex justify-center md:w-1/2 mb-10 md:mb-0">
            <img
              src={heroImage}
              alt="Finance Hero"
              className="w-full h-auto max-w-sm md:max-w-md object-contain"
            />
          </div>
      
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Personal Budget Planner
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              Because managing your finances should not feel like a game of Tetris.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-6 gap-y-4">
               <Link
                className="px-4 py-2 bg-green-700 text-white text-lg font-semibold rounded-md hover:bg-green-800 transition"
                to="/signup"
              > Get Started </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
