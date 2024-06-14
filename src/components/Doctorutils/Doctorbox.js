import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";

const Doctorbox = ({ conversation, setCurrentConversation }) => {
  const [senderNames, setSenderNames] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (
      !conversation ||
      !conversation.messages ||
      conversation.messages.length === 0
    ) {
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
          console.error(
            "No message data found for messageId:",
            firstMessage.messageId
          );
          return;
        }

        const updatedConversation = {
          ...conversation,
          messages: [
            ...conversation.messages,
            {
              messageId: messageData.messageId,
              sentId: messageData.sentId,
              id: doc.id,
              message: messageData.message,
              sentBy: messageData.sentBy,
              date: new Date(
                messageData.timestamp.toDate()
              ).toLocaleDateString(),
              time: new Date(
                messageData.timestamp.toDate()
              ).toLocaleTimeString(),
            },
          ],
        };
        setCurrentConversation(updatedConversation);
      }
    );

    return () => unsubscribe();
  }, [conversation, setCurrentConversation]);

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
              let name =
                senderData.firstName && senderData.lastName
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

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
    return date.toLocaleDateString("en-GB");
  };

  let currentDate = null;

  return (
    <div className="doctorbox-container" style={{ display: "flex", flexDirection: "column-reverse", height: "100%", overflowY: "auto" }}>
      <div className="">
        {conversation &&
          conversation.messages &&
          conversation.messages
            .filter((msg) => msg.time)
            .sort(compareTimeStamps)
            .map((msg, idx) => {
              const showDate = msg.date !== currentDate;
              currentDate = msg.date;
              let name;
              if (msg.sentBy === "company" || msg.sentBy === "user") {
                name = senderNames[msg.sentId] || "unknown";
              } else if (msg.sentBy === "admin") {
                name = "Admin";
              }
              return (
                <div key={idx}>
                  {showDate && (
                    <div className="mb-2 text-center text-gray-600">
                      {formatDate(msg.date)}
                    </div>
                  )}
                  <div
                    className={`mb-2 ${
                      msg.sentBy === "company" ? "text-left" : "text-right"
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        msg.sentBy === "company"
                          ? "bg-gray-200"
                          : "bg-[#8697C4] text-white"
                      }`}
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
      </div>
    </div>
  );
};

export default Doctorbox;
