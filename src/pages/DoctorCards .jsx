import React from "react";
import defaultAvatar from "../assets/img/defaultAvatar.png";

const DoctorCards = ({
  currentDoctors,
  handleViewProfile,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  return (
    <div className="w-full lg:w-3/4 px-4 mt-4">
      <div
        className="overflow-auto"
        style={{ maxHeight: "calc(100vh - 90px)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {currentDoctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200  shadow flex flex-col items-center text-center"
            >
              <img
                loading="lazy"
                src={doctor.image || defaultAvatar}
                alt={`Profile of ${doctor.name}`}
                className="items-center aspect-square w-[90px] mt-3 rounded-full"
              />
              <div className="p-5">
                <div className="self-center text-sm font-bold leading-7 underline">
                  {doctor.name}
                </div>
                <div className="mt-3">
                  <div className="justify-center py-1 text-sm leading-9 bg-violet-100 max-md:px-5">
                    {doctor.specialist}
                  </div>
                </div>
                <div className="justify-center leading-7 mt-2 border-t border-gray-200 border-solid max-md:pr-5 max-md:pl-7">
                  <span className="">Location:</span>
                  <span className="">{doctor.location}</span>
                </div>
                <button
                  onClick={() => handleViewProfile(doctor)}
                  className="justify-center px-2 py-1 mt-3 font-semibold text-white capitalize bg-indigo-800 tracking-[2px] max-md:px-5 hover:bg-indigo-600"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-start pl-5 mt-4 mb-4 overflow-x-auto">
        {currentPage > 5 && (
          <button
            onClick={() => {
              setCurrentPage(currentPage - 5);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-3 py-2 bg-white text-neutral-800 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mr-2"
          >
            &lt;
          </button>
        )}
        {Array.from(
          { length: totalPages },
          (_, index) =>
            index >= currentPage - 3 &&
            index < currentPage + 2 && (
              <button
                key={index}
                onClick={() => {
                  setCurrentPage(index + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-2 ${
                  currentPage === index + 1
                    ? "bg-indigo-400 text-white"
                    : "bg-white text-neutral-800"
                } rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mx-1`}
              >
                {index + 1}
              </button>
            )
        )}
        {currentPage <= totalPages - 5 && (
          <button
            onClick={() => {
              setCurrentPage(currentPage + 5);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-3 py-2 bg-white text-neutral-800 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ml-2"
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCards;
