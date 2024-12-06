import React, { useState, useEffect } from "react";

const ProfileInfo = () => {
    const [profileData, setProfileData] = useState({
        nip: "",
        nipLama: "",
        namaLengkap: "",
        photoUrl: null, // Kosongkan URL foto
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user && user.username) {
            setProfileData(prevData => ({
                ...prevData,
                nip: user.username, // Update the NIP field with username
            }));
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
