"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Menggunakan useRouter dari Next.js
import Link from "next/link"; // Menggunakan Link dari Next.js
import { sidebarData } from "./datasidebar"; // Your sidebar data
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"; // Import the right chevron icon

const CustomSidebar = () => {
  const [isClient, setIsClient] = useState(false); // Menyimpan status client-side rendering
  const [openDropdown, setOpenDropdown] = useState(null); // State to manage which dropdown is open

  // Cek jika halaman sedang dirender di client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Jika bukan client-side, kembalikan null (tidak merender)
  if (!isClient) {
    return null;
  }

  // Toggle dropdown
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <aside id="sidebar-multi-level-sidebar" aria-label="Sidebar" className="bg-gray-100"> {/* Set background to light gray */}
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {sidebarData.map((item, index) => (
            <li key={index}>
              {/* Check if the item has a dropdown */}
              {item.dropdown ? (
                <div>
                  {/* Main label and icon */}
                  <div
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group cursor-pointer"
                    onClick={() => toggleDropdown(index)} // Toggle dropdown on click
                  >
                    <item.icon className="mr-3" />
                    <span>{item.label}</span>

                    {/* Chevron icon (right) */}
                    <FontAwesomeIcon icon={faChevronRight} className="ml-auto w-5 h-5 text-gray-500" />
                  </div>
                  {/* Dropdown menu, only show if openDropdown matches the current item index */}
                  {openDropdown === index && (
                    <ul className="space-y-2 pl-4">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link
                            href={child.to}
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                          >
                            {child.icon && <child.icon className="mr-3" />}
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.to}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <item.icon className="mr-3" />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default CustomSidebar;
