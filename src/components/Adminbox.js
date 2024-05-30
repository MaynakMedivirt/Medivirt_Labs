import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Adminbox = ({ conversation, replyMessage, handleReplyMessageChange, handleSendReply, handleCloseChat }) => {
    const [senderNames, setSenderNames] = useState({});
    console.log(conversation);

    useEffect(() => {
        if (!conversation || conversation.messages.length === 0) {
            return;
        }

        async function fetchSenderNames() {
            const db = getFirestore();
            const names = {};
            const promises = conversation.messages.map(async (msg) => {
                const { sentId } = msg;
                if (sentId && !names[sentId]) {
                    try {
                        console.log(`Fetching name for sentId: ${sentId}`);
                        let senderRef = doc(db, "companies", sentId);
                        let senderSnapshot = await getDoc(senderRef);

                        if (!senderSnapshot.exists()) {
                            senderRef = doc(db, "users", sentId);
                            senderSnapshot = await getDoc(senderRef);
                        }

                        if (senderSnapshot.exists()) {
                            const senderData = senderSnapshot.data();
                            let name = senderData.firstName && senderData.lastName 
                                ? `${senderData.firstName} ${senderData.lastName}` 
                                : senderData.name || "Unknown Sender";
                            names[sentId] = name;
                            console.log(`Fetched name: ${name} for sentId: ${sentId}`);
                        } else {
                            console.error(`Sender with ID ${sentId} not found.`);
                            names[sentId] = "Unknown Sender";
                        }
                    } catch (error) {
                        console.error("Error fetching sender name:", error);
                        names[sentId] = "Unknown Sender";
                    }
                }
            });

            await Promise.all(promises);
            setSenderNames(names);
            console.log("Sender names fetched:", JSON.stringify(names, null, 2));
        }

        fetchSenderNames();
    }, [conversation]);

    const getSenderName = (msg) => {
        if (msg.sentBy === 'admin') {
            return 'Admin';
        }
        return senderNames[msg.sentId] || 'Unknown';
    };

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

    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     const today = new Date();
    //     const yesterday = new Date(today);
    //     yesterday.setDate(today.getDate() - 1);

    //     if (date.toDateString() === today.toDateString()) {
    //         return "Today";
    //     } else if (date.toDateString() === yesterday.toDateString()) {
    //         return "Yesterday";
    //     } else {
    //         return date.toLocaleDateString('en-GB');
    //     }
    // };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    let currentDate = null;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 2);

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold">Chat with {conversation.representativeName} and {conversation.doctorName}</h3>
                </div>
                <div className="overflow-auto max-h-60">
                    {conversation.messages.filter(msg => msg.time).sort(compareTimeStamps).map((msg, idx) => {
                        const showDate = msg.date !== currentDate;
                        currentDate = msg.date;
                        {/* {conversation.messages
                            .filter(msg => new Date(msg.date) >= thirtyDaysAgo && msg.time) 
                            .sort(compareTimeStamps)
                            .map((msg, idx) => {
                                const showDate = msg.date !== currentDate;
                                currentDate = msg.date;  */}
                        return (
                            <div key={idx}>
                                {showDate && (
                                    <div className="mb-2 text-center text-gray-600">
                                        {formatDate(msg.date)}
                                    </div>
                                )}
                                <div className={`mb-2 ${msg.sentBy === 'company' ? 'text-left' : 'text-right'}`}>
                                    <span className="inline-block bg-gray-200 p-2 rounded-lg">
                                        <span className="block text-[0.75rem] font-bold">
                                            {getSenderName(msg)}
                                        </span>
                                        {msg.message}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <textarea
                    placeholder="Type your message here..."
                    value={replyMessage}
                    onChange={handleReplyMessageChange}
                    className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none"
                ></textarea>
                <div className="flex justify-end mt-2">
                    <button onClick={handleSendReply} className="px-4 py-2 bg-indigo-800 text-white rounded-md font-semibold mr-2">
                        Send
                    </button>
                    <button onClick={handleCloseChat} className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Adminbox;
