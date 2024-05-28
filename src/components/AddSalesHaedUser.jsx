import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SalesNavbar from "./SalesNavbar";
import SalesSide from "./SalesSide";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { firebaseConfig } from "../components/firebase";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AddSalesHeadUser = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [role, setRole] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [selectedUsername, setSelectedUsername] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchCompanyName = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", id));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const fetchedCompanyId = userData.companyId;
                    setCompanyId(fetchedCompanyId);

                    const companyDoc = await getDoc(doc(db, "companies", fetchedCompanyId));
                    if (companyDoc.exists()) {
                        const companyData = companyDoc.data();
                        setCompanyName(companyData.companyName);
                    } else {
                        console.log("Company not found");
                    }
                } else {
                    console.log("Sales head not found");
                }
            } catch (error) {
                console.log("Error fetching company:", error);
            }
        };

        fetchCompanyName();
    }, [id]);

    const cleanedCompanyName = companyName.replace(/\s+/g, '');

    const predefinedUsernames = [
        `${firstName}_${lastName}@${cleanedCompanyName}`,
        `${firstName}@${cleanedCompanyName}`,
        `${lastName}@${cleanedCompanyName}`
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = selectedUsername;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const customId = `${firstName}_${lastName}_${companyId}`;
            const customDocRef = doc(db, "users", customId);
            await setDoc(customDocRef, {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                location,
                companyId: companyId,
                fetchId: id,
                username
            });

            console.log("Document written with ID: ", username);
            alert("User added successfully!");

            // Reset form fields
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setRole("");
            setLocation("");

            navigate(`/sales/users/${id}`);
        } catch (error) {
            console.log("Error adding document:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <SalesNavbar />
            <div className="flex flex-1">
                <SalesSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-margin duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
                        >
                            <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">Add Users</h2>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="block mb-2 px-2 text-lg font-bold text-gray-900">First Name :</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
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
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="block mb-2 px-2 text-lg font-bold text-gray-900">Password :</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Password"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="location" className="block mb-2 px-2 text-lg font-bold text-gray-900">Location :</label>
                                    <select
                                        name="location"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
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
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
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
                                        value={selectedUsername}
                                        onChange={(e) => setSelectedUsername(e.target.value)}
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
    );
};

export default AddSalesHeadUser;
