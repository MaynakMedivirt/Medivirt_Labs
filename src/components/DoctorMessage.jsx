import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DoctorNavbar from './DoctorNavbar';
import DoctorSide from './DoctorSide';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const DoctorMessage = () => {
    const [messages, setMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState("");
    const [currentMessageId, setCurrentMessageId] = useState(null);
    const { id } = useParams();

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const db = getFirestore();
                const messageRef = collection(db, "messages");
                const q = query(messageRef, where("doctorID", "==", id));
                const querySnapshot = await getDocs(q);
    
                const fetchCompanyData = async (companyId) => {
                    const companyDocRef = doc(db, "companies", companyId);
                    const companyDocSnapshot = await getDoc(companyDocRef);
                    if (companyDocSnapshot.exists()) {
                        return companyDocSnapshot.data();
                    } else {
                        return null;
                    }
                };
    
                const messagesArray = [];
                const promises = querySnapshot.docs.map(async (doc) => {
                    const messageData = doc.data();
                    const companyData = await fetchCompanyData(messageData.companyID);
                    const companyName = companyData ? companyData.companyName : "Unknown Company";
                    const representativeName = companyData ? companyData.name : "Unknown Representative";

                    if (messageData.sentBy === 'company') {
                        messagesArray.push({
                            id: doc.id,
                            companyName,
                            representativeName,
                            message: messageData.messages,
                            companyId: messageData.companyID // Include companyId in the message object
                        });
                    } else if (messageData.sentBy === 'doctor') {
                        const index = messagesArray.findIndex(message => message.id === messageData.replyTo);
                        if (index !== -1) {
                            if (!messagesArray[index].replies) {
                                messagesArray[index].replies = [];
                            }
                            messagesArray[index].replies.push({
                                id: doc.id,
                                message: messageData.messages
                            });
                        }
                    }
                });
    
                await Promise.all(promises);
                setMessages(messagesArray);
            } catch (error) {
                console.error("Error fetching schedule messages:", error);
            }
        };
    
        fetchMessages();
    }, [id]);

    const handleReply = (messageId) => {
        setCurrentMessageId(messageId);
    };

    const handleReplySubmit = async () => {
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
            const originalMessage = messages.find(msg => msg.id === currentMessageId);
            if (!originalMessage || !originalMessage.companyId) {
                throw new Error("Original message or company ID not found.");
            }
            const replyData = {
                doctorID: id,
                companyID: originalMessage.companyId,
                messages: replyMessage,
                sentBy: "doctor",
                replyTo: currentMessageId,
                timestamp: new Date(),
            };

            const customId = `${id}_${originalMessage.companyId}_${Date.now()}`;
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
            setCurrentMessageId(null);

        } catch (error) {
            console.error("Error sending reply:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to send reply. Please try again.',
            });
        }
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
                                        <th scope="col" className="px-6 py-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="bg-gray-50 px-6 py-3 text-sm uppercase tracking-wider">
                                            Company Name
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Representative Name
                                        </th>
                                        <th scope="col" className="bg-gray-50 px-6 py-3 text-sm uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-sm uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {messages.map((message, index) => (
                                        <tr key={message.id} className="border-b border-gray-200">
                                            <td scope="row" className="px-6 py-4">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                                                {message.companyName}
                                            </td>
                                            <td className="px-6 py-4">
                                                {message.representativeName}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">
                                                {message.message}
                                                {message.replies && (
                                                    <ul className="text-gray-800">
                                                        {message.replies.map((reply, idx) => (
                                                            <li className="text-black" key={idx}>{reply.message}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 bg-gray-50">
                                                <button
                                                    type="button"
                                                    className="text-white bg-[#4BCB5D] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                    onClick={() => handleReply(message.id)}
                                                >
                                                    Reply
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {currentMessageId && (
                            <div className="mt-5 bg-gray-100 p-5 rounded-md shadow-md">
                                <h3 className="text-lg font-semibold mb-3">Reply to Message</h3>
                                <textarea
                                    placeholder="Type your reply here..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none focus:outline-none"
                                ></textarea>
                                <div className="flex justify-end mt-3">
                                    <button
                                        onClick={handleReplySubmit}
                                        className="px-4 py-2 bg-indigo-800 text-white rounded-md font-semibold"
                                    >
                                        Send Reply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorMessage;
 