import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MrNavbar from "./MrNavbar";
import MrSide from './MrSide';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc, onSnapshot} from "firebase/firestore";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import { FaEdit, FaCheck } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";


const MrSchedule = () => {
    const [scheduleMeetings, setScheduleMeetings] = useState([]);
    const [companyMeetings, setCompanyMeetings] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [searchLocation, setSearchLocation] = useState("");
    const { id } = useParams();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleCalendar = (meetingId = null) => {
        setShowCalendar(!showCalendar);
        setSelectedMeetingId(meetingId);
    };

    useEffect(() => {
        const fetchScheduleMeetings = async () => {
            try {
                const db = getFirestore();
                const scheduleMeetingsRef = collection(db, "scheduleMeeting");
                let q = query(scheduleMeetingsRef, where("assigned", "==", id));
                const querySnapshot = await getDocs(q);

                const unsubscribe = onSnapshot(q, async (querySnapshot) => {
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

                    const fetchAssignedData = async (userId) => {
                        const db = getFirestore();
                        const userCollections = ["companies", "users"];
                        for (const collectionName of userCollections) {
                            const userDocRef = doc(db, collectionName, userId);
                            const userDocSnapshot = await getDoc(userDocRef);
                            if (userDocSnapshot.exists()) {
                                if (collectionName === "users") {
                                    const userData = userDocSnapshot.data();
                                    return `${userData.firstName} ${userData.lastName}`;
                                }
                                return userDocSnapshot.data().name;
                            }
                        }
                        console.error(`User with ID ${userId} not found in any collection`);
                        return "Unknown Assigned";
                    };

                    const promises = querySnapshot.docs.map(async (doc) => {
                        const meetingData = doc.data();
                        const doctorData = await fetchDoctorData(meetingData.doctorID);
                        const assignedData = await fetchAssignedData(meetingData.assigned);
                        const doctorName = doctorData ? doctorData.name : "Unknown Doctor";
                        const location = doctorData ? doctorData.location : "Unknown location";

                        const currentDate = new Date().toISOString().split("T")[0];
                        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const meetingDateTime = new Date(`${meetingData.date} ${meetingData.time}`);
                        const isUpcoming = meetingDateTime > new Date(currentDate + ' ' + currentTime);
                        // console.log(`Meeting: ${doctorName} - ${meetingData.date} ${meetingData.time} - Upcoming: ${isUpcoming}`);

                        if (isUpcoming) {
                            return {
                                id: doc.id,
                                doctorName,
                                location,
                                assignedName: assignedData,
                                ...meetingData,
                            };
                        } else {
                            return null;
                        }
                    });

                    const resolvedData = (await Promise.all(promises)).filter(meeting => meeting !== null);

                    const filteredByDate = resolvedData.filter(meeting => !searchDate || meeting.date === searchDate);

                    // const filteredByLocation = filteredByDate.filter(meeting => meeting?.location?.toLowerCase().includes(searchLocation.toLowerCase()));
                    let filteredData = filteredByDate;
                    if (searchLocation.trim() !== "") {
                        filteredData = filteredData.filter(meeting =>
                            meeting?.location?.toLowerCase().includes(searchLocation.toLowerCase())
                        );
                    }
                    setScheduleMeetings(filteredData);
                });

                return () => unsubscribe();


            } catch (error) {
                console.error("Error fetching schedule meetings:", error);
            }
        };

        fetchScheduleMeetings();
    }, [id, searchDate, searchLocation]);

    const handleModify = async () => {
        if (!selectedMeetingId) return;

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const db = getFirestore();
                    const meetingDocRef = doc(db, "scheduleMeeting", selectedMeetingId);

                    const meetingDocSnapshot = await getDoc(meetingDocRef);
                    if (!meetingDocSnapshot.exists()) {
                        throw new Error(
                            `Document with ID ${selectedMeetingId} does not exist`
                        );
                    }

                    const adjustedDate = new Date(selectedDate);
                    const ISTOffset = 330;
                    adjustedDate.setMinutes(adjustedDate.getMinutes() + ISTOffset);
                    const formattedDate = adjustedDate.toISOString().split("T")[0];

                    await updateDoc(meetingDocRef, {
                        date: formattedDate,
                        time: selectedTime,
                        status: "Rescheduled",
                    });
                    toggleCalendar();

                    setTimeout(() => {
                        window.location.reload();
                    }, 900);
                } catch (error) {
                    console.error("Error updating schedule meeting:", error);
                    Swal.fire({
                        title: "Error",
                        text: "An error occurred while updating the schedule. Please try again later.",
                        icon: "error",
                    });
                }
            }
        });
    };

    const indexOfLastMeeting = currentPage * itemsPerPage;
    const indexOfFirstMeeting = indexOfLastMeeting - itemsPerPage;
    const currentMeetings = scheduleMeetings.slice(
        indexOfFirstMeeting,
        indexOfLastMeeting
    );

    const sortedMeetings = [...currentMeetings].sort((a, b) => {
        const dateComparison = new Date(a.date) - new Date(b.date);
        if (dateComparison !== 0) {
            return dateComparison;
        }

        const timeA = a.time.split(" ")[0];
        const timeB = b.time.split(" ")[0];
        return new Date(`1970/01/01 ${timeA}`) - new Date(`1970/01/01 ${timeB}`);
    });

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAccept = async (meetingId) => {
        try {
            const db = getFirestore();
            const meetingDocRef = doc(db, "scheduleMeeting", meetingId);
            await updateDoc(meetingDocRef, { status: "accepted" });

            Swal.fire({
                title: "Accepted",
                text: "Meeting has been accepted.",
                icon: "success",
                timer: 2000,
            });

            setScheduleMeetings((prevMeetings) =>
                prevMeetings.map((meeting) =>
                    meeting.id === meetingId ? { ...meeting, status: "accepted" } : meeting
                )
            );
        } catch (error) {
            console.error("Error accepting meeting:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while accepting the meeting. Please try again later.",
                icon: "error",
            });
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <MrNavbar />
            <div className="flex flex-1 mt-[4.2rem]">
                <MrSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div
                    className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-20"
                        }`}
                >
                    <div className="container px-4 mx-auto my-10">
                        <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">
                            Schedule Meetings
                        </h2>

                        <div className="flex justify-end items-center mb-5">
                            <div className="flex flex-col mx-2 justify-center self-stretch my-auto border rounded-md">
                                <input
                                    type="date"
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                    className="p-2"
                                />
                            </div>
                            <div className="flex flex-col mx-2 justify-center self-stretch my-auto border rounded-md">
                                <input
                                    type="text"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder="Search Location"
                                    className="p-2"
                                />

                            </div>
                            <button
                                onClick={() => console.log("Search logic here")}
                                className="p-2 rounded bg-[#7191E6] text-white  hover:bg-[#3D52A1] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                            >
                                Search
                            </button>
                        </div>

                        <div className="overflow-auto mt-3">
                            <table className="min-w-full divide-y border divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-sm tracking-wider"
                                        >
                                            S.N.
                                        </th>
                                        <th
                                            scope="col"
                                            className="bg-gray-50 px-3 py-3 text-sm uppercase tracking-wider"
                                        >
                                            Doctor Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-sm uppercase tracking-wider"
                                        >
                                            Assigned
                                        </th>
                                        <th
                                            scope="col"
                                            className="bg-gray-50 px-3 py-3 text-sm uppercase tracking-wider"
                                        >
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-sm uppercase tracking-wider"
                                        >
                                            Time
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-sm uppercase tracking-wider"
                                        >
                                            Location
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 bg-gray-50 text-sm uppercase tracking-wider"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="bg-gray-50 px-3 py-3 text-sm uppercase tracking-wider"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedMeetings.map((meeting, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td scope="row" className="px-3 py-3">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-3 font-medium text-gray-900 bg-gray-50">
                                                {meeting.doctorName}
                                            </td>
                                            <td className="px-3 py-3">{meeting.assignedName}</td>
                                            <td className="px-3 py-3 bg-gray-50">{meeting.date}</td>
                                            <td className="px-3 py-3">{meeting.time}</td>
                                            <td className="px-3 py-3 capitalize bg-gray-50">{meeting.location}</td>
                                            <td className="px-3 py-3 capitalize">{meeting.status}</td>
                                            <td className="px-3 py-3 bg-gray-50">
                                                <button
                                                    onClick={() => toggleCalendar(meeting.id)}
                                                    className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                >
                                                    <FaEdit />
                                                    {/* Modify */}
                                                </button>
                                                <Link
                                                    to={meeting.meetingLink}
                                                    type="button"
                                                    className="text-white bg-[#7091E6] rounded-lg px-3 py-[6px] text-center me-2 mb-2"
                                                >
                                                    <SiGooglemeet className="inline-block mb-[5px]" />
                                                </Link>
                                                {meeting.status === "Rescheduled" ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAccept(meeting.id)}
                                                        className="text-white bg-[#7091E6] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-end my-4">
                            {Array.from(
                                { length: Math.ceil(scheduleMeetings.length / itemsPerPage) },
                                (_, i) => (
                                    <button
                                        key={i}
                                        className={`px-3 py-2 mx-1 rounded-md ${currentPage === i + 1
                                            ? "bg-[#7191E6] text-white"
                                            : "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-300"
                                            }`}
                                        onClick={() => handlePageClick(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                )
                            )}
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
                                    view === "month" && date.getDay() === 0 ? "bg-red-200" : null
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
                                onClick={() => toggleCalendar(null)}
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
    );
};

export default MrSchedule;
