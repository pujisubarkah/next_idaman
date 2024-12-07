"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const menuData = [
    {
      label: "Data Pribadi",
      link: "#",
    },
    {
      label: "Arsip/Dokumen Digital",
      link: "#",
    },
    {
      label: "Riwayat Pengembangan Kompetensi",
      subMenu: [
        { label: "Pendidikan", link: "#" },
        { label: "Pelatihan Struktural", link: "/components/jft" },
        { label: "Pelatihan Fungsional", link: "#" },
      ],
    },
    {
      label: "Riwayat SDM",
      subMenu: [
        { label: "Riwayat Jabatan", link: "#" },
        { label: "Riwayat Kepangkatan", link: "#" },
      ],
    },
    {
      label: "Kinerja dan Prestasi",
      subMenu: [
        { label: "Sasaran Kerja", link: "#" },
        { label: "Penghargaan", link: "#" },
      ],
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-teal-200 via-teal-300 to-teal-400 p-4 shadow-lg rounded-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          {menuData.map((menu, index) => (
            <div key={index} className="relative">
              {menu.subMenu ? (
                <>
                  <button
                    className="flex items-center text-white hover:text-teal-800 bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-md transition duration-200 transform hover:scale-105"
                    onClick={() => toggleMenu(menu.label)}
                  >
                    {menu.label}
                    <FontAwesomeIcon
                      icon={activeMenu === menu.label ? faChevronUp : faChevronDown}
                      className="ml-2"
                    />
                  </button>
                  {activeMenu === menu.label && (
                    <ul className="absolute top-full left-0 bg-teal-50 mt-2 rounded-lg shadow-lg w-48">
                      {menu.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.link}
                            className="block px-4 py-2 text-teal-800 hover:bg-teal-200 transition duration-150"
                          >
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a
                  href={menu.link}
                  className="flex items-center text-white hover:text-teal-800 bg-teal-700 hover:bg-teal-600 px-4 py-2 rounded-md transition duration-200 transform hover:scale-105"
                >
                  {menu.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
