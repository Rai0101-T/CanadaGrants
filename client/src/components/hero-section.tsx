import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-16 h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
      <div className="hero-content absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Discover Canadian Grants</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Find the perfect funding opportunities for your projects, business, or research across Canada.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/federal-grants">
            <a>
              <Button variant="netflix" size="lg" className="flex items-center w-full sm:w-auto justify-center">
                <Play className="mr-2 h-5 w-5" /> Browse Grants
              </Button>
            </a>
          </Link>
          <Link href="#how-it-works">
            <a>
              <Button 
                variant="netflixSecondary" 
                size="lg" 
                className="flex items-center w-full sm:w-auto justify-center"
              >
                <Info className="mr-2 h-5 w-5" /> Learn More
              </Button>
            </a>
          </Link>
        </div>
      </div>
      <img 
        src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1920&q=80" 
        alt="Canadian Parliament Building" 
        className="w-full h-full object-cover"
      />
    </section>
  );
}
