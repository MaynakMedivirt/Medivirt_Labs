import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import CompanySide from "./CompanySide";
import CompanyNavbar from "./CompanyNavbar";

const CompanyMissedMeetings = () => {
    const [missedMeetings, setMissedMeetings] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchMissedMeetings = async () => {
            try {
                const db = getFirestore();
                const meetingsRef = collection(db, "scheduleMeeting");
                const q = query(meetingsRef, where("companyID", "==", id));
                const querySnapshot = await getDocs(q);
                const now = new Date();

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

                const missedMeetingsData = await Promise.all(
                    querySnapshot.docs.map(async (doc) => {
                        const meetingData = doc.data();
                        const doctorData = await fetchDoctorData(meetingData.doctorID);
                        const companyData = await fetchCompanyData(meetingData.companyID);
                        return {
                            id: doc.id,
                            ...meetingData,
                            doctorName: doctorData ? doctorData.name : "Unknown Doctor",
                            companyName: companyData ? companyData.companyName : "Unknown Company",
                        };                        
                    })
                );

                const filteredMissedMeetings = missedMeetingsData.filter(meeting => {
                    const meetingDateTime = new Date(`${meeting.date} ${meeting.time}`);
                    return meetingDateTime < now;
                });

                setMissedMeetings(filteredMissedMeetings);
            } catch (error) {
                console.error("Error fetching missed meetings:", error);
            }
        };

        fetchMissedMeetings();
    }, [id]);

    return (
        <div className="flex flex-col h-screen">
            <CompanyNavbar />
            <div className="flex flex-1 mt-[4.2rem]">
                <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div
                    className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-20"
                        }`}
                >
                    <div className="container px-4 mx-auto my-10">
                        <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">
                            Missed Meetings
                        </h2>
                        <div className="overflow-auto mt-3">
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm bg-gray-50 uppercase tracking-wider">
                                            Doctor Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm bg-gray-50 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {missedMeetings.map((meeting, index) => (
                                        <tr key={meeting.id} className="border-b border-gray-200">
                                            <td scope="row" className="px-6 py-4">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                                                {meeting.doctorName} 
                                            </td>
                                            <td className="px-6 py-4">
                                                {meeting.companyName}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">{meeting.date}</td>
                                            <td className="px-6 py-4">{meeting.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyMissedMeetings;
