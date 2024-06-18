import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Navigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  getStorage,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import "firebase/storage";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { useAuth } from "../AuthContext";
import { useDropzone } from "react-dropzone";
import { IoMdArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDoctor = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const storage = getStorage();
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAuth();
  const db = getFirestore();

  const fetchDoctor = async () => {
    try {
      const doctorRef = doc(db, "doctors", id);
      const docSnap = await getDoc(doctorRef);
      if (docSnap.exists()) {
        setDoctor({ id: docSnap.id, ...docSnap.data() });
        if (docSnap.data().image) {
          const imageUrl = await getDownloadURL(
            ref(storage, docSnap.data().image)
          );
          setImageUrl(imageUrl);
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id, storage]);

  const handleImageUpload = async (acceptedFile) => {
    const file = acceptedFile;
    setImageFile(file);
    const storageRef = ref(storage, `images/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error (e.g., show toast)
    }
  };

  const handleImageRemove = async () => {
    try {
      if (doctor.image) {
        await deleteObject(ref(storage, doctor.image));
        setImageUrl(null);
        
        toast.error("Image removed successfully!", {
          // position: toast,
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error removing image:", error);
      // Handle error (e.g., show toast)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const doctorRef = doc(db, "doctors", id);
      const newData = {
        ...doctor,
      };

      if (imageFile) {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);
        newData.image = `images/${imageFile.name}`;
      } else if (!imageUrl) {
        newData.image = ""; // Handle if no image uploaded or removed
      }

      await updateDoc(doctorRef, newData);
      
      toast.success("Data updated successfully!", {
        // position: toast,
        autoClose: 2000,
      });
      
      navigate("/admin/doctors");
    } catch (error) {
      console.error("Error updating document:", error);
      // Handle error (e.g., show toast)
    }
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

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
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
                  Edit Doctor
                </h2>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={doctor.name}
                    onChange={(e) =>
                      setDoctor({ ...doctor, name: e.target.value })
                    }
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
                    value={doctor.gender}
                    onChange={(e) =>
                      setDoctor({ ...doctor, gender: e.target.value })
                    }
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
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                    value={doctor.email}
                    onChange={(e) =>
                      setDoctor({ ...doctor, email: e.target.value })
                    }
                    placeholder=" "
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
                    value={doctor.specialist}
                    onChange={(e) =>
                      setDoctor({ ...doctor, specialist: e.target.value })
                    }
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
                    value={doctor.currentPosition}
                    onChange={(e) =>
                      setDoctor({ ...doctor, currentPosition: e.target.value })
                    }
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
                    value={doctor.location}
                    onChange={(e) =>
                      setDoctor({ ...doctor, location: e.target.value })
                    }
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

              <div className="mb-4">
                <label htmlFor="image" className="text-sm font-bold">
                  Image Upload
                </label>
                <div
                  {...getRootProps()}
                  className="dropzone border-dashed border-2 border-gray-300 rounded-lg p-4 mb-6 text-center cursor-pointer relative"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here...</p>
                  ) : (
                    <p>Drag 'n' drop a file here, or click to select files</p>
                  )}
                  {imageUrl && (
                    <div className="relative z-0 w-full mt-4">
                      <img
                        src={imageUrl}
                        alt="Uploaded"
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
                  value={doctor.about}
                  onChange={(e) =>
                    setDoctor({ ...doctor, about: e.target.value })
                  }
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
                  value={doctor.experience_1}
                  onChange={(e) =>
                    setDoctor({ ...doctor, experience_1: e.target.value })
                  }
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
                  value={doctor.experience_2}
                  onChange={(e) =>
                    setDoctor({ ...doctor, experience_2: e.target.value })
                  }
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
                  value={doctor.experience_3}
                  onChange={(e) =>
                    setDoctor({ ...doctor, experience_3: e.target.value })
                  }
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
                  value={doctor.education_1}
                  onChange={(e) =>
                    setDoctor({ ...doctor, education_1: e.target.value })
                  }
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
                  value={doctor.education_2}
                  onChange={(e) =>
                    setDoctor({ ...doctor, education_2: e.target.value })
                  }
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
                  value={doctor.education_3}
                  onChange={(e) =>
                    setDoctor({ ...doctor, education_3: e.target.value })
                  }
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
                    value={doctor.comment}
                    onChange={(e) =>
                      setDoctor({ ...doctor, comment: e.target.value })
                    }
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
                    value={doctor.other}
                    onChange={(e) =>
                      setDoctor({ ...doctor, other: e.target.value })
                    }
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
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default EditDoctor;
