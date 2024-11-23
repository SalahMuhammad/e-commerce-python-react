import React, { useState } from 'react';
// import { ChevronDown } from 'lucide-react';

const Dropdown = ({ items = [], placeholder = "Select an option", onSelect = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div className="relative w-64">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
      >
        <span className={selected ? "text-gray-900" : "text-gray-500"}>
          {selected || placeholder}
        </span>
        {/* <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        /> */}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {items.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
                onClick={() => handleSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Example usage component
const Example = () => {
  const options = [
    "Product Design",
    "Software Development",
    "Digital Marketing",
    "Customer Support",
    "Sales",
    "Human Resources"
  ];

  const handleSelect = (value) => {
    console.log("Selected:", value);
  };

  return (
    <div className="p-4">
      <Dropdown
        items={options}
        placeholder="Select a department"
        onSelect={handleSelect}
      />
    </div>
  );
};

export default Dropdown;