import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import CompanyNavbar from "./CompanyNavbar";
import CompanySide from "./CompanySide";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import bcrypt from "bcryptjs";

const EditCompanyUser = () => {
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState({
        userName: "",
        email: "",
        password: "",
        role: "",
        location: ""
    });
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const fetchCompanyUser = async () => {
        try {
            const db = getFirestore();
            const userRef = doc(db, "users", id);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUser({
                    id: docSnap.id,
                    userName: data.userName,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    location: data.location,
                    companyId: data.companyId
                });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchCompanyUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const db = getFirestore();
            const userRef = doc(db, "users", id);
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await updateDoc(userRef, {
                userName: user.userName, // Change name to userName
                email: user.email,
                password: hashedPassword,
                role: user.role,
                location: user.location,
            });

            console.log("Document successfully updated!");
            alert("Data successfully updated!");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate(`/company/users/${user.companyId}`);

        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

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
                            <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">Edit User</h2>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="mb-3">
                                    <label htmlFor="userName" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">User Name :</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={user.userName}
                                        onChange={(e) => setUser({ ...user, userName: e.target.value })}
                                        placeholder="Enter User name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Email :</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        placeholder="Enter Email"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Password :</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={user.password}
                                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                                            placeholder="Enter your Password"
                                        />
                                        <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <TbEye /> : <TbEyeClosed />}
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="location" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Location :</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={user.location}
                                        onChange={(e) => setUser({ ...user, location: e.target.value })}
                                        placeholder="Enter Location"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="role" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Role :</label>
                                    <select
                                        name="role"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={user.role}
                                        onChange={(e) => setUser({ ...user, role: e.target.value })}
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
                                    className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCompanyUser;
