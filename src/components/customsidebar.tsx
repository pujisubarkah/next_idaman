
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sidebarData } from "./datasidebar"; // File data menu
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"; // Ikon FontAwesome untuk dropdown

const CustomSidebar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);

  // Menangani role_id dan inisialisasi komponen
  useEffect(() => {
    setIsClient(true);

    // Mengambil role_id dari localStorage
    const storedUser = localStorage.getItem("user");
    const storedRoleId = storedUser ? JSON.parse(storedUser)?.role_id : null;

    if (storedRoleId) {
      setRoleId(Number(storedRoleId)); // Simpan role_id ke state
    }
  }, []);

  // Return null jika data belum siap
  if (!isClient || roleId === null) {
    return null;
  }

  // Fungsi toggle untuk dropdown
  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Filter menu sidebar berdasarkan role_id
  const filteredSidebarData = sidebarData.filter((item) => {
    return !item.roles || item.roles.includes(roleId.toString());
  });

  return (
    <aside className="sidebar bg-gray-100">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {filteredSidebarData.map((item, index) => (
            <li key={index}>
              {/* Menu dengan dropdown */}
              {item.dropdown ? (
                <div>
                  <div
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    {item.icon && React.createElement(item.icon as React.ComponentType<{ className: string }>, { className: "mr-3" })}
                    <span>{item.label}</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className={`ml-auto w-5 h-5 transition-transform ${
                        openDropdown === index ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  {openDropdown === index && (
                    <ul className="space-y-2 pl-4">
                      {item.children?.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link
                            href={child.to || "#"}
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                          >
                            {child.icon && React.createElement(child.icon as React.ComponentType<{ className: string }>, { className: "mr-3" })}
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Menu tanpa dropdown
                <Link
                  href={item.to || "#"}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  {item.icon && React.createElement(item.icon as React.ComponentType<{ className: string }>, { className: "mr-3" })}
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
