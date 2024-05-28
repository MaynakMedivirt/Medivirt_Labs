// FilterMenu.js
import React from "react";

const FilterMenu = ({ allIndustries, selectedIndustries, setSelectedIndustries }) => {
  // Check if allIndustries is defined before rendering
  if (!Array.isArray(allIndustries) || allIndustries.length === 0) {
    return null; // Return null if allIndustries is not defined or empty
  }

  return (
    <div className="w-full lg:w-1/4 px-4 bg-gray-100 py-4 ml-2 hidden md:block">
      <div className="text-2xl font-bold font-sans leading-8 mb-4">
        Filter By Industry
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={selectedIndustries.length === 0}
            onChange={() => setSelectedIndustries([])}
            className="cursor-pointer"
          />
          <span
            onClick={() => setSelectedIndustries([])}
            className="cursor-pointer"
          >
            All
          </span>
        </div>
        {/* Render industries only if allIndustries is defined */}
        {allIndustries.map((industry, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={selectedIndustries.includes(industry)}
              onChange={() =>
                setSelectedIndustries((prev) =>
                  prev.includes(industry)
                    ? prev.filter((item) => item !== industry)
                    : [...prev, industry]
                )
              }
              className="cursor-pointer"
            />
            <span
              onClick={() =>
                setSelectedIndustries((prev) =>
                  prev.includes(industry)
                    ? prev.filter((item) => item !== industry)
                    : [...prev, industry]
                )
              }
              className="cursor-pointer"
            >
              {industry}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterMenu;
