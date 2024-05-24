import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import DoctorSide from './DoctorSide';
import DoctorNavbar from './DoctorNavbar';
import { MdCreditScore } from "react-icons/md";


const DoctorEarning = () => {
    const [completedMeetings, setCompletedMeetings] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [meetingCount, setMeetingCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [meetingsPerPage] = useState(5);
    const { id } = useParams();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchCompletedMeetings = async () => {
            try {
                const db = getFirestore();
                const meetingRef = collection(db, "scheduleMeeting");
                const q = query(meetingRef, where("doctorID", "==", id), where("status", "==", "completed"));
                const querySnapshot = await getDocs(q);

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
                        const companyData = await fetchCompanyData(meetingData.companyID);
                        return {
                            id: doc.id,
                            ...meetingData,
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

        fetchCompletedMeetings();
        fetchMeetingCount();
    }, [id]);

    const indexOfLastMeeting = currentPage * meetingsPerPage;
    const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
    const currentMeetings = completedMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const projected = meetingCount * 150;
    const final = completedMeetings.length * 150;

    return (
        <div className="flex flex-col h-screen">
            <DoctorNavbar />
            <div className="flex flex-1">
                <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-margin duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 mt-10">
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
                                            <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                                Company Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                                Representative Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                                Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {completedMeetings.length === 0 ? (
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
                                                        {meeting.companyName}
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

export default DoctorEarning;
