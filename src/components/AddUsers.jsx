import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CompanySide from './CompanySide';
import CompanyNavbar from './CompanyNavbar';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";
import bcrypt from "bcryptjs";

import { firebaseConfig } from "../components/firebase";


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AddProduct = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const { id } = useParams();

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let companyId = id;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const customId = `${userName}_${companyId}`;
            const customDocRef = doc(db, "users", customId);
            await setDoc(customDocRef, {
                userName,
                email,
                password: hashedPassword,
                role,
                companyId
            });

            console.log("Document Written with ID : ", customId);
            alert("User added successfully!");

            setUserName("");
            setEmail("");
            setPassword("");
            setRole("");

            setTimeout(() => {
                window.location.reload();
            }, 1000);

            navigate(`/company/users/${id}`);

        } catch (error) {
            console.log("Error adding document :", error);
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <CompanyNavbar />
            <div className="flex flex-1">
                <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
                        >
                            <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">Add Product</h2>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="mb-3">
                                    <label htmlFor="userName" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">User Name :</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Enter User name"
                                    // required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Email :</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Email"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Password :</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="role" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Role :</label>
                                    <select
                                        name="role"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Sales Head">Sales Head</option>
                                        <option value="Medical Representative">Medical Representative</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-center my-4">
                                <button
                                    type="submit"
                                    className="text-white font-bold bg-[#7191E6] hover:bg-[#3a60c6] px-4 py-2 hover:bg-[#7091E6] rounded-lg"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct