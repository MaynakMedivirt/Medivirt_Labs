import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DoctorDash from './components/DoctorDash';
/*import CompanyDash from './components/CompanyDash';*/
import { AuthProvider } from './components/AuthContext';
import DoctorList from './components/DoctorList';
/*import CompanyList from './components/CompanyList';*/
import DoctorProfile from './components/DoctorProfile';
/*import CompanyProfile from './components/CompanyProfile';*/
import WarningPage from './pages/WarningPage';
import Navbar from './components/Navbar';
import Sidebar from "./components/Side";
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import DocProfile from './components/DocProfile';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Doctor from './components/Doctor';
import AddDoctor from './components/AddDoctor';
import EditDoctor from './components/EditDoctor';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


const App = () => {
  const isAuthorized = true; // You may need to set the authorization status

  return (
    <AuthProvider>
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/doctordash" element={<DoctorDash />} />
          {/*<Route path="/companydash" element={<CompanyDash />} /> */}
          {/* <Route path="/companylist" element={<CompanyList />} /> */}
          <Route path="/doctorlist" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          {/*<Route path="/company/:id" element={<CompanyProfile />} /> */}
          <Route path="/warning" element={<WarningPage />} />
          <Route path='/price' element={<Pricing/>}/>
          <Route path='/footer' element={<Footer/>}/>
          <Route path='/DocProfile' element={<DocProfile/>}/>
          <Route path='/admin' element={<AdminLogin/>}/>
          <Route path='/adminDash/*' element={<AdminDashboard/>}/>
          <Route path='/admin/doctors*' element={<Doctor/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/edit-doctor/:id' element={<EditDoctor/>}/>
          

          {/* Route for the home page */}
          <Route path="*" element={isAuthorized ? <Home /> : <WarningPage />} />
          <Route path='/nav' element={<Navbar />}/>
          <Route path='/side' element={<Sidebar />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;