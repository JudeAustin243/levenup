"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Landing page has its own dedicated navigation.
  if (pathname === "/") return null;

  const role = (session?.user as any)?.role;
  const isParent = role === "parent";
  const isChild = role === "child";

  const dashboardHref = isChild ? "/child/dashboard" : isParent ? "/parent/dashboard" : "/";
  const progressHref = isChild ? "/child/progress" : "/parent/dashboard";


  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href={dashboardHref} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">11+</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              ElevenPlus
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                {isParent && (
                  <>
                    <Link
                      href="/parent/dashboard"
                      className="text-gray-600 hover:text-indigo-600 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/parent/children"
                      className="text-gray-600 hover:text-indigo-600 font-medium"
                    >
                      Children
                    </Link>
                    <Link
                      href="/parent/schedule"
                      className="text-gray-600 hover:text-indigo-600 font-medium"
                    >
                      Schedule
                    </Link>
                  </>
                )}
                {isChild && (
                  <>
                    <Link
                      href="/child/dashboard"
                      className="text-gray-600 hover:text-amber-600 font-medium"
                    >
                      My Learning
                    </Link>
                    <Link
                      href="/child/progress"
                      className="text-gray-600 hover:text-amber-600 font-medium"
                    >
                      My Progress
                    </Link>
                    <Link
                      href="/child/schedule"
                      className="text-gray-600 hover:text-amber-600 font-medium"
                    >
                      My Schedule
                    </Link>
                    <Link
                      href="/child/review"
                      className="text-gray-600 hover:text-amber-600 font-medium"
                    >
                      Review
                    </Link>
                    <Link
                      href="/child/shop"
                      className="text-gray-600 hover:text-amber-600 font-medium"
                    >
                      Shop
                    </Link>
                    <Link
                      href="/child/avatar"
                      className="text-gray-600 hover:text-amber-600 font-medium"
                    >
                      My Avatar
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {session.user?.name}
                    {isParent && (
                      <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        Parent
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {session ? (
              <>
                {isParent && (
                  <>
                    <Link href="/parent/dashboard" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                    <Link href="/parent/children" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Children</Link>
                    <Link href="/parent/schedule" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Schedule</Link>
                  </>
                )}
                {isChild && (
                  <>
                    <Link href="/child/dashboard" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">My Learning</Link>
                    <Link href="/child/progress" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">My Progress</Link>
                    <Link href="/child/schedule" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">My Schedule</Link>
                    <Link href="/child/review" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Review</Link>
                    <Link href="/child/shop" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Shop</Link>
                    <Link href="/child/avatar" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">My Avatar</Link>
                  </>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Log In</Link>
                <Link href="/signup" className="block px-3 py-2 bg-indigo-600 text-white rounded-lg text-center">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
