import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import Header from '@/components/layout/header';

export default function AboutUs() {
  return (
    <div className="bg-[#141414] text-white min-h-screen">
      <Header />
      
      {/* Modern Banner with Gradient Overlay */}
      <div className="w-full h-72 md:h-96 relative overflow-hidden">
        {/* Canadian business/skyline background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2011&q=80')",
            filter: "brightness(0.5)"
          }}
        ></div>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        
        {/* Title and subtitle with modern styling */}
        <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <div className="inline-block rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white mb-3">
              About Grantflix
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
              About Us: <span className="text-red-600">Grantflix</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
              Connecting Canadian businesses with the funding opportunities they need to grow and succeed.
            </p>
          </div>
        </div>
      </div>
      
      
      
      <main className="relative z-10">
        {/* How It Works Section with ID */}
        <div id="how-it-works" className="scroll-mt-24"></div>
        <section className="max-w-6xl mx-auto px-4 py-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-gray-300">
                Sign up and build your business profile so we can match you with relevant grant opportunities.
              </p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover Grants</h3>
              <p className="text-gray-300">
                Browse federal, provincial, and private grant opportunities filtered to match your business needs.
              </p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply with Confidence</h3>
              <p className="text-gray-300">
                Use our GrantScribe tool to help craft winning applications and track your submission status.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        </section>
        
        {/* Contact Us Section with ID */}
        <div id="contact-us" className="scroll-mt-24"></div>
        <section className="max-w-6xl mx-auto px-4 py-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-[#1a1a1a] border border-[#333333] rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <Button className="bg-primary hover:bg-primary/90 text-white w-full py-2">
                  Send Message
                </Button>
              </form>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#333333]">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-gray-300 mt-1">
                      123 Business Way<br />
                      Toronto, ON M5V 2K5<br />
                      Canada
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-300 mt-1">
                      info@grantflix.com<br />
                      support@grantflix.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-gray-300 mt-1">
                      +1 (416) 555-1234<br />
                      Mon-Fri, 9am-5pm EST
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium mb-3">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  
                  <a href="#" className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                  
                  <a href="#" className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section with ID */}
        <div id="faq" className="scroll-mt-24"></div>
        <section className="bg-[#0c0c0c] py-16 mb-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-[#333333]">
                <AccordionTrigger className="text-lg py-5 hover:text-primary">
                  What types of grants can I find on Grantflix?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-5">
                  Grantflix provides access to a comprehensive database of federal, provincial, and private grant opportunities available to businesses across Canada. Our platform covers grants from all major industries and sectors.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-[#333333]">
                <AccordionTrigger className="text-lg py-5 hover:text-primary">
                  Is there a cost to use Grantflix?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-5">
                  We offer both free and premium account options. The free account provides basic access to grant listings, while premium accounts offer personalized grant matching, application assistance with GrantScribe, and priority notifications for new opportunities.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-[#333333]">
                <AccordionTrigger className="text-lg py-5 hover:text-primary">
                  How often is the grant database updated?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-5">
                  Our database is updated daily to ensure you have access to the most current grant opportunities. We monitor government announcements, funding programs, and private initiatives to keep our listings comprehensive and up-to-date.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b border-[#333333]">
                <AccordionTrigger className="text-lg py-5 hover:text-primary">
                  What is GrantScribe and how does it help with applications?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-5">
                  GrantScribe is our AI-powered grant application assistant. It helps you draft compelling applications, checks for plagiarism, generates ideas based on your business profile, and provides feedback to improve your chances of success.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b border-[#333333]">
                <AccordionTrigger className="text-lg py-5 hover:text-primary">
                  How do I track the status of grant applications?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-5">
                  After adding a grant to your "My List," you can update the status of your application and add notes for each step of the process. This helps you stay organized and ensures you don't miss important deadlines or follow-up requirements.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border-b border-[#333333]">
                <AccordionTrigger className="text-lg py-5 hover:text-primary">
                  Can I get personalized grant recommendations?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-5">
                  Yes! By completing your business profile with details about your industry, location, company size, and goals, our algorithm matches you with the most relevant grant opportunities, saving you time and increasing your chances of success.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      
      {/* About Footer Navigation - Using anchor tags for in-page navigation */}
      <div className="bg-[#0c0c0c] py-8 mb-12" id="about-footer-nav">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <a href="#how-it-works" className="text-gray-300 hover:text-primary flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              How It Works
            </a>
            <a href="#faq" className="text-gray-300 hover:text-primary flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              FAQ
            </a>
            <a href="#contact-us" className="text-gray-300 hover:text-primary flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}