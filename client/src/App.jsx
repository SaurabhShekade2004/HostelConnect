import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FacilityPage from "@/pages/FacilityPage";
import GalleryPage from "@/pages/GalleryPage";
import FaqPage from "@/pages/FaqPage";
import ContactPage from "@/pages/ContactPage";
import StudentDashboard from "@/pages/student/Dashboard";
import ApplicationForm from "@/pages/student/ApplicationForm";
import ComplaintForm from "@/pages/student/ComplaintForm";
import ContactRector from "@/pages/student/ContactRector";
import FacultyDashboard from "@/pages/faculty/Dashboard";
import AllotRoom from "@/pages/faculty/AllotRoom";
import ViewComplaints from "@/pages/faculty/ViewComplaints";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Protected route component
function ProtectedRoute({ component: Component, roles, ...rest }) {
  const { user, isLoading } = useAuth();

  // Show loading state if authentication is still being verified
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If user is not authenticated or doesn't have required role, show unauthorized
  if (!user || (roles && !roles.includes(user.role))) {
    return <div className="flex h-screen items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>You do not have permission to access this page.</p>
        <p>Please <a href="/" className="font-bold underline">login</a> with appropriate credentials.</p>
      </div>
    </div>;
  }

  // If authenticated and authorized, render component
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/amenities" component={FacilityPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* Student routes */}
      <Route path="/student/dashboard">
        {() => <ProtectedRoute component={StudentDashboard} roles={['student']} />}
      </Route>
      <Route path="/student/application">
        {() => <ProtectedRoute component={ApplicationForm} roles={['student']} />}
      </Route>
      <Route path="/student/complaint">
        {() => <ProtectedRoute component={ComplaintForm} roles={['student']} />}
      </Route>
      <Route path="/student/contact-rector">
        {() => <ProtectedRoute component={ContactRector} roles={['student']} />}
      </Route>
      
      {/* Faculty routes */}
      <Route path="/faculty/dashboard">
        {() => <ProtectedRoute component={FacultyDashboard} roles={['faculty']} />}
      </Route>
      <Route path="/faculty/allot-room">
        {() => <ProtectedRoute component={AllotRoom} roles={['faculty']} />}
      </Route>
      <Route path="/faculty/complaints">
        {() => <ProtectedRoute component={ViewComplaints} roles={['faculty']} />}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
          <LoginModal />
          <RegisterModal />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;