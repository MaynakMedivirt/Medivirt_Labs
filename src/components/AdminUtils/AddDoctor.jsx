import React, { useState, useCallback } from "react";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "firebase/storage";
import { useDropzone } from "react-dropzone";
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { firebaseConfig } from "../firebase";
import { useAuth } from "../AuthContext";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const AddDoctor = () => {
  const [name, setName] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [email, setEmail] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [experience_1, setExperience_1] = useState("");
  const [experience_2, setExperience_2] = useState("");
  const [experience_3, setExperience_3] = useState("");
  const [education_1, setEducation_1] = useState("");
  const [education_2, setEducation_2] = useState("");
  const [education_3, setEducation_3] = useState("");
  const [comment, setComment] = useState("");
  const [other, setOther] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gender, setGender] = useState("");
  const { isAdminLoggedIn } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const customId = `${name}_${location}`;
      const customDocRef = doc(db, "doctors", customId);
      await setDoc(customDocRef, {
        name,
        email,
        specialist,
        currentPosition,
        location,
        about,
        image: imageUrl,
        experience_1,
        experience_2,
        experience_3,
        education_1,
        education_2,
        education_3,
        comment,
        other,
        gender,
      });

      // alert("Doctor added successfully!");
      toast.success("Data added successfully!", {
        // position: toast,
        autoClose: 2000,
      });

      // Clear the form fields after successful submission
      setName("");
      setEmail("");
      setSpecialist("");
      setCurrentPosition("");
      setLocation("");
      setAbout("");
      setExperience_1("");
      setExperience_2("");
      setExperience_3("");
      setEducation_1("");
      setEducation_2("");
      setEducation_3("");
      setComment("");
      setOther("");
      setImageUrl("");
      setGender("");

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);

      // navigate("/admin/doctors");
    } catch (error) {
      console.log("Error adding document :", error);
    }
  };

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `images/doctors/${file.name}`);
    try {
      // Upload file to Firebase Storage
      const uploadTaskSnapshot = await uploadBytes(storageRef, file);

      // Get download URL
      const url = await getDownloadURL(uploadTaskSnapshot.ref);

      // Update the imageUrl state with the new URL
      setImageUrl(url);

      // Display image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById("image-preview");
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageRemove = () => {
    setImageUrl("");
    // Hide image preview
    const preview = document.getElementById("image-preview");
    preview.src = "";
    preview.style.display = "none";
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleImageUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    // Check if the inputValue already starts with "Dr. "
    if (inputValue.startsWith("Dr. ")) {
      setName(inputValue); // If it does, just update the state with the current input
    } else {
      setName(`Dr. ${inputValue}`); // Otherwise, add the prefix
    }
  };

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }
  return (
    <>
      <div className="flex">
        <AdminSide />
        <div className="flex-1 overflow-hidden">
          <AdminNavbar />
          <div className="container max-w-full text-black mx-auto my-5 px-10">
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
              >
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 bg-white shadow border rounded-full flex items-center justify-center"
                  >
                    <IoMdArrowBack className="h-6 w-6 font-bold text-[#8697C4]" />
                  </button>
                  <h2 className="flex-grow text-2xl my-5 font-bold text-center uppercase">
                    Add Doctor
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-6 group">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                      value={name}
                      onChange={handleNameChange}
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="name"
                      className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Name
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <select
                      name="gender"
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <label
                      htmlFor="gender"
                      className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Gender
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      // required
                    />
                    <label
                      htmlFor="email"
                      className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Email
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <select
                      name="specialist"
                      id="specialist"
                      value={specialist}
                      onChange={(e) => setSpecialist(e.target.value)}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    >
                      <option value="">Select Specialist</option>
                      <option value="Orthopaedic">Orthopaedic</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Gynaecologist">Gynaecologist</option>
                      <option value="Radiologist">Radiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Oncology">Oncology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Urology">Urology</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="Paediatric">Paediatric</option>
                    </select>
                    <label
                      htmlFor="name"
                      className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Specialist
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <input
                      type="text"
                      name="currentPosition"
                      id="currentPosition"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                      value={currentPosition}
                      onChange={(e) => setCurrentPosition(e.target.value)}
                      placeholder=" "
                    />
                    <label
                      htmlFor="currentPosition"
                      className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Current Position
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <select
                      name="location"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    >
                      <option value="">Select Location</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                    <label
                      htmlFor="location"
                      className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Location
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="image" className="text-sm font-bold">
                    Image Upload
                  </label>
                  <div
                    {...getRootProps()}
                    className="dropzone border-dashed border-2 border-gray-300 rounded-lg p-4 mb-6 text-center cursor-pointer relative"
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>
                        Drag 'n' drop an image here, or click to select an image
                      </p>
                    )}
                    {imageUrl && (
                      <div className="relative z-0 w-full mt-4">
                        <img
                          id="image-preview"
                          src={imageUrl}
                          alt="Image Preview"
                          style={{
                            display: "block",
                            maxHeight: "200px",
                            margin: "10px auto",
                            maxWidth: "100%",
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm py-2 px-4 mt-2"
                          >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-0 w-full mb-6 group">
                  <textarea
                    name="about"
                    id="about"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder=" "
                  ></textarea>
                  <label
                    htmlFor="about"
                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    About
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <textarea
                    name="experience_1"
                    id="experience_1"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={experience_1}
                    onChange={(e) => setExperience_1(e.target.value)}
                    placeholder=" "
                  ></textarea>
                  <label
                    htmlFor="experience_1"
                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Experience 1
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <textarea
                    name="experience_2"
                    id="experience_2"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={experience_2}
                    onChange={(e) => setExperience_2(e.target.value)}
                    placeholder=" "
                  ></textarea>
                  <label
                    htmlFor="experience_2"
                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Experience 2
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <textarea
                    name="experience_3"
                    id="experience_3"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={experience_3}
                    onChange={(e) => setExperience_3(e.target.value)}
                    placeholder=" "
                  ></textarea>
                  <label
                    htmlFor="experience_3"
                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Experience 3
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <textarea
                    name="education_1"
                    id="education_1"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={education_1}
                    onChange={(e) => setEducation_1(e.target.value)}
                    placeholder=" "
                  ></textarea>
                  <label
                    htmlFor="education_1"
                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Education 1
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <textarea
                    name="education_2"
                    id="education_2"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={education_2}
                    onChange={(e) => setEducation_2(e.target.value)}
                    placeholder=" "
                  ></textarea>
                  <label
                    htmlFor="education_2"
                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Education 2
                  </label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <textarea
                    name="education_3"
                    id="education_3"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={education_3}
                    onChange={(e) => setEducation_3(e.target.value)}
                    placeholder=" "
                  ></textarea>
                  <label
                    htmlFor="education_3"
                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Education 3
                  </label>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-6 group">
                    <input
                      type="text"
                      name="comment"
                      id="comment"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder=" "
                    />
                    <label
                      htmlFor="comment"
                      className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Comment If Any
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <input
                      type="text"
                      name="other"
                      id="other"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                      value={other}
                      onChange={(e) => setOther(e.target.value)}
                      placeholder=" "
                    />
                    <label
                      htmlFor="other"
                      className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Other
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
};

export default AddDoctor;
