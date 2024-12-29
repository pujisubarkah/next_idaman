"use client";

import React, { useState } from 'react';

const PresensiTable = () => {
    const data = {
        "Satuan Kerja 1": [
            {
                no: 1,
                namaNip: 'John Doe / 123456',
                presensi: [5, 2, 1, 0, 3, 4, 1, 0, 1, 0],
                absen: [1, 1, 1, 0, 3],
                jamMasuk: '08:00',
                jamPulang: '17:00',
            },
            {
                no: 2,
                namaNip: 'Jane Smith / 789012',
                presensi: [4, 3, 0, 1, 5, 3, 2, 1, 0, 0],
                absen: [0, 2, 0, 1, 1],
                jamMasuk: '08:15',
                jamPulang: '17:05',
            },
        ],
        "Satuan Kerja 2": [
            {
                no: 1,
                namaNip: 'Alice Johnson / 345678',
                presensi: [3, 2, 1, 1, 2, 3, 0, 1, 0, 1],
                absen: [1, 0, 0, 0, 2],
                jamMasuk: '09:00',
                jamPulang: '18:00',
            },
            {
                no: 2,
                namaNip: 'Bob Brown / 234567',
                presensi: [4, 1, 2, 0, 3, 2, 1, 0, 1, 0],
                absen: [0, 1, 0, 0, 0],
                jamMasuk: '08:45',
                jamPulang: '17:30',
            },
        ],
    };

    const [selectedSatuanKerja, setSelectedSatuanKerja] = useState('Satuan Kerja 1');
    const [currentData, setCurrentData] = useState(data['Satuan Kerja 1']);

    const handleSatuanKerjaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        setSelectedSatuanKerja(selected);
        setCurrentData(data[selected]);
    };

    return (
        <div className="overflow-x-auto p-5">
        <h2 className="text-xl font-bold mb-4 text-center">Daftar Kehadiran Pegawai</h2>
        
            {/* Dropdown for selecting Satuan Kerja */}
            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="satuanKerja">Pilih Satuan Kerja:</label>
                <select
                    id="satuanKerja"
                    value={selectedSatuanKerja}
                    onChange={handleSatuanKerjaChange}
                    style={{ padding: "10px", marginLeft: "10px" }}
                >
                    <option value="Satuan Kerja 1">Satuan Kerja 1</option>
                    <option value="Satuan Kerja 2">Satuan Kerja 2</option>
                </select>
            </div>

            {/* Table */}
            

            <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
                <thead>
                    <tr className="bg-teal-900 text-white">
                        <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                            No
                        </th>
                        <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                            Nama/NIP
                        </th>
                        <th colSpan={10} className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">
                            Tingkat Presensi
                        </th>
                        <th colSpan={5} className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">
                            Tidak Hadir Sehari Penuh
                        </th>
                        <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                            Jam Masuk
                        </th>
                        <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                            Jam Pulang
                        </th>
                    </tr>
                    <tr className="bg-teal-900 text-white">
                        {['D', 'S', 'I', 'TK', 'Pulang Tepat Waktu', 'D', 'S', 'I', 'K', 'TK'].map((item, index) => (
                            <th key={index} className="p-2 border border-teal-700 text-left font-bold uppercase text-xs">
                                {item}
                            </th>
                        ))}
                        {['D', 'S', 'I', 'C', 'TK'].map((item, index) => (
                            <th key={index} className="p-2 border border-teal-700 text-left font-bold uppercase text-xs">
                                {item}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                            <td className="px-4 py-2 border border-teal-300">{row.no}</td>
                            <td className="px-4 py-2 border border-teal-300">{row.namaNip}</td>
                            {row.presensi.map((val, idx) => (
                                <td key={idx} className="px-4 py-2 border border-teal-300">{val}</td>
                            ))}
                            {row.absen.map((val, idx) => (
                                <td key={idx} className="px-4 py-2 border border-teal-300">{val}</td>
                            ))}
                            <td className="px-4 py-2 border border-teal-300">{row.jamMasuk}</td>
                            <td className="px-4 py-2 border border-teal-300">{row.jamPulang}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-5">
                <p className="text-sm">
                    <strong>Keterangan:</strong> D: Dinas Luar, S: Sakit, I: Ijin, TK: Tanpa Keterangan, K: Terlambat/Pulang Cepat, C: Cuti
                </p>
            </div>
        </div>
    );
};

export default PresensiTable;
