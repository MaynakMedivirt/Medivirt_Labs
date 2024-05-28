import React, { useState, useEffect } from 'react';
import AdminSide from './AdminSide';
import { Navigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";

const AdminMissedMeeting = () => {
    const { isAdminLoggedIn } = useAuth();
    const [scheduleMeeting, setScheduleMeeting] = useState([]);
    const [missedMeetings, setMissedMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);


    useEffect(() => {
        const fetchMissedMeetings = async () => {
            try {
                const db = getFirestore();
                const meetingCollection = collection(db, 'scheduleMeeting');
                const snapshot = await getDocs(meetingCollection);
                const now = new Date();

                const fetchDoctorData = async (doctorId) => {
                    const doctorDocRef = doc(db, "doctors", doctorId);
                    const doctorDocSnapshot = await getDoc(doctorDocRef);
                    return doctorDocSnapshot.exists() ? doctorDocSnapshot.data() : null;
                };

                const fetchCompanyData = async (companyId) => {
                    const companyDocRef = doc(db, "companies", companyId);
                    const companyDocSnapshot = await getDoc(companyDocRef);
                    return companyDocSnapshot.exists() ? companyDocSnapshot.data() : null;
                };

                const missedMeetingsData = await Promise.all(
                    snapshot.docs.map(async (docSnapshot) => {
                        const meetingData = docSnapshot.data();
                        const doctorData = await fetchDoctorData(meetingData.doctorID);
                        const companyData = await fetchCompanyData(meetingData.companyID);

                        const [time, period] = meetingData.time.split(' ');
                        const [hours, minutes] = time.split(':').map(Number);
                        const adjustedHours = period === 'PM' ? hours + 12 : hours;

                        const meetingDateTime = new Date(meetingData.date);
                        meetingDateTime.setHours(adjustedHours, minutes);

                        return {
                            id: docSnapshot.id,
                            ...meetingData,
                            doctorName: doctorData ? doctorData.name : "Unknown Doctor",
                            companyName: companyData ? companyData.companyName : "Unknown Company",
                            representativeName: companyData ? companyData.name : "Unknown Representative Name",
                            meetingDateTime: meetingDateTime
                        };
                    })
                );

                const filteredMissedMeetings = missedMeetingsData.filter(meeting => {
                    return meeting.meetingDateTime < now;
                });


                console.log('Filtered missed meetings:', filteredMissedMeetings);

                setMissedMeetings(filteredMissedMeetings);
            } catch (error) {
                setError("Error fetching missed meetings: " + error.message);
                console.error("Error fetching missed meetings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMissedMeetings();
    }, []);

    const handleDeleteMeeting = async (meetingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this meeting?"
        );
    
        if (confirmed) {
            try {
                const db = getFirestore();
                await deleteDoc(doc(db, "scheduleMeeting", meetingId));
                setMissedMeetings((prevMeetings) =>
                    prevMeetings.filter((meeting) => meeting.id !== meetingId)
                );
            } catch (error) {
                console.error("Error deleting Meeting:", error);
            }
        }
    };
    

    if (!isAdminLoggedIn) {
        return <Navigate to="/admin" />;
    }

    const indexOfLastMeeting = currentPage * itemsPerPage;
    const indexOfFirstMeeting = indexOfLastMeeting - itemsPerPage;
    const currentMeetings = missedMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);


    return (
        <div className="flex">
            <AdminSide />
            <div className="flex-1">
                <AdminNavbar />
                <div className="container max-w-6xl px-5 mx-auto my-10">
                    <div className="border mt-4 p-2">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-center text-3xl font-bold">Missed Meetings</h2>
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : missedMeetings.length === 0 ? (
                            <p>No missed meetings found.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-2 py-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="px-2 py-3 text-sm bg-gray-50 uppercase tracking-wider">
                                            Doctor Name
                                        </th>
                                        <th scope="col" className="px-2 py-3 text-sm uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th scope="col" className="px-2 py-3 text-sm bg-gray-50 uppercase tracking-wider">
                                            Representative Name
                                        </th>
                                        <th scope="col" className="px-2 py-3 text-sm uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-2 py-3 text-sm bg-gray-50 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th scope="col" className="px-2 py-3 text-sm uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentMeetings.map((meeting, index) => (
                                        <tr key={meeting.id} className="border-b border-gray-200">
                                            <td scope="row" className="px-2 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="px-2 py-2 font-medium text-gray-900 bg-gray-50">
                                                {meeting.doctorName}
                                            </td>
                                            <td className="px-2 py-2 text-gray-900">
                                                {meeting.companyName}
                                            </td>
                                            <td className="px-2 py-2 bg-gray-50">
                                                {meeting.representativeName}
                                            </td>
                                            <td className="px-2 py-2">{meeting.date}</td>
                                            <td className="px-2 py-2  bg-gray-50">{meeting.time}</td>
                                            <td className="px-2 py-2">
                                                <button
                                                    // onClick={() => toggleCalendar(meeting.id)}
                                                    type="button"
                                                    className="text-white bg-[#11A798] rounded-lg p-2 text-center me-2 mb-2"
                                                >
                                                    <FaEdit /> {/* Modify */}
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteMeeting(meeting.id)}
                                                    type="button"
                                                    className="text-white bg-[#11A798] rounded-lg p-2 text-center me-2 mb-2"
                                                >
                                                    <MdAutoDelete /> {/* Delete */}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="flex justify-end my-4">
                            {Array.from({ length: Math.ceil(missedMeetings.length / itemsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-2 mx-1 rounded-md font-bold ${currentPage === i + 1 ? 'bg-transparent text-gray-800 border border-[#11A798] hover:bg-[#11A798] hover:text-white' : 'bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-300'}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-end">
                            {`Showing ${currentMeetings.length} out of ${missedMeetings.length} matches`}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMissedMeeting;
