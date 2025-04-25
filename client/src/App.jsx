import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import StudentDashboard from "./pages/student/Dashboard";
import ApplicationForm from "./pages/student/ApplicationForm";
import ComplaintForm from "./pages/student/ComplaintForm";
import ContactRector from "./pages/student/ContactRector";
import Help from "./pages/student/Help";
import FacultyDashboard from "./pages/faculty/Dashboard";
import AllotRoom from "./pages/faculty/AllotRoom";
import ViewComplaints from "./pages/faculty/ViewComplaints";
import { useState, useEffect } from "react";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/current-user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setCurrentUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Switch>
        <Route path="/">
          <Home 
            currentUser={currentUser} 
            onLogin={handleLogin} 
            onLogout={handleLogout}
          />
        </Route>
        
        {/* Student Routes - Protected */}
        <Route path="/student/dashboard">
          {currentUser && currentUser.role === 'student' ? (
            <StudentDashboard 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          ) : (
            <Home 
              currentUser={currentUser} 
              onLogin={handleLogin} 
              redirectPath="/student/dashboard"
            />
          )}
        </Route>
        
        <Route path="/student/application">
          {currentUser && currentUser.role === 'student' ? (
            <ApplicationForm 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          ) : (
            <Home 
              currentUser={currentUser} 
              onLogin={handleLogin} 
              redirectPath="/student/application"
            />
          )}
        </Route>
        
        <Route path="/student/complaint">
          {currentUser && currentUser.role === 'student' ? (
            <ComplaintForm 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          ) : (
            <Home 
              currentUser={currentUser} 
              onLogin={handleLogin} 
              redirectPath="/student/complaint"
            />
          )}
        </Route>
        
        <Route path="/student/contact-rector">
          {currentUser && currentUser.role === 'student' ? (
            <ContactRector 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          ) : (
            <Home 
              currentUser={currentUser} 
              onLogin={handleLogin} 
              redirectPath="/student/contact-rector"
            />
          )}
        </Route>
        
        <Route path="/student/help">
          {currentUser && currentUser.role === 'student' ? (
            <Help 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          ) : (
            <Home 
              currentUser={currentUser} 
              onLogin={handleLogin} 
              redirectPath="/student/help"
            />
          )}
        </Route>
        
        {/* Faculty Routes - Protected */}
        <Route path="/faculty/dashboard">
          {currentUser && currentUser.role === 'faculty' ? (
            <FacultyDashboard 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          ) : (
            <Home 
              currentUser={currentUser} 
              onLogin={handleLogin} 
              redirectPath="/faculty/dashboard"
            />
          )}
        </Route>
        
        <Route path="/faculty/allot-room">
          {currentUser && currentUser.role === 'faculty' ? (
            <AllotRoom 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          ) : (
            <Home 
              currentUser={currentUser} 
              onLogin={handleLogin} 
              redirectPath="/faculty/allot-room"
            />
          )}
        </Route>
        
        <Route path="/faculty/complaints">
          {currentUser && currentUser.role === 'faculty' ? (
            <ViewComplaints 
              currentUser={currentUser} 
              onLogout={handleLogout}
            />
          ) : (
            <Home 
              currentUser={currentUser} 
              onLogin={handleLogin} 
              redirectPath="/faculty/complaints"
            />
          )}
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
