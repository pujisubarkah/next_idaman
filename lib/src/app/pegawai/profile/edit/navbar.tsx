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
      link: "#data-pribadi",
    },
    {
      label: "Arsip/Dokumen Digital",
      link: "#file-pegawai",
    },
    {
      label: "Riwayat Pengembangan Kompetensi",
      subMenu: [
        { label: "Pendidikan", link: "#pendidikan" },
        { label: "Pelatihan Struktural", link: "#pelatihan-struktural" },
        { label: "Pelatihan Fungsional", link: "#pelatihan-fungsional" },
        { label: "Pelatihan Teknis", link: "#pelatihan-teknis" },
        { label: "Pelatihan Klasikal", link: "#pelatihan-klasikal" },
        { label: "Pelatihan Non Klasikal", link: "#pelatihan-Non-klasikal" },
        { label: "Sertifikasi", link: "#sertifikasi" },
       
      ],
    },
    {
      label: "Riwayat SDM",
      subMenu: [
        { label: "Riwayat Jabatan", link: "#jabatan" },
        { label: "Riwayat PLT/PLH", link: "#pltplh" },
        { label: "Riwayat Kepangkatan", link: "#kepangkatan" },
        { label: "Riwayat KGB", link: "#kgb" },
        { label: "Riwayat Cuti", link: "#cuti" },
        { label: "Kedudukan Hukum", link: "#kedudukan" },
        { label: "Riwayat Kesehatan", link: "#kesehatan" },
        { label: "Riwayat Hukuman", link: "#hukuman" },
      ],
    },
    {
      label: "Kinerja dan Prestasi",
      subMenu: [
       
        { label: "Riwayat Penghargaan", link: "#penghargaan" },
        { label: "Riwayat Publikasi", link: "#publikasi" },
        { label: "Riwayat Keterlibatan Tim Kerja", link: "#timkerja" },
        { label: "Riwayat Prestasi", link: "#prestasi" },
        { label: "Riwayat Assessmen", link: "#assessmen" },
      ],
    },
    {
      label: "Keluarga",
      subMenu: [
        { label: "Pasangan", link: "#pasangan" },
        { label: "Anak", link: "#anak" },
        { label: "Orang Tua", link: "#orangtua" },
        { label: "Saudara Lainnya", link: "#saudara" },
        { label: "Kontak Lainnya", link: "#kontak" },
      ],
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-teal-50 via-teal-75 to-teal-100 p-4 shadow-lg rounded-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          {menuData.map((menu, index) => (
            <div key={index} className="relative">
              {menu.subMenu ? (
                <>
                  <button
                    className="flex items-center text-white hover:text-teal-800 bg-[#3781c7] hover:bg-blue-200 px-4 py-2 rounded-md transition duration-200 transform hover:scale-105"
                    onClick={() => toggleMenu(menu.label)}
                  >
                    {menu.label}
                    <FontAwesomeIcon
                      icon={activeMenu === menu.label ? faChevronUp : faChevronDown}
                      className="ml-2"
                    />
                  </button>
                  {activeMenu === menu.label && (
                    <ul className="absolute top-full left-0 bg-blue-50 mt-2 rounded-lg shadow-lg w-48">
                      {menu.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.link}
                            className="block px-4 py-2 text-blue-800 hover:bg-blue-200 transition duration-150"
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
                  className="flex items-center text-white hover:text-teal-800 bg-[#3781c7] hover:bg-blue-200 px-4 py-2 rounded-md transition duration-200 transform hover:scale-105"
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
