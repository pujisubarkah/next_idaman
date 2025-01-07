"use client";

import { useEffect, useState } from "react";
import axios from "axios";


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
        const res = await axios.get(`/api/pegawai/profile?peg_id=${nip}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        const data = res.data.data.find((item) => item.peg_nip === nip);

        if (data) {
          setProfileData({
            nip: data.peg_nip || "",
            nipLama: data.peg_nip_lama || "",
            namaLengkap: [data.peg_gelar_depan, data.peg_nama, data.peg_gelar_belakang]
            .filter(Boolean).join(" ") || "",
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



export default ProfileInfo;

