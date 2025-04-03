import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { signInSchema, signUpSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();

  // Get redirect path from sessionStorage if it exists
  const getRedirectPath = () => {
    if (typeof window !== 'undefined') {
      const redirectPath = sessionStorage.getItem('redirectAfterAuth');
      if (redirectPath) {
        // Clear the stored path to avoid future redirects
        sessionStorage.removeItem('redirectAfterAuth');
        return redirectPath;
      }
    }
    return "/";
  };
  
  // Redirect if already logged in
  if (user) {
    const redirectPath = getRedirectPath();
    navigate(redirectPath);
    return null;
  }

  // Login form
  const loginForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessDescription: "",
      industry: "",
      province: "",
      isBusiness: true,
    },
  });

  // Handle login submission
  const onLogin = async (data: z.infer<typeof signInSchema>) => {
    try {
      await loginMutation.mutateAsync(data);
      
      // Get the redirect path after successful login
      const redirectPath = getRedirectPath();
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Redirect to the saved path or default path
      navigate(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Handle registration submission
  const onRegister = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const { 
        username, 
        email, 
        password, 
        industry, 
        province,
        businessDescription,
        // Ignore confirmPassword as it's not in our schema
        ...rest
      } = data;
      
      // Create user object according to our schema 
      await registerMutation.mutateAsync({
        username,
        email,
        password, // Will be hashed on the server
        industry,
        province,
        businessDescription,
        isBusiness: true, // Always set to true since this is for businesses
        businessName: rest.businessName,
        businessType: rest.businessType,
        employeeCount: rest.employeeCount,
        yearFounded: rest.yearFounded,
        website: rest.website,
        phoneNumber: rest.phoneNumber,
        address: rest.address
      });
      
      // Get the redirect path after successful registration
      const redirectPath = getRedirectPath();
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      // Redirect to the saved path or default path
      navigate(redirectPath);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Sign In to GrantFlix</CardTitle>
            <CardDescription className="text-gray-400">
              Access your personalized grant recommendations and tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4 border-t border-gray-700">
                      <h3 className="text-base font-medium text-white mb-3">Business Information</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        This information helps us recommend grants matching your business needs
                      </p>
                      
                      <FormField
                        control={registerForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Industry</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white ring-offset-background focus:border-primary focus:outline-none"
                                {...field}
                              >
                                <option value="">Select Your Industry</option>
                                <option value="agriculture">Agriculture</option>
                                <option value="technology">Technology</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="energy">Energy</option>
                                <option value="retail">Retail</option>
                                <option value="education">Education</option>
                                <option value="tourism">Tourism</option>
                                <option value="construction">Construction</option>
                                <option value="finance">Finance</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Province/Territory</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white ring-offset-background focus:border-primary focus:outline-none"
                                {...field}
                              >
                                <option value="">Select Province/Territory</option>
                                <option value="alberta">Alberta</option>
                                <option value="british_columbia">British Columbia</option>
                                <option value="manitoba">Manitoba</option>
                                <option value="new_brunswick">New Brunswick</option>
                                <option value="newfoundland">Newfoundland and Labrador</option>
                                <option value="northwest_territories">Northwest Territories</option>
                                <option value="nova_scotia">Nova Scotia</option>
                                <option value="nunavut">Nunavut</option>
                                <option value="ontario">Ontario</option>
                                <option value="pei">Prince Edward Island</option>
                                <option value="quebec">Quebec</option>
                                <option value="saskatchewan">Saskatchewan</option>
                                <option value="yukon">Yukon</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="businessDescription"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Business Description</FormLabel>
                            <FormControl>
                              <textarea
                                className="flex min-h-24 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white ring-offset-background focus:border-primary focus:outline-none"
                                placeholder="Describe your business, its goals, challenges, and what you're looking for in a grant..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-900 to-black p-12 items-center justify-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-6">
            Discover and Track Grants for Your Business
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            GrantFlix helps Canadian businesses discover relevant grants, compare options, 
            and get assistance with applications.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-primary/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Personalized Recommendations</h3>
                <p className="text-gray-400">Get grant recommendations based on your business profile</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Track Applications</h3>
                <p className="text-gray-400">Manage your application statuses in one place</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-primary/20 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">GrantScribe Assistance</h3>
                <p className="text-gray-400">Get AI-powered help with your grant applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}