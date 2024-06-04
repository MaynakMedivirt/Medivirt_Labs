import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDoc, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useAuth } from "./AuthContext";
import SalesSide from './SalesSide';
import SalesNavbar from './SalesNavbar';
import defaultAvatar from "../assets/img/defaultAvatar.png";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import "./style/Calendar.css";
import { firebaseConfig } from "../components/firebase";
import Jitsi from "react-jitsi";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SalesViewDoctor = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [doctor, setDoctor] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [showMessaging, setShowMessaging] = useState(false);
    const [message, setMessage] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [scheduleMeetings, setScheduleMeetings] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { currentUser } = useAuth();

    console.log(currentUser);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                const db = getFirestore();
                const doctorRef = doc(db, "doctors", location.state.doctorId);
                const doctorDoc = await getDoc(doctorRef);
                if (doctorDoc.exists()) {
                    setDoctor(doctorDoc.data());
                } else {
                    console.log("Doctor not found");
                }
            } catch (error) {
                console.error("Error fetching doctor profile: ", error.message);
            }
        };

        fetchDoctorProfile();
    }, [location.state.doctorId]);

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const toggleMessaging = () => {
        setShowMessaging(!showMessaging);
    };

    const onChange = (date) => {
        setSelectedDate(date);
    };

    const handleBookSchedule = async () => {
        const adjustedDate = new Date(selectedDate);
        const ISTOffset = 330;
        adjustedDate.setMinutes(adjustedDate.getMinutes() + ISTOffset);
        const formattedDate = adjustedDate.toISOString().split("T")[0];
        const selectedDateTime = new Date(`${formattedDate} ${selectedTime}`);

        if (selectedDateTime < new Date()) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You cannot schedule a meeting for a past date and time!",
            });
            return;
        }


        try {
            const meetingLink = `https://meet.jit.si/${doctor.name.replace(/\s+/g, "")}-${currentUser.id}-${Date.now()}`;

            const scheduleData = {
                companyID: currentUser.companyId || currentUser.id,
                doctorID: location.state.doctorId,
                date: formattedDate,
                time: selectedTime,
                meetingLink: meetingLink,
                status: "scheduled",
                assigned: currentUser.id,
            };

            const customId = `${doctor.id}_${currentUser.id}`;
            const customDocRef = doc(db, "scheduleMeeting", customId);
            await setDoc(customDocRef, scheduleData);

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your scheduled meeting sent to the doctor successfully!",
                showConfirmButton: false,
                timer: 2000,
            });

            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
            navigate(`/sales/doctors/${id}`);
        } catch (error) {
            console.error("Error scheduling meeting:", error);
            alert("Failed to schedule meeting. Please try again.");
        }
    };

    const handleSendMessage = async () => {
        if (!doctor) {
            console.error("Doctor object is null or undefined.");
            return;
        }

        try {
            const messageData = {
                companyID: currentUser.companyId || currentUser.id,
                doctorID: location.state.doctorId,
                messages: message,
                sentBy: "company",
                timestamp: new Date(),
                messageId: currentUser.id,
                sentId: currentUser.id,
            };

            const customId = `${location.state.doctorId}_${currentUser.id}_${Date.now()}`;
            const customDocRef = doc(db, "messages", customId);
            await setDoc(customDocRef, messageData);

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Message sent successfully!",
                showConfirmButton: false,
                timer: 2000,
            });

            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
            navigate(`/sales/doctors/${id}`);
        } catch (error) {
            console.error("Error sending messages:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <SalesNavbar />
            <div className="flex flex-1">
                <SalesSide open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto overflow-auto my-5">
                        <div className="flex items-center justify-center">
                            <h2 className="text-2xl font-bold">Doctor Profile</h2>
                        </div>
                        {doctor && (
                            <div className="container max-w-6xl px-5 mx-auto ">
                                <div className="overflow-hidden">
                                    <div className="flex flex-col px-2 ">
                                        <div className="grid gap-4 md:grid-cols-2 my-4 flex justify-center items-center">
                                            <div className="bg-white border shadow rounded p-4" style={{ height: "fit-content" }}>
                                                <div className="flex">
                                                    <div className="flex-shrink w-24 h-24 rounded border">
                                                        {doctor.image ? (
                                                            <img
                                                                src={doctor.image}
                                                                alt={`Profile of ${doctor.name}`}
                                                                className="w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="flex-shrink w-24 h-24 rounded">
                                                                <img
                                                                    src={defaultAvatar}
                                                                    className="w-full h-full "
                                                                    alt="User Profile"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="px-4 md:flex-grow m-auto">
                                                        <h1 className="text-lg font-semibold text-gray-800 ">
                                                            {doctor.name}
                                                        </h1>
                                                        <p className="text-md mt-4 text-gray-500">
                                                            {doctor.specialist}
                                                        </p>
                                                        <p className="text-md text-gray-500">
                                                            {doctor.currentPosition}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white border rounded-lg overflow-hidden shadow ml-4" style={{ height: "fit-content" }}>
                                                <div className="">
                                                    <div className="mt-5">
                                                        <div className="p-6 md:p-5 md:h-auto">
                                                            <div className="flex items-center justify-between mb-5">
                                                                <p className="text-lg ">Location:</p>
                                                                <p className="text-lg font-semibold">Bangalore</p>
                                                            </div>
                                                            <hr className="mb-3 border-gray-300"></hr>
                                                            <div className="flex items-center justify-between mb-5">
                                                                <span className="text-lg">Specialist:</span>
                                                                <span className="text-lg font-semibold">
                                                                    {doctor.specialist}
                                                                </span>
                                                            </div>
                                                            <hr className="mb-3 border-gray-300"></hr>
                                                            <div className="flex items-center justify-between mb-5">
                                                                <p className="text-lg">Gender: </p>
                                                                <p className="text-lg font-semibold capitalize">
                                                                    {doctor.gender}
                                                                </p>
                                                            </div>
                                                            <hr className="mb-3 border-gray-300"></hr>
                                                            <div className="flex items-center justify-center">
                                                                <button
                                                                    onClick={toggleCalendar}
                                                                    className="flex gap-1.5 justify-center items-center px-6 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5"
                                                                >
                                                                    {showCalendar ? "Hide Calendar" : "Schedule Meeting"}
                                                                </button>
                                                                <button
                                                                    onClick={toggleMessaging}
                                                                    className="flex gap-1.5 justify-center items-center px-6 py-2 mt-5 ml-3 text-base font-bold text-center text-white uppercase bg-green-600 tracking-[2px] max-md:mt-5"
                                                                >
                                                                    {showMessaging ? "Hide Message" : "Send Message"}
                                                                </button>
                                                            </div>
                                                            {showCalendar && (
                                                                <div className="mt-5">
                                                                    <Calendar
                                                                        onChange={onChange}
                                                                        value={selectedDate}
                                                                        minDate={new Date()}
                                                                        className="custom-calendar"
                                                                    />
                                                                    <div className="flex justify-between mt-3">
                                                                        <select
                                                                            value={selectedTime}
                                                                            onChange={(e) => setSelectedTime(e.target.value)}
                                                                            className="p-2 border border-gray-300 rounded-md focus:outline-none w-full max-w-[200px]"
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
                                                                    </div>
                                                                    <div className="flex justify-center mt-5">
                                                                        <button
                                                                            onClick={handleBookSchedule}
                                                                            disabled={!selectedTime}
                                                                            className={`px-6 py-2 text-base font-bold text-center text-white uppercase ${selectedTime
                                                                                ? "bg-blue-800 hover:bg-blue-600 cursor-pointer"
                                                                                : "bg-gray-400 cursor-not-allowed"
                                                                                }`}
                                                                        >
                                                                            Book Schedule Meeting
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {showMessaging && (
                                                                <div className="mt-5">
                                                                    <div className="bg-gray-200 p-4 rounded-md">
                                                                        <p className="text-md font-semibold mb-2">
                                                                            Send a Message
                                                                        </p>
                                                                        <textarea
                                                                            placeholder="Type your message here..."
                                                                            value={message}
                                                                            onChange={(e) => setMessage(e.target.value)}
                                                                            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none focus:outline-none"
                                                                        ></textarea>
                                                                        <div className="flex justify-end mt-3">
                                                                            <button
                                                                                onClick={handleSendMessage}
                                                                                className="px-4 py-2 bg-indigo-800 text-white rounded-md font-semibold"
                                                                            >
                                                                                Send
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-4 mt-[1rem] bg-white border shadow rounded">
                                        <div className="flex-grow">
                                            <h1 className="text-xl font-semibold text-gray-800 mb-3">
                                                About
                                            </h1>
                                            <p className="text-md text-gray-500 mb-2">{doctor.about}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                                        <div className="bg-white border shadow rounded p-4">
                                            <div className="flex-grow mb-[2rem] mt-4 ">
                                                <h1 className="text-xl font-semibold">Experience</h1>

                                                {doctor.experience_1 && (
                                                    <div className="mt-5 flex items-center">
                                                        <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                                                            A
                                                        </button>
                                                        <div className="px-5">
                                                            <p className="text-sm ">{doctor.experience_1}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {doctor.experience_2 && (
                                                    <div className="mt-5 flex items-center">
                                                        <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                                                            B
                                                        </button>
                                                        <div className="px-5">
                                                            <p className="text-sm ">{doctor.experience_2}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {doctor.experience_3 && (
                                                    <div className="mt-5 flex items-center">
                                                        <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                                                            C
                                                        </button>
                                                        <div className="px-5">
                                                            <p className="text-sm ">{doctor.experience_3}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-white border shadow rounded p-4">
                                            <div className="flex-grow mb-[2rem] mt-4 ">
                                                <h1 className="text-xl font-semibold">Education</h1>
                                                {doctor.education_1 && (
                                                    <div className="mt-5 flex items-center">
                                                        <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                                                            A
                                                        </button>
                                                        <div className="px-5">
                                                            <p className="text-sm ">{doctor.education_1}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {doctor.education_2 && (
                                                    <div className="mt-5 flex items-center">
                                                        <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                                                            B
                                                        </button>
                                                        <div className="px-5">
                                                            <p className="text-sm ">{doctor.education_2}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {doctor.education_3 && (
                                                    <div className="mt-5 flex items-center">
                                                        <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                                                            C
                                                        </button>
                                                        <div className="px-5">
                                                            <p className="text-sm ">{doctor.education_3}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesViewDoctor;
