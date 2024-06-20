import React, { useState, useEffect, useRef } from "react";
import { getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";
import { format, parse } from "date-fns";

const Doctorbox = ({ conversation, setCurrentConversation }) => {
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
          console.error(
            "No message data found for messageId:",
            firstMessage.messageId
          );
          return;
        }

        const newMessage = {
          messageId: messageData.messageId,
          sentId: messageData.sentId,
          id: doc.id,
          message: messageData.message,
          sentBy: messageData.sentBy,
          timestamp: messageData.timestamp,
          date: format(new Date(messageData.timestamp.toDate()), "dd/MM/yyyy"),
          time: format(new Date(messageData.timestamp.toDate()), "hh:mm:ss a"),
        };

        // Update messages with new message and sort
        const updatedMessages = [...conversation.messages, newMessage].sort(
          compareTimeStamps
        );

        // Update conversation state with updated messages
        setCurrentConversation({ ...conversation, messages: updatedMessages });
      },
      (error) => {
        console.error("Error fetching message:", error);
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
      const names = { ...senderNames };

      // Use Promise.all to await all sender name fetches
      await Promise.all(
        conversation.messages.map(async (msg) => {
          const { sentId } = msg;
          if (sentId && !names[sentId]) {
            try {
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
              } else {
                console.error(`Sender with ID ${sentId} not found.`);
                names[sentId] = "Unknown Sender";
              }
            } catch (error) {
              console.error("Error fetching sender name:", error);
              names[sentId] = "Unknown Sender";
            }
          }
        })
      );

      // Set senderNames state with updated names
      setSenderNames(names);
    }

    fetchSenderNames();
  }, [conversation, senderNames]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const compareTimeStamps = (msg1, msg2) => {
    const date1 = parse(msg1.date, "dd/MM/yyyy", new Date());
    const date2 = parse(msg2.date, "dd/MM/yyyy", new Date());

    if (date1.getTime() !== date2.getTime()) {
      return date1.getTime() - date2.getTime();
    } else {
      const time1 = parse(msg1.time, "hh:mm:ss a", new Date());
      const time2 = parse(msg2.time, "hh:mm:ss a", new Date());
      return time1.getTime() - time2.getTime();
    }
  };

  let currentDate = null;

  return (
    <div
      className="doctorbox-container"
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        height: "100%",
        overflowY: "auto",
      }}
    >
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
                name = senderNames[msg.sentId] || "Unknown Sender";
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Doctorbox;
