import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, Routes, Route } from "react-router-dom";
import DoctorNavbar from "./DoctorNavbar";
import DoctorSide from "./DoctorSide";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import "../style/Doctor.css";
import { FaEdit, FaCheck } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import JitsiMeeting from "../JitsiMeeting";

const DoctorSchedule = () => {
  const [scheduleMeetings, setScheduleMeetings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
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
        let q = query(scheduleMeetingsRef, where("doctorID", "==", id));

        if (searchDate !== "") {
          q = query(q, where("date", "==", searchDate));
        }

        const querySnapshot = await getDocs(q);
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const fetchCompanyData = async (companyId) => {
            const companyDocRef = doc(db, "companies", companyId);
            const companyDocSnapshot = await getDoc(companyDocRef);
            if (companyDocSnapshot.exists()) {
              return companyDocSnapshot.data();
            } else {
              return null;
            }
          };

          const fetchAssignedData = async (assigned) => {
            let assignedName;

            try {
              const companyDocRef = doc(db, "companies", assigned);
              const companyDocSnapshot = await getDoc(companyDocRef);

              if (companyDocSnapshot.exists()) {
                assignedName = companyDocSnapshot.data().name;
              } else {
                const userDocRef = doc(db, "users", assigned);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                  const userData = userDocSnapshot.data();
                  assignedName = `${userData.firstName} ${userData.lastName}`;
                } else {
                  console.error(`No document found with ID ${assigned}`);
                }
              }
            } catch (error) {
              console.error("Error fetching assigned data:", error);
            }

            return assignedName;
          };

          const promises = querySnapshot.docs.map(async (doc) => {
            const meetingData = doc.data();
            const companyData = await fetchCompanyData(meetingData.companyID);
            const assignedName = await fetchAssignedData(meetingData.assigned);
            const companyName = companyData
              ? companyData.companyName
              : "Unknown Company";
            const representativeName = companyData
              ? companyData.name
              : "Unknown Representative";

            // Check if the meeting date is in the future
            const currentDate = new Date().toISOString().split("T")[0];
            const currentTime = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const meetingDateTime = new Date(
              `${meetingData.date} ${meetingData.time}`
            );
            const isUpcoming =
              meetingDateTime > new Date(currentDate + " " + currentTime);
            // console.log(`Meeting: ${companyName} - ${meetingData.date} ${meetingData.time} - Upcoming: ${isUpcoming}`);

            if (isUpcoming) {
              return {
                id: doc.id,
                companyName,
                representativeName,
                assignedName,
                ...meetingData,
              };
            } else {
              return null;
            }
          });

          const resolvedData = (await Promise.all(promises)).filter(
            (meeting) => meeting !== null
          );
          setScheduleMeetings(resolvedData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching schedule meetings:", error);
      }
    };

    fetchScheduleMeetings();
  }, [id, searchDate, scheduleMeetings]);

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
          meeting.id === meetingId
            ? { ...meeting, status: "accepted" }
            : meeting
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

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOnLeave = () => {
    window.location.href = "/home"; // Redirect the user to a custom page
  };

  const interfaceConfig = {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    DEFAULT_BACKGROUND: "#f0f0f0",
    TOOLBAR_BUTTONS: [
      "microphone",
      "camera",
      "desktop",
      "fullscreen",
      "fodeviceselection",
      "hangup",
      "profile",
      "chat",
      "recording",
      "livestreaming",
      "etherpad",
      "sharedvideo",
      "settings",
      "raisehand",
      "videoquality",
      "filmstrip",
      "invite",
      "feedback",
      "stats",
      "shortcuts",
      "tileview",
      "videobackgroundblur",
      "download",
      "help",
      "mute-everyone",
      "e2ee",
    ],
    JITSI_WATERMARK_LINK: "https://medivirt.com",
    DEFAULT_LOGO_URL:
      "https://medivirt.com/static/media/Medivirt.aa6fab5cce6b660ab2e2.png",
    DEFAULT_WELCOME_PAGE_LOGO_URL:
      "https://medivirt.com/static/media/Medivirt.aa6fab5cce6b660ab2e2.png",
    BRAND_WATERMARK_LINK: "https://medivirt.com",
    SHOW_BRAND_WATERMARK: true,
    SHOW_POWERED_BY: false,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
  };

  return (
    <div className="flex flex-col h-screen">
      <DoctorNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="container px-4 mx-auto mt-10">
            <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">
              <span className="bg-[#8697C4] text-white p-2">
                {" "}
                Schedule Meetings{" "}
              </span>
            </h2>

            <div className="flex justify-end items-center bg-white rounded max-md:flex-wrap max-md:max-w-full">
              <div className="flex items-center">
                <div className="flex flex-col justify-end sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 w-full lg:w-auto"
                  />
                </div>
                <button
                  onClick={() => console.log("Search logic here")}
                  className="p-2 bg-[#ADBBDA] text-white  hover:bg-[#8697C4] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="overflow-auto shadow-md sm:rounded-lg mt-3 table-container">
              <table className="divide-y border divide-gray-300 w-full text-left rtl:text-right">
                <thead className="text-sm text-gray-700 uppercase ">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-3 tracking-wider bg-gray-50"
                    >
                      S.N.
                    </th>
                    <th scope="col" className="px-6 py-3 tracking-wider">
                      Company Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 tracking-wider bg-gray-50"
                    >
                      Representative Name
                    </th>
                    <th scope="col" className="px-6 py-3 tracking-wider">
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 tracking-wider bg-gray-50"
                    >
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 tracking-wider">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 tracking-wider bg-gray-50"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduleMeetings.length === 0 ? (
                    <tr className="bg-white border-b dark:border-gray-200">
                      <td colSpan="7" className="text-center py-4">
                        <p className="text-lg">No Schedule meetings.</p>
                      </td>
                    </tr>
                  ) : (
                    scheduleMeetings.map((meeting, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:border-gray-200"
                      >
                        <td
                          scope="row"
                          className="px-2 py-3 bg-gray-50 text-center font-medium"
                        >
                          {index + 1}.
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {meeting.companyName}
                        </td>
                        <td className="px-4 py-3 bg-gray-50">
                          {meeting.assignedName}
                        </td>
                        <td className="px-4 py-3">{meeting.date}</td>
                        <td className="px-4 py-3 bg-gray-50">{meeting.time}</td>
                        <td className="px-4 py-3 capitalize">
                          {meeting.status}
                        </td>
                        <td className="px-4 py-3 bg-gray-50">
                          <button
                            onClick={() => toggleCalendar(meeting.id)}
                            className="text-white bg-[#8697C4] rounded-lg px-3 py-2 text-center me-2 mb-2"
                          >
                            <FaEdit />
                            {/* Modify */}
                          </button>

                          {meeting.status !== "accepted" &&
                          meeting.status !== "Rescheduled" ? (
                            <button
                              onClick={() => handleAccept(meeting.id)}
                              type="button"
                              className="text-white bg-[#8697C4] rounded-lg px-3 py-2 text-center me-2 mb-2"
                            >
                              <FaCheck />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="text-white bg-gray-400 rounded-lg px-3 py-2 text-center me-2 mb-2 cursor-not-allowed"
                              disabled
                            >
                              <FaCheck />
                            </button>
                          )}

                          <Link
                            to={meeting.meetingLink}
                            type="button"
                            className="text-white bg-[#8697C4] rounded-lg px-3 py-[6px] text-center me-2 mb-2"
                          >
                            <SiGooglemeet className="inline-block mb-[5px]" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
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
                    className={`px-3 py-2 mx-1 rounded-md ${
                      currentPage === i + 1
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
        <div className="overlay">
          <div className="overlay-content">
            <Calendar
              onChange={setSelectedDate}
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
            <div className="flex justify-end mt-4">
              <button
                onClick={() => toggleCalendar(null)}
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400 transition-all duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleModify}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 transition-all duration-300 ease-in-out"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route
          path="/jitsi/:roomName"
          element={
            <JitsiMeeting
              onLeave={handleOnLeave}
              interfaceConfig={interfaceConfig}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default DoctorSchedule;
