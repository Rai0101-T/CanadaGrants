import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, LogOut } from "lucide-react";
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
          <Link href="/">
            <a className="text-primary font-bold text-3xl md:text-4xl mr-10">GRANTFLIX</a>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li>
                <Link href="/">
                  <a className="text-white hover:text-primary transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/federal-grants">
                  <a className="text-gray-300 hover:text-primary transition-colors">Federal Grants</a>
                </Link>
              </li>
              <li>
                <Link href="/provincial-grants">
                  <a className="text-gray-300 hover:text-primary transition-colors">Provincial Grants</a>
                </Link>
              </li>
              <li>
                <Link href="/private-grants">
                  <a className="text-gray-300 hover:text-primary transition-colors">Private Grants</a>
                </Link>
              </li>
              <li>
                <Link href="/trade-commissioner-grants">
                  <a className="text-gray-300 hover:text-primary transition-colors">Trade Commissioner</a>
                </Link>
              </li>
              <li>
                <Link href="/my-list">
                  <a className="text-gray-300 hover:text-primary transition-colors">My List</a>
                </Link>
              </li>
              <li>
                <Link href="/about-us">
                  <a className="text-gray-300 hover:text-primary transition-colors">About Us</a>
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
              <Link href="/">
                <a className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">Home</a>
              </Link>
            </li>
            <li>
              <Link href="/federal-grants">
                <a className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">Federal</a>
              </Link>
            </li>
            <li>
              <Link href="/provincial-grants">
                <a className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">Provincial</a>
              </Link>
            </li>
            <li>
              <Link href="/private-grants">
                <a className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">Private</a>
              </Link>
            </li>
            <li>
              <Link href="/trade-commissioner-grants">
                <a className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">Trade</a>
              </Link>
            </li>
            <li>
              <Link href="/my-list">
                <a className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">My List</a>
              </Link>
            </li>
            <li>
              <Link href="/grant-scribe">
                <a className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">GrantScribe</a>
              </Link>
            </li>
            <li>
              <Link href="/about-us">
                <a className="text-sm text-gray-300 hover:text-primary whitespace-nowrap">About Us</a>
              </Link>
            </li>
            <li>
              {!user ? (
                <Link href="/auth">
                  <a className="text-sm text-primary font-semibold whitespace-nowrap">Sign In</a>
                </Link>
              ) : (
                <a 
                  onClick={() => logoutMutation.mutate()} 
                  className="text-sm text-red-500 cursor-pointer whitespace-nowrap"
                >
                  Logout
                </a>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
