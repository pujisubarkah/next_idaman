import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileInfo = () => {
    const [profileData, setProfileData] = useState({
        nip: "",
        nipLama: "",
        namaLengkap: "",
        photoUrl: null as string | null,
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User from localStorage:", user);

        if (user && user.username) {
            setProfileData(prevData => ({
                ...prevData,
                nip: user.username,
            }));

            const fetchProfileData = async () => {
                try {
                    console.log("Fetching profile data for username:", user.username);
                    const res = await axios.get(`/api/pegawai/idaman?peg_nip=${user.username}`, {
                        headers: {
                            'Cache-Control': 'no-cache',
                        }
                    });

                    const data = res.data.data;
                    const filteredData = data.find(item => item.peg_nip === user.username);

                    if (filteredData) {
                        console.log("Filtered profile data:", filteredData);

                        setProfileData(prevData => ({
                            ...prevData,
                            nipLama: filteredData.peg_nip_lama || "",
                            namaLengkap: filteredData.peg_nama || "",
                            photoUrl: filteredData.peg_foto || null,
                        }));
                    } else {
                        console.warn("No matching profile data found for NIP:", user.username);
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
            };
            fetchProfileData();
        }
    }, []);

    // Fungsi untuk memvalidasi ekstensi gambar
    const isValidImageUrl = (url: string | null) => {
        if (!url) return false;
        const validExtensions = ['jpg', 'jpeg', 'png'];
        const extension = url.split('.').pop()?.toLowerCase();
        return validExtensions.includes(extension || '');
    };

    // Base URL untuk foto yang diupload ke Supabase
    const basePhotoUrl = "https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/";

    return (
        <div className="w-full max-w-4xl mx-auto p-4 border rounded-md bg-gray-50">
            <h2 className="text-2xl font-bold text-teal-600">Informasi Profil</h2>
            <div className="flex items-start space-x-6">
                {/* Kolom Foto Profil (Besar) */}
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

                {/* Kolom Informasi Profil */}
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
