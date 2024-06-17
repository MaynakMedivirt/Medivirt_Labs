import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import signupImage from "../assets/img/login-signup.jpg";
import { FcGoogle } from "react-icons/fc";
import Header from "./Header";
import Footer from "./Footer";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { PiSignIn } from "react-icons/pi";
import MedivirtLogo from "../assets/img/Medivirt.png";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";

import { firebaseConfig } from "../components/firebase";

import "../components/style/Signup.css";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Company");
  const [companyName, setCompanyName] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  const redirectToDashboard = (userData) => {
    if (userData.role === "Doctor") {
      if (!userData.profileComplete) {
        navigate(`/doctorprofilecomplete/${userData.id}`);
      } else {
        navigate(`/doctorDashboard/${userData.id}`);
      }
    }
  };

  useEffect(() => {
    if (showSuccessMessage) {
      redirectToLogin();
    }
  }, [showSuccessMessage]);

  const isWorkEmail = (email) => {
    // List of free email domains
    const freeEmailDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "aol.com",
      "icloud.com",
      "mail.com",
      "yandex.com",
      "protonmail.com",
      "reddif.com",
    ];
    const emailDomain = email.split("@")[1];
    return !freeEmailDomains.includes(emailDomain);
  };

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.error("Error sending verification email:", error.message);
      setErrorMessage("Failed to send verification email. Please try again.");
      setErrorField("verification");
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (role === "Company" && !isWorkEmail(email)) {
      setErrorMessage(
        "Please use a valid work email for company registration !!"
      );
      setErrorField("email");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email after signup
      await sendVerificationEmail(user);
      const userData = { email, name, phone, role };

      if (role === "Company") {
        userData.companyName = companyName;
      }
      await addUserToDatabase(userData);

      setShowSuccessMessage(true);

      redirectToLogin();
    } catch (error) {
      console.error("Error signing up:", error.message);
      setErrorMessage("Failed to create account. Please try again.");
      setErrorField("signup");
    }
  };

  const addUserToDatabase = async (userData) => {
    try {
      const collectionName = role === "Doctor" ? "doctors" : "companies";
      await addDoc(collection(db, collectionName), userData);
    } catch (error) {
      console.error("Error adding user data to database:", error.message);
      setErrorMessage("Failed to add user data to database.");
      setErrorField("database");
    }
  };

  // const handleSignupWithGoogle = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

  //     // Send verification email after signup with Google
  //     // await sendVerificationEmail(user);

  //     const userData = { email: user.email, name: user.displayName, phone: user.phoneNumber, role: 'Doctor' };

  //     await addUserToDatabase(userData);

  //     setShowSuccessMessage(true);
  //   } catch (error) {
  //     console.error('Error signing up with Google:', error.message);
  //     setErrorMessage('Failed to sign up with Google. Please try again.');
  //     setErrorField('google');
  //   }
  // };

  const handleSignupWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const email = user.email;
        const emailQuery = query(
          collection(db, "doctors"),
          where("email", "==", email)
        );
        const snapshot = await getDocs(emailQuery);

        let userData;

        if (snapshot.empty) {
          userData = {
            email: user.email,
            name: user.displayName,
            phone: user.phoneNumber,
            role: "Doctor",
          };
          const docRef = await addDoc(collection(db, "doctors"), userData);
          userData.id = docRef.id; // Add the document ID to the userData
        } else {
          userData = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
        }
        toast.success("Signup successful!", {
          // position: toast,
          autoClose: 3000,
        });
        // setShowSuccessMessage(true);
        setTimeout(() => redirectToDashboard(userData), 3000);
      }
    } catch (error) {
      console.error("Error signing up with Google:", error.message);
      setErrorMessage("Failed to sign up with Google. Please try again.");
      setErrorField("google");
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center px-5 lg:px-0 bg-cover md:h-[45rem]">
        <div className="max-w-screen-2xl bg-white flex justify-center w-full lg:w-full xl:w-full">
          <div className="hidden bg-[#7191e6] md:flex md:w-[60%]">
            <div
              className="w-full bg-contain bg-no-repeat"
              style={{
                backgroundImage: `url(${signupImage})`,
                height: "735px",
              }}
            >
              <div className="mt-[6rem] ml-10 mr-10">
                <img
                  loading="lazy"
                  srcSet={MedivirtLogo}
                  className="max-w-full aspect-[7.14] w-[156px] mb-[5rem]"
                  alt="Medivirt Logo"
                />
                <h1 className="text-2xl xl:text-3xl font-semibold text-[#FFF]">
                  Sign Up as {role}
                </h1>
                <p className="text-lg mt-3 text-[#fff]">
                  Hey, Welcome to MEDIVIRT! Enter your details to create an
                  account
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[40%] p-6 sm:p-8">
            <div
              id="roles"
              className="flex gap-5 text-base font-bold text-center uppercase mb-10 whitespace-nowrap tracking-[2px]"
            >
              <button
                className={`flex flex-1 gap-3 justify-center items-center py-6 pr-10 pl-5 rounded-lg ${
                  role === "Company"
                    ? "bg-[#3d52a1] text-white" // Active state for Company button
                    : "bg-gray-200 text-zinc-500" // Inactive state for Company button
                }`}
                onClick={() => setRole("Company")}
              >
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                <div className="text-[1.5rem] font-sans">COMPANY</div>
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              </button>
              <button
                className={`flex flex-1 gap-3 justify-center items-center py-6 pr-10 pl-5 rounded-lg  ${
                  role === "Doctor"
                    ? "bg-[#3d52a1] text-white" // Active state for Doctor button
                    : "bg-gray-200 text-zinc-500" // Inactive state for Doctor button
                }`}
                onClick={() => setRole("Doctor")}
              >
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                <div className="text-[1.5rem] font-sans">DOCTOR</div>
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              </button>
            </div>

            {/* Company name input for company role */}
            {role === "Company" && (
              <div className="mb-4">
                <input
                  className="w-full px-4 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                {errorField === "companyName" && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
              </div>
            )}
            <div className="mb-4">
              <input
                className="w-full px-4 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errorField === "name" && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                className={`w-full px-4 py-5 rounded-lg font-medium bg-gray-100 border ${
                  errorField === "email" ? "border-red-500" : "border-gray-200"
                } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                type="email"
                placeholder={role === "Company" ? "Work Email" : "Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorField === "email" && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
            <div className="mb-4 relative w-full">
              {/* Password input wrapper with relative position */}
              <input
                className="w-full px-5 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorField === "password" && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
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
            <div className="mb-4">
              <input
                className="w-full px-3 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errorField === "phone" && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
            {/* Sign up button */}
            <button
              className="mt-4 tracking-wide font-semibold bg-[#3d52a1] text-gray-100 w-full py-5 rounded-lg hover:bg-[#9a9a9a] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
              onClick={handleSignup}
            >
              <PiSignIn className="mr-4 h-6 w-6" />
              Sign Up
            </button>
            {/* Conditionally render Sign up with Google button */}
            {role === "Doctor" && (
              <button
                className="mt-4 tracking-wide font-semibold bg-[#3d52a1] text-gray-100 w-full py-5 rounded-lg hover:bg-[#9a9a9a] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                onClick={handleSignupWithGoogle}
              >
                <FcGoogle className="mr-4 h-6 w-6" />
                Sign Up with Google
              </button>
            )}
            {/* Link to login page */}
            <p className="mt-5 text-lg text-gray-600 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-[#3d52a1] font-semibold">
                Sign in
              </Link>
            </p>
            {showPopup && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg text-center">
                <p className="text-xl text-green-500">Signup Successful!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer  position="top-right"/>
    </>
  );
};

export default SignupPage;
