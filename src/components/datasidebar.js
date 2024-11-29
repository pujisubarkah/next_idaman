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
    label: "Semua Pegawai",
    to: "#",
    icon: FaTable,
  },
  {
    label: "Pencarian Dinamis",
    to: "#",
    icon: FaSearch,
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
  },
  {
    label: "Absen/Presensi",
    to: "#",
    icon: FaTable,
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
  },
  {
    label: "Ubah Password",
    to: "#",
    icon: FaCog,
  },
  {
    label: "Logout",
    to: "#",
    icon: FaPowerOff,
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
