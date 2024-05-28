import React from "react";
import defaultAvatar from "../assets/img/defaultAvatar.png";

const CompanyCard = ({ company, handleViewProfile }) => {
  return (
    <div className="overflow-auto md:overflow-visible" style={{ maxHeight: "calc(100vh - 200px)" }}>
      <div className="bg-white border border-gray-200 rounded-lg shadow flex flex-col items-center text-center">
        <img
          loading="lazy"
          src={company.image || defaultAvatar}
          alt={`Logo of ${company.name}`}
          className="items-center aspect-square w-[90px] mt-3 rounded-full"
        />
        <div className="p-5">
          <div className="text-sm font-bold leading-7 underline">
            {company.name}
          </div>
          <div className="mt-3">
            <div className="py-1 text-sm leading-9 bg-violet-100 max-md:px-5">
              {company.industry}
            </div>
          </div>
          <div className="mt-2 border-t border-gray-200 max-md:pr-5 max-md:pl-7">
            <span className="text-sm">Location:</span>
            <span className="text-sm">{company.location}</span>
          </div>
          <button
            onClick={() => handleViewProfile(company)}
            className="px-2 py-1 mt-3 font-semibold text-white capitalize bg-indigo-800 tracking-[2px] max-md:px-5 hover:bg-indigo-600"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
