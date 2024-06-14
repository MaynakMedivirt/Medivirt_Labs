import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DoctorNavbar from "./DoctorNavbar";
import DoctorSide from "./DoctorSide";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import Swal from "sweetalert2";
import Doctorbox from "./Doctorbox";
import "../style/Doctor.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaCommentSlash } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";

const DoctorMessage = () => {
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [currentConversation, setCurrentConversation] = useState(null);
  const [showDoctorbox, setShowDoctorbox] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleReplyMessageChange = (e) => {
    setReplyMessage(e.target.value);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Message cannot be empty!",
      });
      return;
    }

    try {
      const db = getFirestore();
      if (!currentConversation || !currentConversation.companyID) {
        throw new Error("Conversation or company ID not found.");
      }

      const replyData = {
        companyID: currentConversation.companyID,
        doctorID: id,
        messageId: currentConversation.messages[0].messageId,
        messages: replyMessage,
        sentBy: "doctor",
        timestamp: new Date(),
      };

      const customId = `${id}_${currentConversation.companyID}_${Date.now()}`;
      const customDocRef = doc(db, "messages", customId);
      await setDoc(customDocRef, replyData);

      setReplyMessage("");

      const timestamp = replyData.timestamp;
      const date = timestamp.toLocaleDateString();
      const time = timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMessage = {
        messageId: replyData.messageId,
        id: customId,
        message: replyData.messages,
        sentBy: replyData.sentBy,
        date,
        time,
      };

      setCurrentConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        recentMessage: {
          text: replyData.messages,
          isDoctor: true,
          date,
          time,
          timestamp,
        },
      }));

      // Update the main messages array to reflect the new message in the conversation
      setMessages((prevMessages) =>
        prevMessages.map((conv) =>
          conv.doctorID === currentConversation.doctorID &&
          conv.companyID === currentConversation.companyID
            ? {
                ...conv,
                messages: [...conv.messages, newMessage],
                recentMessage: {
                  text: replyData.messages,
                  isDoctor: true,
                  date,
                  time,
                  timestamp,
                },
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Error sending reply:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to send reply. Please try again.",
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const db = getFirestore();
      const messageRef = collection(db, "messages");
      let q = query(messageRef, where("doctorID", "==", id));

      const querySnapshot = await getDocs(q);
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const fetchCompanyData = async (companyID) => {
          const companyDocRef = doc(db, "companies", companyID);
          const companyDocSnapshot = await getDoc(companyDocRef);
          if (companyDocSnapshot.exists()) {
            return companyDocSnapshot.data();
          } else {
            console.error(`company with ID ${companyID} not found`);
            return null;
          }
        };

        const fetchAssignedData = async (messageId) => {
          let assignedName;

          try {
            const companyDocRef = doc(db, "companies", messageId);
            const companyDocSnapshot = await getDoc(companyDocRef);

            if (companyDocSnapshot.exists()) {
              assignedName = companyDocSnapshot.data().name;
            } else {
              const userDocRef = doc(db, "users", messageId);
              const userDocSnapshot = await getDoc(userDocRef);

              if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                assignedName = `${userData.firstName} ${userData.lastName}`;
              } else {
                console.error(`No document found with ID ${messageId}`);
              }
            }
          } catch (error) {
            console.error("Error fetching assigned data:", error);
          }

          return assignedName;
        };

        const groupedMessages = {};
        const promises = querySnapshot.docs.map(async (doc) => {
          const messageData = doc.data();
          const companyData = await fetchCompanyData(messageData.companyID);
          const assignedName = await fetchAssignedData(messageData.messageId);
          const companyName = companyData
            ? companyData.companyName
            : "Unknown Company Name";
          const representativeName = companyData
            ? companyData.name
            : "Unknown Name";

          const key = `${messageData.doctorID}_${messageData.companyID}`;
          if (!groupedMessages[key]) {
            groupedMessages[key] = {
              companyName,
              representativeName,
              assignedName,
              doctorID: messageData.doctorID,
              companyID: messageData.companyID,
              messages: [],
              recentMessage: {
                text: "",
                isCompany: false,
                date: "",
                time: "",
              },
            };
          }

          const timestamp = messageData.timestamp?.toDate();
          const date = timestamp ? timestamp.toLocaleDateString() : "N/A";
          const time = timestamp ? timestamp.toLocaleTimeString() : "N/A";

          groupedMessages[key].messages.push({
            messageId: messageData.messageId,
            id: doc.id,
            message: messageData.messages,
            sentBy: messageData.sentBy,
            sentId: messageData.sentId,
            date,
            time,
          });

          // Check if the current message is the most recent one
          if (
            !groupedMessages[key].recentMessage.timestamp ||
            timestamp > groupedMessages[key].recentMessage.timestamp
          ) {
            groupedMessages[key].recentMessage = {
              text: messageData.messages,
              isDoctor: messageData.sentBy === "doctor",
              date,
              time,
              timestamp,
            };
          }
        });

        await Promise.all(promises);

        // Convert groupedMessages object to array
        const messagesArray = Object.keys(groupedMessages).map(
          (key) => groupedMessages[key]
        );
        const sortedMessages = sortMessagesByTimestamp(messagesArray);
        setMessages(sortedMessages);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching schedule messages:", error);
    }
  };

  const sortMessagesByTimestamp = (messagesArray) => {
    return messagesArray.sort((a, b) => {
      const timestampA = a.recentMessage.timestamp;
      const timestampB = b.recentMessage.timestamp;
      if (timestampA && timestampB) {
        return timestampB - timestampA;
      }
      return 0;
    });
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  const handleReply = (conversation) => {
    setCurrentConversation(conversation);
    setShowDoctorbox(true);
  };

  const handleCloseChat = () => {
    setShowDoctorbox(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterMessages = (messages) => {
    return messages.filter((conversation) =>
      conversation.representativeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <DoctorNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div
            className="flex mt-5 px-3"
            style={{ maxHeight: "calc(100vh - 6rem)" }}
          >
            <div
              className={`conversation-list w-full md:w-1/3 ${
                showDoctorbox && "hidden md:block"
              }`}
              style={{ borderRadius: "5% 0 0 0", boxShadow: "0 0 4px #aeafb2" }}
            >
              <div style={{ background: "#8697C4", borderRadius: "0 0 0% 0" }}>
                <h2 className="text-[1.5rem] font-bold font-[K2D] text-center text-white py-4">
                  Chat
                </h2>
              </div>
              <div
                className="conversationlist-container px-2 overflow-y-auto"
                style={{
                  maxHeight: "calc(100vh - 10rem)",
                  overflowY: "auto",
                  background: "#F9F9FB",
                  borderRadius: "5% 0 0 0",
                }}
              >
                <div className="flex flex-col relative justify-center self-stretch border mt-2">
                  <div className="flex rounded-lg">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search Company..."
                      className="w-full px-3 py-2 border-b focus:outline-none focus:border-[#aeafb2]"
                    />
                    <button
                      type="button"
                      className="flex-shrink-0 inline-flex px-2 items-center bg-[#8697C4] text-white"
                    >
                      <IoSearchSharp />
                    </button>
                  </div>
                </div>
                {filterMessages(messages).map((conversation, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 border-b my-2 shadow-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => handleReply(conversation)}
                    style={{ background: "white" }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div
                          id="concomname"
                          className="font-bold text-gray-700"
                        >
                          {conversation.representativeName}
                        </div>
                        <div
                          id="conrecentmsg"
                          className="text-sm font-bold text-gray-600 mt-1"
                        >
                          {conversation.recentMessage.text}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 text-right">
                        <div>{conversation.recentMessage.date}</div>
                        <div>{conversation.recentMessage.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showDoctorbox && currentConversation ? (
              <div className="chatbox-container w-full md:w-2/3 flex flex-col border">
                <div className="shadow-lg p-4 flex items-center justify-between">
                  <h3 className="font-bold text-xl">
                    {currentConversation?.representativeName}
                  </h3>
                  <button
                    className="hover:text-gray-700"
                    onClick={handleCloseChat}
                  >
                    <IoIosCloseCircleOutline size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-[#fafafa] p-4 doctorbox-content">
                  <Doctorbox
                    conversation={currentConversation}
                    replyMessage={replyMessage}
                    handleReplyMessageChange={handleReplyMessageChange}
                    setCurrentConversation={setCurrentConversation}
                  />
                </div>
                <div className="px-2 py-2 border-t bg-white">
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="2"
                    placeholder="Type your message..."
                    value={replyMessage}
                    onChange={handleReplyMessageChange}
                  />
                  <button
                    className="bg-[#7191E6] text-white float-end px-4 py-2 rounded"
                    onClick={handleSendReply}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div
                id="hide-on-smallscreen"
                className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white rounded-lg shadow-lg m-2"
              >
                <FaCommentSlash className="text-gray-400 text-6xl mb-4" />
                <p className="text-lg font-semibold">No conversation found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Start a conversation by selecting a contact or sending a
                  message.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMessage;
