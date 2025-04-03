import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import FederalGrants from "@/pages/federal-grants";
import ProvincialGrants from "@/pages/provincial-grants";
import PrivateGrants from "@/pages/private-grants";
import GrantDetails from "@/pages/grant-details";
import MyList from "@/pages/my-list";
import GrantScribe from "@/pages/grant-scribe";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/federal-grants" component={FederalGrants} />
          <Route path="/provincial-grants" component={ProvincialGrants} />
          <Route path="/private-grants" component={PrivateGrants} />
          <Route path="/grant/:id" component={GrantDetails} />
          <ProtectedRoute path="/my-list" component={MyList} />
          <ProtectedRoute path="/grant-scribe" component={GrantScribe} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
