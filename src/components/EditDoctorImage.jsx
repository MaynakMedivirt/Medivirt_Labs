import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, getStorage, deleteObject, uploadBytes } from "firebase/storage";
import "firebase/storage";
import DoctorNavbar from './DoctorNavbar';
import DoctorSide from './DoctorSide';


const EditDoctorImage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const storage = getStorage();
    const navigate = useNavigate();


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
                console.log("No such document! ");
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
                const downloadURL = await getDownloadURL(imageRef); // Get the download URL
                newData.image = downloadURL; // Update newData.image with the download URL
            } else if (!imageUrl) {

                newData.image = "";
            }

            await updateDoc(doctorRef, newData);

            console.log("Document successfully updated!");
            alert("Data successfully updated!");
            // setDoctor(null);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate(`/doctor/profile/${id}`);

            // fetchDoctor();
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    return (
        <div className="flex flex-col h-screen">
            <DoctorNavbar />
            <div className="flex flex-1">
                <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>

                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
                        >
                            <h3 className="text-2xl px-3 my-5 font-bold">Edit Image</h3>
                            <div class="mb-5">
                                <label htmlFor="image" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Image :</label>
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
                                    <button
                                        onClick={handleImageRemove}
                                        className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm py-2 px-4 mt-2"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            )}
                            <div className="flex justify-end items-center">
                                <button type="submit" class="flex gap-1.5 justify-center items-center px-10 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5">save</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditDoctorImage;
