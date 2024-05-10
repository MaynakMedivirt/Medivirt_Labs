import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DoctorNavbar from './DoctorNavbar';
import DoctorSide from './DoctorSide';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const DoctorSchedule = () => {
    const [scheduleMeetings, setScheduleMeetings] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchScheduleMeetings = async () => {
            try {
                const db = getFirestore();
                const scheduleMeetingsRef = collection(db, "scheduleMeeting");
                const q = query(scheduleMeetingsRef, where("doctorID", "==", id));
                const querySnapshot = await getDocs(q);
                // const meetingsData = [];

                const fetchCompanyData = async (companyId) => {
                    const companyDocRef = doc(db, "companies", companyId);
                    const companyDocSnapshot = await getDoc(companyDocRef);
                    if (companyDocSnapshot.exists()) {
                        return companyDocSnapshot.data();
                    } else {
                        return null;
                    }
                };

                const promises = querySnapshot.docs.map(async (doc) => {
                    const meetingData = doc.data();
                    // console.log(meetingData);
                    
                    // Fetch company data
                    const companyData = await fetchCompanyData(meetingData.companyID);
                    const companyName = companyData ? companyData.companyName : "Unknown Company";
                    const representativeName = companyData ? companyData.name : "Unknown Representative";
                
                    // Fetch doctor data
                    // const doctorData = await fetchDoctorData(meetingData.doctorID);
                    // const doctorName = doctorData ? doctorData.name : "Unknown Doctor";
                    
                    return {
                        id: doc.id,
                        companyName,
                        representativeName,
                        // doctorName,
                        ...meetingData,
                    };
                });

                const resolvedData = await Promise.all(promises);
                setScheduleMeetings(resolvedData);
            } catch (error) {
                console.error("Error fetching schedule meetings:", error);
            }
        };

        fetchScheduleMeetings();
    }, [id]);
    
    return (
        <div className="flex flex-col h-screen">
            <DoctorNavbar />
            <div className="flex flex-1">
                <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">
                            Schedule Meetings
                        </h2>
                        <div className="overflow-auto mt-3">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col"className="px-6 py-3 text-sm uppercase tracking-wider">
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
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {scheduleMeetings.map((meeting, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td scope="row" className="px-6 py-4">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                                                {meeting.companyName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {meeting.representativeName}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">
                                                {meeting.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                {meeting.time}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">
                                                <button type="button" className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2">
                                                    Modify
                                                </button>
                                                <button type="button" className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2">
                                                    Accept
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorSchedule;
