import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, getStorage, deleteObject, uploadBytes } from "firebase/storage";
import { useAuth } from './AuthContext';
import { getAuth, signOut } from "firebase/auth";

const ProfileComplete = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const storage = getStorage();
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const auth = getAuth();

    const navigate = useNavigate();

    const fetchCompanyProfile = async () => {
        try {
            const db = getFirestore();
            const companyRef = doc(db, "companies", id);
            const docSnap = await getDoc(companyRef);
            if (docSnap.exists()) {
                setCompany({ id: docSnap.id, ...docSnap.data() });
                if (docSnap.data().image) {
                    const url = await getDownloadURL(ref(storage, docSnap.data().image));
                    setImageUrl(url);
                }
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching company:", error);
        }
    };

    useEffect(() => {
        fetchCompanyProfile();
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
            const companyRef = doc(db, "companies", id);
            const newData = {
                ...company,
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

            await updateDoc(companyRef, newData);

            console.log("Document successfully updated!");
            alert("Data successfully updated!");

            signOut(auth).then(() => {
                navigate('/login');
            }).catch((error) => {
                console.error("Error signing out:", error);
            });

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    if (!company) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container text-black mx-auto my-5 px-10">
            <div className="w-full max-w-2xl mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
                >
                    <h2 className="text-center text-3xl font-bold my-5">
                        Update Company Profile
                    </h2>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="mb-3">
                            <label htmlFor="companyName" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Company Name :</label>
                            <input
                                type="text"
                                name="companyName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={company.companyName || ''}
                                onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                                placeholder="Enter Company name"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Representative Name :</label>
                            <input
                                type="text"
                                name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={company.name || ''}
                                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                placeholder="Enter Representative name"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Email :</label>
                            <input
                                type="email"
                                name="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={company.email || ''}
                                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Phone Number :</label>
                            <input
                                type="tel"
                                name="phone"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={company.phone || ''}
                                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
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
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="about" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">About Company :</label>
                        <textarea
                            name="about"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={company.about || ''}
                            onChange={(e) => setCompany({ ...company, about: e.target.value })}
                            placeholder="Enter about company"
                            required
                        />
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="mb-3">
                            <label htmlFor="location" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Location :</label>
                            <input
                                type="text"
                                name="location"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={company.location || ''}
                                onChange={(e) => setCompany({ ...company, location: e.target.value })}
                                placeholder="Enter location"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="headquarter" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Headquarter :</label>
                            <input
                                type="text"
                                name="headquarter"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={company.headquarter || ''}
                                onChange={(e) => setCompany({ ...company, headquarter: e.target.value })}
                                placeholder="Enter headquarter"
                            // required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category" className="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">Category :</label>
                            <input
                                type="text"
                                name="category"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={company.category || ''}
                                onChange={(e) => setCompany({ ...company, category: e.target.value })}
                                placeholder="Enter category"
                            // required
                            />
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <button
                            type="submit"
                            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                        >
                            UPDATE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileComplete;
