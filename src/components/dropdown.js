"use client";

import React, { useState } from "react";

const StylishAccordionDropdown = ({ label, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Header Dropdown */}
      <div
        className="cursor-pointer flex items-center justify-between p-3 rounded-md hover:bg-gray-200 transition-all"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          {Icon && <Icon className="mr-3 text-teal-500" size={20} />}
          <span className="font-medium text-gray-700">{label}</span>
        </div>
        <span
          className={`transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </div>

      {/* Dropdown Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="mt-2 pl-8 space-y-2">
          {children.map((child, index) => (
            <li key={index} className="flex items-center p-2 text-sm font-medium text-black rounded-md transition-all">
              <span className="font-medium text-gray-700">{child.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StylishAccordionDropdown;
