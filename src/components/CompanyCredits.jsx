import React, { useState, useEffect } from 'react';
import CompanyNavbar from './CompanyNavbar';
import CompanySide from './CompanySide';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { MdCreditScore } from "react-icons/md";
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const CompanyCredits = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [meetingCount, setMeetingCount] = useState(0);
    const [totalCredits, setTotalCredits] = useState(35);
    const [completedMeetings, setCompletedMeetings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [meetingsPerPage] = useState(5);
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

        const fetchCompletedMeetings = async () => {
            try {
                const db = getFirestore();
                const meetingRef = collection(db, "scheduleMeeting");
                const q = query(meetingRef, where("companyID", "==", id), where("status", "==", "completed"));
                const querySnapshot = await getDocs(q);

                const fetchDoctorData = async (doctorId) => {
                    const doctorDocRef = doc(db, "doctors", doctorId);
                    const doctorDocSnapshot = await getDoc(doctorDocRef);
                    if (doctorDocSnapshot.exists()) {
                        return doctorDocSnapshot.data();
                    } else {
                        return null;
                    }
                };


                const fetchCompanyData = async (companyId) => {
                    const companyDocRef = doc(db, "companies", companyId);
                    const companyDocSnapshot = await getDoc(companyDocRef);
                    if (companyDocSnapshot.exists()) {
                        return companyDocSnapshot.data();
                    } else {
                        return null;
                    }
                };

                const completedMeetingsData = await Promise.all(
                    querySnapshot.docs.map(async (doc) => {
                        const meetingData = doc.data();
                        const doctorData = await fetchDoctorData(meetingData.doctorID);
                        const companyData = await fetchCompanyData(meetingData.companyID);
                        return {
                            id: doc.id,
                            ...meetingData,
                            doctorName: doctorData ? doctorData.name : "Unknown Doctor",
                            companyName: companyData ? companyData.companyName : "Unknown Company",
                            representativeName: companyData ? companyData.name : "Unknown Company",
                        };
                    })
                );

                setCompletedMeetings(completedMeetingsData);
            } catch (error) {
                console.error("Error fetching completed meetings:", error);
            }
        };

        fetchMeetingCount();
        fetchCompletedMeetings();
    }, [id]);

    const indexOfLastMeeting = currentPage * meetingsPerPage;
    const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
    const currentMeetings = completedMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                                        <div className="text-gray-400">Consumed Credits</div>
                                        <div className="text-2xl font-bold text-black">{meetingCount}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border shadow-sm rounded">
                                <div className="flex justify-center items-center">
                                    <button
                                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                                    >
                                        Add Credits
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[4rem] border">
                            <div className="my-5 text-center">
                                <h1 className="font-bold text-xl uppercase">Completed Meetings ({completedMeetings.length})</h1>
                            </div>
                            <div className="overflow-auto mt-3">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-sm tracking-wider">
                                                S.N.
                                            </th>
                                            <th scope="col" className="bg-gray-50 px-6 py-3 text-sm uppercase tracking-wider">
                                                Doctor Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                                Representative Name
                                            </th>
                                            <th scope="col" className="bg-gray-50 px-6 py-3 text-sm uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-sm                                                     uppercase tracking-wider">
                                                Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentMeetings.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4">No completed meetings found.</td>
                                            </tr>
                                        ) : (
                                            currentMeetings.map((meeting, index) => (
                                                <tr key={meeting.id} className="border-b border-gray-200">
                                                    <td scope="row" className="px-6 py-4">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                                                        {meeting.doctorName}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {meeting.representativeName}
                                                    </td>
                                                    <td className="px-6 py-4 bg-gray-50">{meeting.date}</td>
                                                    <td className="px-6 py-4">{meeting.time}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end my-4">
                                {Array.from({ length: Math.ceil(completedMeetings.length / meetingsPerPage) }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-3 py-2 mx-1 rounded-md font-bold ${currentPage === i + 1 ? 'bg-transparent text-gray-800 border border-[#7191E6] hover:bg-[#7191E6] hover:text-white' : 'bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-300'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCredits;

