import React, { useState, useEffect } from 'react';
import CompanyNavbar from './CompanyNavbar';
import CompanySide from './CompanySide';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { MdCreditScore } from "react-icons/md";
import { useParams } from 'react-router-dom';


const CompanyCredits = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [meetingCount, setMeetingCount] = useState(0);
    const { id } = useParams();


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchMeetingCount = async () => {
            try {
                const db = getFirestore();
                const meetingRef = collection(db, "scheduleMeeting");
                const q = query(meetingRef, where("companyID", "==", id));
                const querySnapshot = await getDocs(q);
                setMeetingCount(querySnapshot.size);
            } catch (error) {
                console.error("Error fetching meeting count:", error);
            }
        };

        fetchMeetingCount();
    }, []);

    const totalCredits = 35;
    const availableCredits = totalCredits - meetingCount;

    return (
        <div className="flex flex-col h-screen">
            <CompanyNavbar />
            <div className="flex flex-1">
                <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-margin duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <div className="my-5 text-center">
                            <h1 className="font-bold text-xl uppercase">Credits</h1>
                        </div>
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-white border shadow-sm rounded p-5">
                                <div className="flex space-x-4 items-center">
                                    <div>
                                        <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                                            <MdCreditScore className="text-[#7191E6] h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">Total Credits</div>
                                        <div className="text-2xl font-bold text-black">{totalCredits}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border shadow-sm rounded p-5">
                                <div className="flex space-x-4 items-center">
                                    <div>
                                        <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                                            <MdCreditScore className="text-[#7191E6] h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">Available Credits</div>
                                        <div className="text-2xl font-bold text-black">{availableCredits}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border shadow-sm rounded p-5">
                                <div className="flex space-x-4 items-center">
                                    <div>
                                        <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                                            <MdCreditScore className="text-[#7191E6] h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400">Consume Credits</div>
                                        <div className="text-2xl font-bold text-black">{meetingCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCredits;
