import React, { useState } from "react";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import MrNavbar from "./MrNavbar";
import MrSide from "./MrSide";

const MrSetting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setSuccess("Password reset successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("No user is signed in.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <MrNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <MrSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-margin duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
              <h1 className="text-2xl font-bold mb-4">Mr. Password Change</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="oldPassword"
                  >
                    Old Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-xs italic mb-4">{error}</p>
                )}
                {success && (
                  <p className="text-green-500 text-xs italic mb-4">{success}</p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MrSetting;