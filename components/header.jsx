// Header component for the app's navigation bar
// This uses Next.js, React, Clerk for authentication, and Tailwind CSS for styling
import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react"; // Icon library
import Link from "next/link"; // For navigation between pages
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"; // Auth components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Custom dropdown menu components
import Image from "next/image"; // For optimized images
import { checkUser } from "@/lib/checkUser";

// The Header is an async function because it checks user status before rendering
export default async function Header() {
  // Ensure user is checked (for SSR or auth logic)
  await checkUser();

  return (
    // Header bar: fixed to top, full width, with border and background blur
    // Tailwind classes:
    // fixed: stays at top when scrolling
    // top-0: aligns to top
    // w-full: full width
    // border-b: bottom border
    // bg-background/80: semi-transparent background
    // backdrop-blur-md: blur effect for background
    // z-50: high stacking order (on top of other elements)
    // supports-[backdrop-filter]:bg-background/60: fallback for browsers that support backdrop-filter
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      {/* Navigation container: centers content, adds horizontal padding, sets height, and aligns items */}
      {/* container: centers content with max width */}
      {/* mx-auto: horizontal margin auto (center) */}
      {/* px-4: horizontal padding */}
      {/* h-16: height 4rem (64px) */}
      {/* flex: flexbox layout */}
      {/* items-center: vertical align center */}
      {/* justify-between: space between left and right */}
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo on the left, links to home page */}
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="Sensai Logo"
            width={200}
            height={60}
            // h-12: height 3rem (48px)
            // py-1: vertical padding 0.25rem (4px)
            // w-auto: width auto (keeps aspect ratio)
            // object-contain: image scales to fit container
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons (right side of navbar) */}
        {/* flex: flexbox layout */}
        {/* items-center: vertical align center */}
        {/* space-x-2: horizontal space between children (0.5rem) */}
        {/* md:space-x-4: on medium+ screens, space is 1rem */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Only show these buttons if user is signed in */}
          <SignedIn>
            {/* Dashboard button: outline style, only visible on medium+ screens */}
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
                // hidden: hide on small screens
                // md:inline-flex: show as inline-flex on medium+ screens
                // items-center: vertical align icon and text
                // gap-2: 0.5rem space between icon and text
              >
                <LayoutDashboard className="h-4 w-4" />
                Industry Insights
              </Button>
              {/* Icon-only dashboard button for mobile */}
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0"
                // md:hidden: only show on small screens
                // w-10 h-10: width/height 2.5rem (40px)
                // p-0: no padding
              >
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            {/* Growth Tools Dropdown menu */}
            <DropdownMenu>
              {/* Button that triggers the dropdown */}
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2"
                  // flex: flexbox layout
                  // items-center: vertical align icon and text
                  // gap-2: 0.5rem space between icon and text
                >
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              {/* Dropdown content: aligns to end, fixed width */}
              <DropdownMenuContent align="end" className="w-48"
                // w-48: width 12rem (192px)
              >
                {/* Each item is a link to a tool */}
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2"
                    // flex: flexbox layout
                    // items-center: vertical align icon and text
                    // gap-2: 0.5rem space between icon and text
                  >
                    <FileText className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/interview" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          {/* Show Sign In button if user is signed out */}
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          {/* User avatar and menu, only when signed in */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10", // avatar size
                  userButtonPopoverCard: "shadow-xl", // popover shadow
                  userPreviewMainIdentifier: "font-semibold", // bold username
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
