import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CompanySide from './CompanySide';
import CompanyNavbar from './CompanyNavbar';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import Chatbox from './Chatbox'; // Import the Chatbox component

const CompanyMessage = () => {
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState("");
    const [currentConversation, setCurrentConversation] = useState(null);
    const [showChatbox, setShowChatbox] = useState(false); 
    const { id } = useParams();
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
            if (!currentConversation || !currentConversation.doctorID) {
                throw new Error("Conversation or doctor ID not found.");
            }
            const replyData = {
                companyID: id,
                doctorID: currentConversation.doctorID,
                messages: replyMessage,
                sentBy: "company",
                timestamp: new Date(),
            };

            const customId = `${id}_${currentConversation.doctorID}_${Date.now()}`;
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

            // Refetch messages to update the conversation list
            const fetchMessages = async () => {
                try {
                    const db = getFirestore();
                    const messageRef = collection(db, "messages");
                    const q = query(messageRef, where("companyID", "==", id));
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
        
                    const groupedMessages = {};
                    const promises = querySnapshot.docs.map(async (doc) => {
                        const messageData = doc.data();
                        const doctorData = await fetchDoctorData(messageData.doctorID);
                        const doctorName = doctorData ? doctorData.name : "Unknown Doctor";
    
                        const key = `${messageData.doctorID}_${messageData.companyID}`;
                        if (!groupedMessages[key]) {
                            groupedMessages[key] = {
                                doctorName,
                                doctorID: messageData.doctorID,
                                companyID: messageData.companyID,
                                messages: [],
                            };
                        }

                        const timestamp = messageData.timestamp?.toDate(); // Ensure timestamp exists and convert it
                        const date = timestamp ? timestamp.toLocaleDateString() : "N/A"; // Check if timestamp is available
                        const time = timestamp ? timestamp.toLocaleTimeString() : "N/A"; // Check if timestamp is available
    
                        groupedMessages[key].messages.push({
                            id: doc.id,
                            message: messageData.messages,
                            sentBy: messageData.sentBy,
                            date,
                            time,
                        });
                    });
    
                    await Promise.all(promises);
    
                    // Convert groupedMessages object to array
                    const messagesArray = Object.keys(groupedMessages).map(key => groupedMessages[key]);
                    setMessages(messagesArray);
                } catch (error) {
                    console.error("Error fetching schedule messages:", error);
                }
            };
        
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
                    if (doctorDocSnapshot.exists()) {
                        return doctorDocSnapshot.data();
                    } else {
                        console.error(`Doctor with ID ${doctorId} not found`);
                        return null;
                    }
                };
    
                const groupedMessages = {};
                const promises = querySnapshot.docs.map(async (doc) => {
                    const messageData = doc.data();
                    const doctorData = await fetchDoctorData(messageData.doctorID);
                    const doctorName = doctorData ? doctorData.name : "Unknown Doctor";

                    const key = `${messageData.doctorID}_${messageData.companyID}`;
                    if (!groupedMessages[key]) {
                        groupedMessages[key] = {
                            doctorName,
                            doctorID: messageData.doctorID,
                            companyID: messageData.companyID,
                            messages: [],
                        };
                    }

                    const timestamp = messageData.timestamp?.toDate(); // Ensure timestamp exists and convert it
                    const date = timestamp ? timestamp.toLocaleDateString() : "N/A"; // Check if timestamp is available
                    const time = timestamp ? timestamp.toLocaleTimeString() : "N/A"; // Check if timestamp is available

                    groupedMessages[key].messages.push({
                        id: doc.id,
                        message: messageData.messages,
                        sentBy: messageData.sentBy,
                        date,
                        time,
                    });
                });

                await Promise.all(promises);

                // Convert groupedMessages object to array
                const messagesArray = Object.keys(groupedMessages).map(key => groupedMessages[key]);
                setMessages(messagesArray);
            } catch (error) {
                console.error("Error fetching schedule messages:", error);
            }
        };
    
        fetchMessages();
    }, [id]);

    const handleReply = (conversation) => {
        setCurrentConversation(conversation);
        setShowChatbox(true);
    };

    const handleCloseChat = () => {
        setShowChatbox(false); // Hide the chatbox
    };


    return (
        <div className="flex flex-col h-screen">
            <CompanyNavbar />
            <div className="flex flex-1">
                <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">
                            Messages
                        </h2>
                        <div className="overflow-auto mt-3 border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="bg-gray-50 px-6 py-3 text-sm uppercase tracking-wider">
                                            Doctor Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {messages.map((conversation, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td scope="row" className="px-6 py-4">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                                                {conversation.doctorName}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">
                                                <button
                                                    type="button"
                                                    className="text-white bg-[#4BCB5D] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                    onClick={() => handleReply(conversation)}
                                                >
                                                    Open ChatBox
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {currentConversation && showChatbox && (
                            <Chatbox
                                conversation={currentConversation}
                                replyMessage={replyMessage}
                                handleReplyMessageChange={(e) => setReplyMessage(e.target.value)}
                                handleSendReply={handleSendReply}
                                handleCloseChat={handleCloseChat} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyMessage;