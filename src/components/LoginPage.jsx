import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FcGoogle } from "react-icons/fc";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { PiSignIn } from "react-icons/pi";
import { useAuth } from "./AuthContext";
import signupImage from "../assets/img/login-signup.jpg";
import MedivirtLogo from "../assets/img/Medivirt.png";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../components/firebase";
import bcrypt from 'bcryptjs';

import '../components/style/Signup.css'

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Company");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const redirectToDashboard = (userData) => {
    if (userData.role === "Doctor") {
      if(!userData.profileComplete) {
        navigate(`/doctorprofilecomplete/${userData.id}`);
      }else{
        navigate(`/doctorDashboard/${userData.id}`);
      }
    } else if (userData.role === "Company") {
       if (userData.role_company === "Sales Head") {
        navigate(`/salesDashboard/${userData.id}`);
      } else if (userData.role_company === "Medical Representative") {
        navigate(`/mrDashboard/${userData.id}`);
      } else if (!userData.profileComplete) {
        navigate(`/profilecomplete/${userData.id}`);
      } else {
        navigate(`/companydashboard/${userData.id}`);
      }
    }
  };
  
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userData = await getUserDocument(identifier);
      if (!userData) throw new Error("User data not found.");

      if (role === "Company" && identifier !== userData.email) {
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) throw new Error("Invalid password.");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
        if (!userCredential.user.emailVerified) {
          throw new Error("Email is not verified.");
        }
      }

      setCurrentUser(userData);
      setShowPopup(true);
      setTimeout(() => redirectToDashboard(userData), 2000);
    } catch (error) {
      console.error("Error signing in:", error.message);
      alert("Failed to sign in. Please check your credentials and try again.");
    }
  };

  const getUserDocument = async (identifier) => {
    const collectionRef = role === "Doctor" ? "doctors" : "companies";
    const emailQuery = query(collection(db, collectionRef), where("email", "==", identifier));
    const snapshot = await getDocs(emailQuery);
    if (!snapshot.docs.length && role === "Company") {
      const usernameQuery = query(collection(db, "users"), where("username", "==", identifier));
      const snapshotUsers = await getDocs(usernameQuery);
      if (snapshotUsers.docs.length) {
        const userData = snapshotUsers.docs[0].data();
        return { ...userData, role_company: userData.role, role, id: snapshotUsers.docs[0].id };
      }
    }
    if (snapshot.docs.length) return { ...snapshot.docs[0].data(), role, id: snapshot.docs[0].id };
    return null;
  };

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const email = user.email;
        const emailQuery = query(collection(db, "doctors"), where("email", "==", email));
        const snapshot = await getDocs(emailQuery);
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setCurrentUser({ ...userData, id: snapshot.docs[0].id });
          setShowPopup(true);
          setTimeout(() => redirectToDashboard({ ...userData, id: snapshot.docs[0].id }), 2000);
        } else {
          throw new Error("No doctor found with this email.");
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex px-5 lg:px-0 bg-cover">
        <div className="max-w-screen-2xl bg-white shadow flex justify-center w-full lg:w-full xl:w-full">
        <div className="hidden bg-[#7191e6] md:flex md:w-[60%]">
        <div
          className="w-full bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url(${signupImage})`,
            height: '735px',
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
              Hey, Welcome to MEDIVIRT! Enter your details to create an account
            </p>
          </div>
        </div>
      </div>
          <div className="w-full md:w-[40%] p-6 sm:p-8 lg:">
            <div id="roles" className="flex gap-4 max-w-xl mx-auto mt-20 text-base font-bold text-center uppercase mb-10 whitespace-nowrap tracking-[2px]">
              {["Company", "Doctor"].map(r => (
                <button
                  key={r}
                  className={`flex justify-center items-center py-6 pr-10 pl-5 rounded-lg w-full ${role === r ? "bg-[#3d52a1] text-white" : "bg-gray-200 text-zinc-500"}`}
                  onClick={() => setRole(r)}
                >
                  <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                  <div className="self-stretch">{r.toUpperCase()}</div>
                  <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                </button>
              ))}
            </div>
            <div className="mx-auto max-w-xl flex flex-col gap-4 items-center">
              <input
                className="w-full px-5 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type={role === "Doctor" ? "email" : "text"}
                placeholder={role === "Doctor" ? "Enter your email" : "Enter your email or username"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              <div className="relative w-full">
                <input
                  className="w-full px-5 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <TbEyeClosed className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(false)} />
                ) : (
                  <TbEye className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(true)} />
                )}
              </div>
              <button
                className="tracking-wide font-semibold mt-8 bg-[#3d52a1] text-gray-100 w-full py-5 rounded-lg hover:bg-[#7091E6] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                onClick={handleLogin}
              >
                <PiSignIn className="mr-4 h-5 w-5" />
                Sign In
              </button>
              {role === "Doctor" && (
                <button
                  className="tracking-wide font-semibold bg-[#3d52a1] text-gray-100 w-full py-5 rounded-lg hover:bg-[#7091E6] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={handleLoginWithGoogle}
                >
                  <FcGoogle className="mr-4 h-6 w-6" />
                  Sign In with Google
                </button>
              )}
              <p className="md:mt-4 text-lg text-gray-600 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#3d52a1] font-semibold text-lg">
                  Sign up
                </Link>
              </p>
            </div>
            {showPopup && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg text-center">
                <p className="text-xl text-green-500">Login Successful!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
