import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-16 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-primary font-bold text-3xl mb-4">GRANTFLIX</h2>
            <p className="max-w-md text-sm">
              Canada's premier grant finding platform, helping individuals, businesses, and organizations discover the perfect funding opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/federal-grants" className="hover:text-primary transition-colors">
                    Federal Grants
                  </Link>
                </li>
                <li>
                  <Link href="/provincial-grants" className="hover:text-primary transition-colors">
                    Provincial Grants
                  </Link>
                </li>
                <li>
                  <Link href="/private-grants" className="hover:text-primary transition-colors">
                    Private Grants
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">About</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    href="/about-us#how-it-works" 
                    className="hover:text-primary transition-colors special-anchor" 
                    data-section="how-it-works"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about-us#faq" 
                    className="hover:text-primary transition-colors special-anchor" 
                    data-section="faq"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about-us#contact-us" 
                    className="hover:text-primary transition-colors special-anchor" 
                    data-section="contact-us"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-bold mb-4">Stay Updated</h3>
              <p className="text-sm mb-4">
                Subscribe to get the latest on new grants and funding opportunities.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-[#333333] text-white border border-gray-700 rounded-l py-2 px-3 w-full focus:outline-none focus:border-primary"
                />
                <Button 
                  variant="netflix" 
                  className="rounded-l-none"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#333333] pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} GrantFlix. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
