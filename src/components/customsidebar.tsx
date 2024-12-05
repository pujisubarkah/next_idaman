"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Menggunakan Link dari Next.js
import { sidebarData } from "./datasidebar"; // Your sidebar data
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"; // Import the right chevron icon

const CustomSidebar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Assuming the role_id is saved in localStorage or context after login
    const storedRoleId = JSON.parse(localStorage.getItem("user") || "{}")?.role_id;
    if (storedRoleId) {
      setRoleId(storedRoleId); // Set the user's role ID
    }
  }, []);

  if (!isClient || roleId === null) {
    return null; // Return null if the role ID is not yet available
  }

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Filter sidebar data based on role_id
  const filteredSidebarData = sidebarData.filter(item => {
    // Check if the item's required role matches the user's role
    if (item.roles && !item.roles.includes(roleId)) {
      return false; // Don't show this item if the role doesn't match
    }
    return true;
  });

  return (
    <aside id="sidebar-multi-level-sidebar" aria-label="Sidebar" className="bg-gray-100">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {filteredSidebarData.map((item, index) => (
            <li key={index}>
              {item.dropdown ? (
                <div>
                  <div
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    {item.icon && <item.icon className="mr-3" />}
                    <span>{item.label}</span>
                    <FontAwesomeIcon icon={faChevronRight} className="ml-auto w-5 h-5 text-gray-500" />
                  </div>
                  {openDropdown === index && (
                    <ul className="space-y-2 pl-4">
                      {item.children?.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link
                            href={child.to}
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                          >
                            {"icon" in child && child.icon && React.createElement(child.icon, { className: "mr-3" })}
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
                  {item.icon && <item.icon className="mr-3" />}
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
