import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import signupImage from '../assets/img/login-signup.jpg';
import { FcGoogle } from 'react-icons/fc';
import Header from './Header';
import Footer from './Footer';
import { PiSignIn } from 'react-icons/pi';

import { firebaseConfig } from '../components/firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('company');
  const [companyName, setCompanyName] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [setErrorMessage] = useState('');
  const [errorField, setErrorField] = useState('');

  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (showSuccessMessage) {
      redirectToLogin();
    }
  }, [showSuccessMessage]);

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.error('Error sending verification email:', error.message);
      setErrorMessage('Failed to send verification email. Please try again.');
      setErrorField('verification');
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email after signup
      await sendVerificationEmail(user);
      const userData = { email, name, phone, role };

      if (role === 'company') {
        userData.companyName = companyName;
      }
      await addUserToDatabase(userData);

      setShowSuccessMessage(true);

      redirectToLogin()
    } catch (error) {
      console.error('Error signing up:', error.message);
      setErrorMessage('Failed to create account. Please try again.');
      setErrorField('signup');
    }
  };

  const addUserToDatabase = async (userData) => {
    try {
      const collectionName = role === 'doctor' ? 'doctors' : 'companies';
      await addDoc(collection(db, collectionName), userData);
    } catch (error) {
      console.error('Error adding user data to database:', error.message);
      setErrorMessage('Failed to add user data to database.');
      setErrorField('database');
    }
  };

  const handleSignupWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send verification email after signup with Google
      await sendVerificationEmail(user);

      const userData = { email: user.email, name: user.displayName, phone: user.phoneNumber, role,};
      if (role === 'company') {
        userData.companyName = companyName;
      }
      await addUserToDatabase(userData);

      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error signing up with Google:', error.message);
      setErrorMessage('Failed to sign up with Google. Please try again.');
      setErrorField('google');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-5 lg:px-0 bg-cover">
        <div className="max-w-screen-2xl bg-white shadow sm:rounded-lg flex justify-center w-full lg:w-3/4 xl:w-full">
          <div className="hidden bg-[#7191e6] md:flex md:w-[60%] rounded-l-lg">
            <div
              className="w-full bg-contain bg-no-repeat"
              style={{
                backgroundImage: `url(${signupImage})`,
                height: '900px'
              }}
            >

              <div className="mt-[6rem] ml-10 mr-10">
                <img
                  loading="lazy"
                  srcSet="./src/assets/img/Medivirt.png"
                  className="max-w-full aspect-[7.14] w-[156px] mb-[5rem]"
                />
                <h1 className="text-2xl xl:text-3xl font-semibold text-[#FFF]">
                  Sign Up as {role}
                </h1>
                <p className="text-lg mt-3 text-[#fff]">
                  Hey, Welcome to MEDIVIRT! Enter your details to create an account
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[40%] p-6 sm:p-8 lg:">
            <div className="flex gap-5 text-base font-bold text-center uppercase mb-10 whitespace-nowrap tracking-[2px] max-md:flex-wrap">
              <button
                className={`flex flex-1 gap-5 justify-center items-center py-6 pr-10 pl-5 rounded-lg ${role === 'company'
                    ? 'bg-[#3d52a1] text-white' // Active state for Company button
                    : 'bg-gray-200 text-zinc-500' // Inactive state for Company button
                  }`}
                onClick={() => setRole('company')}
              >
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                <div className="text-[1.5rem] font-sans">COMPANY</div>
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              </button>
              <button
                className={`flex flex-1 gap-5 justify-center items-center py-6 pr-10 pl-5 rounded-lg  ${role === 'doctor'
                    ? 'bg-[#3d52a1] text-white' // Active state for Doctor button
                    : 'bg-gray-200 text-zinc-500' // Inactive state for Doctor button
                  }`}
                onClick={() => setRole('doctor')}
              >
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                <div className="text-[1.5rem] font-sans">DOCTOR</div>
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              </button>
            </div>

            {/* Company name input for company role */}
            {/* Error messages based on errorField */}
            {errorField === 'signup' && (
              <p className="text-red-500 text-sm mb-2">Failed to create account. Please try again.</p>
            )}
            {errorField === 'verification' && (
              <p className="text-red-500 text-sm mb-2">Failed to send verification email. Please try again.</p>
            )}
            {errorField === 'database' && (
              <p className="text-red-500 text-sm mb-2">Failed to add user data to database.</p>
            )}
            {role === 'company' && (
              <input
                className="w-full px-4 py-5 mb-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            )}
            {/* Input fields for name, email, phone, password */}
            <input
              className="w-full px-4 py-5 mb-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full px-4 py-5 mb-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full px-3 py-5 mb-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="w-full px-3 py-5 mb-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Sign up button */}
            <button
              className="mt-4 tracking-wide font-semibold bg-[#3d52a1] text-gray-100 w-full py-5 rounded-lg hover:bg-[#9a9a9a] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              onClick={handleSignup}
            >
              <PiSignIn className="mr-4 h-6 w-6" />
              Sign Up
            </button>
            {/* Sign up with Google button */}
            <button
              className="mt-4 tracking-wide font-semibold bg-[#3d52a1] text-gray-100 w-full py-5 rounded-lg hover:bg-[#9a9a9a] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              onClick={handleSignupWithGoogle}
            >
              <FcGoogle className="mr-4 h-6 w-6" />
              Sign Up with Google
            </button>
            {/* Link to login page */}
            <p className="mt-5 text-lg text-gray-600 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-[#3d52a1] font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupPage;