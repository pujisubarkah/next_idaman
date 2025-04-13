"use client";

import React, { useEffect, useState } from 'react';
import RootLayout from '../../pegawai/profile/edit/layout'; // Import layout
import axios from 'axios'; // Import axios for API calls
import LoadingSpinner from "../../../components/LoadingSpinner"; // Import your LoadingSpinner component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faEye, faEdit } from '@fortawesome/free-solid-svg-icons'; // Import faEye and faEdit icons

interface PegawaiByPendidikan {
    [key: string]: {
        peg_nama: string;
        peg_nip: string;
        satuan_kerja_nama: string;
        unit_kerja_parent_nama: string;
        unit_kerja_nama: string;
        eselon_nm: string;
        jabatan_nama: string;
        nm_tingpend_akhir: string;
    }[];
}

interface RekapGolonganData {
    satuan_kerja_id: number;
    satuan_kerja_nama: string;
    pegawai_by_pendidikan: PegawaiByPendidikan;
}

const RekapGolonganPage: React.FC = () => {
    const [data, setData] = useState<RekapGolonganData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalValue, setModalValue] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<any[]>([]);
    const [isPegawaiModalOpen, setIsPegawaiModalOpen] = useState<boolean>(false);

    // Define the education levels (columns)
    const pendidikanLevels = [
        'SD', 'SLTP', 'SLTA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3', 'belumTerdata'
    ];

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/rekap/pendidikan');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate totals based on pendidikan
    const calculateTotals = (data: RekapGolonganData[]) => {
        const totals = {
            SD: 0,
            SLTP: 0,
            SLTA: 0,
            D1: 0,
            D2: 0,
            D3: 0,
            D4: 0,
            S1: 0,
            S2: 0,
            S3: 0,
            belumTerdata: 0,
            jumlahSeluruh: 0,
        };

        data.forEach(item => {
            pendidikanLevels.forEach(level => {
                if (item.pegawai_by_pendidikan[level]) {
                    totals[level] += item.pegawai_by_pendidikan[level].length;
                }
            });
            totals.jumlahSeluruh += Object.values(item.pegawai_by_pendidikan).reduce((sum, arr) => sum + arr.length, 0);
        });

        return totals;
    };

    const totals = calculateTotals(data);

    // Handle cell click event for modals
    const handleCellClick = (level: string, rowData: RekapGolonganData) => {
        if (rowData.pegawai_by_pendidikan[level]) {
            setModalData(rowData.pegawai_by_pendidikan[level]);
            setModalTitle(level);
            setIsPegawaiModalOpen(true);
        }
    };

    return (
        <RootLayout>
            <div className="my-5">
                {/* Title */}
                <h1 className="text-center text-2xl font-bold text-[#3781c7] mb-2">
                    REKAPITULASI APARATUR SIPIL NEGARA
                </h1>
                <h1 className="text-center text-2xl font-bold text-[#3781c7] mb-2">
                    DI LINGKUNGAN LEMBAGA ADMINISTRASI NEGARA
                </h1>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <LoadingSpinner /> // Show loading spinner when data is fetching
                    ) : (
                        <table className="w-full border border-[#3781c7] rounded-lg">
                            <thead>
                                <tr className="bg-[#3781c7] text-white">
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm" rowSpan={2}>
                                        No
                                    </th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm" rowSpan={2}>
                                        Nama Satker
                                    </th>
                                    {/* Dynamically creating the headers based on pendidikanLevels */}
                                    {pendidikanLevels.map(level => (
                                        <th key={level} className="p-2 border border-[#f2bd1d] text-center">{level.toUpperCase()}</th>
                                    ))}
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm" rowSpan={2}>
                                        Jumlah Seluruh
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={13} className="p-3 text-center text-gray-500">
                                            No data available.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => (
                                        <tr key={item.satuan_kerja_id} className="bg-teal-50 hover:bg-teal-100">
                                            <td className="p-3 border border-[#f2bd1d] text-center">{index + 1}</td>
                                            <td className="p-3 border border-[#f2bd1d]">{item.satuan_kerja_nama}</td>
                                            {/* Dynamically displaying the data based on pendidikanLevels */}
                                            {pendidikanLevels.map(level => (
                                                <td key={level} className="p-3 border border-[#f2bd1d] text-center cursor-pointer" onClick={() => handleCellClick(level, item)}>
                                                    {item.pegawai_by_pendidikan[level]?.length || 0}
                                                </td>
                                            ))}
                                            <td className="p-3 border border-[#f2bd1d] text-center">
                                                {Object.values(item.pegawai_by_pendidikan).reduce((sum, arr) => sum + arr.length, 0)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {/* Total Row */}
                                <tr className="bg-[#87ceeb] font-bold">
                                    <td colSpan={2} className="p-3 text-center">Total</td>
                                    {/* Dynamically display totals for each pendidikan level */}
                                    {pendidikanLevels.map(level => (
                                        <td key={level} className="p-3 text-center">{totals[level]}</td>
                                    ))}
                                    <td className="p-3 text-center">{totals.jumlahSeluruh}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal for Detail Pegawai */}
            {isPegawaiModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%]">
                        <h2 className="text-lg font-bold mb-4">Detail Pegawai - {modalTitle}</h2>
                        <div className="overflow-y-auto max-h-[400px]">
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
                        </div>
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => setIsPegawaiModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </RootLayout>
    );
};

export default RekapGolonganPage;
