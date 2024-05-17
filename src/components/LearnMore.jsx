import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

import Doctor_1 from '../assets/img/doctor p1.jpg';
import Doctor_2 from '../assets/img/doctor p2.jpg';
import Doctor_3 from '../assets/img/doctor p3.jpg';
import Doctor_4 from '../assets/img/doctor p4.jpg';
import Doctor_5 from '../assets/img/doctor p5.jpg';
import Doctor_6 from '../assets/img/doctor p6.jpg';
import Doctor_7 from '../assets/img/doctor p7.jpg';
import Doctor_8 from '../assets/img/doctor p8.jpg';
import Doctor_9 from '../assets/img/doctor p9.jpg';

import Company_1 from '../assets/img/company p1.jpg'
import Company_2 from '../assets/img/company p2.jpg'
import Company_3 from '../assets/img/company p3.jpg'
import Company_4 from '../assets/img/company p4.jpg'
import Company_5 from '../assets/img/company p5.jpg'
import Company_6 from '../assets/img/company p6.jpg'
import Company_7 from '../assets/img/company p7.jpg'
import Company_8 from '../assets/img/company p8.jpg'
import Company_9 from '../assets/img/company p9.jpg'

import Header from './Header'
import Footer from './Footer'

const LearnMore = () => {

    const [activeTab, setActiveTab] = useState("doctor");

    const doctorMenu = [
        {
            title: "Registration and Profile Setup:",
            image: Doctor_1,
            point_1: "Doctors register on the platform by providing professional credentials and relevant information.",
            point_2: "They create profiles detailing their specialties, areas of interest, and preferred meeting times."
        },
        {
            title: "Availability Management:",
            image: Doctor_2,
            point_1: "Doctors set their availability preferences indicating when they are open to virtual product presentations.",
            point_2: "They can adjust their availability based on their schedule and workload."
        },
        {
            title: "Meeting Requests Handling:",
            image: Doctor_3,
            point_1: "Doctors receive meeting requests from medical sales reps through the platform.",
            point_2: "They can review meeting details, including the product being presented and the agenda."
        },
        {
            title: "Confirmation or Rescheduling:",
            image: Doctor_4,
            point_1: "Doctors confirm or reschedule meetings based on their availability and interest in the presented product.",
            point_2: "They have the option to propose alternative meeting times if needed."
        },
        {
            title: "Virtual Meetings Participation:",
            image: Doctor_5,
            point_1: "Doctors join virtual meetings at the scheduled time through the platform.",
            point_2: "They actively engage in discussions with the medical sales rep, asking questions and providing feedback."
        },
        {
            title: "Document Review and Collaboration:",
            image: Doctor_6,
            point_1: "Doctors review product information and related documents shared by the sales rep during the meeting.",
            point_2: "They collaborate on documents in real-time, if necessary, to ensure a thorough understanding."
        },
        {
            title: "Post-Meeting Follow-up:",
            image: Doctor_7,
            point_1: "After the meeting, doctors may request additional information or clarification from the sales rep.",
            point_2: "They provide feedback on the presented product and meeting experience through the platform's feedback system."
        },
        {
            title: "Data Security and Compliance:",
            image: Doctor_8,
            point_1: "Doctors' sensitive information and company data are securely managed and protected in compliance with healthcare regulations.",
            point_2: "The platform ensures confidentiality and integrity of communication channels during virtual meetings."
        },
        {
            title: "Continuous Learning and Improvement:",
            image: Doctor_9,
            point_1: "Doctors may access resources and educational materials provided by the platform to stay informed about new products and advancements.",
            point_2: "They contribute to the platform's improvement by providing suggestions and insights based on their experiences."
        },
    ];

    const companyMenu = [
        {
            title: "Platform Enrollment:",
            image: Company_1,
            point_1: "Healthcare companies register on the platform by providing company information and product details.",
            point_2: "They create company profiles highlighting their offerings, target market, and sales objectives."
        },
        {
            title: "Representative Onboarding:",
            image: Company_2,
            point_1: "Medical sales representatives (reps) associated with the healthcare company register on the platform.",
            point_2: "They create individual profiles, detailing their experience, expertise, and product knowledge."
        },
        {
            title: "Product Presentation Setup:",
            image: Company_3,
            point_1: "Reps schedule virtual product presentations on the platform, specifying target doctor and objectives.",
            point_2: "They prepare presentation materials, including slides, brochures, and product samples."
        },
        {
            title: "Doctor Targeting:",
            image: Company_4,
            point_1: "Reps identify target doctors or healthcare professionals for each product presentation based on specialties and interests.",
            point_2: "They use platform features to filter and search for relevant contacts within the platform's network."
        },
        {
            title: "Meeting Coordination:",
            image: Company_5,
            point_1: "Reps send meeting invitations to targeted doctors through the platform, providing details about the product presentation.",
            point_2: "They manage meeting schedules and logistics to ensure smooth coordination."
        },
        {
            title: "Virtual Presentation Delivery:",
            image: Company_6,
            point_1: "Reps conduct virtual product presentations at the scheduled time using the platform's video conferencing tools.",
            point_2: "They showcase product features, benefits, and clinical evidence to engage the audience effectively."
        },
        {
            title: "Document Sharing and Follow-up:",
            image: Company_7,
            point_1: "During the presentation, reps share product-related documents and resources with doctors through the platform.",
            point_2: "They follow up with doctors post-presentation to address questions, provide additional information, and gather feedback."
        },
        {
            title: "Performance Monitoring:",
            image: Company_8,
            point_1: "Healthcare companies monitor the performance of their reps and product presentations through analytics provided by the platform.",
            point_2: "They track metrics such as meeting attendance, engagement levels, and conversion rates to assess effectiveness."
        },
        {
            title: "Compliance and Security:",
            image: Company_9,
            point_1: "Healthcare companies ensure compliance with regulatory requirements, such as HIPAA, in all interactions on the platform.",
            point_2: "They adhere to data security protocols to safeguard sensitive information shared during presentations."
        },
    ];

    return (
        <>
        <Header/>
        <div className="container my-5 m-auto">
            <div className="flex items-center justify-center">
                <h1
                    className={`text-xl px-2 py-1 font-semibold cursor-pointer ${activeTab === "doctor" ? "bg-[#11A798] text-white" : "bg-gray-500 text-white"} rounded-lg`}
                    onClick={() => setActiveTab("doctor")}
                >
                    Doctor
                </h1>
                <h1
                    className={`text-xl px-2 py-1 ml-5 font-semibold cursor-pointer ${activeTab === "company" ? "bg-[#11A798] text-white" : "bg-gray-500 text-white"} rounded-lg`}
                    onClick={() => setActiveTab("company")}
                >
                    Company
                </h1>
            </div>

            {activeTab === "doctor" && (
                <div className="mt-5">
                    <h1 className="text-center">OPERATIONAL PROCESS TAILORED SPECIFICALLY FOR DOCTORS:</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 my-5 gap-8">
                        {doctorMenu.map((doctorMenu, index) => (
                            <div key={index} className=" bg-white border border-gray-200 rounded-lg shadow flex flex-col items-center text-center hover:border-[#11A798] transition-all duration-300">
                                <div class="p-4">
                                    <h2 class=" font-semibold mb-4">{doctorMenu.title}</h2>
                                    <img src={doctorMenu.image} alt="Placeholder Image" class="w-full h-48 object-cover mb-4" />
                                    <ul class="list-disc pl-5">
                                        <li class="text-black">{doctorMenu.point_1}</li>
                                        <li className="text-black">{doctorMenu.point_2}</li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <h1 className="text-center text-lg font-bold">To Book Appointment!</h1>
                        <button class="p-4 mb-5 bg-[#11A798] text-white font-semibold rounded-full shadow-md hover:bg-[#288178] transform hover:scale-105 transition-transform duration-200 ease-in-out">
                            <FaPlus />
                        </button>


                    </div>
                </div>
            )}

            {activeTab === "company" && (
                <div className="mt-5">
                    <h1 className="text-center">OPERATIONAL PROCESS TAILORED SPECIFICALLY FOR COMPANIES:</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-5 gap-8">
                    {companyMenu.map((companyMenu, index) => (
                            <div key={index} className=" bg-white border border-gray-200 rounded-lg shadow flex flex-col items-center text-center  hover:border-[#11A798] transition-all duration-300">
                                <div class="p-4">
                                    <h2 class=" font-semibold mb-4">{companyMenu.title}</h2>
                                    <img src={companyMenu.image} alt="Placeholder Image" class="w-full h-48 object-cover mb-4" />
                                    <ul class="list-disc pl-5">
                                        <li class="text-black">{companyMenu.point_1}</li>
                                        <li className="text-black">{companyMenu.point_2}</li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <Footer />
        </>
    )
}

export default LearnMore