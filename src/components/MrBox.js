import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const MrBox = ({ conversation, replyMessage, handleReplyMessageChange, handleSendReply, handleCloseChat, predefinedMessages, currentUserId }) => {
    const [senderNames, setSenderNames] = useState({});

    useEffect(() => {
        if (!conversation || conversation.messages.length === 0) {
            return;
        }

        async function fetchSenderNames() {
            const db = getFirestore();
            const names = {};

            for (const msg of conversation.messages) {
                const { sentId } = msg;
                if (sentId && sentId !== currentUserId && !names[sentId]) {
                    try {
                        let senderRef = doc(db, "companies", sentId);
                        let senderSnapshot = await getDoc(senderRef);

                        if (!senderSnapshot.exists()) {
                            senderRef = doc(db, "users", sentId);
                            senderSnapshot = await getDoc(senderRef);
                        }

                        if (senderSnapshot.exists()) {
                            const senderData = senderSnapshot.data();
                            let name = senderData.firstName && senderData.lastName ? `${senderData.firstName} ${senderData.lastName}` : senderData.name || "Unknown Sender";
                            names[sentId] = name;
                        } else {
                            console.error(`Sender with ID ${sentId} not found.`);
                            names[sentId] = "Unknown Sender";
                        }
                    } catch (error) {
                        console.error("Error fetching sender name:", error);
                        names[sentId] = "Unknown Sender";
                    }
                }
            }
            setSenderNames(names);
        }

        fetchSenderNames();
    }, [conversation, currentUserId]);

    const compareTimeStamps = (msg1, msg2) => {
        const date1 = new Date(msg1.date);
        const date2 = new Date(msg2.date);

        if (date1.getTime() !== date2.getTime()) {
            return date1.getTime() - date2.getTime();
        } else {
            const time1 = new Date("2000-01-01 " + msg1.time);
            const time2 = new Date("2000-01-01 " + msg2.time);
            return time1.getTime() - time2.getTime();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const handlePredefinedMessageClick = (message) => {
        handleReplyMessageChange({ target: { value: message } });
    };

    let currentDate = null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold">Chat with {conversation && conversation.doctorName}</h3>
                </div>
                <div className="overflow-auto max-h-60">
                    {conversation && conversation.messages && conversation.messages.filter(msg => msg.time).sort(compareTimeStamps).map((msg, idx) => {
                        const showDate = msg.date !== currentDate;
                        currentDate = msg.date;
                        // const name = msg.sentId === currentUserId ? '' : senderNames[msg.sentId];
                        let name;
                        if (msg.sentId === currentUserId) {
                            name = '';
                        } else if (msg.sentBy === 'company') {
                            name = senderNames[msg.sentId];
                        } else if (msg.sentBy === 'admin') {
                            name = 'Admin';
                        }
                        return (
                            <div key={idx}>
                                {showDate && (
                                    <div className="mb-2 text-center text-gray-600">
                                        {formatDate(msg.date)}
                                    </div>
                                )}
                                <div className={`mb-2 ${msg.sentBy === 'company' ? 'text-right' : 'text-left'}`}>
                                    <span className="inline-block bg-gray-200 p-2 rounded-lg">
                                        <span className="block text-[0.75rem] font-bold">
                                            {name}
                                        </span>
                                        {msg.message}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div>
                    {predefinedMessages.map((msg, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePredefinedMessageClick(msg)}
                            className="px-2 py-1 bg-[#4BCB5D] text-white rounded-md mr-2 mb-2"
                        >
                            {msg}
                        </button>
                    ))}
                </div>
                <textarea
                    placeholder="Type your message here..."
                    value={replyMessage}
                    onChange={handleReplyMessageChange}
                    className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none"
                ></textarea>
                <div className="flex justify-between mt-2">
                    <div>
                        <button onClick={handleSendReply} className="px-4 py-2 bg-indigo-800 text-white rounded-md font-semibold mr-2">
                            Send
                        </button>
                        <button onClick={handleCloseChat} className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MrBox;
