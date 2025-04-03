import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import FederalGrants from "@/pages/federal-grants";
import ProvincialGrants from "@/pages/provincial-grants";
import GrantDetails from "@/pages/grant-details";
import MyList from "@/pages/my-list";
import GrantSherpa from "@/pages/grant-sherpa";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/federal-grants" component={FederalGrants} />
          <Route path="/provincial-grants" component={ProvincialGrants} />
          <Route path="/grant/:id" component={GrantDetails} />
          <Route path="/my-list" component={MyList} />
          <Route path="/grant-sherpa" component={GrantSherpa} />
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
