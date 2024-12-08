import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUpload } from 'react-icons/fa';
import { ADDRGETNETWORKPARAMS } from "dns";

const DataPribadi = () => {
    const [datapribadi, setdatapribadi] = useState({
        nip: "",
        nipLama: "",
        namaLengkap: "",
        tempat: "",
        tanggalLahir: "",
        jenisKelamin: "",
        statusPernikahan: "",
        Agama: "",
    });

    // Fungsi untuk memformat tanggal
    const formatTanggal = (tanggal) => {
        const bulanIndo = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const date = new Date(tanggal);
        const hari = date.getDate();
        const bulan = bulanIndo[date.getMonth()];
        const tahun = date.getFullYear();

        return `${hari} - ${bulan} - ${tahun}`;
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User from localStorage:", user);

        if (user && user.username) {
            setdatapribadi(prevData => ({
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

                    const data = res.data.data;
                    const filteredData = data.find(item => item.peg_nip === user.username);

                    if (filteredData) {
                        console.log("Filtered profile data:", filteredData);

                        setdatapribadi({
                            nip: user.username,
                            nipLama: filteredData.peg_nip_lama || "",
                            namaLengkap: filteredData.peg_nama || "",
                            tempat: filteredData.peg_lahir_tempat || "",
                            tanggalLahir: filteredData.peg_lahir_tanggal || "",
                            jenisKelamin: filteredData.peg_jenis_kelamin || "",
                            statusPernikahan: filteredData.peg_status_perkawinan || "",
                            Agama: filteredData.id_agama || "",
                        });
                    } else {
                        console.warn("No matching profile data found for NIP:", user.username);
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    console.error(error.response ? "Error response data:" + error.response.data : error.message);
                }
            };

            fetchProfileData();
        }
    }, []);

    const dataEntries = [
        {
            label: "Tempat, Tanggal Lahir",
            value: `${datapribadi.tempat}, ${formatTanggal(datapribadi.tanggalLahir)}`,
            showButton: true,
            buttonLabel: "Akte Kelahiran",
            buttonIcon: <FaUpload />
        },
        { label: "Jenis Kelamin", value: datapribadi.jenisKelamin },
        {
            label: "Status Perkawinan",
            value: datapribadi.statusPernikahan,
            buttons: [
                { label: "KK", icon: <FaUpload /> },
                { label: "Akte Nikah", icon: <FaUpload /> }
            ]
        },
        { label: "Agama", value: datapribadi.Agama },
        { label: "Status Pegawai", value: datapribadi.Agama },
        { label: "Jenis ASN", value: datapribadi.Agama },
        { label: "Jenis PNS", value: datapribadi.Agama },
        { label: "Pendidikan Awal", value: datapribadi.Agama },
        { label: "Pendidikan Akhir", value: datapribadi.Agama },
        { label: "Jenis Jabatan", value: datapribadi.Agama },
        { label: "Eselon", value: datapribadi.Agama },
        { label: "Status Gaji", value: datapribadi.Agama },
        { label: "Kedudukan Pegawai", value: datapribadi.Agama },   
        { label: "Nama Jabatan", value: datapribadi.Agama }, 
        { label: "Satuan Kerja", value: datapribadi.Agama }, 
        { label: "Golongan Awal", value: datapribadi.Agama }, 
        { label: "Golongan Akhir", value: datapribadi.Agama }, 
        { label: "Masa Kerja Golongan", value: datapribadi.Agama }, 
        { label: "No KARPEG", value: datapribadi.Agama }, 
        { label: "No Askes", value: datapribadi.Agama }, 
        { label: "No KTP", value: datapribadi.Agama }, 
        { label: "Golongan Darah", value: datapribadi.Agama }, 
        { label: "BAPETARUM", value: datapribadi.Agama }, 
        { label: "TMT Gaji Berkala Terbaru", value: datapribadi.Agama }, 
        { label: "Alamat Rumah", value: datapribadi.Agama },
        { label: "Provinsi", value: datapribadi.Agama },
        { label: "Kab/Kota", value: datapribadi.Agama },
        { label: "Kec.", value: datapribadi.Agama },
        { label: "Kel/Desa", value: datapribadi.Agama },
        { label: "Telp", value: datapribadi.Agama },
        { label: "Email", value: datapribadi.Agama },
        { label: "Email Resmi", value: datapribadi.Agama }, 
        { label: "Domisili KTP", value: datapribadi.Agama },
        { label: "Alamat Rumah", value: datapribadi.Agama },
        { label: "Provinsi", value: datapribadi.Agama },
        { label: "Kab/Kota", value: datapribadi.Agama },
        { label: "Kec.", value: datapribadi.Agama },
        { label: "Kel/Desa", value: datapribadi.Agama },
    ];

    return (
        <div id="data-pribadi" className="w-full p-2 border rounded-md bg-gray-50">
            <table className="w-full border-collapse">
                <tbody>
                    {dataEntries.map((entry, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"} // Memeriksa apakah baris ganjil atau genap
                        >
                            <td className="px-4 py-2  font-semibold w-1/6">{entry.label}</td>
                            <td className="px-4 py-2 border border-gray-300 w-3/8 flex flex-wrap items-center">
                                {entry.value || "—"}
                                {entry.buttons && entry.buttons.map((btn, i) => (
                                    <button key={i} className="ml-2 px-4 py-1 bg-teal-500 text-white rounded hover:bg-blue-600 flex items-center">
                                        {btn.icon} {/* Ikon button */}
                                        <span className="ml-2">{btn.label}</span> {/* Label button */}
                                    </button>
                                ))}
                                {entry.showButton && entry.buttonLabel && !entry.buttons && (
                                    <button className="ml-2 px-4 py-1 bg-teal-500 text-white rounded hover:bg-blue-600 flex items-center">
                                        {entry.buttonIcon} {/* Ikon upload */}
                                        <span className="ml-2">{entry.buttonLabel}</span> {/* Label button */}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataPribadi;
