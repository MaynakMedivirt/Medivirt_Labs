import React, { useState, useEffect } from "react";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import DoctorSide from "./DoctorSide";
import DoctorNavbar from "./DoctorNavbar";

const DoctorSetting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIFSCCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankSuccess, setBankSuccess] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePasswordSubmit = async (e) => {
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

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const bankDetailsDocRef = doc(db, "bankDetails", user.uid);

      try {
        await setDoc(bankDetailsDocRef, {
          bankName,
          accountNumber,
          ifscCode,
          accountHolderName,
        });

        setBankSuccess("Bank details added successfully!");
        setIsEditMode(false);
        fetchBankDetails(); // Fetch updated bank details
      } catch (error) {
        setError(error.message);
        console.error("Error adding bank details: ", error);
      }
    } else {
      setError("No user is signed in.");
    }
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const bankDetailsDocRef = doc(db, "bankDetails", user.uid);

      try {
        await setDoc(bankDetailsDocRef, {
          bankName,
          accountNumber,
          ifscCode,
          accountHolderName,
        });

        setBankSuccess("Bank details updated successfully!");
        setIsEditMode(false);
        fetchBankDetails(); // Fetch updated bank details
      } catch (error) {
        setError(error.message);
        console.error("Error updating bank details: ", error);
      }
    } else {
      setError("No user is signed in.");
    }
  };

  const fetchBankDetails = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const bankDetailsDocRef = doc(db, "bankDetails", user.uid);

      try {
        const docSnapshot = await getDoc(bankDetailsDocRef);
        if (docSnapshot.exists()) {
          setBankDetails(docSnapshot.data());
        } else {
          setBankDetails(null);
        }
      } catch (error) {
        setError("Error fetching bank details");
        console.error("Error fetching bank details: ", error);
      }
    } else {
      setError("No user is signed in.");
    }
  };

  const handleEditClick = () => {
    if (bankDetails) {
      setBankName(bankDetails.bankName);
      setAccountNumber(bankDetails.accountNumber);
      setIFSCCode(bankDetails.ifscCode);
      setAccountHolderName(bankDetails.accountHolderName);
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setBankName("");
    setAccountNumber("");
    setIFSCCode("");
    setAccountHolderName("");
    setIsEditMode(false);
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <DoctorNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-margin duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="flex flex-col p-4 md:flex-row">
            <div className="md:w-[40vw] pr-0 md:pr-4 mb-4 md:mb-0">
              <div className="bg-white shadow-lg rounded-lg">
                <div className="bg-[#8697C4] text-white p-4">
                  <h1 className="text-2xl font-bold">Change Your Password</h1>
                </div>
                <form onSubmit={handlePasswordSubmit} className="p-4">
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
                      className="bg-[#4f46e5] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="md:w-[60vw] pl-0 md:pl-4">
              <div className="bg-white shadow-lg rounded-lg">
                <div className="bg-[#8697C4] text-white p-4">
                  <h1 className="text-2xl font-bold">
                    {isEditMode ? "Edit Your Bank Details" : "Add Your Bank Details"}
                  </h1>
                </div>
                <form onSubmit={isEditMode ? handleBankUpdate : handleBankSubmit} className="p-4">
                  <div className="mb-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="bankName"
                      >
                        Bank Name
                      </label>
                      <input
                        type="text"
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          bankDetails && !isEditMode ? 'cursor-not-allowed' : ''
                        }`}
                        disabled={!isEditMode}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="accountHolderName"
                      >
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        id="accountHolderName"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          bankDetails && !isEditMode ? 'cursor-not-allowed' : ''
                        }`}
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="accountNumber"
                    >
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        bankDetails && !isEditMode ? 'cursor-not-allowed' : ''
                      }`}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="ifscCode"
                    >
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      value={ifscCode}
                      onChange={(e) => setIFSCCode(e.target.value)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        bankDetails && !isEditMode ? 'cursor-not-allowed' : ''
                      }`}
                      disabled={!isEditMode}
                    />
                  </div>
                  {bankSuccess && (
                    <p className="text-green-500 text-xs italic mb-4">{bankSuccess}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-[#4f46e5] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      {isEditMode ? "Update Bank Details" : "Add Bank Details"}
                    </button>
                    {isEditMode ? (
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="bg-[#4f46e5] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleEditClick}
                      >
                        Edit Details
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          {bankDetails && (
            <div className="p-4 bg-white shadow-lg rounded-lg mt-4">
              <h2 className="text-xl font-bold mb-4">Your Bank Details</h2>
              <p>
                <strong>Bank Name:</strong> {bankDetails.bankName}
              </p>
              <p>
                <strong>Account Holder Name:</strong> {bankDetails.accountHolderName}
              </p>
              <p>
                <strong>Account Number:</strong> {bankDetails.accountNumber}
              </p>
              <p>
                <strong>IFSC Code:</strong> {bankDetails.ifscCode}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSetting;

