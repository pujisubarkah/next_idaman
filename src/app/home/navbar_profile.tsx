import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileInfo = () => {
    const [profileData, setProfileData] = useState({
        nip: "",
        nipLama: "",
        namaLengkap: "",
        photoUrl: null as string | null, // Kosongkan URL foto
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
                    const res = await axios.get(`/api/pegawai/idaman_unit?peg_nip=${user.username}`, {
                        headers: {
                            'Cache-Control': 'no-cache',
                        }
                    });
            
                    if (Array.isArray(res.data.data)) {
                        console.log("Raw data array:", res.data.data);
                        res.data.data.forEach((item, index) => {
                            console.log(`Item ${index}:`, item);
                        });
                    }
            
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
            
                    if (error.response) {
                        console.error("Error response data:", error.response.data);
                        console.error("Error response status:", error.response.status);
                    } else if (error.request) {
                        console.error("Error request:", error.request);
                    } else {
                        console.error("Error message:", error.message);
                    }
                }
            };
            fetchProfileData();
            console.log("Photo URL:", profileData.photoUrl);
        }
    }, []);

    return (
        <div className="w-full max-w-md mx-auto p-4 border rounded-md bg-gray-50">
            <div className="flex items-start space-x-4">
                {/* Foto Placeholder Kotak */}
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                    {profileData.photoUrl ? (
                        <img
                            src={profileData.photoUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-500 text-sm">No Photo</span>
                    )}
                </div>

                {/* Informasi Profil */}
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
