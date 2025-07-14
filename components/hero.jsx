// This is a React component for the main hero section of the landing page.
// It uses client-side rendering ("use client") because it relies on browser features like scrolling.
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image"; // For optimized images in Next.js
import { Button } from "@/components/ui/button"; // Custom button component
import Link from "next/link"; // For navigation between pages

// The HeroSection function defines our main hero area.
const HeroSection = () => {
  // We use a "ref" to get a direct reference to the image element in the DOM.
  // This lets us change its CSS classes when the user scrolls.
  const imageRef = useRef(null);

  // useEffect runs code after the component is added to the page.
  // Here, we set up a scroll event listener to animate the image when the user scrolls down.
  useEffect(() => {
    // Get the actual image element from the ref
    const imageElement = imageRef.current;

    // This function runs every time the user scrolls
    const handleScroll = () => {
      // Get how far the user has scrolled vertically
      const scrollPosition = window.scrollY;
      // Set a threshold (in pixels) for when to trigger the animation
      const scrollThreshold = 100;

      // If the user has scrolled more than 100px, add the 'scrolled' class to the image
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        // Otherwise, remove the 'scrolled' class
        imageElement.classList.remove("scrolled");
      }
    };

    // Listen for scroll events on the window
    window.addEventListener("scroll", handleScroll);
    // Clean up: remove the event listener when the component is removed from the page
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // The empty array means this only runs once when the component mounts

  return (
    // The main section of the hero area, with padding for spacing
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          {/* The main headline with a colorful gradient effect and animation */}
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          {/* A short description below the headline */}
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>
        {/* Two buttons: one to get started, one to watch a demo video */}
        <div className="flex justify-center space-x-4">
          {/* Link to the dashboard page */}
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          {/* Link to an external YouTube demo video */}
          <Link href="https://www.youtube.com/@masxman-dev">
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </Link>
        </div>
        {/* The hero image, which animates when the user scrolls down */}
        <div className="hero-image-wrapper mt-5 md:mt-0">
          {/* The ref here lets us access this div in JavaScript */}
          <div ref={imageRef} className="hero-image">
            {/* The main image, with rounded corners and a shadow */}
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Export the component so it can be used in other parts of the app
export default HeroSection;
