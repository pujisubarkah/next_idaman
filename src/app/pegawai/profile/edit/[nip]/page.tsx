"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { useParams } from "next/navigation"; // Jika `useParams` digunakan dari Next.js

import RootLayout from "../../../../home/layout"; // Sesuaikan path RootLayout

const ProfileInfo = ({ nip }: { nip: string }) => {
  const [profileData, setProfileData] = useState({
    nip: "",
    nipLama: "",
    namaLengkap: "",
    photoUrl: null as string | null,
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
        console.log("Fetching profile data for NIP:", nip);
        const res = await axios.get(`/api/pegawai/idaman?peg_nip=${nip}`, {
          headers: { "Cache-Control": "no-cache" },
        });

        console.log("API response data:", res.data);

        const data = res.data.data;
        const filteredData = data.find((item: any) => item.peg_nip === nip);

        if (filteredData) {
          setProfileData({
            nip: filteredData.peg_nip || "",
            nipLama: filteredData.peg_nip_lama || "",
            namaLengkap: filteredData.peg_nama || "",
            photoUrl: filteredData.peg_foto || null,
          });
        } else {
          console.warn("Data profil tidak ditemukan untuk NIP:", nip);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [nip]);

  const isValidImageUrl = (url: string | null) => {
    if (!url) return false;
    const validExtensions = ["jpg", "jpeg", "png"];
    const extension = url.split(".").pop()?.toLowerCase();
    return validExtensions.includes(extension || "");
  };

  const basePhotoUrl =
    "https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border rounded-md bg-gray-50">
      <h2 className="text-2xl font-bold text-teal-600">Informasi Profil</h2>
      <div className="flex items-start space-x-6">
        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300 rounded-full">
          {profileData.photoUrl && isValidImageUrl(profileData.photoUrl) ? (
            <img
              src={`${basePhotoUrl}${profileData.photoUrl}`}
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

const EditProfile = ({ params }: { params: { nip: string } }) => {
  const { nip } = params;

  if (!nip) {
    return (
      <RootLayout>
        <div>Error: NIP tidak ditemukan di URL.</div>
        
      </RootLayout>
    );
  }

  return (
    <RootLayout>
    
      <ProfileInfo nip={nip} />
   
    </RootLayout>
  );
};

export default EditProfile;
