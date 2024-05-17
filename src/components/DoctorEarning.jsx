import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { MdCreditScore } from "react-icons/md";
import { useParams } from 'react-router-dom';
import DoctorSide from './DoctorSide';
import DoctorNavbar from './DoctorNavbar';


const DoctorEarning = () => {
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
                const q = query(meetingRef, where("doctorID", "==", id));
                const querySnapshot = await getDocs(q);
                setMeetingCount(querySnapshot.size);
            } catch (error) {
                console.error("Error fetching meeting count:", error);
            }
        };

        fetchMeetingCount();
    }, []);

    const projected = meetingCount * 150;
    const final = meetingCount * 150;

    return (
        <div className="flex flex-col h-screen">
            <DoctorNavbar />
            <div className="flex flex-1">
                <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-margin duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <div className="my-5 text-center">
                            <h1 className="font-bold text-xl uppercase">Earnings</h1>
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
                                        <div className="text-gray-400">Projected Earning</div>
                                        <div className="text-2xl font-bold text-black">{projected}</div>
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
                                        <div className="text-gray-400">Final Earning</div>
                                        <div className="text-2xl font-bold text-black">{final}</div>
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

export default DoctorEarning;
