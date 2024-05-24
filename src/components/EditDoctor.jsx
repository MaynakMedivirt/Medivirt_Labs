import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Navigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, getStorage, deleteObject, uploadBytes } from "firebase/storage";
import "firebase/storage";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { useAuth } from './AuthContext';


const EditDoctor = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const storage = getStorage();
    const navigate = useNavigate();
    const { isAdminLoggedIn } = useAuth()


    const fetchDoctor = async () => {
        try {
            const db = getFirestore();
            const doctorRef = doc(db, "doctors", id);
            const docSnap = await getDoc(doctorRef);
            if (docSnap.exists()) {
                setDoctor({ id: docSnap.id, ...docSnap.data() });
                if (docSnap.data().image) {
                    const imageUrl = await getDownloadURL(ref(storage, docSnap.data().image));
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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleImageRemove = async () => {
        try {
            if (doctor.image) {
                await deleteObject(ref(storage, doctor.image));
                setImageUrl(null);
                alert("Removing your image...");
            }
        } catch (error) {
            console.error("Error removing image:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const db = getFirestore();
            const doctorRef = doc(db, "doctors", id);
            const newData = {
                ...doctor,
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

            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
            navigate('/admin/doctors');

            // fetchDoctor();
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };
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
                            <h2 className="text-center text-3xl font-bold my-5">
                                Edit Doctor
                            </h2>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={doctor.name}
                                        onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
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
                                        onChange={(e) => setDoctor({ ...doctor, gender: e.target.value })}
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
                                        onChange={(e) => setDoctor({ ...doctor, email: e.target.value })}
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
                                        onChange={(e) => setDoctor({ ...doctor, specialist: e.target.value })}
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
                                    <select
                                        name="location"
                                        id="location"
                                        value={doctor.location}
                                        onChange={(e) => setDoctor({ ...doctor, location: e.target.value })}
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
                            <div className="relative z-0 w-full mb-6 group">
                                <input
                                    type="text"
                                    name="currentPosition"
                                    id="currentPosition"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                    value={doctor.currentPosition}
                                    onChange={(e) => setDoctor({ ...doctor, currentPosition: e.target.value })}
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
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="image"
                                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Image
                                </label>
                            </div>
                            {imageUrl && (
                                <div className="mb-6">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                                    />
                                    <button
                                        onClick={handleImageRemove}
                                        className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm py-2 px-4 mt-2"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            )}
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                            {/* Image preview */}
                            {/* <div className="flex justify-center items-center">
                                    {image && (
                                        <img
                                            src={image}
                                            alt="Doctor"
                                            className="rounded-full border"
                                            style={{ width: "100px", height: "100px" }}
                                        />
                                    )}
                                </div> */}

                            {/* Upload/change image input */}
                            {/* <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="image"
                                        id="image"
                                        className=""
                                        onChange={handleImageChange}
                                    />
                                    <label
                                        htmlFor="image"
                                        className="text-sm cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 block w-full text-center"
                                    >
                                        {image ? "Change Image" : "Upload Image"}
                                    </label>
                                </div>
                            </div> */}
                            <div className="relative z-0 w-full mb-6 group">
                                <textarea
                                    name="about"
                                    id="about"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                    value={doctor.about}
                                    onChange={(e) => setDoctor({ ...doctor, about: e.target.value })}
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
                                    onChange={(e) => setDoctor({ ...doctor, experience_1: e.target.value })}
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
                                    onChange={(e) => setDoctor({ ...doctor, experience_2: e.target.value })}
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
                                    onChange={(e) => setDoctor({ ...doctor, experience_3: e.target.value })}
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
                                    onChange={(e) => setDoctor({ ...doctor, education_1: e.target.value })}
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
                                    onChange={(e) => setDoctor({ ...doctor, education_2: e.target.value })}
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
                                    onChange={(e) => setDoctor({ ...doctor, education_3: e.target.value })}
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
                                        onChange={(e) => setDoctor({ ...doctor, comment: e.target.value })}
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
                                        onChange={(e) => setDoctor({ ...doctor, other: e.target.value })}
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
        </div>

    );
};

export default EditDoctor;
