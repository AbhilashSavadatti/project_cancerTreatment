import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Sidebar, Navbar } from "./components";
import { Home,Profile, Onboarding } from "./pages";
import MedicalRecords from "./pages/records/index";
import ScreeningSchedule from "./pages/ScreeningSchedule";
import SingleRecordDetails from "./pages/records/single-record-details";
import { useStateContext } from "./context";
import Landing from "./pages/landing";
import image from './assets/cancer.png'
import Example from "./components/BubbleText";

const App = () => {
  const { user, authenticated, ready, login, currentUser } = useStateContext();
  const navigate = useNavigate();


  

  useEffect(() => {
    if (ready) {
      if (!authenticated) {
        login(); // Trigger login flow if not authenticated
      } else if (user && !currentUser) {
        navigate("/onboarding"); // Redirect to Onboarding if user exists but profile is incomplete
      } else if (authenticated) {
        navigate("/"); // Redirect to Home if authenticated
      }
    }
  }, [user, authenticated, ready, login, currentUser, navigate]);


  return (
    <div className="sm:-8 relative flex min-h-screen bg-cover bg-center bg-no-repeat flex-row bg-[#769279] p-4
    
    "
    style={{ backgroundImage: `url(${image})` }}>

     
      <div className="relative mr-10 hidden sm:flex">
        <Sidebar />
      </div>

      <div className="mx-auto max-w-full flex-1 max-sm:w-full sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/medical-records/:id" element={<SingleRecordDetails />} />
          <Route path="/screening-schedules" element={<ScreeningSchedule />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
