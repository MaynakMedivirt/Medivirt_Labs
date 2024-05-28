import React from "react";

const FilterMenu = ({
  allSpecialists,
  allLocations,
  selectedSpecialists,
  setSelectedSpecialists,
  selectedLocations,
  setSelectedLocations,
  searchQuery,
  setSearchQuery,
  drawerOpen,
  setDrawerOpen,
}) => {
  return (
    <div className={`lg:w-1/4 p-4 ${drawerOpen ? "block" : "hidden"} md:block`}>
      <div className="bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-2">Filter By Specialist</h2>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={selectedSpecialists.length === 0}
              onChange={() => setSelectedSpecialists([])}
              className="cursor-pointer"
            />
            <span onClick={() => setSelectedSpecialists([])} className="cursor-pointer">
              All
            </span>
          </div>
          {allSpecialists.map((specialist, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedSpecialists.includes(specialist)}
                onChange={() =>
                  setSelectedSpecialists((prev) =>
                    prev.includes(specialist)
                      ? prev.filter((item) => item !== specialist)
                      : [...prev, specialist]
                  )
                }
                className="cursor-pointer"
              />
              <span
                onClick={() =>
                  setSelectedSpecialists((prev) =>
                    prev.includes(specialist)
                      ? prev.filter((item) => item !== specialist)
                      : [...prev, specialist]
                  )
                }
                className="cursor-pointer"
              >
                {specialist}
              </span>
            </div>
          ))}
        </div>
        <hr className="my-4" />
        <h2 className="text-lg font-semibold mb-2">Filter By Location</h2>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={selectedLocations.length === 0}
              onChange={() => setSelectedLocations([])}
              className="cursor-pointer"
            />
            <span onClick={() => setSelectedLocations([])} className="cursor-pointer">
              All
            </span>
          </div>
          {allLocations.map((location, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() =>
                  setSelectedLocations((prev) =>
                    prev.includes(location)
                      ? prev.filter((item) => item !== location)
                      : [...prev, location]
                  )
                }
                className="cursor-pointer"
              />
              <span
                onClick={() =>
                  setSelectedLocations((prev) =>
                    prev.includes(location)
                      ? prev.filter((item) => item !== location)
                      : [...prev, location]
                  )
                }
                className="cursor-pointer"
              >
                {location}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
