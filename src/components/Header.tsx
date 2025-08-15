import Link from "next/link";
import AuthHeader from "./AuthHeader";
import SearchInput from "./search-input";
import { Suspense } from "react";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4 gap-4">
        
        {/* Logo / Title */}
        <div className="text-2xl font-extrabold tracking-tight hover:text-blue-400 transition-colors">
          <Link href="/">
            SpeakSpace
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl w-full">
          <Suspense>
            <SearchInput />
          </Suspense>
        </div>

        {/* Auth / Profile */}
        <div className="flex items-center space-x-4">
          <AuthHeader />
        </div>

      </div>
    </header>
  );
}
