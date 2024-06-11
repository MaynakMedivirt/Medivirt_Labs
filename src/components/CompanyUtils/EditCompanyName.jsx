import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, getStorage, deleteObject, uploadBytes } from "firebase/storage";
import "firebase/storage";
import CompanyNavbar from "./CompanyNavbar";
import CompanySide from "./CompanySide";
import { IoMdArrowBack } from "react-icons/io";

const EditCompanyName = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const storage = getStorage();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const db = getFirestore();
                const companyRef = doc(db, "companies", id);
                const docSnap = await getDoc(companyRef);
                if (docSnap.exists()) {
                    setCompany({ id: docSnap.id, ...docSnap.data() });
                    if (docSnap.data().image) {
                        const imageUrl = await getDownloadURL(ref(storage, docSnap.data().image));
                        setImageUrl(imageUrl);
                    }
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching company:", error);
            }
        };

        fetchCompany();
    }, [id, storage]);

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0]; // Ensure a file is selected
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.error("No file selected or invalid file type");
        }
    };

    const handleImageRemove = async () => {
        try {
            if (company.image) {
                await deleteObject(ref(storage, company.image));
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
            const companyRef = doc(db, "companies", id);
            const newData = {
                ...company,
            };

            if (imageFile) {
                const imageRef = ref(storage, `images/${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                const downloadURL = await getDownloadURL(imageRef);
                newData.image = downloadURL;
            } else if (!imageUrl) {
                newData.image = "";
            }

            await updateDoc(companyRef, newData);

            console.log("Document successfully updated!");
            alert("Data successfully updated!");

            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate(`/company/profile/${id}`);

        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col h-screen">
            <CompanyNavbar />
            <div className="flex flex-1 mt-[4.2rem]">
                <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-20'}`}>

                    <div className="container px-4 mx-auto my-10">
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
                                    <IoMdArrowBack className="h-6 w-6 font-bold text-[#3D52A1]" />
                                </button>
                                <h2 className="flex-grow text-2xl my-5 font-bold text-center uppercase">Edit Company Name</h2>
                            </div>

                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="mb-3">
                                    <label htmlFor="companyName" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Company Name :</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={company ? company.companyName : ''}
                                        onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                                        placeholder="Enter Company name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="location" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Location :</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={company ? company.location : ''}
                                        onChange={(e) => setCompany({ ...company, location: e.target.value })}
                                        placeholder="Enter Company location"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="image" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Image :</label>
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
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm py-2 px-4 mt-2"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            )}
                            <div className="flex justify-end items-center">
                                <button type="submit" className="flex gap-1.5 justify-center items-center px-10 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditCompanyName;
