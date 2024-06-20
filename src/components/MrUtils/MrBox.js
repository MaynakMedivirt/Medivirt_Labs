import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";
import { format, parse } from 'date-fns';

const MrBox = ({
  conversation,
  handleReplyMessageChange,
  currentUserId,
  setCurrentConversation,
}) => {
  const [senderNames, setSenderNames] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversation || !conversation.messages || conversation.messages.length === 0) {
      return;
    }

    const db = getFirestore();
    const firstMessage = conversation.messages[0];

    if (!firstMessage.messageId) {
      console.error("First message does not have a messageId");
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "messages", firstMessage.messageId),
      (doc) => {
        const messageData = doc.data();
        if (!messageData) {
          console.error("Message data not found");
          return;
        }

        const newMessage = {
          messageId: messageData.messageId,
          sentId: messageData.sentId,
          id: doc.id,
          message: messageData.message,
          sentBy: messageData.sentBy,
          timestamp: messageData.timestamp,
          date: format(new Date(messageData.timestamp.toDate()), 'dd/MM/yyyy'),
          time: format(new Date(messageData.timestamp.toDate()), 'hh:mm:ss a'),
        };

        const updatedMessages = [...conversation.messages, newMessage].sort(compareTimeStamps);
        const updatedConversation = { ...conversation, messages: updatedMessages };

        setCurrentConversation(updatedConversation);
      },
      (error) => {
        console.error("Error fetching message:", error);
      }
    );

    return () => unsubscribe();
  }, [conversation, currentUserId, setCurrentConversation]);

  useEffect(() => {
    if (!conversation || !conversation.messages || conversation.messages.length === 0) {
      return;
    }

    async function fetchSenderNames() {
      const db = getFirestore();
      const names = { ...senderNames }; // Preserve existing names

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
  }, [conversation, currentUserId, senderNames]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const compareTimeStamps = (msg1, msg2) => {
    const date1 = parse(msg1.date, 'dd/MM/yyyy', new Date());
    const date2 = parse(msg2.date, 'dd/MM/yyyy', new Date());

    if (date1.getTime() !== date2.getTime()) {
      return date1.getTime() - date2.getTime();
    } else {
      const time1 = parse(msg1.time, 'hh:mm:ss a', new Date());
      const time2 = parse(msg2.time, 'hh:mm:ss a', new Date());
      return time1.getTime() - time2.getTime();
    }
  };

  const handlePredefinedMessageClick = (message) => {
    handleReplyMessageChange({ target: { value: message } });
  };

  let currentDate = null;

  return (
    <div className="companybox-container" style={{ display: "flex", flexDirection: "column-reverse", height: "100%", overflowY: "auto" }}>
      <div>
        {conversation && conversation.messages && conversation.messages.filter((msg) => msg.time).sort(compareTimeStamps).map((msg, idx) => {
          const showDate = msg.date !== currentDate;
          currentDate = msg.date;
          let name;
          if (msg.sentId === currentUserId) {
            name = "";
          } else if (msg.sentBy === "company") {
            name = senderNames[msg.sentId];
          } else if (msg.sentBy === "admin") {
            name = "Admin";
          }
          return (
            <div key={idx}>
              {showDate && (
                <div className="mb-2 text-center text-gray-600">
                  {msg.date}
                </div>
              )}
              <div
                className={`mb-2 ${msg.sentBy === "company" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${msg.sentBy === "company" ? "bg-[#8697C4] text-white" : "bg-gray-200"}`}
                >
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
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MrBox;
