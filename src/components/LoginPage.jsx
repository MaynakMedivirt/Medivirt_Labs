import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FcGoogle } from "react-icons/fc";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { PiSignIn } from "react-icons/pi";
import { useAuth } from "./AuthContext"; // Import useAuth
import signupImage from "../assets/img/login-signup.jpg";
import MedivirtLogo from "../assets/img/Medivirt.png";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseConfig } from "../components/firebase";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Company");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  const redirectToDashboard = () => {
    navigate("/home");
  };

  // const handleLogin = async (event) => {
  //   event.preventDefault();
  //   try {
  //     if (email && password) {
  //       const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //       const user = userCredential.user;
  //       if (user.emailVerified) {
  //         const userData = await getUserDocumentByEmail(email);
  //         if (userData) {
  //           setCurrentUser(userData); 
  //           console.log(userData);
  //           setShowPopup(true);
  //           setTimeout(() => {
  //             redirectToDashboard();
  //           }, 3000);
  //         } else {
  //           throw new Error("User data not found.");
  //         }
  //       } else {
  //         alert("Email not verified!");
  //       }
  //     } else if (name) {
  //       const userDoc = await getUserDocumentByRole(name, role);
  //       if (userDoc) {
  //         setCurrentUser({ ...userDoc, role, id: userDoc.id });
  //         console.log({ ...userDoc, role, id: userDoc.id });
  //         alert("Login successful!");
  //         redirectToDashboard();
  //       } else {
  //         throw new Error("User not found.");
  //       }
  //     } else {
  //       throw new Error("Please provide email/password or name.");
  //     }
  //   } catch (error) {
  //     console.error("Error signing in:", error.message);
  //     alert("Failed to sign in. Please check your credentials and try again.");
  //   }
  // };

  // const getUserDocumentByRole = async (name, role) => {
  //   const usersRef = collection(db, role === 'Doctor' ? 'doctors' : 'companies');
  //   const q = query(usersRef, where("name", "==", name));
  //   const querySnapshot = await getDocs(q);
  //   return querySnapshot.docs[0];
  // };

  // const getUserDocumentByRole = async (name, role) => {
  //   if (role === "Company") {
  //     const companiesRef = collection(db, "companies");
  //     const companyQuery = query(companiesRef, where("name", "==", name));
  //     const companySnapshot = await getDocs(companyQuery);
  //     if (!companySnapshot.empty) {
  //       return {
  //         ...companySnapshot.docs[0].data(),
  //         role: "Company",
  //         id: companySnapshot.docs[0].id,
  //       };
  //     }

  //     // If not found in companies collection, check 'users' collection for a match based on username
  //     const usersRef = collection(db, "users");
  //     const userQuery = query(usersRef, where("username", "==", name));
  //     const userSnapshot = await getDocs(userQuery);
  //     if (!userSnapshot.empty) {
  //       return {
  //         ...userSnapshot.docs[0].data(),
  //         role_company: userSnapshot.docs[0].data().role,
  //         role: "Company",
  //         id: userSnapshot.docs[0].id,
  //       };
  //     }
  //   } else if (role === "Doctor") {
  //     const doctorsRef = collection(db, "doctors");
  //     const doctorQuery = query(doctorsRef, where("name", "==", name));
  //     const doctorSnapshot = await getDocs(doctorQuery);
  //     if (!doctorSnapshot.empty) {
  //       return {
  //         ...doctorSnapshot.docs[0].data(),
  //         role: "Doctor",
  //         id: doctorSnapshot.docs[0].id,
  //       };
  //     }
  //   }

  //   return null;
  // };

  // const getUserDocumentByEmail = async (email) => {
  //   if (role === "Company") {
  //     const companiesRef = collection(db, "companies");
  //     const companyQuery = query(companiesRef, where("email", "==", email));
  //     const companySnapshot = await getDocs(companyQuery);
  //     if (!companySnapshot.empty) {
  //       return {
  //         ...companySnapshot.docs[0].data(),
  //         role: "Company",
  //         id: companySnapshot.docs[0].id,
  //       };
  //     }

  //     // If not found in companies collection, check 'users' collection for a match based on username
  //     const usersRef = collection(db, "users");
  //     const userQuery = query(usersRef, where("email", "==", email));
  //     const userSnapshot = await getDocs(userQuery);
  //     if (!userSnapshot.empty) {
  //       return {
  //         ...userSnapshot.docs[0].data(),
  //         role_company: userSnapshot.docs[0].data().role,
  //         role: "Company",
  //         id: userSnapshot.docs[0].id,
  //       };
  //     }
  //   } else if (role === "Doctor") {
  //     const doctorsRef = collection(db, "doctors");
  //     const doctorQuery = query(doctorsRef, where("email", "==", email));
  //     const doctorSnapshot = await getDocs(doctorQuery);
  //     if (!doctorSnapshot.empty) {
  //       return {
  //         ...doctorSnapshot.docs[0].data(),
  //         role: "Doctor",
  //         id: doctorSnapshot.docs[0].id,
  //       };
  //     }
  //   }

  //   return null;
  // };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      let userData = null;
      if (email && password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        userData = await getUserDocument("email", email);
      } else if (name) {
        userData = await getUserDocument("name", name);
      } else {
        throw new Error("Please provide email/password or name.");
      }

      if (userData) {
        setCurrentUser(userData);
        console.log(userData);
        setShowPopup(true);
        setTimeout(redirectToDashboard, 3000);
      } else {
        throw new Error("User data not found.");
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      alert("Failed to sign in. Please check your credentials and try again.");
    }
  };

  const getUserDocument = async (field, value) => {
    const collectionName = role === "Company" ? "companies" : "doctors";
    const fieldToQuery = field === "email" ? "email" : "name";
    const q = query(collection(db, collectionName), where(fieldToQuery, "==", value));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length) {
      return { ...snapshot.docs[0].data(), role, id: snapshot.docs[0].id };
    } else if (field === "name") {
      // If not found by name, check the 'users' collection for a match based on username
      const userSnapshot = await getDocs(query(collection(db, "users"), where("username", "==", value)));
      if (userSnapshot.docs.length) {
        return { ...userSnapshot.docs[0].data(), role_company: userSnapshot.docs[0].data().role, role, id: userSnapshot.docs[0].id };
      }
    }
    return null;
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
      console.error("Error signing in with Google:", error.message);
      alert("Failed to sign in with Google. Please try again.");
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
                height: "900px",
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
                  Login as {role}
                </h1>
                <p className="text-lg mt-3 text-[#fff]">
                  Welcome back to MEDIVIRT! Sign in to your account
                </p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[40%] p-6 sm:p-8 lg:">
            <div className="flex gap-4 max-w-xl mx-auto mt-20 text-base font-bold text-center uppercase mb-10 whitespace-nowrap tracking-[2px] max-md:flex-wrap">
              {/* Role Selection Buttons */}
              <button
                className={`flex justify-center items-center py-6 pr-10 pl-5 rounded-lg w-full ${role === "Company"
                  ? "bg-[#3d52a1] text-white"
                  : "bg-gray-200 text-zinc-500"
                  }`}
                onClick={() => setRole("Company")}
              >
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                <div className="self-stretch">COMPANY</div>
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              </button>
              <button
                className={`flex justify-center items-center py-6 pr-10 pl-5 rounded-lg w-full ${role === "Doctor"
                  ? "bg-[#3d52a1] text-white"
                  : "bg-gray-200 text-zinc-500"
                  }`}
                onClick={() => setRole("Doctor")}
              >
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
                <div className="self-stretch">DOCTOR</div>
                <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              </button>
            </div>
            <div className="mx-auto max-w-xl flex flex-col gap-4 items-center">
              <input
                className="w-full px-5 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <h4 className="text-center font-bold">OR</h4>
              {role === "Company" && (
                <input
                  className="w-full px-5 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Enter Company name or Username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              {role === "Doctor" && (
                <input
                  className="w-full px-5 py-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Enter Doctor name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <div className="relative w-full">
                {" "}
                {/* Password input wrapper with relative position */}
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
                <Link
                  to="/signup"
                  className="text-[#3d52a1] font-semibold text-lg"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
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
