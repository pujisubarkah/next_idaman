"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../navbar"; // Sesuaikan path Navbar
import Datapribadi from "../data-pribadi"; // Sesuaikan path Datapribadi
import FilePegawai from "../file-pegawai"; // Sesuaikan path FilePegawai
import Fungsional from "../fungsional"; // Sesuaikan path Fungsional
import Struktural from "../struktural"; // Sesuaikan path Struktural
import Jabatan from "../jabatan"; // Sesuaikan path Jabatan
import Anak from "../anak"; // Sesuaikan path Anak
import Kepangkatan from "../pangkat"; // Sesuaikan path Kepangkatan
import Pendidikan from "../pendidikan"; // Sesuaikan path Pendidikan
import Penghargaan from "../penghargaan"; // Sesuaikan path Penghargaan
import Pasangan from "../pasangan"; // Sesuaikan path Pasangan
import OrangTua from "../orangtua"; // Sesuaikan path OrangTua
import Saudara from "../saudara"; // Sesuaikan path Saudara
import Kontak from "../kontak"; // Sesuaikan path Kontak
import RootLayout from "../layout"; // Sesuaikan path RootLayout

const ProfileInfo = ({ nip }) => {
  const [profileData, setProfileData] = useState({
    nip: "",
    nipLama: "",
    namaLengkap: "",
    photoUrl: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!nip) {
        console.error("NIP tidak ditemukan di parameter URL.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/pegawai/idaman?peg_nip=${nip}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        const data = res.data.data.find((item) => item.peg_nip === nip);

        if (data) {
          setProfileData({
            nip: data.peg_nip || "",
            nipLama: data.peg_nip_lama || "",
            namaLengkap: data.peg_nama || "",
            photoUrl: data.peg_foto || null,
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [nip]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border rounded-md bg-gray-50">
      <h2 className="text-2xl font-bold text-teal-600">Informasi Profil</h2>
      <div className="flex items-start space-x-6">
        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300 rounded-full">
          {profileData.photoUrl ? (
            <img
              src={`https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${profileData.photoUrl}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://via.placeholder.com/150"
              alt="No Photo"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <div className="border border-gray-300 rounded-md divide-y divide-gray-300">
            <div className="flex justify-between p-3 bg-gray-100">
              <div className="font-semibold">NIP</div>
              <div>{profileData.nip || "—"}</div>
            </div>
            <div className="flex justify-between p-3">
              <div className="font-semibold">NIP Lama</div>
              <div>{profileData.nipLama || "—"}</div>
            </div>
            <div className="flex justify-between p-3 bg-gray-100">
              <div className="font-semibold">Nama Lengkap</div>
              <div>{profileData.namaLengkap || "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProfile = ({ params }) => {
  const { nip } = params;

  // State untuk tab yang aktif, dimulai dengan #data-pribadi
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
        <ProfileInfo nip={nip} />

        <main className="container mx-auto p-2 space-y-4">
          {/* Tampilkan hanya tab yang aktif */}
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
              <Pendidikan />
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

export default EditProfile;
