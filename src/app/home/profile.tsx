"use client";

import { useState, useEffect } from "react";
import UserNavbar from './user_navbar';
import DataPribadi from './data-pribadi';
import Pendidikan from '../pegawai/profile/edit/pendidikan';
import PelatihanStuktural from '../pegawai/profile/edit/struktural';
import PelatihanFungsional from '../pegawai/profile/edit/fungsional';
import FilePegawai from './file-pegawai';
import NavbarProfile from '../pegawai/profile/edit/navbar_profile';
import Pasangan from '../pegawai/profile/edit/pasangan';
import Anak from '../pegawai/profile/edit/anak';  
import Jabatan from '../pegawai/profile/edit/jabatan';
import Kepangkatan from '../pegawai/profile/edit/pangkat';
import Penghargaan from '../pegawai/profile/edit/penghargaan';
import OrangTua from '../pegawai/profile/edit/orangtua';
import Saudara from '../pegawai/profile/edit/saudara';
import Kontak from '../pegawai/profile/edit/kontak';    

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
