import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DoctorNavbar from "./DoctorNavbar";
import DoctorSide from "./DoctorSide";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import Doctorbox from "./Doctorbox";

const DoctorMessage = () => {
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState("");
    const [currentConversation, setCurrentConversation] = useState(null);
    const [showDoctorbox, setShowDoctorbox] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchDate, setSearchDate] = useState(''); 
    const { id } = useParams();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleReplyMessageChange = (e) => {
        setReplyMessage(e.target.value);
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Message cannot be empty!',
            });
            return;
        }

        try {
            const db = getFirestore();
            if (!currentConversation || !currentConversation.companyID) {
                throw new Error("Conversation or company ID not found.");
            }
            const replyData = {
                companyID: currentConversation.companyID,
                doctorID: id,
                messageId: currentConversation.messages[0].messageId, 
                messages: replyMessage,
                sentBy: "doctor",
                timestamp: new Date(),
            };  

            const customId = `${id}_${currentConversation.companyID}_${Date.now()}`;
            const customDocRef = doc(db, "messages", customId);
            await setDoc(customDocRef, replyData);

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Reply sent successfully!",
                showConfirmButton: false,
                timer: 2000,
            });

            setReplyMessage("");
            setCurrentConversation(null);

            fetchMessages();
        } catch (error) {
            console.error("Error sending reply:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to send reply. Please try again.',
            });
        }
    };

    const fetchMessages = async () => {
        try {
            const db = getFirestore();
            const messageRef = collection(db, "messages");
            let q = query(messageRef, where("doctorID", "==", id));

            const querySnapshot = await getDocs(q);

            const fetchCompanyData = async (companyID) => {
                const companyDocRef = doc(db, "companies", companyID);
                const companyDocSnapshot = await getDoc(companyDocRef);
                if (companyDocSnapshot.exists()) {
                    return companyDocSnapshot.data();
                } else {
                    console.error(`company with ID ${companyID} not found`);
                    return null;
                }
            };

            const fetchAssignedData = async (messageId) => {
                let assignedName;
                
                try {
                  const companyDocRef = doc(db, "companies", messageId);
                  const companyDocSnapshot = await getDoc(companyDocRef);
              
                  if (companyDocSnapshot.exists()) {
                    assignedName = companyDocSnapshot.data().name;
                  } else {
                    const userDocRef = doc(db, "users", messageId);
                    const userDocSnapshot = await getDoc(userDocRef);
              
                    if (userDocSnapshot.exists()) {
                      const userData = userDocSnapshot.data();
                      assignedName = `${userData.firstName} ${userData.lastName}`;
                    } else {
                      console.error(`No document found with ID ${messageId}`);
                    }
                  }
                } catch (error) {
                  console.error("Error fetching assigned data:", error);
                }
              
                return assignedName;
              };

            const groupedMessages = {};
            const promises = querySnapshot.docs.map(async (doc) => {
                const messageData = doc.data();
                const companyData = await fetchCompanyData(messageData.companyID);
                const assignedName = await fetchAssignedData(messageData.messageId);
                const companyName = companyData ? companyData.companyName : "Unknown Company Name";
                const representativeName = companyData ? companyData.name : "Unknown Name";

                const key = `${messageData.doctorID}_${messageData.companyID}`;
                if (!groupedMessages[key]) {
                    groupedMessages[key] = {
                        companyName,
                        representativeName,
                        assignedName,
                        doctorID: messageData.doctorID,
                        companyID: messageData.companyID,
                        messages: [],
                        recentMessage: {
                            text: "",
                            isCompany: false,
                            date: "",
                            time: ""
                        }
                    };
                }

                const timestamp = messageData.timestamp?.toDate();
                const date = timestamp ? timestamp.toLocaleDateString() : "N/A";
                const time = timestamp ? timestamp.toLocaleTimeString() : "N/A";

                groupedMessages[key].messages.push({
                    messageId: messageData.messageId, 
                    id: doc.id,
                    message: messageData.messages,
                    sentBy: messageData.sentBy,
                    date,
                    time,
                });

                // Check if the current message is the most recent one
                if (!groupedMessages[key].recentMessage.timestamp || timestamp > groupedMessages[key].recentMessage.timestamp) {
                    groupedMessages[key].recentMessage = {
                        text: messageData.messages,
                        isDoctor: messageData.sentBy === "doctor",
                        date,
                        time,
                        timestamp
                    };
                }
            });

            await Promise.all(promises);

            // Convert groupedMessages object to array
            const messagesArray = Object.keys(groupedMessages).map(key => groupedMessages[key]);
            setMessages(messagesArray);
        } catch (error) {
            console.error("Error fetching schedule messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [id, searchDate]); 

    const handleReply = (conversation) => {
        console.log("Selected Conversation:", conversation); // Add this line to check the selected conversation
        setCurrentConversation(conversation);
        setShowDoctorbox(true);
    };

    const handleCloseChat = () => {
        setShowDoctorbox(false);
    };

    const indexOfLastMessage = currentPage * itemsPerPage;
    const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

    // Handle pagination button click
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="flex flex-col h-screen">
            <DoctorNavbar />
            <div className="flex flex-1">
                <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">
                            Messages
                        </h2>

                        <div className="overflow-auto mt-3 border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="p-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="bg-gray-50 p-3 text-sm uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th scope="col" className="p-3 text-sm uppercase tracking-wider">
                                            Representative Name
                                        </th>
                                        <th scope="col" className="bg-gray-50 p-3 text-sm uppercase tracking-wider">
                                            Recent Message
                                        </th>
                                        <th scope="col" className="p-3 text-sm uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="bg-gray-50 p-3 text-sm uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th scope="col" className="p-3 text-sm uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                {currentMessages.length > 0 ? (
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentMessages.map((conversation, index) => (
                                            <tr key={index} className="border-b border-gray-200">
                                                <td scope="row" className="p-2">
                                                    {index + 1}
                                                </td>
                                                <td className="p-2 font-medium text-gray-900 bg-gray-50">
                                                    {conversation.companyName}
                                                </td>
                                                <td className="p-2 font-medium text-gray-900">
                                                    {conversation.assignedName}
                                                </td>
                                                <td className="p-2 font-medium text-gray-900 bg-gray-50">
                                                    {conversation.recentMessage.text}
                                                </td>
                                                <td className="p-2 font-medium text-gray-900">
                                                    {conversation.recentMessage.date}
                                                </td>
                                                <td className="p-2 font-medium text-gray-900 bg-gray-50">
                                                    {conversation.recentMessage.time}
                                                </td>
                                                <td className="p-2">
                                                    <button
                                                        type="button"
                                                        className="text-white bg-[#4BCB5D] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                        onClick={() => handleReply(conversation)}
                                                    >
                                                        View Messages
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="7" className="p-4 text-center">No messages found.</td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>

                        {currentConversation && showDoctorbox && (
                            <Doctorbox
                                conversation={currentConversation}
                                replyMessage={replyMessage}
                                handleReplyMessageChange={(e) => setReplyMessage(e.target.value)}
                                handleSendReply={handleSendReply}
                                handleCloseChat={handleCloseChat}
                            />
                        )}

                        {/* Pagination */}
                        <div className="flex justify-end my-4">
                            {Array.from({ length: Math.ceil(messages.length / itemsPerPage) }, (_, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-2 mx-1 rounded-md ${currentPage === i + 1 ? 'bg-[#7191E6] text-white' : 'bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-300'}`}
                                    onClick={() => handlePageClick(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorMessage;
