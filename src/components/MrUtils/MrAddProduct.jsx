import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MrSide from './MrSide';
import MrNavbar from './MrNavbar';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "firebase/storage";
import { IoMdArrowBack } from "react-icons/io";

import { firebaseConfig } from "../firebase";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const MrAddProduct = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [productName, setProductName] = useState("");
    const [productDetails, setProductDetails] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [companyId, setCompanyId] = useState("");
    const { id } = useParams();

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, "users", id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setCompanyId(userData.companyId);
                } else {
                    console.log("User document not found");
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
            }
        };
        fetchUser();
    }, [id, db]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const customId = `${productName}_${companyId}`;
            const customDocRef = doc(db, "products", customId);
            await setDoc(customDocRef, {
                productName,
                productDetails,
                image: imageUrl,
                companyId
            });

            console.log("Document Written with ID : ", customId);
            alert("Product added successfully!");

            setProductName("");
            setProductDetails("");
            setImageUrl("");

            setTimeout(() => {
                window.location.reload();
            }, 1000);

            navigate(`/mr/products/${id}`);

        } catch (error) {
            console.log("Error adding document :", error);
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            handleImageRemove();
            return;
        }
        const storageRef = ref(storage, `images/products/${file.name}`);
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

    return (
        <div className="flex flex-col h-screen">
            <MrNavbar />
            <div className="flex flex-1 mt-[4.2rem]">
                <MrSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
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
                                <h2 className="flex-grow text-[1.5rem] my-5 font-bold text-center uppercase">Add Product</h2>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="productName" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Product Name :</label>
                                <input
                                    type="text"
                                    name="productName"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Enter product name"
                                // required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Product Image :</label>
                                <input
                                    type="file"
                                    name="image"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
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
                            <div className="mb-3">
                                <label htmlFor="productDetails" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Product Details :</label>
                                <textarea
                                    type="text"
                                    name="productDetails"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2"
                                    value={productDetails}
                                    onChange={(e) => setProductDetails(e.target.value)}
                                    placeholder="Enter Product Details"
                                ></textarea>
                            </div>
                            <div className="text-center my-4">
                                <button
                                    type="submit"
                                    className="text-white font-bold rounded-lg bg-[#7191E6] hover:bg-[#3a60c6] px-4 py-2 hover:bg-[#7091E6] "
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MrAddProduct
