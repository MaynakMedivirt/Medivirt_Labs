import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Header from "./Header";
import Footer from "./Footer";
import Image from "../assets/img/defaultAvatar.png";
import Banner from "../assets/img/Banner.png";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import "./style/Calendar.css";
import { firebaseConfig } from "../components/firebase";
import Jitsi from "react-jitsi";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DoctorProfiles = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [message, setMessage] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduleMeetings, setScheduleMeetings] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const docRef = doc(db, "doctors", id);
        const doctorSnapshot = await getDoc(docRef);
        if (doctorSnapshot.exists()) {
          setDoctor({ id: doctorSnapshot.id, ...doctorSnapshot.data() });
        } else {
          console.log("No such doctor");
        }
      } catch (error) {
        console.log("Error fetching doctor :", error);
      }
    };
    fetchDoctor();
  }, [id]);

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
        doctorID: doctor.id,
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

      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
        doctorID: doctor.id,
        messages: message,
        sentBy: "company",
        timestamp: new Date(),
        messageId: currentUser.id,
        sentId: currentUser.id,
      };

      const customId = `${doctor.id}_${currentUser.id}_${Date.now()}`;
      const customDocRef = doc(db, "messages", customId);
      await setDoc(customDocRef, messageData);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Message sent successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error sending messages:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  if (!doctor) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-0 xl:max-w-[200rem] my-10">
        <div className="overflow-hidden mt-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10">
            <div className="col-span-1 md:col-span-2 mt-5">
              <div
                className="overflow-hidden"
                style={{
                  backgroundImage: `url(${Banner})`,
                  height: "250px",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex flex-col md:flex-row p-6 items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 rounded-full">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full flex items-center justify-center">
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={`Profile of ${doctor.name}`}
                          className="w-32 h-32 md:w-48 md:h-48 rounded-full"
                        />
                      ) : (
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full flex items-center justify-center">
                          <img src={Image} alt="Placeholder" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-6 md:flex-grow">
                    <h1 className="text-xl font-semibold text-gray-800 mb-2 underline underline-offset-4">
                      {doctor.name}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {doctor.specialist}
                    </p>
                    <p className="text-lg text-gray-600 mb-4">
                      {doctor.currentPosition}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-b-2 border-gray-300 mt-6">
                <h3 className="font-semibold text-xl mb-3">About Doctor</h3>
                <p className="text-lg text-gray-600 mb-4">{doctor.about}</p>
              </div>

              <div className="my-[4rem] px-4 md:px-10 border-b-2 border-gray-200 ">
                <h2 className="font-semibold text-2xl">Experience</h2>
                {doctor.experience_1 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      A
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.experience_1}
                      </p>
                    </div>
                  </div>
                )}
                {doctor.experience_2 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      B
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.experience_2}
                      </p>
                    </div>
                  </div>
                )}
                {doctor.experience_3 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      C
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.experience_3}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="my-[4rem] px-4 md:px-10 ">
                <h2 className="font-semibold text-2xl">Education</h2>
                {doctor.education_1 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem] ">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      A
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.education_1}
                      </p>
                    </div>
                  </div>
                )}
                {doctor.education_2 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      B
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.education_2}
                      </p>
                    </div>
                  </div>
                )}
                {doctor.education_3 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      C
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.education_3}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-1 md:col-span-1">
              <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
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
                      {currentUser && currentUser.role !== "Doctor" && (
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
                      )}
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorProfiles;
