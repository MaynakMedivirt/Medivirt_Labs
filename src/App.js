import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DoctorDash from './components/DoctorDash';
/*import CompanyDash from './components/CompanyDash';*/
import { AuthProvider, useAuth } from './components/AuthContext';
import DoctorList from './components/DoctorList';
import CompanyList from './components/CompanyList';
import DoctorProfile from './components/DoctorProfile';
import CompanyProfile from './components/CompanyProfile';
import WarningPage from './pages/WarningPage';
import Navbar from './components/Navbar';
import Sidebar from "./components/Side";
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import DocProfile from './components/DocProfile';
import DoctorDashboard from './components/DoctorDashboard';
import DocdashProfile from './components/DocdashProfile';
import EditDoctorAbout from './components/EditDoctorAbout';
import EditDoctorExperience from './components/EditDoctorExperience';
import EditDoctorEducation from './components/EditDoctorEducation';
import EditDoctorCurrentposition from './components/EditDoctorCurrentposition';
import EditDoctorImage from './components/EditDoctorImage';
import DoctorSchedule from './components/DoctorSchedule';
import DoctorMessage from './components/DoctorMessage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Doctor from './components/Doctor';
import AddDoctor from './components/AddDoctor';
import EditDoctor from './components/EditDoctor';
import ScheduleList from './components/ScheduleList';
import AddManager from './components/AddManager';
import Manager from './components/Manager';
import EditManager from './components/EditManager';
import AdminMessage from './components/AdminMessage';
// import AdminDoctorMessage from './components/AdminDoctorMessage';
import Company from './components/Company';
import AddCompany from './components/AddCompany';
import EditCompany from './components/EditCompany';
import AdminMissedMeeting from './components/AdminMissedMeeting';

import ManagerDashboard from './components/ManagerDashboard';
import ManagerSchedule from './components/ManagerSchedule';
// import ManagerCompany from './components/ManagerCompany';
// import ManagerDoctor from './components/ManagerDoctor';
import ManageDoctors from './components/ManageDoctors';
import ManageCompanies from './components/ManageCompanies';
import ManagerMessages from './components/ManagerMessages';

import ProfileComplete from './components/ProfileComplete';
import CompanyDashboard from './components/CompanyDashboard';
import CompanySchedule from './components/CompanySchedule';
import CompanyMessage from './components/CompanyMessage';
import ComdashProfile from './components/ComdashProfile';
import Products from './components/Products';
import Users from './components/Users';
import AddProduct from './components/AddProduct';
import AddUsers from './components/AddUsers';
import CompanyCredits from './components/CompanyCredits';
import EditCompanyName from './components/EditCompanyName';
import EditCompanyAbout from './components/EditCompanyAbout';
import EditCompanyDetails from './components/EditCompanyDetails';
import EditCompanyUser from './components/EditCompanyUser';
import CompanyMissedMeetings from './components/CompanyMissedMeetings';

import DoctorEarning from './components/DoctorEarning';
import LearnMore from './components/LearnMore';
import DoctorMissedMeetings from './components/DoctorMissedMeetings';

import SalesDashboard from './components/SalesDashboard';
import SalesHeadSchedule from './components/SalesHeadSchedule';
import SalesHeadUsers from './components/SalesHeadUsers';
import AddSalesHeadUser from './components/AddSalesHaedUser';
import EditSalesHeadUser from './components/EditSalesHeadUser';
import SalesHeadMessage from './components/SalesHeadMessage';

