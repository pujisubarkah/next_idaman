"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar";
import Profile from "../navbar_profile";
import RootLayout from "../layout";
import Datapribadi from "../data-pribadi";
import FilePegawai from "../file-pegawai";
import Fungsional from "../fungsional";
import Struktural from "../struktural";
import Jabatan from "../jabatan";
import Teknis from "../teknis";
import Klasikal from "../klasikal";
import NonKlasikal from "../nonklasikal";
import Sertifikasi from "../sertifikat";
import Pltplh from "../pltplh";
import Kgb from "../kgb";
import Cuti from "../cuti";
import Publikasi from "../publikasi";
import Timkerja from "../timkerja";
import Prestasi from "../prestasi";
import Assessmen from "../assessmen";
import Kepangkatan from "../pangkat";
import Pendidikan from "../pendidikan";
import Kedudukan from "../kedudukan";
import Kesehatan from "../kesehatan";
import Hukuman from "../hukuman";
import Penghargaan from "../penghargaan";
import Pasangan from "../pasangan";
import OrangTua from "../orangtua";
import Anak from "../anak";
import Saudara from "../saudara";
import Kontak from "../kontak";

const Page = () => {
  const nip = window.location.pathname.split("/").pop();
  const [activeTab, setActiveTab] = useState<string>(window.location.hash || "#data-pribadi");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "#data-pribadi":
        return <Datapribadi params={{ nip }} />;
      case "#file-pegawai":
        return <FilePegawai />;
      case "#pendidikan":
        return <Pendidikan nip={nip} />;
      case "#pelatihan-fungsional":
        return <Fungsional />;
      case "#pelatihan-struktural":
        return <Struktural />;
      case "#pelatihan-teknis":
        return <Teknis />;
      case "#pelatihan-klasikal":
        return <Klasikal />;
      case "#pelatihan-Non-klasikal":
        return <NonKlasikal />;
      case "#sertifikasi":
        return <Sertifikasi />;
      case "#jabatan":
        return <Jabatan />;
      case "#pltplh":
        return <Pltplh />;
      case "#kepangkatan":
        return <Kepangkatan />;
      case "#kgb":
        return <Kgb />;
      case "#cuti":
        return <Cuti />;
      case "#kedudukan":
        return <Kedudukan />;
      case "#kesehatan":
        return <Kesehatan />;
      case "#hukuman":
        return <Hukuman />;
      case "#penghargaan":
        return <Penghargaan />;
      case "#publikasi":
        return <Publikasi />;
      case "#timkerja":
        return <Timkerja />;
      case "#prestasi":
        return <Prestasi />;
      case "#assessmen":
        return <Assessmen />;
      case "#pasangan":
        return <Pasangan />;
      case "#anak":
        return <Anak />;
      case "#orangtua":
        return <OrangTua />;
      case "#saudara":
        return <Saudara />;
      case "#kontak":
        return <Kontak />;
      default:
        return <div>Tab tidak ditemukan.</div>;
    }
  };

  return (
    <div className="space-y-4">
      <Navbar />
      <Profile nip={nip} />
      <main className="container mx-auto p-2 space-y-4">
        <section id={activeTab.replace("#", "")}>{renderTabContent()}</section>
      </main>
    </div>
  );
};

export default Page;
