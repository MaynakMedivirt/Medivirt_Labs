import React, { useState, useEffect } from "react";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, getStorage, deleteObject, uploadBytes } from "firebase/storage";
import "firebase/storage";

import { firebaseConfig } from "../components/firebase";
import { useAuth } from './AuthContext';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const EditCompany = () => {
    const { id } = useParams();
    const [company, setCompany] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageMarkedForRemoval, setImageMarkedForRemoval] = useState(false);
    const navigate = useNavigate();
    const { isAdminLoggedIn } = useAuth();

    const fetchCompany = async () => {
        try {
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
            console.error("Error fetching Company:", error);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, [id]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleImageRemove = () => {
        setImageMarkedForRemoval(true);
        setImageUrl(null);
        setImageFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const companyRef = doc(db, "companies", id);
            const newData = {
                ...company,
            };

            if (imageFile) {
                const imageRef = ref(storage, `images/${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                const downloadURL = await getDownloadURL(imageRef);
                newData.image = downloadURL;
            } else if (imageMarkedForRemoval) {
                if (company.image) {
                    await deleteObject(ref(storage, company.image));
                }
                newData.image = "";
            }

            await updateDoc(companyRef, newData);

            console.log("Document successfully updated!");
            alert("Data successfully updated!");

            navigate('/admin/companies');
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    if (!isAdminLoggedIn) {
        return <Navigate to="/admin" />;
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
                                Edit Company
                            </h2>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="companyName"
                                        id="companyName"
                                        className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={company ? company.companyName : ''}
                                        onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="companyName"
                                        className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Company Name
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={company ? company.name : ''}
                                        onChange={(e) => setCompany({ ...company, name: e.target.value })}
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
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={company ? company.email : ''}
                                        onChange={(e) => setCompany({ ...company, email: e.target.value })}
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="email"
                                        className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Email
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={company ? company.phone : ''}
                                        onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="phone"
                                        className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Phone
                                    </label>
                                </div>
                            </div>
                            <div className="relative z-0 w-full mb-6 group">
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                    onChange={handleImageUpload}
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="image"
                                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Image
                                </label>
                            </div>
                            {imageUrl && (
                                <div className="relative z-0 w-full mb-6 group">
                                    <img src={imageUrl} alt="Company" className="mb-4" />
                                    <button
                                        type="button"
                                        className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
                                        onClick={handleImageRemove}
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            )}
                            <div className="relative z-0 w-full mb-6 group">
                                <textarea
                                    name="about"
                                    id="about"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                    value={company ? company.about : ''}
                                    onChange={(e) => setCompany({ ...company, about: e.target.value })}
                                    placeholder=" "
                                ></textarea>
                                <label
                                    htmlFor="about"
                                    className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    About
                                </label>
                            </div>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={company ? company.location : ''} 
                                        onChange={(e) => setCompany({ ...company, location: e.target.value })}
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="location"
                                        className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Location
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="headquarter"
                                        id="headquarter"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={company ? company.headquarter : ''}
                                        onChange={(e) => setCompany({ ...company, headquarter: e.target.value })}
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="headquarter"
                                        className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Headquarter
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="category"
                                        id="category"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={company ? company.category : ''}
                                        onChange={(e) => setCompany({ ...company, category: e.target.value })}
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="category"
                                        className="peer-focus:font-medium absolute text-sm text-black-800 dark:text-black-800 font-bold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                    >
                                        Category
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
    );
};

export default EditCompany;