import MrDashboard from './components/MrDashboard';
import MrSchedule from './components/MrSchedule';
import MrMessage from './components/MrMessage';

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
          <Route path="/companylist" element={<CompanyList />} />
          <Route path="/doctorlist" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/company/:id" element={<CompanyProfile />} /> 
          <Route path="/warning" element={<WarningPage />} />
          <Route path='/price' element={<Pricing/>}/>
          <Route path='/footer' element={<Footer/>}/>
          <Route path='/DocProfile' element={<DocProfile/>}/>
          <Route path='/doctorDashboard/:id' element={<DoctorDashboard/>}/>
          <Route path='/doctor/profile/:id' element={<DocdashProfile/>}/>          
          <Route path='/doctor/profile/edit-about/:id' element={<EditDoctorAbout/>}/>          
          <Route path='/doctor/profile/edit-experience/:id' element={<EditDoctorExperience/>}/>          
          <Route path='/doctor/profile/edit-education/:id' element={<EditDoctorEducation/>}/>          
          <Route path='/doctor/profile/edit-currentposition/:id' element={<EditDoctorCurrentposition/>}/>          
          <Route path='/doctor/profile/edit-image/:id' element={<EditDoctorImage/>}/>          
          <Route path='/doctor/schedule/:id' element={<DoctorSchedule/>}/>          
          <Route path='/doctor/message/:id' element={<DoctorMessage/>}/>   
          <Route path='/admin' element={<AdminLogin/>}/>
          <Route path='/admin/dash' element={<AdminDashboard/>}/>
          <Route path='/admin/doctors' element={<Doctor/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/edit-doctor/:id' element={<EditDoctor/>}/>
          <Route path='/admin/doctorSchedule' element={<ScheduleList />}/>    
          <Route path='/admin/manager' element={<Manager />}/>    
          <Route path='/add-manager' element={<AddManager/>}/> 
          <Route path='/edit-manager/:id' element={<EditManager/>}/>     
          <Route path='/admin/messages' element={<AdminMessage />} />  
          {/* <Route path='/admin/doctorMessage' element={<AdminDoctorMessage />} />  */}
          <Route path='/admin/companies' element={<Company />} /> 
          <Route path='/admin/add-company' element={<AddCompany />} /> 
          <Route path='/admin/edit-company/:id' element={<EditCompany />} /> 
          <Route path='/admin/missedMeeting' element={<AdminMissedMeeting />} /> 

          {/* growth manager  */}
          <Route path='/manager/dash/:id' element={<ManagerDashboard />} />  
          <Route path='/manager/doctorSchedule' element={<ManagerSchedule />} />  
          {/* <Route path='/manager/companyMessage' element={<ManagerCompany />} />  
          <Route path='/manager/doctorMessage' element={<ManagerDoctor />} />   */}
          <Route path='/manager/doctors' element={<ManageDoctors />} />  
          <Route path='/manager/companies' element={<ManageCompanies />} /> 
          <Route path='/manager/messages' element={<ManagerMessages />} /> 

          {/* company  */}
          <Route path='/profilecomplete/:id' element={<ProfileComplete/>}/>
          <Route path='/companyDashboard/:id' element={<CompanyDashboard/>}/>
          <Route path='/company/schedule/:id' element={<CompanySchedule/>}/>
          <Route path='/company/message/:id' element={<CompanyMessage/>}/>
          <Route path='/company/profile/:id' element={<ComdashProfile/>}/>
          <Route path='/company/products/:id' element={<Products/>}/>
          <Route path='/company/users/:id' element={<Users/>}/>
          <Route path='/company/add-product/:id' element={<AddProduct/>}/>
          <Route path='/company/add-user/:id' element={<AddUsers/>}/>
          <Route path='/company/credits/:id' element={<CompanyCredits/>}/>
          <Route path='/company/profile/edit-Name/:id' element={<EditCompanyName/>}/>
          <Route path='/company/profile/edit-about/:id' element={<EditCompanyAbout/>}/>
          <Route path='/company/profile/edit-details/:id' element={<EditCompanyDetails/>}/>
          <Route path='/company/edit-user/:id' element={<EditCompanyUser/>}/>
          <Route path='/company/missedMeeting/:id' element={<CompanyMissedMeetings/>}/>

          <Route path='/doctor/earning/:id' element={<DoctorEarning/>}/>
          <Route path='/doctor/missedMeeting/:id' element={<DoctorMissedMeetings/>}/>

          <Route path='/learnMore' element={<LearnMore />}/>

          <Route path='/salesDashboard/:id' element={<SalesDashboard />} />
          <Route path='/sales/schedule/:id' element={<SalesHeadSchedule />} />
          <Route path='/sales/users/:id' element={<SalesHeadUsers />} />
          <Route path='/sales/add-user/:id' element={<AddSalesHeadUser />} />
          <Route path='/sales/edit-user/:id' element={<EditSalesHeadUser />} />
          <Route path='/sales/message/:id' element={<SalesHeadMessage />} />
          
          <Route path='/mrDashboard/:id' element={<MrDashboard />} />
          <Route path='/mr/schedule/:id' element={<MrSchedule />} />
          <Route path='/mr/message/:id' element={<MrMessage />} />


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