
import Link from 'next/link';  // Import Link from Next.js
import {
  FaTachometerAlt,
  FaSearch,
  FaUser,
  FaBell,
  FaHdd,
  FaList,
  FaTable,
  FaChartPie,
  FaHandPointUp,
} from "react-icons/fa";

export const sidebarData = [
  {
    label: "Dashboard",
    to: "/home",
    icon: FaTachometerAlt,
  },
  {
    label: "List Pegawai",
    to: "/list_unit",
    icon: FaList,
  },
  {
    label: "Cari Pegawai",
    to: "/list_all_pegawai",
    icon: FaList,
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
  },
  {
    label: "Jabatan Kosong",
    dropdown: true,
    icon: FaHandPointUp,
    children: [
      { label: "Eselon", to: "#" },
      { label: "Noneselon", to: "#" },
    ],
  },
  {
    label: "Pegawai Struktural",
    to: "#",
    icon: FaUser,
  },
  {
    label: "Notifikasi",
    dropdown: true,
    icon: FaBell,
    children: [
      { label: "Prediksi Pensiun", to: "notifikasi/prediksi" },
      { label: "Melebihi Umur Pensiun", to: "notifikasi/lebih" },
      { label: "Prediksi Kenaikan Pangkat", to: "notifikasi/prediksipangkat" },
      { label: "Masa Kerja", to: "notifikasi/masa_kerja" },
    ],
  },
  {
    label: "Data Master",
    to: "#",
    icon: FaHdd,
  },
  {
    label: "Rekap",
    dropdown: true,
    icon: FaTable,
    children: [
      { label: "Daftar Urut Kepangkatan", to: "#" },
      { label: "Unit Kerja", to: "#" },
      { label: "Jabatan", to: "#" },
    ],
  },
  {
    label: "Grafik",
    dropdown: true,
    icon: FaChartPie,
    children: [
      { label: "Jabatan", to: "#" },
      { label: "Golongan", to: "#" },
    ],
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
                <li key={childIndex}>
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
