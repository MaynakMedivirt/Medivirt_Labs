import React from "react";

const Doctorbox = ({ conversation, replyMessage, handleReplyMessageChange, handleSendReply, handleCloseChat }) => {

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
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString('en-GB');
        }
    };

    let currentDate = null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold">Chat with {conversation.representativeName}</h3>
                </div>
                <div className="overflow-auto max-h-60">
                    {/* Sort messages by timestamp before rendering */}
                    {conversation.messages.filter(msg => msg.time).sort(compareTimeStamps).map((msg, idx) => {
                        const showDate = msg.date !== currentDate;
                        currentDate = msg.date;
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
                                            {msg.sentBy === 'admin' ? 'Admin' : ''}
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

export default Doctorbox;
