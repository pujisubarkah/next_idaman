"use client";

import React, { useEffect, useState } from 'react';
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

interface RekapGolonganData {
    no: number;
    satker: string;
    lakiLaki: number;
    perempuan: number;
    jumlahSeluruh: number;
}

const RekapJenisKelamin: React.FC = () => {
    const [data, setData] = useState<RekapGolonganData[]>([]);

    useEffect(() => {
        // Dummy data - this can later be replaced with an API fetch
        const fetchData = async () => {
            // Simulating API fetch
            const dummyData: RekapGolonganData[] = [
                {
                    no: 1,
                    satker: 'Satker 1',
                    lakiLaki: 5,
                    perempuan: 3,
                    jumlahSeluruh: 8,
                },
                {
                    no: 2,
                    satker: 'Satker 2',
                    lakiLaki: 7,
                    perempuan: 2,
                    jumlahSeluruh: 9,
                },
            ];
            setData(dummyData);
        };

        fetchData();
    }, []);

    // Calculate total for each gender and total number
    const totalLakiLaki = data.reduce((total, item) => total + item.lakiLaki, 0);
    const totalPerempuan = data.reduce((total, item) => total + item.perempuan, 0);
    const totalJumlahSeluruh = data.reduce((total, item) => total + item.jumlahSeluruh, 0);

    return (
        <RootLayout>
            <div className="my-5">
                {/* Title */}
                <h1 className="text-center text-2xl font-bold text-teal-800 mb-2">
                    REKAPITULASI APARATUR SIPIL NEGARA
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
                                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm" colSpan={2}>
                                    Jenis Kelamin
                                </th>
                                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm" rowSpan={2}>
                                    Jumlah Seluruh
                                </th>
                            </tr>
                            <tr className="bg-teal-900 text-white">
                                <th className="p-2 border border-teal-700 text-center">Laki-laki</th>
                                <th className="p-2 border border-teal-700 text-center">Perempuan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-3 text-center text-gray-500">
                                        No data available.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.no} className="bg-teal-50">
                                        <td className="p-3 border border-teal-300 text-center">{item.no}</td>
                                        <td className="p-3 border border-teal-300">{item.satker}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.lakiLaki}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.perempuan}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.jumlahSeluruh}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {/* Totals row */}
                        <tfoot>
                            <tr className="bg-teal-500 text-white">
                                <td colSpan={2} className="p-3 border border-teal-700 text-center font-bold">Total</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalLakiLaki}</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalPerempuan}</td>
                                <td className="p-3 border border-teal-700 text-center font-bold">{totalJumlahSeluruh}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </RootLayout>
    );
};

export default RekapJenisKelamin;
