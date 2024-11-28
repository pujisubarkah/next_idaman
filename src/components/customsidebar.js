"use client";
import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { useRouter } from "next/navigation"; // Menggunakan useRouter dari Next.js
import Link from "next/link"; // Menggunakan Link dari Next.js
import Dropdown from "./dropdown";
import { sidebarData } from "./datasidebar";

const CustomSidebar = () => {
  const [isClient, setIsClient] = useState(false); // Menyimpan status client-side rendering

  const router = useRouter(); // Inisialisasi useRouter

  // Cek jika halaman sedang dirender di client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Jika bukan client-side, kembalikan null (tidak merender)
  if (!isClient) {
    return null;
  }

  // Fungsi untuk navigasi menggunakan useRouter
  const handleNavigation = (to) => {
    router.push(to); // Navigasi ke path yang diberikan
  };

  return (
    <div className="flex">
      {/* Sidebar component */}
      <Sidebar aria-label="Sidebar with content separator" className="w-64">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {sidebarData.map((item, index) =>
              item.dropdown ? (
                <Dropdown key={index} label={item.label} icon={item.icon}>
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex}>
                      {/* Handle navigasi dengan onClick */}
                      <Link href={child.to} onClick={() => console.log(child.label)}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </Dropdown>
              ) : (
                <Sidebar.Item
                key={index}
                as={Link}
                href={item.to}
                icon={item.icon}
                className="hover:bg-white hover:text-teal-500 hover:border-teal-500 border border-transparent"
              >
                {item.label}
              </Sidebar.Item>
            )
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>

      {/* Konten utama */}
      <div className="flex-1 p-4">
        {/* Konten halaman lainnya */}
      </div>
    </div>
  );
};

export default CustomSidebar;
