"use client";

import { useState, useEffect } from "react";
import UserNavbar from './user_navbar';
import DataPribadi from './data-pribadi';
import Pendidikan from './pendidikan';
import PelatihanStuktural from './struktural';
import PelatihanFungsional from './fungsional';
import FilePegawai from './file-pegawai';
import NavbarProfile from './navbar_profile';
import Pasangan from './pasangan';
import Anak from './anak';  
import Jabatan from './jabatan';
import Kepangkatan from './pangkat';
import Penghargaan from './penghargaan';
import OrangTua from './orangtua';
import Saudara from './saudara';
import Kontak from './kontak';    

export default function Home() {
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    // Update tab based on URL hash
    const handleHashChange = () => {
      setActiveTab(window.location.hash);
    };

    // Initial load
    handleHashChange();

    // Listen for hash change events
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <>
     <div className="space-y-4"> {/* Atur jarak antar komponen */}
      <UserNavbar />
      <NavbarProfile />
      </div>
      <main className="container mx-auto p-2 space-y-2">
        {activeTab === "#data-pribadi" && <DataPribadi />}
        {activeTab === "#file-pegawai" && <FilePegawai />}
        {activeTab === "#pendidikan" && <Pendidikan />}
        {activeTab === "#pelatihan-struktural" && <PelatihanStuktural />}
        {activeTab === "#pelatihan-fungsional" && <PelatihanFungsional />}
        {activeTab === "#jabatan" && <Jabatan />}
        {activeTab === "#kepangkatan" && <Kepangkatan />}
        {activeTab === "#pasangan" && <Pasangan />}
        {activeTab === "#anak" && <Anak />}
        {activeTab === "#penghargaan" && <Penghargaan />}
        {activeTab === "#orangtua" && <OrangTua />}
        {activeTab === "#saudara" && <Saudara />}
        {activeTab === "#kontak" && <Kontak />}
      </main>
    </>
  );
}
