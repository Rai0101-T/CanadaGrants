import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/lib/protected-route";

export default function ScraperAdminPage() {
  return (
    <ProtectedRoute path="/admin/scraper" component={ScraperAdmin} />
  );
}

function ScraperAdmin() {
  const { user } = useAuth();
  const [selectedScraper, setSelectedScraper] = useState<string>("");
  const { toast } = useToast();

  // Check if user is an admin
  const isAdmin = user?.email?.includes("admin") || user?.email === "admin@grantflix.com";

  // Mutation for running all scrapers
  const runAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/scraper/run");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Scraper triggered",
        description: "All scrapers have been started. Check server logs for progress."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to trigger scraper",
        variant: "destructive"
      });
    }
  });

  // Mutation for running a specific scraper
  const runSpecificMutation = useMutation({
    mutationFn: async (source: string) => {
      const res = await apiRequest("POST", `/api/admin/scraper/run/${source}`);
      return await res.json();
    },
    onSuccess: (_, source) => {
      toast({
        title: "Scraper triggered",
        description: `${source} scraper has been started. Check server logs for progress.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to trigger specific scraper",
        variant: "destructive"
      });
    }
  });

  const handleRunAll = () => {
    runAllMutation.mutate();
  };

  const handleRunSpecific = () => {
    if (!selectedScraper) {
      toast({
        title: "Error",
        description: "Please select a scraper to run",
        variant: "destructive"
      });
      return;
    }

    runSpecificMutation.mutate(selectedScraper);
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Grant Scraper Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Run All Scrapers</CardTitle>
            <CardDescription>
              Run all configured scrapers to collect grant data from all sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will launch all scrapers in sequence, which may take several minutes to complete.
              Results will be saved to the database automatically.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleRunAll} 
              disabled={runAllMutation.isPending}
              className="w-full"
            >
              {runAllMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                "Run All Scrapers"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Run Specific Scraper</CardTitle>
            <CardDescription>
              Run a single scraper to collect data from a specific source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Select Scraper</p>
                <Select
                  value={selectedScraper}
                  onValueChange={setSelectedScraper}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scraper" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alberta-innovates">Alberta Innovates</SelectItem>
                    <SelectItem value="innovation-canada">Innovation Canada</SelectItem>
                    <SelectItem value="trade-commissioner">Trade Commissioner</SelectItem>
                    <SelectItem value="trade-funding-programs">Trade Funding Programs</SelectItem>
                    <SelectItem value="futurpreneur">Futurpreneur</SelectItem>
                    <SelectItem value="women-entrepreneurship">Women Entrepreneurship Strategy</SelectItem>
                    <SelectItem value="launch-online">Launch Online</SelectItem>
                    <SelectItem value="alberta-health">Alberta Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleRunSpecific} 
              disabled={runSpecificMutation.isPending || !selectedScraper}
              className="w-full"
            >
              {runSpecificMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                "Run Selected Scraper"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Scraper Information</CardTitle>
            <CardDescription>
              Details about the configured scrapers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Scraper Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  All scrapers are automatically scheduled to run weekly on Sunday at 1:00 AM.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold">Available Scrapers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">Alberta Innovates</h4>
                    <p className="text-sm text-muted-foreground">Collects grants from Alberta Innovates website</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">Innovation Canada</h4>
                    <p className="text-sm text-muted-foreground">Collects federal grants from Innovation Canada</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">Trade Commissioner</h4>
                    <p className="text-sm text-muted-foreground">Collects grants from the Trade Commissioner Service</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">Trade Funding Programs</h4>
                    <p className="text-sm text-muted-foreground">Collects detailed funding programs from TCS</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">Futurpreneur</h4>
                    <p className="text-sm text-muted-foreground">Collects grants for young entrepreneurs</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">Women Entrepreneurship Strategy</h4>
                    <p className="text-sm text-muted-foreground">Collects grants for women-led businesses</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">Launch Online</h4>
                    <p className="text-sm text-muted-foreground">Collects grants for online business development</p>
                  </div>
                  <div className="p-4 border rounded">
                    <h4 className="font-medium">Alberta Health</h4>
                    <p className="text-sm text-muted-foreground">Collects health-related grants in Alberta</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}