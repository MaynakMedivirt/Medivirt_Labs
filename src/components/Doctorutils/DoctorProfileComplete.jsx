import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  getStorage,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import { useAuth } from "../AuthContext";
import { getAuth, signOut } from "firebase/auth";

const DoctorProfileComplete = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const storage = getStorage();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const auth = getAuth();

  const navigate = useNavigate();

  const fetchDoctorProfile = async () => {
    try {
      const db = getFirestore();
      const doctorRef = doc(db, "doctors", id);
      const docSnap = await getDoc(doctorRef);
      if (docSnap.exists()) {
        setDoctor({ id: docSnap.id, ...docSnap.data() });
        if (docSnap.data().image) {
          const url = await getDownloadURL(ref(storage, docSnap.data().image));
          setImageUrl(url);
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, [id, storage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
    // setImageRemoved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const doctorRef = doc(db, "doctors", id);
      const newData = {
        ...doctor,
        profileComplete: true,
      };

      if (imageFile) {
        const imageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const downloadURL = await getDownloadURL(imageRef);
        newData.image = downloadURL;
      } else if (!imageUrl) {
        newData.image = "";
      }

      await updateDoc(doctorRef, newData);

      console.log("Document successfully updated!");
      alert("Data successfully updated!");

      signOut(auth)
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container text-black mx-auto my-5 px-10">
      <div className="w-full max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-center text-3xl font-bold my-5">
            Update Doctor Profile
          </h2>

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Name :
              </label>
              <input
                type="text"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.name || ""}
                onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                placeholder="Enter Doctor name"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="gender"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Gender :
              </label>
              <select
                name="gender"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.gender || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, gender: e.target.value })
                }
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label
                htmlFor="email"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Email :
              </label>
              <input
                type="text"
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.email || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, email: e.target.value })
                }
                placeholder="Enter Doctor Email"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="specialist"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Specialist :
              </label>
              <select
                name="specialist"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.specialist || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, specialist: e.target.value })
                }
                required
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
            </div>

            <div className="mb-3">
              <label
                htmlFor="currentPosition"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Current Position :
              </label>
              <input
                type="text"
                name="currentPosition"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.currentPosition || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, currentPosition: e.target.value })
                }
                placeholder="Enter Current Position"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="location"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Location :
              </label>
              <select
                name="location"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.location || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, location: e.target.value })
                }
                required
              >
                <option value="">Select Location</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="image"
              className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
            >
              Image :
            </label>
            <input
              type="file"
              name="image"
              id="image"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
          {imageUrl && (
            <div className="mb-6">
              <img
                src={imageUrl}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}

          <div className="mb-3">
            <label
              htmlFor="about"
              className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
            >
              About :
            </label>
            <textarea
              name="about"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={doctor.about || ""}
              onChange={(e) => setDoctor({ ...doctor, about: e.target.value })}
              placeholder="About Yourself "
              required
            />
          </div>

          <div>
            <div className="mb-3">
              <label
                htmlFor="education_1"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Education 1 :
              </label>
              <textarea
                name="education_1"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.education_1 || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, education_1: e.target.value })
                }
                placeholder="Enter Your Education "
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="education_2"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Education 2 :
              </label>
              <textarea
                name="education_2"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.education_2 || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, education_2: e.target.value })
                }
                placeholder="Enter Your Education "
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="education_3"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Education 3 :
              </label>
              <textarea
                name="education_3"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.education_3 || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, education_3: e.target.value })
                }
                placeholder="Enter Your Education "
              />
            </div>
          </div>

          <div>
            <div className="mb-3">
              <label
                htmlFor="experience_1"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Experience 1 :
              </label>
              <textarea
                name="experience_1"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.experience_1 || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, experience_1: e.target.value })
                }
                placeholder="Enter Your experience "
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="experience_2"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Experience 2 :
              </label>
              <textarea
                name="experience_2"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.experience_2 || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, experience_2: e.target.value })
                }
                placeholder="Enter Your experience "
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="experience_3"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Experience 3 :
              </label>
              <textarea
                name="experience_3"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.experience_3 || ""}
                onChange={(e) =>
                  setDoctor({ ...doctor, experience_3: e.target.value })
                }
                placeholder="Enter Your experience "
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="mb-3">
              <label
                htmlFor="comment"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Comment If Any :
              </label>
              <input
                type="text"
                name="comment"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.comment || ""}
                onChange={(e) => setDoctor({ ...doctor, comment: e.target.value })}
                placeholder="Enter Any Comment"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="other"
                className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
              >
                Other :
              </label>
              <input
                type="text"
                name="other"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={doctor.other || ""}
                onChange={(e) => setDoctor({ ...doctor, other: e.target.value })}
                placeholder="Other"
              />
            </div>
          </div>

          <div className="text-center mt-3">
            <button
              type="submit"
              className="text-white bg-[#7191E6] hover:bg-[#3D52A1] focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            >
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileComplete;
