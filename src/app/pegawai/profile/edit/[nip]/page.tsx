"use client";
import { useEffect, useState } from "react";
import Navbar from "../navbar";
import Datapribadi from "../data-pribadi";
import FilePegawai from "../file-pegawai";
import Fungsional from "../fungsional";
import Struktural from "../struktural";
import Jabatan from "../jabatan";
import Profile from "../navbar_profile";
import Anak from "../anak";
import Kepangkatan from "../pangkat";
import Pendidikan from "../pendidikan";
import Penghargaan from "../penghargaan";
import Pasangan from "../pasangan";
import OrangTua from "../orangtua";
import Saudara from "../saudara";
import Kontak from "../kontak";
import RootLayout from "../layout";

const Page = () => {
  // Ambil NIP dari URL
  const nip = window.location.pathname.split("/").pop();

  // State untuk tab yang aktif
  const [activeTab, setActiveTab] = useState<string>(window.location.hash || "#data-pribadi");

  // Fungsi untuk mengubah tab yang aktif
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab; // Perbarui hash di URL
  };

  // Gunakan useEffect untuk mendeteksi perubahan hash URL
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(window.location.hash || "#data-pribadi");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (!nip) {
    return (
      <RootLayout>
        <div>Error: NIP tidak ditemukan di URL.</div>
      </RootLayout>
    );
  }

  return (
    <div className="space-y-4">
      <Navbar />
      <Profile nip={nip} />

      <main className="container mx-auto p-2 space-y-4">
        {activeTab === "#data-pribadi" && (
          <section id="data-pribadi">
            <Datapribadi params={{ nip }} />
          </section>
        )}
        {activeTab === "#file-pegawai" && (
          <section id="file-pegawai">
            <FilePegawai />
          </section>
        )}
        {activeTab === "#pendidikan" && (
          <section id="pendidikan">
            <Pendidikan nip={nip} />
          </section>
        )}
        {activeTab === "#pelatihan-fungsional" && (
          <section id="pelatihan-fungsional">
            <Fungsional />
          </section>
        )}
        {activeTab === "#pelatihan-struktural" && (
          <section id="pelatihan-struktural">
            <Struktural />
          </section>
        )}
        {activeTab === "#jabatan" && (
          <section id="jabatan">
            <Jabatan />
          </section>
        )}
        {activeTab === "#kepangkatan" && (
          <section id="kepangkatan">
            <Kepangkatan />
          </section>
        )}
        {activeTab === "#penghargaan" && (
          <section id="penghargaan">
            <Penghargaan />
          </section>
        )}
        {activeTab === "#pasangan" && (
          <section id="pasangan">
            <Pasangan />
          </section>
        )}
        {activeTab === "#anak" && (
          <section id="anak">
            <Anak />
          </section>
        )}
        {activeTab === "#orangtua" && (
          <section id="orangtua">
            <OrangTua />
          </section>
        )}
        {activeTab === "#saudara" && (
          <section id="saudara">
            <Saudara />
          </section>
        )}
        {activeTab === "#kontak" && (
          <section id="kontak">
            <Kontak />
          </section>
        )}
      </main>
    </div>
  );
};

export default Page;
