import { useState } from 'react';
import Link from 'next/link';  // Import Link from Next.js
import {
  FaTachometerAlt,
  FaSearch,
  FaUser,
  FaBell,
  FaCog,
  FaUsers,
  FaHdd,
  FaList,
  FaTable,
  FaChartPie,
  FaHandPointUp,
  FaPowerOff,
  FaCircle,  // Import FaCircle icon for bullet
} from "react-icons/fa";

export const sidebarData = [
  {
    label: "Dashboard",
    to: "/home",
    icon: FaTachometerAlt,
    roles: ["1", "4"], // Example role permissions
  },
  {
    label: "List Pegawai",
    to: "/list_unit",
    icon: FaList,
    roles: ["1"], // Only admin can see this
  },
  {
    label: "Cari Pegawai",
    to: "/list_all_pegawai",
    icon: FaList,
    roles: ["1"], // Only admin can see this
  },
  {
    label: "List Pegawai Inaktif",
    dropdown: true,
    icon: FaList,
    children: [
      { label: "Pensiun", to: "/pegawai-inaktif/pensiun" },
      { label: "Meninggal Dunia", to: "/pegawai-inaktif/meninggal" },
      { label: "Pindah ke Luar", to: "/pegawai-inaktif/pindah" },
      { label: "CLTN/Tugas Belajar", to: "#" },
    ],
    roles: ["1"],
  },
  {
    label: "Pegawai Struktural",
    to: "#",
    icon: FaUser,
    roles: ["1"],
  },
  {
    label: "Notifikasi",
    dropdown: true,
    icon: FaBell,
    children: [
      { label: "Prediksi Pensiun", to: "/notifikasi/prediksi" },
      { label: "Melebihi Umur Pensiun", to: "/notifikasi/lebih" },
      { label: "Prediksi Kenaikan Pangkat", to: "/notifikasi/prediksipangkat" },
      { label: "Masa Kerja", to: "/notifikasi/masa_kerja" },
    ],
    roles: ["1"],
  },
  {
    label: "Data Master",
    dropdown: true,
    icon: FaHdd,
    children: [
      { label: "Satuan Kerja", to: "/data/satker" },
      { label: "Unit Kerja", to: "/data/uker" },
      { label: "Jabatan", to: "/data/jabatan" },
      { label: "JFT", to: "/data/JFT" },
      { label: "JFU", to: "/data/JFU" },
      { label: "Universitas", to: "/data/universitas" },
      { label: "Fakultas", to: "/data/fakultas" },
      { label: "Monitoring Kelengkapan Data", to: "/data/mkd" },
      { label: "Hukuman Disiplin", to: "/data/hukdis" },
      { label: "Diklat Struktural Kategori", to: "/data/diklat_struk" },
      { label: "Diklat Teknis", to: "/data/diklat_teknis" },
      { label: "Monitoring Format Ceklis", to: "/data/mfc" },
    ],
    roles: ["1"],
  },
  {
    label: "Semua Pegawai",
    to: "#",
    icon: FaTable,
    roles: ["1"],
  },
  {
    label: "Pencarian Dinamis",
    to: "#",
    icon: FaSearch,
    roles: ["1"],
  },
  {
    label: "Jabatan Kosong",
    dropdown: true,
    icon: FaHandPointUp,
    children: [
      { label: "Eselon", to: "/Jabatan-kosong/Eselon" },
      { label: "Noneselon", to: "/jabatan-kosong/Noneselon" },
    ],
    roles: ["1"],
  },
  {
    label: "Rekap",
    dropdown: true,
    icon: FaTable,
    children: [
      { label: "Daftar Urut Kepangkatan", to: "#" },
      { label: "Unit Kerja", to: "#" },
      { label: "Jabatan", to: "#" },
      { label: "Golongan", to: "#" },
      { label: "Jenis Kelamin", to: "#" },
      { label: "Tingkat Pendidikan", to: "#" },
      { label: "Kelompok Usia", to: "#" },
      { label: "Eselon Jenis Kelamin", to: "#" },
      { label: "Monitoring Mapping SIASN", to: "#" },
    ],
    roles: ["1"],
  },
  {
    label: "Formasi",
    dropdown: true,
    icon: FaTable,
    children: [
      { label: "PNS Akan Naik Pangkat", to: "#" },
      { label: "PNS Akan Pensiun Golongan", to: "#" },
      { label: "PNS Akan Pensiun Jabatan", to: "#" },
      { label: "PNS Pindah Keluar", to: "#" },
      { label: "PNS Meninggal", to: "#" },
      { label: "PNS Sudah Pensiun", to: "#" },
    ],
    roles: ["1"],
  },
  {
    label: "Grafik",
    dropdown: true,
    icon: FaChartPie,
    children: [
      { label: "Jabatan", to: "#" },
      { label: "Golongan", to: "#" },
      { label: "Jenis Kelamin", to: "#" },
      { label: "Eselon Jenis Kelamin", to: "#" },
      { label: "Tingkat Pendidikan", to: "#" },
      { label: "Kelompok Usia", to: "#" },
    ],
    roles: ["1"],
  },
  {
    label: "Absen/Presensi",
    to: "#",
    icon: FaTable,
    roles: ["1"],
  },
  {
    label: "Users",
    dropdown: true,
    icon: FaUsers,
    children: [
      { label: "Data User", to: "#" },
      { label: "Data Role", to: "#" },
      { label: "Hak Akess User", to: "#" },
    ],
    roles: ["1"],
  },
  {
    label: "Ubah Password",
    to: "#",
    icon: FaCog,
    roles: ["1"],
  },
  {
    label: "Logout",
    to: "#",
    icon: FaPowerOff,
    roles: ["1"],
  },
];

// Sidebar component where the Link is used
export const Sidebar = () => {
  return (
    <nav>
      <ul>
        {sidebarData.map((item, index) => {
          if (item.dropdown) {
            return (
              <li key={index}>
                <div>
                  <item.icon />
                  {item.label}
                </div>
                <ul>
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex} className="flex items-center">
                      {/* Add FaCircle for bullet effect */}
                      <FaCircle className="mr-2 text-gray-500" />
                      <Link href={child.to}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }
          return (
            <li key={index}>
              <Link href={item.to}>
                <item.icon />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
