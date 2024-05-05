import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "firebase/storage"

import Navbar from "./Navbar";
import Side from "./Side";

import { firebaseConfig } from '../components/firebase';

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const DocProfile = () => {

  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [location, setLocation]           = useState('');
  const [birthday, setBirthday]           = useState('');
  const [gender, setGender]               = useState('');
  const [specialist, setSpecialist]       = useState('');
  const [phone, setPhone]                 = useState('');
  const [education, setEducation]         = useState('');
  const [qualification, setQualification] = useState('');
  const [aboutMe, setAboutMe]             = useState('');
  const [imageUrl, setImageUrl]           = useState('');

  useEffect(() => {
    
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    // const storageRef = ref(storage, `images/${currentUser.uid}/${file.name}`);
    // try {
      // Upload file to Firebase Storage
    //   const uploadTaskSnapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
    //   const url = await getDownloadURL(uploadTaskSnapshot.ref);
      
      // Update the imageUrl state with the new URL
    //   setImageUrl(url);
    // } catch (error) {
    //   console.error('Error uploading image:', error);
    // }
  };

  return (
    <>
      <div className="flex">
        <Side />
        <div className="flex-1">
          <Navbar />
          <div className="container max-w-full mx-auto my-10 px-10">
            <form className="border p-5">
              <h1 className="text-center my-4 text-2xl font-bold">Profile</h1>
              <div className="flex flex-wrap mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block text-black font-bold"> Doctor Name:</label>
                  <input
                    type="text"
                    placeholder="Enter youe name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input mt-1 block w-full border border-black rounded-md"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block text-black font-bold">Email:</label>
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input mt-1 block w-full border border-black rounded-md"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block text-black font-bold">
                    Location:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-input mt-1 block w-full border border-black rounded-md"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block text-black font-bold">Birthday:</label>
                  <input
                    type="date"
                    placeholder="Enter your Birth-Date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="form-input mt-1 block w-full border border-black rounded-md"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block text-black font-bold">Gender:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-select mt-1 block w-full border border-black rounded-md"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block text-black font-bold">Profile Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="form-input mt-1 block w-full border border-black rounded-md"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block text-black font-bold">
                    Specialist:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Spaecialist"
                    value={specialist}
                    onChange={(e) => setSpecialist(e.target.value)}
                    className="form-input mt-1 block w-full border border-black rounded-md"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block text-black font-bold">
                    Phone:
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input mt-1 block w-full border border-black rounded-md"
                  />
                </div>
                <div className="w-full px-3 mb-6">
                  <label className="block text-black font-bold">Qualification:</label>
                  <textarea
                    placeholder="Tell us about your qualification..."
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="form-textarea mt-1 block w-full border border-black rounded-md"
                  ></textarea>
                </div>
                <div className="w-full px-3 mb-6">
                  <label className="block text-black font-bold">Education:</label>
                  <textarea
                    placeholder="Tell us about your education..."
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="form-textarea mt-1 block w-full border border-black rounded-md"
                  ></textarea>
                </div>
                <div className="w-full px-3 mb-6">
                  <label className="block text-black font-bold">About Me:</label>
                  <textarea
                    placeholder="Tell us something about yourself..."
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    className="form-textarea mt-1 block w-full border border-black rounded-md"
                  ></textarea>
                </div>
              </div>
                <div className="w-full text-center mb-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    // onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocProfile;
