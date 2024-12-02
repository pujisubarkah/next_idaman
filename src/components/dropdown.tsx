"use client";

// Dropdown.js
import { useState } from "react";

const Dropdown = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <button type="button" onClick={toggleDropdown} className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
        {item.icon}
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{item.title}</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>
      {isOpen && item.submenu && (
        <ul className="py-2 space-y-2">
          {item.submenu.map((subitem, index) => (
            <li key={index}>
              <a href={subitem.link} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                {subitem.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;
