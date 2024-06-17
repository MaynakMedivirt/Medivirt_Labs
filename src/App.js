import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
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
import LearnMore from './components/LearnMore';

import DoctorProfileComplete from './components/Doctorutils/DoctorProfileComplete';
import DoctorDashboard from './components/Doctorutils/DoctorDashboard';
import DocdashProfile from './components/Doctorutils/DocdashProfile';
import EditDoctorAbout from './components/Doctorutils/EditDoctorAbout';
import EditDoctorExperience from './components/Doctorutils/EditDoctorExperience';
import EditDoctorEducation from './components/Doctorutils/EditDoctorEducation';
import EditDoctorCurrentposition from './components/Doctorutils/EditDoctorCurrentposition';
import EditDoctorImage from './components/Doctorutils/EditDoctorImage';
import DoctorSchedule from './components/Doctorutils/DoctorSchedule';
import DoctorMessage from './components/Doctorutils/DoctorMessage';
import DoctorEarning from './components/Doctorutils/DoctorEarning';
import DoctorMissedMeetings from './components/Doctorutils/DoctorMissedMeetings';
import DoctorSetting from './components/Doctorutils/DoctorSetting';

import AdminLogin from './components/AdminUtils/AdminLogin';
import AdminDashboard from './components/AdminUtils/AdminDashboard';
import Doctor from './components/AdminUtils/Doctor';
import AddDoctor from './components/AdminUtils/AddDoctor';
import EditDoctor from './components/AdminUtils/EditDoctor';
import ScheduleList from './components/AdminUtils/ScheduleList';
import AddManager from './components/AdminUtils/AddManager';
import Manager from './components/AdminUtils/Manager';
import EditManager from './components/AdminUtils/EditManager';
import AdminMessage from './components/AdminUtils/AdminMessage';
import Company from './components/AdminUtils/Company';
import AddCompany from './components/AdminUtils/AddCompany';
import EditCompany from './components/AdminUtils/EditCompany';
import AdminMissedMeeting from './components/AdminUtils/AdminMissedMeeting';

import ManagerDashboard from './components/ManagerUtils/ManagerDashboard';
import ManagerSchedule from './components/ManagerUtils/ManagerSchedule';
import ManageDoctors from './components/ManagerUtils/ManageDoctors';
import ManageCompanies from './components/ManagerUtils/ManageCompanies';
import ManagerMessages from './components/ManagerUtils/ManagerMessages';

import ProfileComplete from './components/CompanyUtils/ProfileComplete';
import CompanyDashboard from './components/CompanyUtils/CompanyDashboard';
import CompanySchedule from './components/CompanyUtils/CompanySchedule';
import CompanyMessage from './components/CompanyUtils/CompanyMessage';
import ComdashProfile from './components/CompanyUtils/ComdashProfile';
import Products from './components/CompanyUtils/Products';
import Users from './components/CompanyUtils/Users';
import AddProduct from './components/CompanyUtils/AddProduct';
import AddUsers from './components/CompanyUtils/AddUsers';
import CompanyCredits from './components/CompanyUtils/CompanyCredits';
import EditCompanyName from './components/CompanyUtils/EditCompanyName';
import EditCompanyAbout from './components/CompanyUtils/EditCompanyAbout';
import EditCompanyDetails from './components/CompanyUtils/EditCompanyDetails';
import EditCompanyUser from './components/CompanyUtils/EditCompanyUser';
import CompanyMissedMeetings from './components/CompanyUtils/CompanyMissedMeetings';
import MyDoctors from './components/CompanyUtils/MyDoctors';
import DoctorViewProfile from './components/CompanyUtils/DoctorViewProfile';
import CompanySetting  from './components/CompanyUtils/CompanySetting ';


import SalesDashboard from './components/SalesUtils/SalesDashboard';
import SalesHeadUsers from './components/SalesUtils/SalesHeadUsers';
import AddSalesHeadUser from './components/SalesUtils/AddSalesHaedUser';
import SalesHeadMessage from './components/SalesUtils/SalesHeadMessage';
import SalesHeadProduct from './components/SalesUtils/SalesHeadProduct';
import SalesAddProduct from './components/SalesUtils/SalesAddProduct';
import SalesAllDoctors from './components/SalesUtils/SalesAllDoctors';
import SalesViewDoctor from './components/SalesUtils/SalesViewDoctor';
import SalesHeadSchedule from './components/SalesUtils/SalesHeadSchedule';
import EditSalesHeadUser from './components/SalesUtils/EditSalesHeadUser';
import SalesHeadSetting  from './components/SalesUtils/SalesHeadSetting';


