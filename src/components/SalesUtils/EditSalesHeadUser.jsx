import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import SalesNavbar from "./SalesNavbar";
import SalesSide from "./SalesSide";
import bcrypt from "bcryptjs";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { firebaseConfig } from "../firebase";
import { initializeApp } from "firebase/app";
import { IoMdArrowBack } from "react-icons/io";
import "../style/Company.css";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EditSalesHeadUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = location.state;
    const { id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        location: "",
        role: "",
        username: ""
    });

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                } else {
                    console.log("User not found");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        const fetchCompanyName = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const companyDoc = await getDoc(doc(db, "companies", userData.companyId));
                    if (companyDoc.exists()) {
                        setCompanyName(companyDoc.data().companyName);
                    }
                }
            } catch (error) {
                console.error("Error fetching company:", error);
            }
        };

        fetchUser();
        fetchCompanyName();
    }, [userId]);

    const cleanedCompanyName = companyName.replace(/\s+/g, '');
    const predefinedUsernames = [`${user.firstName}_${user.lastName}@${cleanedCompanyName}`, `${user.firstName}@${cleanedCompanyName}`, `${user.lastName}@${cleanedCompanyName}`];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await updateDoc(doc(db, "users", userId), {
                ...user,
                password: hashedPassword
            });

            console.log("Document successfully updated!");
            alert("Data successfully updated!");
            navigate(`/sales/users/${id}`);
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <SalesNavbar />
            <div className="flex flex-1 mt-[4.2rem]">
                <SalesSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-20'}`}>
                    <div className="container px-4 mx-auto my-10">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
                        >
                            <div className="flex items-center justify-between" id="edittexts">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-8 h-8 bg-white shadow border rounded-full flex items-center justify-center"
                                >
                                    <IoMdArrowBack className="h-6 w-6 font-bold text-[#8697C4]" />
                                </button>
                                <h2 className="flex-grow text-2xl my-5 font-bold text-center uppercase">Edit User</h2>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="block mb-2 px-2 text-lg font-bold text-gray-900">First Name :</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={user.firstName}
                                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                        placeholder="Enter First Name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="lastName" className="block mb-2 px-2 text-lg font-bold text-gray-900">Last Name :</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={user.lastName}
                                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                        placeholder="Enter Last Name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="block mb-2 px-2 text-lg font-bold text-gray-900">Email :</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        placeholder="Enter Email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="block mb-2 px-2 text-lg font-bold text-gray-900">Password :</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                            value={user.password}
                                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                                            placeholder="Enter Password"
                                            required
                                        />
                                        <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <TbEye /> : <TbEyeClosed />}
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="location" className="block mb-2 px-2 text-lg font-bold text-gray-900">Location :</label>
                                    <select
                                        name="location"
                                        className="bg-gray-50 border border-gray-300  text-gray-900 rounded-lg block w-full p-2"
                                        value={user.location}
                                        onChange={(e) => setUser({ ...user, location: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Location</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Kolkata">Kolkata</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                        <option value="Chennai">Chennai</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="role" className="block mb-2 px-2 text-lg font-bold text-gray-900">Role :</label>
                                    <select
                                        name="role"
                                        className="bg-gray-50 border border-gray-300  text-gray-900 rounded-lg block w-full p-2"
                                        value={user.role}
                                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Medical Representative">Medical Representative</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="block mb-2 px-2 text-lg font-bold text-gray-900">Username :</label>
                                    <select
                                        name="username"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={user.username}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Username</option>
                                        {predefinedUsernames.map((username, index) => (
                                            <option key={index} value={username}>{username}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="text-center my-4">
                                <button
                                    type="submit"
                                    className="text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg"
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

export default EditSalesHeadUser;

