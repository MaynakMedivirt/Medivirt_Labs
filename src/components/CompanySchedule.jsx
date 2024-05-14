import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CompanySide from './CompanySide';
import CompanyNavbar from './CompanyNavbar';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Calendar from 'react-calendar';
import Swal from 'sweetalert2';

const CompanySchedule = () => {
    const [scheduleMeetings, setScheduleMeetings] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const { id } = useParams();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    useEffect(() => {
        const fetchScheduleMeetings = async () => {
            try {
                const db = getFirestore();
                const scheduleMeetingsRef = collection(db, "scheduleMeeting");
                const q = query(scheduleMeetingsRef, where("companyID", "==", id));
                const querySnapshot = await getDocs(q);

                const fetchDoctorData = async (doctorId) => {
                    const doctorDocRef = doc(db, "doctors", doctorId);
                    const doctorDocSnapshot = await getDoc(doctorDocRef);
                    if (doctorDocSnapshot.exists()) {
                        return doctorDocSnapshot.data();
                    } else {
                        console.error(`Doctor with ID ${doctorId} not found`);
                        return null;
                    }
                };

                const promises = querySnapshot.docs.map(async (doc) => {
                    const meetingData = doc.data();
                    const doctorData = await fetchDoctorData(meetingData.doctorID);
                    const doctorName = doctorData ? doctorData.name : "Unknown Doctor";

                    return {
                        id: doc.id,
                        doctorName,
                        ...meetingData,
                    };
                });

                const resolvedData = await Promise.all(promises);
                console.log('Resolved data:', resolvedData);
                setScheduleMeetings(resolvedData);
            } catch (error) {
                console.error("Error fetching schedule meetings:", error);
            }
        };

        fetchScheduleMeetings();
    }, [id]);

    const handleModify = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!"
        }).then((result) => {
            if (result.isConfirmed) {
                toggleCalendar();
                setTimeout(() => {
                    window.location.reload();
                }, 900);
            }
        });
    };

    return (
        <div className="flex flex-col h-screen">
            <CompanyNavbar />
            <div className="flex flex-1">
                <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
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
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Doctor Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Action
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
                                                {meeting.doctorName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {meeting.date}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">
                                                {meeting.time}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={toggleCalendar}
                                                    className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                >
                                                    Modify
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                >
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
            {showCalendar && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <div className="w-full max-w-xs">
                            <Calendar
                                onChange={setSelectedDate}
                                value={selectedDate}
                                className="border border-gray-300 rounded-md shadow-md"
                                calendarClassName="bg-white p-4 rounded-lg shadow-lg"
                                tileClassName={({ date, view }) =>
                                    view === 'month' && date.getDay() === 0 ? 'bg-red-200' : null
                                }
                            />
                        </div>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="mt-3 block w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Time</option>
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="09:30 AM">09:30 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="10:30 AM">10:30 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="12:30 PM">12:30 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="1:30 PM">1:30 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="2:30 PM">2:30 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="3:30 PM">3:30 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="4:30 PM">4:30 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                            <option value="5:30 PM">5:30 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                            <option value="6:30 PM">6:30 PM</option>
                            <option value="7:00 PM">7:00 PM</option>
                            <option value="7:30 PM">7:30 PM</option>
                            <option value="8:00 PM">8:00 PM</option>
                            <option value="8:30 PM">8:30 PM</option>
                        </select>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={toggleCalendar}
                                className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModify}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CompanySchedule;