import MrDashboard from './components/MrUtils/MrDashboard';
import MrSchedule from './components/MrUtils/MrSchedule';
import MrMessage from './components/MrUtils/MrMessage';
import MrProduct from './components/MrUtils/MrProduct';
import MrAddProduct from './components/MrUtils/MrAddProduct';
import MrAllDoctors from './components/MrUtils/MrAllDoctors';
import MrViewDoctor from './components/MrUtils/MrViewDoctor';
import MrSetting  from './components/MrUtils/MrSetting';

import './App.css'

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const isAuthorized = true; 
  
  return (
    <AuthProvider>
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/company" element={<CompanyList />} />
          <Route path="/doctorlist" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/company/:id" element={<CompanyProfile />} /> 
          <Route path="/warning" element={<WarningPage />} />
          <Route path='/price' element={<Pricing/>}/>
          <Route path='/footer' element={<Footer/>}/>

          <Route path='/doctorprofilecomplete/:id' element={<DoctorProfileComplete/>}/>
          <Route path='/doctorDashboard/:id' element={<DoctorDashboard/>}/>
          <Route path='/doctor/profile/:id' element={<DocdashProfile/>}/>          
          <Route path='/doctor/profile/edit-about/:id' element={<EditDoctorAbout/>}/>          
          <Route path='/doctor/profile/edit-experience/:id' element={<EditDoctorExperience/>}/>          
          <Route path='/doctor/profile/edit-education/:id' element={<EditDoctorEducation/>}/>          
          <Route path='/doctor/profile/edit-currentposition/:id' element={<EditDoctorCurrentposition/>}/>          
          <Route path='/doctor/profile/edit-image/:id' element={<EditDoctorImage/>}/>          
          <Route path='/doctor/schedule/:id' element={<DoctorSchedule/>}/>          
          <Route path='/doctor/message/:id' element={<DoctorMessage/>}/>
          <Route path='/doctor/setting/:id' element={<DoctorSetting/>}/>

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
          <Route path='/company/doctors/:id' element={<MyDoctors/>}/>
          <Route path='/company/viewProfile/:id' element={<DoctorViewProfile/>}/>
          <Route path='/company/setting/:id' element={<CompanySetting/>}/>

          <Route path='/doctor/earning/:id' element={<DoctorEarning/>}/>
          <Route path='/doctor/missedMeeting/:id' element={<DoctorMissedMeetings/>}/>

          <Route path='/learnMore' element={<LearnMore />}/>

          <Route path='/salesDashboard/:id' element={<SalesDashboard />} />
          <Route path='/sales/schedule/:id' element={<SalesHeadSchedule />} />
          <Route path='/sales/users/:id' element={<SalesHeadUsers />} />
          <Route path='/sales/add-user/:id' element={<AddSalesHeadUser />} />
          <Route path='/sales/edit-user/:id' element={<EditSalesHeadUser />} />
          <Route path='/sales/message/:id' element={<SalesHeadMessage />} />
          <Route path='/sales/products/:id' element={<SalesHeadProduct />} />
          <Route path='/sales/add-product/:id' element={<SalesAddProduct />} />
          <Route path='/sales/doctors/:id' element={<SalesAllDoctors />} />
          <Route path='/sales/viewProfile/:id' element={<SalesViewDoctor />} />
          <Route path='/sales/setting/:id' element={<SalesHeadSetting/>}/>
          
          <Route path='/mrDashboard/:id' element={<MrDashboard />} />
          <Route path='/mr/schedule/:id' element={<MrSchedule />} />
          <Route path='/mr/message/:id' element={<MrMessage />} />
          <Route path='/mr/products/:id' element={<MrProduct />} />
          <Route path='/mr/add-product/:id' element={<MrAddProduct />} />
          <Route path='/mr/doctors/:id' element={<MrAllDoctors />} />
          <Route path='/mr/viewProfile/:id' element={<MrViewDoctor />} />
          <Route path='/mr/setting/:id' element={<MrSetting/>}/>


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