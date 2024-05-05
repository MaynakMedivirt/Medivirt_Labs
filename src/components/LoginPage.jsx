import React, { useState,useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { PiSignIn } from "react-icons/pi";
import Header from './Header';
import Footer from './Footer';
import signupImage from '../assets/img/login-signup.jpg';
import MedivirtLogo from '../assets/img/Medivirt.png'
import { firebaseConfig } from '../components/firebase'; 

const app = initializeApp(firebaseConfig);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [role, setRole] = useState('company');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth()
  const auth = getAuth(); // Initialize auth here
  // const currentUser=auth.currentUser

  auth.languageCode = 'en';

  const redirectToDashboard = () => {
    navigate('/home');
  };

 
  // console.log(auth)

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      
        await signInWithEmailAndPassword(auth, email, password);
        if(currentUser.emailVerified){
          setShowPopup(true);
          setTimeout(() => {
            redirectToDashboard();
          }, 3000);
        }
        else{
          alert("Email not verified!")
        }
    } catch (error) {
      console.error('Error signing in:', error.message);
      alert('Failed to sign in. Please check your credentials and try again.');
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user !== null) {
        setShowPopup(true);
        setTimeout(() => {
          redirectToDashboard();
        }, 5000);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      alert('Failed to sign in with Google. Please try again.');
    }
  };


  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-5 lg:px-0 bg-cover">
        <div className="max-w-screen-2xl bg-white shadow sm:rounded-lg flex justify-center w-full lg:w-3/4 xl:w-full">
          {/* Left Side Image Section */}
          <div className="hidden bg-[#7191e6] md:flex md:w-[60%] rounded-l-lg">
            <div className="w-full bg-contain bg-no-repeat" style={{ backgroundImage: `url(${signupImage})`, height: '900px' }}>
              <div className="mt-[6rem] ml-10 mr-10">
                <img loading="lazy" srcSet= {MedivirtLogo} className="max-w-full aspect-[7.14] w-[156px] mb-[5rem]" alt="Medivirt Logo" />
                <h1 className="text-2xl xl:text-3xl font-semibold text-[#FFF]">Login as {role}</h1>
                <p className="text-lg mt-3 text-[#fff]">Welcome back to MEDIVIRT! Sign in to your account</p>
              </div>
            </div>
          </div>
          {/* Right Side Login Section */}
          <div className="w-full md:w-[40%] p-6 sm:p-8 lg:">
            <div className="flex gap-4 max-w-xl mx-auto mt-20 text-base font-bold text-center uppercase mb-10 whitespace-nowrap tracking-[2px] max-md:flex-wrap">
              {/* Role Selection Buttons */}
              <button
                className={`flex justify-center items-center py-6 pr-10 pl-5 rounded-lg w-full ${role === 'company' ? 'bg-[#3d52a1] text-white' : 'bg-gray-200 text-zinc-500'}`}
                onClick={() => setRole('company')}
              >
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                <div className="self-stretch">COMPANY</div>
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              </button>
              <button
                className={`flex justify-center items-center py-6 pr-10 pl-5 rounded-lg w-full ${role === 'doctor' ? 'bg-[#3d52a1] text-white' : 'bg-gray-200 text-zinc-500'}`}
                onClick={() => setRole('doctor')}
              >
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                <div className="self-stretch">DOCTOR</div>
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              </button>
            </div>
            {/* Login Form */}
            <div className="mx-auto max-w-xl flex flex-col gap-4 items-center">
              <input
                className="w-full px-5 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative w-full"> {/* Password input wrapper with relative position */}
                <input
                  className="w-full px-5 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Password visibility toggle icon */}
                {showPassword ? (
                  <TbEyeClosed 
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <TbEye
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              <button
                className="tracking-wide font-semibold mt-8 bg-[#3d52a1] text-gray-100 w-full py-5 rounded-lg hover:bg-[#7091E6] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                onClick={handleLogin}
              >
                <PiSignIn className="mr-4 h-5 w-5" />
                Sign In
              </button>
              <button
                className="tracking-wide font-semibold bg-[#3d52a1] text-gray-100 w-full py-5 rounded-lg hover:bg-[#7091E6] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                onClick={handleLoginWithGoogle}
              >
                <FcGoogle className="mr-4 h-6 w-6" />
                Sign In with Google
              </button>
              <p className="md:mt-4 text-lg text-gray-600 text-center">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#3d52a1] font-semibold text-lg">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Login Success Popup */}
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg text-center">
          <p className="text-xl text-green-500">Login Successful!</p>
        </div>
      )}
      <Footer />
    </>
  );
};

export default LoginPage;