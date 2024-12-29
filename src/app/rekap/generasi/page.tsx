"use client";

import React, { useEffect, useState } from 'react';
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

interface RekapGenerasiData {
    no: number;
    satker: string;
    babyBoomers: number;
    generasiX: number;
    generasiY: number;
    generasiZ: number;
    generasiAlpha: number;
    jumlahSeluruh: number;
}

const RekapGenerasi: React.FC = () => {
    const [data, setData] = useState<RekapGenerasiData[]>([]);

    useEffect(() => {
        // Dummy data - this can later be replaced with an API fetch
        const fetchData = async () => {
            // Simulating API fetch
            const dummyData: RekapGenerasiData[] = [
                {
                    no: 1,
                    satker: 'Satker 1',
                    babyBoomers: 4,
                    generasiX: 6,
                    generasiY: 5,
                    generasiZ: 8,
                    generasiAlpha: 2,
                    jumlahSeluruh: 25,
                },
                {
                    no: 2,
                    satker: 'Satker 2',
                    babyBoomers: 7,
                    generasiX: 5,
                    generasiY: 9,
                    generasiZ: 6,
                    generasiAlpha: 3,
                    jumlahSeluruh: 30,
                },
            ];
            setData(dummyData);
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

    return (
        <RootLayout>
            <div className="my-5">
                {/* Title */}
                <h1 className="text-center text-2xl font-bold text-teal-800 mb-2">
                    REKAPITULASI GENERASI
                </h1>
                <h1 className="text-center text-2xl font-bold text-teal-800 mb-2">
                    DI LINGKUNGAN LEMBAGA ADMINISTRASI NEGARA
                </h1>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-teal-600 rounded-lg">
                        <thead>
                            <tr className="bg-teal-900 text-white">
                                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm" rowSpan={2}>
                                    No
                                </th>
                                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm" rowSpan={2}>
                                    Nama Satker
                                </th>
                                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm" colSpan={5}>
                                    Generasi
                                </th>
                                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm" rowSpan={2}>
                                    Jumlah Seluruh
                                </th>
                            </tr>
                            <tr className="bg-teal-900 text-white">
                                <th className="p-2 border border-teal-700 text-center">Baby Boomers</th>
                                <th className="p-2 border border-teal-700 text-center">Generasi X</th>
                                <th className="p-2 border border-teal-700 text-center">Generasi Y</th>
                                <th className="p-2 border border-teal-700 text-center">Generasi Z</th>
                                <th className="p-2 border border-teal-700 text-center">Generasi Alpha</th>
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
                                    <tr key={item.no} className="bg-teal-50">
                                        <td className="p-3 border border-teal-300 text-center">{item.no}</td>
                                        <td className="p-3 border border-teal-300">{item.satker}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.babyBoomers}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.generasiX}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.generasiY}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.generasiZ}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.generasiAlpha}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.jumlahSeluruh}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {/* Totals row */}
                        <tfoot>
                            <tr className="bg-teal-600 text-white">
                                <td colSpan={2} className="p-3 border border-teal-700 text-center font-bold">Total</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalBabyBoomers}</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalGenerasiX}</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalGenerasiY}</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalGenerasiZ}</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalGenerasiAlpha}</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalJumlahSeluruh}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </RootLayout>
    );
};

export default RekapGenerasi;
