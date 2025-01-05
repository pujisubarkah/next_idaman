"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { FaArrowLeft } from 'react-icons/fa'; // Import the left arrow icon

const RiwayatJabatanPage: React.FC = () => {
    const router = useRouter(); // Initialize useRouter

    // State for form data
    const [formData, setFormData] = useState({
        jabatanAktif: '',
        jenisJabatan: '',
        tmt: '',
        satuanKerja: '',
        unitKerja: '',
        jabatan: '',
        eselon: '',
        golongan: '',
        tmtPelantikan: '',
        tmtSelesai: '',
        noSK: '',
        tanggalSK: '',
        penandatangan: '',
    });

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        // Here you can add your logic to handle form submission, e.g., sending data to an API
    };

    return (
        <div className="relative p-4">
            <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Form Riwayat Jabatan</h1>
            
            {/* Kembali Label with Left Arrow Icon */}
            <span
                onClick={() => router.back()} // Navigate back to the previous page
                className="absolute top-4 left-4 text-blue-500 cursor-pointer hover:underline flex items-center"
            >
                <FaArrowLeft className="mr-1" /> Kembali
            </span>

            <h1 className="text-3xl font-extrabold text-blue-600 mb-6">Data Riwayat</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                    {/* Example Field: Masa Kerja Golongan */}
                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            Jabatan Aktif:
                        </label>
                        <div className="flex items-center w-2/6">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="jabatanAktif"
                                    value="Aktif"
                                    checked={formData.jabatanAktif === 'Aktif'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Aktif
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="jabatanAktif"
                                    value="Non-Aktif"
                                    checked={formData.jabatanAktif === 'Non-Aktif'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Non-Aktif
                            </label>
                        </div>
                    </div>

                    {/* Repeat for other fields */}
                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            Jenis Jabatan:
                        </label>
                        <div className="flex items-center w-2/6">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="jenisJabatan"
                                    value="Struktural"
                                    checked={formData.jenisJabatan === 'Struktural'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Struktural
                            </label>
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="jenisJabatan"
                                    value="JF"
                                    checked={formData.jenisJabatan === 'JF'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                JF
                            </label>
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="jenisJabatan"
                                    value="JFU"
                                    checked={formData.jenisJabatan === 'JFU'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                JFU
                            </label>
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="jenisJabatan"
                                    value="PLH"
                                    checked={formData.jenisJabatan === 'PLH'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                PLH
                            </label>
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="jenisJabatan"
                                    value="PLT"
                                    checked={formData.jenisJabatan === 'PLT'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                PLT
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="jenisJabatan"
                                    value="Tugas Tambahan"
                                    checked={formData.jenisJabatan === 'Tugas Tambahan'}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Tugas Tambahan
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            TMT:
                        </label>
                        <input
                            type="date"
                            name="tmt"
                            id="tmt"
                            value={formData.tmt}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    {/* Add more fields similarly */}
                    {/* Example for Satuan Kerja */}
                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2 ">
                            Satuan Kerja:
                        </label>
                        <input
                            type="text"
                            name="satuanKerja"
                            id="satuanKerja"
                            placeholder="Satuan Kerja"
                            value={formData.satuanKerja}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    {/* Continue adding other fields in the same format */}
                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            Unit Kerja:
                        </label>
                        <input
                            type="text"
                            name="unitKerja"
                            id="unitKerja"
                            placeholder="Unit Kerja"
                            value={formData.unitKerja}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            Jabatan:
                        </label>
                        <input
                            type="text"
                            name="jabatan"
                            id="jabatan"
                            placeholder="Jabatan"
                            value={formData.jabatan}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            Eselon:
                        </label>
                        <input
                            type="text"
                            name="eselon"
                            id="eselon"
                            placeholder="Eselon"
                            value={formData.eselon}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            Golongan:
                        </label>
                        <input
                            type="text"
                            name="golongan"
                            id="golongan"
                            placeholder="Golongan"
                            value={formData.golongan}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            TMT Pelantikan:
                        </label>
                        <input
                            type="date"
                            name="tmtPelantikan"
                            id="tmtPelantikan"
                            value={formData.tmtPelantikan}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            TMT Selesai:
                        </label>
                        <input
                            type="date"
                            name="tmtSelesai"
                            id="tmtSelesai"
                            value={formData.tmtSelesai}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            No SK:
                        </label>
                        <input
                            type="text"
                            name="noSK"
                            id="noSK"
                            placeholder="No SK"
                            value={formData.noSK}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            Tanggal SK:
                        </label>
                        <input
                            type="date"
                            name="tanggalSK"
                            id="tanggalSK"
                            value={formData.tanggalSK}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                            Penandatangan:
                        </label>
                        <input
                            type="text"
                            name="penandatangan"
                            id="penandatangan"
                            placeholder="Penandatangan"
                            value={formData.penandatangan}
                            onChange={handleChange}
                            className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                        />
                    </div>

                </div>
                <h1 className="text-3xl font-extrabold text-blue-600 mb-6">Berkas</h1>
                <div className="flex items-center mb-4">
                    <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                        File SK Jabatan Pelaksana:
                    </label>
                    <input
                        type="file"
                        name="fileSKJabatanPelaksana"
                        id="fileSKJabatanPelaksana"
                        onChange={handleChange}
                        className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                        File Surat Pernyataan Melaksanakan Tugas:
                    </label>
                    <input
                        type="file"
                        name="fileSuratPernyataanMelaksanakanTugas"
                        id="fileSuratPernyataanMelaksanakanTugas"
                        onChange={handleChange}
                        className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <label className="block text-gray-700 text-sm font-bold w-1/6 border rounded-md bg-teal-100 p-2">
                        File Surat Pernyataan Pelantikan:
                    </label>
                    <input
                        type="file"
                        name="fileSuratPernyataanPelantikan"
                        id="fileSuratPernyataanPelantikan"
                        onChange={handleChange}
                        className="shadow border rounded w-2/6 mr-2 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline border-gray-300"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default RiwayatJabatanPage;