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
        { label: "Pelatihan Struktural", link: "#" },
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
    <nav className="bg-transparent p-4 shadow-md rounded-full">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          {menuData.map((menu, index) => (
            <div key={index} className="relative">
              {menu.subMenu ? (
                <>
                  <button
                    className="flex items-center text-black hover:bg-teal-100 px-3 py-2 rounded-full outline outline-2 outline-offset-2 outline-black skew-x-12"
                    onClick={() => toggleMenu(menu.label)}
                  >
                    {menu.label}
                    <FontAwesomeIcon
                      icon={activeMenu === menu.label ? faChevronUp : faChevronDown}
                      className="ml-2"
                    />
                  </button>
                  {activeMenu === menu.label && (
                    <ul className="absolute top-full left-0 bg-gray-200 mt-2 rounded-lg shadow-lg w-max">
                      {menu.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.link}
                            className="block px-4 py-2 text-black hover:bg-teal-100"
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
                  className="flex items-center text-black hover:bg-teal-100 px-3 py-2 rounded-full outline outline-2 outline-offset-2 outline-black skew-x-12"
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
