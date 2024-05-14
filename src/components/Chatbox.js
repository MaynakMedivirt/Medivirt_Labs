// Chatbox.js
import React from "react";

const Chatbox = ({ conversation, replyMessage, handleReplyMessageChange, handleSendReply, handleCloseChat }) => {
    // Function to compare timestamps for sorting
    const compareTimeStamps = (msg1, msg2) => {
        // Parse and convert time strings to Date objects
        const time1 = new Date("2000-01-01 " + msg1.time);
        const time2 = new Date("2000-01-01 " + msg2.time);
        
        // Compare the time objects
        return time1.getTime() - time2.getTime();
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold">Chat with {conversation.doctorName}</h3>
                </div>
                <div className="overflow-auto h-60">
                    {/* Sort messages by timestamp before rendering */}
                    {conversation.messages.filter(msg => msg.time).sort(compareTimeStamps).map((msg, idx) => (
                        <div key={idx} className={`mb-2 ${msg.sentBy === 'company' ? 'text-right' : 'text-left'}`}>
                            <span className="inline-block bg-gray-200 p-2 rounded-lg">{msg.message}</span>
                            <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                        </div>
                    ))}
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

export default Chatbox;
