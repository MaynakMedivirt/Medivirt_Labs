import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";

const ScheduleList = () => {

    const [scheduleMeeting, setScheduleMeeting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const db = getFirestore();
                const meetingCollection = collection(db, "scheduleMeeting");
                const snapshot = await getDocs(meetingCollection);

                const fetchCompanyData = async (companyId) => {
                    const companyDocRef = doc(db, "companies", companyId);
                    const companyDocSnapshot = await getDoc(companyDocRef);
                    if (companyDocSnapshot.exists()) {
                        return companyDocSnapshot.data();
                    } else {
                        return null;
                    }
                };
                
                const fetchDoctorData = async (doctorId) => {
                    const doctorDocRef = doc(db, "doctors", doctorId);
                    const doctorDocSnapshot = await getDoc(doctorDocRef);
                    if (doctorDocSnapshot.exists()) {
                        return doctorDocSnapshot.data();
                    } else {
                        return null;
                    }
                };
                
                const promises = snapshot.docs.map(async (doc) => {
                    const meetingData = doc.data();
                    // console.log(meetingData);
                    
                    // Fetch company data
                    const companyData = await fetchCompanyData(meetingData.companyID);
                    const companyName = companyData ? companyData.companyName : "Unknown Company";
                    const representativeName = companyData ? companyData.name : "Unknown Representative";
                
                    // Fetch doctor data
                    const doctorData = await fetchDoctorData(meetingData.doctorID);
                    const doctorName = doctorData ? doctorData.name : "Unknown Doctor";
                    
                    return {
                        id: doc.id,
                        companyName,
                        representativeName,
                        doctorName,
                        ...meetingData,
                    };
                });
                
                // console.log(companyDoc.data().name);

                const resolvedData = await Promise.all(promises);
                setScheduleMeeting(resolvedData);
            } catch (error) {
                setError("Error fetching meetings: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, []);


    // if (loading) {
    //     return <div>Loading...</div>;
    // }



    return (
        <div className="flex">
            <AdminSide />
            <div className="flex-1 overflow-hidden">
                <AdminNavbar />
                <div className="container mx-auto px-5 md:px-3 h-full overflow-y-scroll overflow-x-scroll">
                    <div className="border mt-4 p-2">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-center text-3xl font-bold">Schedule List</h2>
                        </div>

                        <div className="overflow-auto mt-3">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-2 py-2 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="px-2 bg-gray-50 py-2 text-sm uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th scope="col" className="px-2 py-2 text-sm uppercase tracking-wider">
                                            Representative Name
                                        </th>
                                        <th scope="col" className="px-2 bg-gray-50 py-2 text-sm uppercase tracking-wider">
                                            Doctor Name
                                        </th>
                                        <th scope="col" className="px-2 py-2 text-sm uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-2 bg-gray-50 py-2 text-sm uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th scope="col" className="px-2 py-2 text-sm uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-sm divide-y divide-gray-200">
                                    {scheduleMeeting.map((meeting, index) => (
                                        <tr key={meeting.id} className="border-b border-gray-200">
                                            <td scope="row" className="px-2 py-2">
                                                {index + 1}
                                            </td>
                                            <td scope="row" className="px-2 py-2 font-medium text-gray-900 bg-gray-50">
                                                {meeting.companyName}
                                            </td>
                                            <td className="px-2 py-2">
                                                {meeting.representativeName}
                                            </td>
                                            <td className="px-2 py-2 bg-gray-50">
                                                {meeting.doctorName}
                                            </td>
                                            <td className="px-2 py-2">
                                                {meeting.date}
                                            </td>
                                            <td className="px-2 py-2 bg-gray-50">
                                                {meeting.time}
                                            </td>
                                            <td className="px-2 py-2">
                                                <button type="button" className="text-white bg-[#7091E6] rounded-lg p-2 text-center me-2 mb-2">
                                                    Modify
                                                </button>
                                                <button type="button" className="text-white bg-[#7091E6] rounded-lg p-2 text-center me-2 mb-2">
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
    );
};

export default ScheduleList;
