import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SpinWheelPage from "./pages/spin-wheel";


// Optional: Create and customize a theme (can be removed if default MUI theme is fine)
// import theme from "./theme"; // If you have a custom theme



const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={SpinWheelPage} />
      {/* <Route path="/admin" component={AdminDashboard} /> */}
      {/* <Route component={NotFound} /> */}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
     
         
          <Router />
       
    </QueryClientProvider>
  );
}

export default App;
