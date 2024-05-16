import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSide from "./AdminSide";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import Adminbox from './Adminbox';

const AdminMessage = () => {
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState("");
    const [currentConversation, setCurrentConversation] = useState(null);
    const [showAdminbox, setshowAdminbox] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { id } = useParams();

    // const handleReplyMessageChange = (e) => {
    //     setReplyMessage(e.target.value);
    // };

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
            if (!currentConversation || !currentConversation.companyID || !currentConversation.doctorID) {
                throw new Error("Invalid conversation or missing IDs.");
            }
            const replyData = {
                companyID: currentConversation.companyID,
                doctorID: currentConversation.doctorID,
                messages: replyMessage,
                sentBy: "",
                timestamp: new Date(),
            };

            const customId = `${id}_${currentConversation.doctorID}_${currentConversation.companyID}_${Date.now()}`;
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
            // let q = query(messageRef, where("companyID", "==", id));

            const querySnapshot = await getDocs(messageRef);

            const fetchCompanyData = async (companyID) => {
                const companyDocRef = doc(db, "companies", companyID);
                const companyDocSnapshot = await getDoc(companyDocRef);
                if (companyDocSnapshot.exists()) {
                    return companyDocSnapshot.data();
                } else {
                    console.error(`Company with ID ${companyID} not found`);
                    return null;
                }
            };

            const fetchDoctorData = async (doctorID) => {
                const doctorDocRef = doc(db, "doctors", doctorID);
                const doctorDocSnapshot = await getDoc(doctorDocRef);
                if (doctorDocSnapshot.exists()) {
                    return doctorDocSnapshot.data();
                } else {
                    console.error(`Company with ID ${doctorID} not found`);
                    return null;
                }
            };

            const groupedMessages = {};
            const promises = querySnapshot.docs.map(async (doc) => {
                const messageData = doc.data();
                const companyData = await fetchCompanyData(messageData.companyID);
                const companyName = companyData ? companyData.companyName : "Unknown Company Name";
                const representativeName = companyData ? companyData.name : "Unknown Representative Name";

                const doctorData = await fetchDoctorData(messageData.doctorID);
                const doctorName = doctorData ? doctorData.name :"unknown doctor name";

                const key = `${messageData.doctorID}_${messageData.companyID}`;
                if (!groupedMessages[key]) {
                    groupedMessages[key] = {
                        doctorName,
                        companyName,
                        representativeName,
                        doctorID: messageData.doctorID,
                        companyID: messageData.companyID,
                        messages: [],
                        recentMessage: {
                            text: "",
                            isDoctor: false,
                            date: "",
                            time: ""
                        }
                    };
                }

                const timestamp = messageData.timestamp?.toDate();
                const date = timestamp ? timestamp.toLocaleDateString() : "N/A";
                const time = timestamp ? timestamp.toLocaleTimeString() : "N/A";

                groupedMessages[key].messages.push({
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
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [id]);

    const handleReply = (conversation) => {
        setCurrentConversation(conversation);
        setshowAdminbox(true);
    };

    const handleCloseChat = () => {
        setshowAdminbox(false);
    };

    const indexOfLastMessage = currentPage * itemsPerPage;
    const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="flex">
            <AdminSide />
            <div className="flex-1 overflow-hidden">
                <AdminNavbar />
                <div className="container mx-auto px-5 md:px-3 h-full overflow-y-scroll overflow-x-scroll">
                    <div className="border mt-4 p-2">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-center text-3xl font-bold">Messages</h2>
                        </div>
                        <div className="overflow-auto mt-3 border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="p-2 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="bg-gray-50 p-2 text-sm uppercase tracking-wider">
                                            Doctor Name
                                        </th>
                                        <th scope="col" className="p-2 text-sm uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th scope="col" className="bg-gray-50 p-2 text-sm uppercase tracking-wider">
                                            Representative Name
                                        </th>
                                        <th scope="col" className="p-2 text-sm uppercase tracking-wider">
                                            Recent Message
                                        </th>
                                        <th scope="col" className="bg-gray-50 p-2 text-sm uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="p-2 text-sm uppercase tracking-wider">
                                            Time
                                        </th>

                                        <th scope="col" className="p-2 text-sm uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentMessages.map((conversation, index) => (
                                        <tr key={index} className="text-sm border-b border-gray-200">
                                            <td className="p-2">
                                                {index + 1}
                                            </td>
                                            <td className="p-2 bg-gray-50 font-bold">
                                                {conversation.doctorName}
                                            </td>
                                            <td className="p-2 font-bold">
                                                {conversation.companyName}
                                            </td>
                                            <td className="p-2 bg-gray-50 ">
                                                {conversation.representativeName}
                                            </td>
                                            <td className="p-2">
                                                {conversation.recentMessage && conversation.recentMessage.isDoctor !== undefined ? (
                                                    conversation.recentMessage.isDoctor ? (
                                                        <span style={{ color: "blue" }}>{conversation.recentMessage.text}</span>
                                                    ) : (
                                                        <span style={{ color: "green" }}>{conversation.recentMessage.text}</span>
                                                    )
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>
                                            <td className="p-2 bg-gray-50 ">
                                                {conversation.recentMessage.date}
                                            </td>
                                            <td className="p-2">
                                                {conversation.recentMessage.time}
                                            </td>
                                            <td className="p-2 bg-gray-50 ">
                                                <button
                                                    onClick={() => handleReply(conversation)}
                                                    className="text-white bg-[#4BCB5D] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                >
                                                    Open ChatBox
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {currentConversation && showAdminbox && (
                        <Adminbox
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
    );
}

export default AdminMessage;
