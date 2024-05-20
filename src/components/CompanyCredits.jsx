import React, { useState, useEffect } from 'react';
import CompanyNavbar from './CompanyNavbar';
import CompanySide from './CompanySide';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { MdCreditScore } from "react-icons/md";
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const CompanyCredits = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [meetingCount, setMeetingCount] = useState(0);
    const [totalCredits, setTotalCredits] = useState(35); // Initialize with default value
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
    }, [id]);

    const availableCredits = totalCredits - meetingCount;

    const handleAddCredits = async () => {
        const { value: newCredits } = await Swal.fire({
            title: 'Enter new credits',
            input: 'number',
            inputLabel: 'Number of credits to add',
            inputPlaceholder: 'Enter number of credits',
            showCancelButton: true,
        });

        if (newCredits) {
            const updatedCredits = totalCredits + parseInt(newCredits);
            setTotalCredits(updatedCredits);

            // Update Firestore if needed
            // try {
            //     const db = getFirestore();
            //     const companyDocRef = doc(db, "companies", id);
            //     await updateDoc(companyDocRef, { credits: updatedCredits });
            // } catch (error) {
            //     console.error("Error updating credits:", error);
            // }
        }
    };

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
                                        <div className="text-gray-400">Consumed Credits</div>
                                        <div className="text-2xl font-bold text-black">{meetingCount}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border shadow-sm rounded">
                                <div className="flex justify-center items-center">
                                    <button
                                        onClick={handleAddCredits}
                                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                                    >
                                        Add Credits
                                    </button>
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
