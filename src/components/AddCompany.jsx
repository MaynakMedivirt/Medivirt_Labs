import React, { useState } from "react";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { getFirestore, collection, addDoc, doc, setDoc, } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "firebase/storage";

import { firebaseConfig } from "../components/firebase";
import { useAuth } from './AuthContext';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const AddCompany = () => {
    const [companyName, setCompanyName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [about, setAbout] = useState("");
    const [location, setLocation] = useState("");
    const [headquarter, setHeadquarter] = useState("");
    const [category, setCategory] = useState("");
    const { isAdminLoggedIn } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const customId = `${name}_${companyName}`;
            const customDocRef = doc(db, "companies", customId);
            await setDoc(customDocRef, {
                companyName,
                name,
                email,
                phone,
                image: imageUrl,
                about,
                location,
                headquarter,
                category,
                role: "company",
                profileComplete: true,
            });

            console.log("Document Written with ID : ", customId);
            alert("Company added successfully!");

            // Clear the form fields after successful submission
            setCompanyName("");
            setName("");
            setEmail("");
            setPhone("");
            setImageUrl("");
            setAbout("");
            setLocation("");
            setHeadquarter("");
            setCategory("");

            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
            navigate('/admin/companies');
 

        } catch (error) {
            console.log("Error adding document :", error);
        }
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            handleImageRemove();
            return;
        }
        const storageRef = ref(storage, `images/companies/${file.name}`);
        try {
            const uploadTaskSnapshot = await uploadBytes(storageRef, file);

            const url = await getDownloadURL(uploadTaskSnapshot.ref);

            setImageUrl(url);

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
        const preview = document.getElementById("image-preview");
        preview.src = "";
        preview.style.display = "none";
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
                                ADD Company
                            </h2>
                            <div className="grid md:grid-cols-2 md:gap-6">
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="companyName"
                                        id="companyName"
                                        className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder=" "
                                        requ ired
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
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
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
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
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
                            {/* Image preview */}
                            <img
                                id="image-preview"
                                src=""
                                alt="Preview"
                                style={{
                                    display: "none",
                                    maxWidth: "100%",
                                    maxHeight: "200px",
                                }}
                            />
                            {/* Remove image button */}
                            {imageUrl && (
                                <button
                                    onClick={handleImageRemove}
                                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm py-2 px-4 mt-2"
                                >
                                    Remove Image
                                </button>
                            )}
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
                            <div className="grid md:grid-cols-2 md:gap-6">
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
                                <div className="relative z-0 w-full mb-6 group">
                                    <input
                                        type="text"
                                        name="headquarter"
                                        id="headquarter"
                                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                                        value={headquarter}
                                        onChange={(e) => setHeadquarter(e.target.value)}
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
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
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

export default AddCompany;
