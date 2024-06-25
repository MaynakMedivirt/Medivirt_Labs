import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CompanyNavbar from "./CompanyNavbar";
import CompanySide from "./CompanySide";
import { AiFillMessage } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaChartLine } from "react-icons/fa";
import { PiChartPieSliceFill } from "react-icons/pi";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Graph from "../../assets/img/graph.PNG";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CompanyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [scheduleMeetings, setScheduleMeetings] = useState([]);
  const [meetingData, setMeetingData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [userData, setUserData] = useState({});
  const [assignedUsersData, setAssignedUsersData] = useState([]);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const db = getFirestore();
        const messageRef = collection(db, "messages");
        const q = query(messageRef, where("companyID", "==", id));
        const querySnapshot = await getDocs(q);

        const fetchDoctorData = async (doctorId) => {
          const doctorDocRef = doc(db, "doctors", doctorId);
          const doctorDocSnapshot = await getDoc(doctorDocRef);
          return doctorDocSnapshot.exists() ? doctorDocSnapshot.data() : null;
        };

        const fetchAssignedData = async (messageId) => {
          try {
            const companyDocRef = doc(db, "companies", messageId);
            const companyDocSnapshot = await getDoc(companyDocRef);

            if (companyDocSnapshot.exists()) {
              return companyDocSnapshot.data().name;
            }

            const userDocRef = doc(db, "users", messageId);
            const userDocSnapshot = await getDoc(userDocRef);

            return userDocSnapshot.exists()
              ? `${userDocSnapshot.data().firstName} ${
                  userDocSnapshot.data().lastName
                }`
              : null;
          } catch (error) {
            console.error("Error fetching assigned data:", error);
            return null;
          }
        };

        const groupedMessages = {};
        const promises = querySnapshot.docs.map(async (doc) => {
          const messageData = doc.data();
          const assignedName = await fetchAssignedData(messageData.messageId);
          const doctorData = await fetchDoctorData(messageData.doctorID);
          const doctorName = doctorData ? doctorData.name : "Unknown Doctor";

          const key = `${messageData.doctorID}_${messageData.companyID}`;
          if (!groupedMessages[key]) {
            groupedMessages[key] = {
              doctorName,
              assignedName,
              doctorID: messageData.doctorID,
              companyID: messageData.companyID,
              messages: [],
              recentMessage: {
                text: "",
                isCompany: false,
                date: "",
                time: "",
                timestamp: null,
              },
            };
          }

          const timestamp = messageData.timestamp?.toDate();
          const date = timestamp ? format(timestamp, "dd-MM-yyyy") : "N/A";
          const time = timestamp ? format(timestamp, "hh:mm a") : "N/A";

          groupedMessages[key].messages.push({
            messageId: messageData.messageId,
            sentId: messageData.sentId,
            id: doc.id,
            message: messageData.messages,
            sentBy: messageData.sentBy,
            date,
            time,
          });

          if (
            !groupedMessages[key].recentMessage.timestamp ||
            timestamp > groupedMessages[key].recentMessage.timestamp
          ) {
            groupedMessages[key].recentMessage = {
              text: messageData.messages,
              isCompany: messageData.sentBy === "company",
              date,
              time,
              timestamp,
            };
          }
        });

        await Promise.all(promises);

        const messagesArray = Object.values(groupedMessages);
        const sortedMessages = messagesArray
          .sort((a, b) => {
            const timestampA = a.recentMessage.timestamp;
            const timestampB = b.recentMessage.timestamp;
            return timestampB - timestampA;
          })
          .slice(0, 4);

        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching schedule messages:", error);
      }
    };

    const fetchScheduleMeetings = async () => {
      try {
        const db = getFirestore();
        const scheduleMeetingsRef = collection(db, "scheduleMeeting");
        const q = query(scheduleMeetingsRef, where("companyID", "==", id));

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

          const fetchCompanyData = async (companyId) => {
            const CompanyDocRef = doc(db, "companies", companyId);
            const CompanyDocSnapshot = await getDoc(CompanyDocRef);
            if (CompanyDocSnapshot.exists()) {
              return CompanyDocSnapshot.data();
            } else {
              console.error(`Company with ID ${companyId} not found`);
              return null;
            }
          };

          const fetchAssignedData = async (assigned) => {
            let assignedName;
            let assignedRole;

            try {
              const companyDocRef = doc(db, "companies", assigned);
              const companyDocSnapshot = await getDoc(companyDocRef);

              if (companyDocSnapshot.exists()) {
                assignedName = companyDocSnapshot.data().name;
                assignedRole = companyDocSnapshot.data().role;
              } else {
                const userDocRef = doc(db, "users", assigned);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                  const userData = userDocSnapshot.data();
                  assignedName = `${userData.firstName} ${userData.lastName}`;
                  assignedRole = userData.role;
                } else {
                  console.error(`No document found with ID ${assigned}`);
                }
              }
            } catch (error) {
              console.error("Error fetching assigned data:", error);
            }

            return { assignedName, assignedRole };
          };

          const currentDate = new Date().toISOString().split("T")[0];
          const currentTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          const upcomingMeetings = [];
          querySnapshot.forEach((doc) => {
            const meetingData = doc.data();
            const meetingDateTime = new Date(
              `${meetingData.date} ${meetingData.time}`
            );

            // Check if meeting is upcoming
            if (meetingDateTime > new Date(currentDate + " " + currentTime)) {
              upcomingMeetings.push({
                id: doc.id,
                ...meetingData,
              });
            }
          });

          // Sort upcoming meetings by date/time ascending
          upcomingMeetings.sort((a, b) => {
            const dateTimeA = new Date(`${a.date} ${a.time}`);
            const dateTimeB = new Date(`${b.date} ${b.time}`);
            return dateTimeA - dateTimeB;
          });

          // Take the first 4 upcoming meetings
          const recentMeetings = upcomingMeetings.slice(0, 4);

          // Fetch doctor and assigned data for each meeting
          const promises = recentMeetings.map(async (meeting) => {
            const doctorData = await fetchDoctorData(meeting.doctorID);
            const companyData = await fetchCompanyData(meeting.companyID);
            const { assignedName, assignedRole } = await fetchAssignedData(
              meeting.assigned
            );
            const doctorName = doctorData ? doctorData.name : "Unknown Doctor";
            const companyName = companyData
              ? companyData.companyName
              : "Unknown Company";

            return {
              id: meeting.id,
              doctorName,
              companyName,
              assignedName,
              assignedRole,
              ...meeting,
            };
          });

          // Resolve all promises and set the state
          const resolvedData = await Promise.all(promises);
          setScheduleMeetings(resolvedData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching schedule meetings:", error);
      }
    };

    const fetchMeetings = async () => {
      try {
        const db = getFirestore();
        const scheduleMeetingsRef = collection(db, "scheduleMeeting");
        const q = query(scheduleMeetingsRef, where("companyID", "==", id));
        const querySnapshot = await getDocs(q);

        const meetingsByMonth = {};

        querySnapshot.forEach((doc) => {
          const meetingData = doc.data();
          const meetingDate = new Date(meetingData.date);
          const month = meetingDate.toLocaleString("default", {
            month: "short",
          });
          const year = meetingDate.getFullYear();
          const key = `${month} ${year}`;

          if (!meetingsByMonth[key]) {
            meetingsByMonth[key] = 0;
          }
          meetingsByMonth[key]++;
        });

        const currentYear = new Date().getFullYear();

        const sortedMeetingLabels = Object.keys(meetingsByMonth).sort(
          (a, b) => {
            const [monthA, yearA] = a.split(" ");
            const [monthB, yearB] = b.split(" ");

            if (parseInt(yearA) !== parseInt(yearB)) {
              return parseInt(yearA) - parseInt(yearB);
            }

            const months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

            return months.indexOf(monthA) - months.indexOf(monthB);
          }
        );

        const meetingCounts = sortedMeetingLabels.map(
          (label) => meetingsByMonth[label]
        );

        setMeetingData(meetingsByMonth);

        const updatedChartData = {
          labels: sortedMeetingLabels,
          datasets: [
            {
              label: "Total Meetings",
              data: meetingCounts,
              fill: false,
              borderColor: "rgba(119,150,230,1)",
              borderWidth: 2,
              tension: 0.1,
              pointStyle: "rectRounded",
              pointBorderWidth: 2,
            },
          ],
        };

        setChartData(updatedChartData); // Set the chart data state
      } catch (error) {
        console.error("Error fetching schedule meetings:", error);
      }
    };

    const fetchAssignedUsersData = async () => {
      try {
        const db = getFirestore();
        const scheduleMeetingsRef = collection(db, "scheduleMeeting");
        const q = query(scheduleMeetingsRef, where("companyID", "==", id));
        const querySnapshot = await getDocs(q);

        const assignedUsersCount = {};
        querySnapshot.forEach((doc) => {
          const meetingData = doc.data();
          const assigned = meetingData.assigned;

          if (!assignedUsersCount[assigned]) {
            assignedUsersCount[assigned] = 0;
          }

          assignedUsersCount[assigned]++;
        });

        const userPromises = Object.keys(assignedUsersCount).map(
          async (userId) => {
            let assignedName = "";
            let assignedRole = "";

            try {
              const companyDocRef = doc(db, "companies", userId);
              const companyDocSnapshot = await getDoc(companyDocRef);

              if (companyDocSnapshot.exists()) {
                assignedName = companyDocSnapshot.data().name;
                assignedRole = companyDocSnapshot.data().role;
              } else {
                const userDocRef = doc(db, "users", userId);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                  const userData = userDocSnapshot.data();
                  assignedName = `${userData.firstName} ${userData.lastName}`;
                  assignedRole = userData.role;
                } else {
                  console.error(`No document found with ID ${userId}`);
                }
              }
            } catch (error) {
              console.error("Error fetching assigned data:", error);
            }

            return {
              userId,
              assignedName,
              assignedRole,
              count: assignedUsersCount[userId],
            };
          }
        );

        const resolvedUserData = await Promise.all(userPromises);
        setAssignedUsersData(resolvedUserData);

        // Construct userData for the bar chart
        const userNames = resolvedUserData.map((data) => data.assignedName);
        const meetingCounts = resolvedUserData.map((data) => data.count);
        const colors = ["rgba(119,150,230,1)", "rgba(61,82,161,1)"]; // Define your alternate colors

        const userData = {
          labels: userNames,
          datasets: [
            {
              label: "Scheduled Meetings",
              data: meetingCounts,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1,
            },
          ],
        };

        setUserData(userData);
      } catch (error) {
        console.error("Error fetching assigned users data:", error);
      }
    };

    fetchMessages();
    fetchScheduleMeetings();
    fetchMeetings();
    fetchAssignedUsersData();

    return () => {};
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      <CompanyNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-margin duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="container px-4 mx-auto my-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-2 rounded shadow-md">
              <div className="bg-[#8697C4] text-white p-2">
                <h2 className="text-lg font-bold flex items-center">
                  <AiFillMessage className="mr-2" /> Recent Messages
                </h2>
              </div>
              {messages.length === 0 ? (
                <div
                  className="px-4 border-b my-2 shadow-lg cursor-pointer hover:bg-gray-100"
                  style={{ background: "white" }}
                >
                  No messages found !
                </div>
              ) : (
                messages.map((message, index) => (
                  <Link
                    key={index}
                    to={`/company/message/${message.companyID}`}
                  >
                    <div
                      className="px-4 border-b my-2 shadow-lg cursor-pointer hover:bg-gray-100"
                      style={{ background: "white" }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-gray-700">
                            {message.doctorName}
                          </div>
                          <div className="text-sm font-bold text-gray-600 mt-1">
                            {message.recentMessage.text}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 text-right">
                          <div>{message.recentMessage.date}</div>
                          <div>{message.recentMessage.time}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="bg-white p-2 rounded shadow-md">
              <div className="bg-[#8697C4] text-white p-2">
                <h2 className="text-lg font-bold flex items-center">
                  <RiCalendarScheduleLine className="mr-2" /> Upcoming Schedule
                </h2>
              </div>
              <div className="overflow-auto shadow-md sm:rounded-lg mt-3 table-container">
                <table className="divide-y border divide-gray-300 w-full text-left rtl:text-right">
                  <thead className="text-sm text-gray-700 uppercase ">
                    <tr>
                      <th
                        scope="col"
                        className="px-2 py-2 tracking-wider bg-gray-50"
                      >
                        S.N.
                      </th>
                      <th scope="col" className="px-3 py-2 tracking-wider">
                        Doctor Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 tracking-wider bg-gray-50"
                      >
                        Company Name
                      </th>
                      <th scope="col" className="px-3 py-2 tracking-wider">
                        Assigned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleMeetings.length === 0 ? (
                      <tr className="bg-white border-b dark:border-gray-200">
                        <td colSpan="3" className="text-center py-2">
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
                            className="px-2 py-2 bg-gray-50 text-center"
                          >
                            {index + 1}.
                          </td>
                          <td className="px-2 py-2 font-medium">
                            {meeting.doctorName}
                          </td>
                          <td className="px-2 py-2 bg-gray-50">
                            {meeting.companyName}
                          </td>
                          <td className="px-2 py-2">{meeting.assignedName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-2 rounded shadow-md">
              <div className="bg-[#8697C4] text-white p-2">
                <h2 className="text-lg font-bold flex items-center">
                  <FaChartLine className="mr-2" /> Meetings
                </h2>
              </div>
              {/* <Line data={chartData} /> */}
              {Object.keys(chartData).length > 0 && <Line data={chartData} />}
            </div>

            <div className="bg-white p-2 rounded shadow-md">
              <div className="bg-[#8697C4] text-white p-2">
                <h2 className="text-lg font-bold flex items-center">
                  <PiChartPieSliceFill className="mr-2" /> Doctors
                </h2>
              </div>
              {Object.keys(userData).length > 0 && (
                <Bar
                  data={userData}
                  options={{
                    indexAxis: "y", 
                    elements: {
                      bar: {
                        barPercentage: 0.8, 
                        categoryPercentage: 1.0, 
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
