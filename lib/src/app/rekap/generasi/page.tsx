"use client";

import React, { useEffect, useState } from 'react';
import RootLayout from '../../pegawai/profile/edit/layout'; // Import layout
import axios from 'axios'; // Import axios for API calls
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons"; // Import faEye and faEdit icons

interface RekapGenerasiData {
    no: number;
    satker: string;
    babyBoomers: number;
    generasiX: number;
    generasiY: number;
    generasiZ: number;
    generasiAlpha: number;
    jumlahSeluruh: number;
    pegawai_by_generation: any; // Add this to hold employee details
}

const RekapGenerasi: React.FC = () => {
    const [data, setData] = useState<RekapGenerasiData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<any[]>([]);
    const [modalTitle, setModalTitle] = useState<string>('');

    useEffect(() => {
        // Fetching data from the API
        const fetchData = async () => {
            try {
                const response = await fetch('/api/rekap/generasi');
                const apiData = await response.json();

                // Transform the API data into the format you expect
                const transformedData = apiData.map((item: any, index: number) => ({
                    no: index + 1,
                    satker: item.satuan_kerja_nama,
                    babyBoomers: item.pegawai_by_generation['Baby Boomers']?.count || 0,
                    generasiX: item.pegawai_by_generation['Generation X']?.count || 0,
                    generasiY: item.pegawai_by_generation['Millennials (Generation Y)']?.count || 0,
                    generasiZ: item.pegawai_by_generation['Generation Z']?.count || 0,
                    generasiAlpha: item.pegawai_by_generation['Generation Alpha']?.count || 0,
                    jumlahSeluruh: (
                        (item.pegawai_by_generation['Baby Boomers']?.count || 0) +
                        (item.pegawai_by_generation['Generation X']?.count || 0) +
                        (item.pegawai_by_generation['Millennials (Generation Y)']?.count || 0) +
                        (item.pegawai_by_generation['Generation Z']?.count || 0) +
                        (item.pegawai_by_generation['Generation Alpha']?.count || 0)
                    ),
                    pegawai_by_generation: item.pegawai_by_generation // Store employee details
                }));

                setData(transformedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Calculate total for each generation and total number
    const totalBabyBoomers = data.reduce((total, item) => total + item.babyBoomers, 0);
    const totalGenerasiX = data.reduce((total, item) => total + item.generasiX, 0);
    const totalGenerasiY = data.reduce((total, item) => total + item.generasiY, 0);
    const totalGenerasiZ = data.reduce((total, item) => total + item.generasiZ, 0);
    const totalGenerasiAlpha = data.reduce((total, item) => total + item.generasiAlpha, 0);
    const totalJumlahSeluruh = data.reduce((total, item) => total + item.jumlahSeluruh, 0);

    // Handle cell click event for modals
    const handleCellClick = (generation: string, rowData: RekapGenerasiData) => {
        setModalTitle(generation);
        setModalData(rowData.pegawai_by_generation[generation]?.pegawai || []); // Get employee details for the selected generation
        setIsModalOpen(true);
    };

    return (
        <RootLayout>
            <div className="my-5">
                {/* Title */}
                <h1 className="text-center text-2xl font-bold text-[#3781c7] mb-2">
                    REKAPITULASI GENERASI
                </h1>
                <h1 className="text-center text-2xl font-bold text-[#3781c7] mb-2">
                    DI LINGKUNGAN LEMBAGA ADMINISTRASI NEGARA
                </h1>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-[#3781c7] rounded-lg">
                        <thead>
                            <tr className="bg-[#3781c7] text-white">
                                <th className="p-3 border border-[#f2bd1d] text-center font-bold uppercase text-sm" rowSpan={2}>
                                    No
                                </th>
                                <th className="p-3 border border-[#f2bd1d] text-center font-bold uppercase text-sm" rowSpan={2}>
                                    Nama Satker
                                </th>
                                <th className="p-3 border border-[#f2bd1d] text-center font-bold uppercase text-sm" colSpan={5}>
                                    Generasi
                                </th>
                                <th className="p-3 border border-[#f2bd1d] text-center font-bold uppercase text-sm" rowSpan={2}>
                                    Jumlah Seluruh
                                </th>
                            </tr>
                            <tr className="bg-[#3781c7] text-white">
                                <th className="p-2 border border-[#f2bd1d] text-center">Baby Boomers</th>
                                <th className="p-2 border border-[#f2bd1d] text-center">Generasi X</th>
                                <th className="p-2 border border-[#f2bd1d] text-center">Generasi Y</th>
                                <th className="p-2 border border-[#f2bd1d] text-center">Generasi Z</th>
                                <th className="p-2 border border-[#f2bd1d] text-center">Generasi Alpha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-3 text-center text-gray-500">
                                        No data available.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.no} className="bg-teal-50 hover:bg-teal-100">
                                        <td className="p-3 border border-[#f2bd1d] text-center">{item.no}</td>
                                        <td className="p-3 border border-[#f2bd1d]">{item.satker}</td>
                                        <td className="p-3 border border-[#f2bd1d] text-center cursor-pointer" onClick={() => handleCellClick('Baby Boomers', item)}>
                                            {item.babyBoomers}
                                        </td>
                                        <td className="p-3 border border-[#f2bd1d] text-center cursor-pointer" onClick={() => handleCellClick('Generasi X', item)}>
                                            {item.generasiX}
                                        </td>
                                        <td className="p-3 border border-[#f2bd1d] text-center cursor-pointer" onClick={() => handleCellClick('Generasi Y', item)}>
                                            {item.generasiY}
                                        </td>
                                        <td className="p-3 border border-[#f2bd1d] text-center cursor-pointer" onClick={() => handleCellClick('Generasi Z', item)}>
                                            {item.generasiZ}
                                        </td>
                                        <td className="p-3 border border-[#f2bd1d] text-center cursor-pointer" onClick={() => handleCellClick('Generasi Alpha', item)}>
                                            {item.generasiAlpha}
                                        </td>
                                        <td className="p-3 border border-[#f2bd1d] text-center">{item.jumlahSeluruh}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {/* Totals row */}
                        <tfoot>
                            <tr className="bg-[#87ceeb] text-white">
                                <td colSpan={2} className="p-3 border border-[#f2bd1d] text-center font-bold">Total</td>
                                <td className="p-3 border border-[#f2bd1d] text-center font-bold">{totalBabyBoomers}</td>
                                <td className="p-3 border border-[#f2bd1d] text-center font-bold">{totalGenerasiX}</td>
                                <td className="p-3 border border-[#f2bd1d] text-center font-bold">{totalGenerasiY}</td>
                                <td className="p-3 border border-[#f2bd1d] text-center font-bold">{totalGenerasiZ}</td>
                                <td className="p-3 border border-[#f2bd1d] text-center font-bold">{totalGenerasiAlpha}</td>
                                <td className="p-3 border border-[#f2bd1d] text-center font-bold">{totalJumlahSeluruh}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Modal for Employee Details */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Detail {modalTitle}</h2>
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border border-gray-300 text-left">Nama</th>
                                    <th className="p-2 border border-gray-300 text-left">NIP</th>
                                    <th className="p-2 border border-gray-300 text-left">Satuan Kerja</th>
                                    <th className="p-2 border border-gray-300 text-left">Unit Kerja Parent</th>
                                    <th className="p-2 border border-gray-300 text-left">Unit Kerja</th>
 <th className="p-2 border border-gray-300 text-left">Jabatan</th>
                                    <th className="p-2 border border-gray-300 text-left">Pilihan</th>
                                </tr>
                            </thead>
                           <tbody>
                                                               {modalData.map(({ peg_nip, peg_nama, satuan_kerja_nama, unit_kerja_parent_nama, unit_kerja_nama, jabatan_nama }, index) => (
                                                                   <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                                       <td className="p-2 border border-gray-300">{peg_nama}</td>
                                                                       <td className="p-2 border border-gray-300">{peg_nip}</td>
                                                                       <td className="p-2 border border-gray-300">{satuan_kerja_nama}</td>
                                                                       <td className="p-2 border border-gray-300">{unit_kerja_parent_nama}</td>
                                                                       <td className="p-2 border border-gray-300">{unit_kerja_nama}</td>
                                                                       <td className="p-2 border border-gray-300">{jabatan_nama}</td>
                                                                       <td className="p-2 border border-gray-300">
                                                                           <div className="flex gap-x-2">
                                                                               <button
                                                                                   className="bg-[#3781c7] text-white px-2 py-1 rounded hover:bg-[#2a5a8c] flex items-center"
                                                                                   onClick={() => window.open(`/pegawai/profile/edit/${peg_nip}`, "_blank")}
                                                                               >
                                                                                   <FontAwesomeIcon icon={faEye} className="mr-2" />
                                                                                   View
                                                                               </button>
                                                                               <button
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center"
                                                                                   onClick={() => window.open(`/edit-pegawai/${peg_nip}`, "_blank")}
                                                                               >
                                                                                   <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                                                                   Edit
                                                                               </button>
                                                                           </div>
                                                                       </td>
                                                                   </tr>
                                                               ))}
                                                           </tbody>
                        </table>
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </RootLayout>
    );
};

export default RekapGenerasi;