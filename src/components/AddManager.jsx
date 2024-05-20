import React, { useState } from "react";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import bcrypt from "bcryptjs";
import "firebase/storage";

import { firebaseConfig } from "../components/firebase";
import { useAuth } from './AuthContext';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const AddManager = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const customId = `${name}`;
      const customDocRef = doc(db, "managers", customId);
      await setDoc(customDocRef, {
        name,
        email,
        password: hashedPassword,
        location
      });

      console.log("Document Written with ID : ", customId);
      alert("Manager added successfully!");

      // Clear the form fields after successful submission
      setName("")
      setEmail("")
      setPassword("")
      setLocation("")

      // Reload the page after 1 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      navigate('/admin/manager');
    } catch (error) {
      console.log("Error adding document :", error);
    }
  };
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="flex">
      <AdminSide />
      <div className="flex-1 overflow-hidden">
        <AdminNavbar />
        <div className="container max-w-full text-black mx-auto my-5 px-10">
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
            >
              <h2 className="text-center text-3xl font-bold my-5">
                ADD GROWTH MANAGER
              </h2>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div class="mb-5 mt-5">
                  <label htmlFor="name" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Name :</label>
                  <input
                    type="text"
                    name="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Growth Manager name"
                  />
                </div>
                <div class="mb-5 mt-5">
                  <label htmlFor="location" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Location :</label>
                  <input
                    type="text"
                    name="location"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter Location"
                  />
                </div>
                <div class="mb-5 mt-5">
                  <label htmlFor="email" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Email :</label>
                  <input
                    type="email"
                    name="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                  />
                </div>
                <div class="mb-5">
                  <label htmlFor="password" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Password :</label>
                  <input
                    type="password"
                    name="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Password"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddManager;
