import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Navigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, getStorage, deleteObject, uploadBytes } from "firebase/storage";
import "firebase/storage";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import bcrypt from "bcryptjs";
import { useAuth } from "../components/AuthContext";

const EditManager = () => {
    const { id } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [manager, setManager] = useState({
        name: "",
        email: "",
        password: "",
        location: "",
    });
    const storage = getStorage();
    const navigate = useNavigate();
    const { isAdminLoggedIn } = useAuth();

    const fetchManager = async () => {
        try {
            const db = getFirestore();
            const managerRef = doc(db, "managers", id);
            const docSnap = await getDoc(managerRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setManager({
                    id: docSnap.id,
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    location: data.location,
                });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching Manager:", error);
        }
    };


    useEffect(() => {
        fetchManager();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const db = getFirestore();
            const managerRef = doc(db, "managers", id);
            const hashedPassword = await bcrypt.hash(manager.password, 10);
            await updateDoc(managerRef, {
                name: manager.name,
                email: manager.email,
                password: hashedPassword,
                location: manager.location
            });

            console.log("Document successfully updated!");
            alert("Data successfully updated!");
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
            navigate('/admin/manager');

            // fetchDoctor();
        } catch (error) {
            console.error("Error updating document:", error);
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
                                EDIT GROWTH MANAGER
                            </h2>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div class="mb-5 mt-5">
                                    <label htmlFor="name" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Name :</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={manager.name}
                                        onChange={(e) => setManager({ ...manager, name: e.target.value })}
                                        placeholder="Enter Manager name"
                                    />
                                </div>
                                <div class="mb-5 mt-5">
                                    <label htmlFor="location" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Location :</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={manager.location}
                                        onChange={(e) => setManager({ ...manager, location: e.target.value })}
                                        placeholder="Enter Location"
                                    />
                                </div>
                                <div class="mb-5 mt-5">
                                    <label htmlFor="email" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Email :</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={manager.email}
                                        onChange={(e) => setManager({ ...manager, email: e.target.value })}
                                        placeholder="Enter your Email"
                                    />
                                </div>
                                <div className="mb-5 mt-5">
                                    <label htmlFor="password" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Password :</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={manager.password}
                                            onChange={(e) => setManager({ ...manager, password: e.target.value })}
                                            placeholder="Enter your Password"
                                        />
                                        <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <TbEye /> : <TbEyeClosed />}
                                        </button>
                                    </div>
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

export default EditManager;
