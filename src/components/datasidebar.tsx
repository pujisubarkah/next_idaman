
import { useState } from 'react';

interface SidebarItem {
  label: string;
  to?: string;
  icon: React.ComponentType;
  roles: string[];
  dropdown?: boolean;
  children?: SidebarItem[];
}
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

export const sidebarData: SidebarItem[] = [
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
    to: "/list-all-pegawai",
    icon: FaList,
    roles: ["1"], // Only admin can see this
  },
  {
    label: "List Pegawai Inaktif",
    dropdown: true,
    icon: FaList,
    children: [
      { label: "Pensiun", to: "/pegawai-inaktif/pensiun", icon: FaCircle, roles: ["1"] },
      { label: "Meninggal Dunia", to: "/pegawai-inaktif/meninggal", icon: FaCircle, roles: ["1"] },
      { label: "Pindah ke Luar", to: "/pegawai-inaktif/pindah", icon: FaCircle, roles: ["1"] },
      { label: "CLTN/Tugas Belajar", to: "#", icon: FaCircle, roles: ["1"] },
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
      { label: "Prediksi Pensiun", to: "/notifikasi/prediksi", icon: FaCircle, roles: ["1"] },
      { label: "Melebihi Umur Pensiun", to: "/notifikasi/lebih", icon: FaCircle, roles: ["1"] },
      { label: "Prediksi Kenaikan Pangkat", to: "/notifikasi/prediksipangkat", icon: FaCircle, roles: ["1"] },
      { label: "Masa Kerja", to: "/notifikasi/masa_kerja", icon: FaCircle, roles: ["1"] },
    ],
    roles: ["1"],
  },
  {
    label: "Data Master",
    dropdown: true,
    icon: FaHdd,
    children: [
      { label: "Satuan Kerja", to: "/data/satker", icon: FaCircle, roles: ["1"] },
      { label: "Unit Kerja", to: "/data/uker", icon: FaCircle, roles: ["1"] },
      { label: "Jabatan", to: "/data/jabatan", icon: FaCircle, roles: ["1"] },
      { label: "JFT", to: "/data/JFT", icon: FaCircle, roles: ["1"] },
      { label: "JFU", to: "/data/JFU", icon: FaCircle, roles: ["1"] },
      { label: "Universitas", to: "/data/universitas", icon: FaCircle, roles: ["1"] },
      { label: "Jurusan", to: "/data/jurusan", icon: FaCircle, roles: ["1"] },
      { label: "Monitoring Kelengkapan Data", to: "/data/mkd", icon: FaCircle, roles: ["1"] },
      { label: "Hukuman Disiplin", to: "/data/hukdis", icon: FaCircle, roles: ["1"] },
      { label: "Penghargaan", to: "/data/penghargaan", icon: FaCircle, roles: ["1"] },
      { label: "Diklat Struktural Kategori", to: "/data/diklat_struk", icon: FaCircle, roles: ["1"] },
      { label: "Diklat Fungsional", to: "/data/diklat_jft", icon: FaCircle, roles: ["1"] },
      { label: "Diklat Teknis", to: "/data/diklat_teknis", icon: FaCircle, roles: ["1"] },
      { label: "Monitoring Bangkom", to: "/data/bangkom", icon: FaCircle, roles: ["1"] },  
      { label: "Monitoring Format Ceklis", to: "/data/mfc", icon: FaCircle, roles: ["1"] },
    ],
    roles: ["1"],
  },
  {
    label: "Semua Pegawai",
    to: "/pns/search",
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
      { label: "Eselon", to: "/Jabatan-kosong/Eselon", icon: FaCircle, roles: ["1"] },
      { label: "Noneselon", to: "/jabatan-kosong/Noneselon", icon: FaCircle, roles: ["1"] },
    ],
    roles: ["1"],
  },
  {
    label: "Rekap",
    dropdown: true,
    icon: FaTable,
    children: [
     
    
      { label: "Golongan", to: "/rekap/golongan", icon: FaCircle, roles: ["1"] },
      { label: "Jenis Kelamin", to: "/rekap/jenis-kelamin", icon: FaCircle, roles: ["1"] },
      { label: "Tingkat Pendidikan", to: "/rekap/pendidikan", icon: FaCircle, roles: ["1"] },
      { label: "Generasi", to: "/rekap/generasi", icon: FaCircle, roles: ["1"] },
      { label: "Monitoring Mapping SIASN", to: "#", icon: FaCircle, roles: ["1"] },
    ],
    roles: ["1"],
  },
  {
    label: "Formasi",
    dropdown: true,
    icon: FaTable,
    children: [
      { label: "PNS Akan Naik Pangkat", to: "#", icon: FaCircle, roles: ["1"] },
      { label: "PNS Akan Pensiun Golongan", to: "#", icon: FaCircle, roles: ["1"] },
      { label: "PNS Akan Pensiun Jabatan", to: "#", icon: FaCircle, roles: ["1"] },
      { label: "PNS Pindah Keluar", to: "#", icon: FaCircle, roles: ["1"] },
      { label: "PNS Meninggal", to: "#", icon: FaCircle, roles: ["1"] },
      { label: "PNS Sudah Pensiun", to: "#", icon: FaCircle, roles: ["1"] },
    ],
    roles: ["1"],
  },
  {
    label: "Grafik",
    dropdown: true,
    icon: FaChartPie,
    children: [
      { label: "Jabatan", to: "/grafik/jabatan", icon: FaCircle, roles: ["1"] },
      { label: "Golongan", to: "/grafik/golongan", icon: FaCircle, roles: ["1"] },
      { label: "Jenis Kelamin", to: "/grafik/jenis-kelamin", icon: FaCircle, roles: ["1"] },
      { label: "Tingkat Pendidikan", to: "/grafik/pendidikan", icon: FaCircle, roles: ["1"] },
      { label: "Generasi", to: "/grafik/generasi", icon: FaCircle, roles: ["1"] },
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
      { label: "Data User", to: "/user/all", icon: FaCircle, roles: ["1"] },
      { label: "Data Role", to: "/user/roles", icon: FaCircle, roles: ["1"] },
      { label: "Hak Akess User", to: "#", icon: FaCircle, roles: ["1"] },
    ],
    roles: ["1"],
  },
  {
    label: "Data Pegawai",
    to: "/pegawai/profile/edit/id",
    icon: FaUser,
    roles: ["4"],
  },
  {
    label: "Coaching & Mentoring",
    to: "#",
    icon: FaUser,
    roles: ["4"],
  },
  {
    label: "Absen dan Presensi",
    dropdown: true,
    icon: FaUsers,
    children: [
      { label: "Ijin", to: "/daftar-hadir/ijin", icon: FaCircle, roles: ["4"] },
      { label: "Cuti", to: "/daftar-hadir/cuti", icon: FaCircle, roles: ["4"] },
      { label: "Presensi", to: "/daftar-hadir/presensi", icon: FaCircle, roles: ["4"] },
   
    ],
    roles: ["4"],
  },
  {
    label: "Penilian Kinerja",
    to: "/penilaian-kinerja",
    icon: FaUser,
    roles: ["4"],
  },
  {
    label: "Ubah Password",
    to: "/user/edit",
    icon: FaCog,
    roles: ["1", "4"],
  },
  {
    label: "Logout",
    to: "/logout",
    icon: FaPowerOff,
    roles: ["1", "4"],
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
                  {item.children && item.children.map((child, childIndex) => (
                    <li key={childIndex} className="flex items-center">
                      {/* Add FaCircle for bullet effect */}
                      <FaCircle className="mr-2 text-gray-500" />
                      {child.to && (
                        <Link href={child.to}>
                          {child.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            );
          }
          return (
            <li key={index}>
              {item.to && (
                <Link href={item.to}>
                  <item.icon />
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
