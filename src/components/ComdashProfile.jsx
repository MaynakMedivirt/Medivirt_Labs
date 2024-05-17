import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "../assets/img/defaultAvatar.png";
import Banner from "../assets/img/Banner.png";
import { FaPen } from "react-icons/fa";
import CompanyNavbar from "./CompanyNavbar";
import CompanySide from "./CompanySide";

const ComdashProfile = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("about");

    const [company, setCompany] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const db = getFirestore();
                const docRef = doc(db, "companies", id);
                const companySnapshot = await getDoc(docRef);
                if (companySnapshot.exists()) {
                    setCompany({ id: companySnapshot.id, ...companySnapshot.data() });
                } else {
                    console.log("No such company");
                }
            } catch (error) {
                console.log("Error fetching company :", error);
            }
        };
        fetchCompany();
    }, [id]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col h-screen">
            <CompanyNavbar />
            <div className="flex flex-1">
                <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"}`}>
                    {company && (
                        <div className="container max-w-6xl px-5 mx-auto my-10">
                            <div className="overflow-hidden mt-[20px]">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10">
                                    <div className="col-span-1 md:col-span-2 mt-5">
                                        <div
                                            className="overflow-hidden"
                                            style={{
                                                backgroundImage: `url(${Banner})`,
                                                height: "250px",
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <div className="p-6">
                                                    <div className="mb-4">
                                                        {company.image ? (
                                                            <img
                                                                src={company.image}
                                                                alt={`Profile of ${company.name}`}
                                                                className=""
                                                                style={{ width: '50%' }}
                                                            />
                                                        ) : (
                                                            <img src={Image} alt="Placeholder" className="w-32 h-32 md:w-48 md:h-48" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h1 className="text-xl text-gray-800 font-bold">
                                                            {company.companyName}
                                                        </h1>
                                                        <p className="text-lg text-gray-600">
                                                            {company.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 md:col-span-1">
                                        <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
                                            <div className="">
                                                <div className="mt-5">
                                                    <div className="p-6 md:p-5 md:h-auto">
                                                        <div className="flex items-center justify-between mb-5">
                                                            <p className="text-sm ">Categories:</p>
                                                            <p className="text-sm font-semibold">{company.category}</p>
                                                        </div>
                                                        <hr className="mb-3 border-gray-300"></hr>
                                                        <div className="flex items-center justify-between mb-5">
                                                            <span className="text-sm">Email:</span>
                                                            <span className="text-sm font-semibold">
                                                                {company.email}
                                                            </span>
                                                        </div>
                                                        <hr className="mb-3 border-gray-300"></hr>
                                                        <div className="flex items-center justify-between mb-5">
                                                            <p className="text-sm">Phone: </p>
                                                            <p className="text-sm font-semibold capitalize">{company.phone}</p>
                                                        </div>
                                                        <hr className="mb-3 border-gray-300"></hr>
                                                        <div className="flex items-center justify-between mb-5">
                                                            <p className="text-sm">Location: </p>
                                                            <p className="text-sm font-semibold capitalize">{company.location}</p>
                                                        </div>
                                                        <hr className="mb-3 border-gray-300"></hr>
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                className="flex gap-1.5 justify-center items-center px-6 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5"
                                                            >
                                                                Contact
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <div className="flex">
                                        <h1
                                            className={`text-xl px-1 font-semibold cursor-pointer ${activeTab === "about" ? "bg-[#EEE7F6] text-black" : "text-gray-800"}`}
                                            onClick={() => setActiveTab("about")}
                                        >
                                            About Company
                                        </h1>
                                        <h1
                                            className={`text-xl px-1 ml-5 font-semibold cursor-pointer ${activeTab === "product" ? "bg-[#EEE7F6] text-black" : "text-gray-800"}`}
                                            onClick={() => setActiveTab("product")}
                                        >
                                            Product
                                        </h1>
                                    </div>
                                    {activeTab === "about" && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5">
                                            <div className="col-span-1 md:col-span-2 mt-5">
                                                <p style={{ wordSpacing: '5px' }}>{company.about}</p>

                                            </div>
                                        </div>
                                    )}
                                    {activeTab === "product" && (
                                        <div className="overflow-auto mt-3">
                                            <table className="min-w-full divide-y border divide-gray-200">
                                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-sm tracking-wider">
                                                            S.N.
                                                        </th>
                                                        <th scope="col" className="bg-gray-50 px-6 py-3 text-sm uppercase tracking-wider">
                                                            Product Name
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">

                                                    <tr className="border-b border-gray-200">
                                                        <td scope="row" className="px-6 py-4">
                                                            1
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                                                            product
                                                        </td>
                                                        <td scope="row" className="px-6 py-4">
                                                            <button
                                                                className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                            >
                                                                Enquiry About The Product
                                                            </button>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComdashProfile;
