import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.email?.includes("admin") || user?.email === "admin@grantflix.com";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black to-transparent'
      }`}
    >
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-primary font-bold text-3xl md:text-4xl mr-10">
            GRANTFLIX
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-white hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/federal-grants" className="text-gray-300 hover:text-primary transition-colors">
                  Federal Grants
                </Link>
              </li>
              <li>
                <Link href="/provincial-grants" className="text-gray-300 hover:text-primary transition-colors">
                  Provincial Grants
                </Link>
              </li>
              <li>
                <Link href="/private-grants" className="text-gray-300 hover:text-primary transition-colors">
                  Private Grants
                </Link>
              </li>
              <li>
                <Link href="/my-list" className="text-gray-300 hover:text-primary transition-colors">
                  My List
                </Link>
              </li>
              <li>
                <Link href="/grant-scribe" className="text-gray-300 hover:text-primary transition-colors">
                  GrantScribe
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Input
              type="text"
              placeholder="Search grants..."
              className="bg-black bg-opacity-70 text-white border border-gray-600 rounded py-1 px-3 w-40 md:w-64 focus:outline-none focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-800 text-white">
                <DropdownMenuItem onClick={() => navigate("/my-list")} className="cursor-pointer">
                  My List
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate("/grant-scribe")} 
                  className="cursor-pointer"
                >
                  GrantScribe
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate("/profile")} 
                  className="cursor-pointer flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem 
                    onClick={() => navigate("/admin/scraper")} 
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Scraper Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => logoutMutation.mutate()} 
                  className="text-red-500 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="netflix" 
              size="sm"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      
      <div className="md:hidden px-4 pb-2">
        <nav>
          <ul className="flex space-x-4 overflow-x-auto scrollbar-none">
            <li>
              <Link href="/" className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">
                Home
              </Link>
            </li>
            <li>
              <Link href="/federal-grants" className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">
                Federal
              </Link>
            </li>
            <li>
              <Link href="/provincial-grants" className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">
                Provincial
              </Link>
            </li>
            <li>
              <Link href="/private-grants" className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">
                Private
              </Link>
            </li>
            <li>
              <Link href="/my-list" className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">
                My List
              </Link>
            </li>
            <li>
              <Link href="/grant-scribe" className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">
                GrantScribe
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/admin/scraper" className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">
                  Admin
                </Link>
              </li>
            )}
            <li>
              <Link href="/about-us" className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">
                About Us
              </Link>
            </li>
            <li>
              {!user ? (
                <Link href="/auth" className="text-sm text-primary font-semibold whitespace-nowrap">
                  Sign In
                </Link>
              ) : null}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
