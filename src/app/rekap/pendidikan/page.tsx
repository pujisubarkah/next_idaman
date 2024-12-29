"use client";

import React, { useEffect, useState } from 'react';
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

interface RekapGolonganData {
    no: number;
    satker: string;
    sd: number;
    sltp: number;
    slta: number;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    s1: number;
    s2: number;
    s3: number;
    belumTerdata: number;
    jumlahSeluruh: number;
}

const RekapGolonganPage: React.FC = () => {
    const [data, setData] = useState<RekapGolonganData[]>([]);

    useEffect(() => {
        // Dummy data - this can later be replaced with an API fetch
        const fetchData = async () => {
            // Simulating API fetch
            const dummyData: RekapGolonganData[] = [
                {
                    no: 1,
                    satker: 'Satker 1',
                    sd: 5,
                    sltp: 3,
                    slta: 7,
                    d1: 2,
                    d2: 4,
                    d3: 1,
                    d4: 0,
                    s1: 8,
                    s2: 3,
                    s3: 6,
                    belumTerdata: 0,
                    jumlahSeluruh: 39,
                },
                {
                    no: 2,
                    satker: 'Satker 2',
                    sd: 6,
                    sltp: 2,
                    slta: 5,
                    d1: 3,
                    d2: 1,
                    d3: 4,
                    d4: 0,
                    s1: 7,
                    s2: 5,
                    s3: 9,
                    belumTerdata: 1,
                    jumlahSeluruh: 42,
                },
            ];
            setData(dummyData);
        };

        fetchData();
    }, []);

    // Calculate totals per education level
    const calculateTotals = (data: RekapGolonganData[]) => {
        const totals = {
            sd: 0,
            sltp: 0,
            slta: 0,
            d1: 0,
            d2: 0,
            d3: 0,
            d4: 0,
            s1: 0,
            s2: 0,
            s3: 0,
            belumTerdata: 0,
            jumlahSeluruh: 0,
        };

        data.forEach(item => {
            totals.sd += item.sd;
            totals.sltp += item.sltp;
            totals.slta += item.slta;
            totals.d1 += item.d1;
            totals.d2 += item.d2;
            totals.d3 += item.d3;
            totals.d4 += item.d4;
            totals.s1 += item.s1;
            totals.s2 += item.s2;
            totals.s3 += item.s3;
            totals.belumTerdata += item.belumTerdata;
            totals.jumlahSeluruh += item.jumlahSeluruh;
        });

        return totals;
    };

    const totals = calculateTotals(data);

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
                                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm" rowSpan={2}>
                                    No
                                </th>
                                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm" rowSpan={2}>
                                    Nama Satker
                                </th>
                              
                                <th className="p-3 border border-teal-700 text-center font-bold uppercase text-sm" colSpan={10}>
                                    Tingkat Pendidikan
                                </th>
                                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm" rowSpan={2}>
                                    Belum Terdata
                                </th>
                                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm" rowSpan={2}>
                                    Jumlah Seluruh
                                </th>
                            </tr>
                            <tr className="bg-teal-900 text-white">
                                <th className="p-2 border border-teal-700 text-center">SD</th>
                                <th className="p-2 border border-teal-700 text-center">SLTP</th>
                                <th className="p-2 border border-teal-700 text-center">SLTA</th>
                                <th className="p-2 border border-teal-700 text-center">D1</th>
                                <th className="p-2 border border-teal-700 text-center">D2</th>
                                <th className="p-2 border border-teal-700 text-center">D3</th>
                                <th className="p-2 border border-teal-700 text-center">D4</th>
                                <th className="p-2 border border-teal-700 text-center">S1</th>
                                <th className="p-2 border border-teal-700 text-center">S2</th>
                                <th className="p-2 border border-teal-700 text-center">S3</th>
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
                                data.map((item) => (
                                    <tr key={item.no} className="bg-teal-50">
                                        <td className="p-3 border border-teal-300 text-center">{item.no}</td>
                                        <td className="p-3 border border-teal-300">{item.satker}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.sd}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.sltp}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.slta}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.d1}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.d2}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.d3}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.d4}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.s1}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.s2}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.s3}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.belumTerdata}</td>
                                        <td className="p-3 border border-teal-300 text-center">{item.jumlahSeluruh}</td>
                                    </tr>
                                ))
                            )}
                            {/* Total Row */}
                            <tr className="bg-teal-100 font-bold">
                                <td colSpan={2} className="p-3 text-center">Total</td>
                                <td className="p-3 text-center">{totals.sd}</td>
                                <td className="p-3 text-center">{totals.sltp}</td>
                                <td className="p-3 text-center">{totals.slta}</td>
                                <td className="p-3 text-center">{totals.d1}</td>
                                <td className="p-3 text-center">{totals.d2}</td>
                                <td className="p-3 text-center">{totals.d3}</td>
                                <td className="p-3 text-center">{totals.d4}</td>
                                <td className="p-3 text-center">{totals.s1}</td>
                                <td className="p-3 text-center">{totals.s2}</td>
                                <td className="p-3 text-center">{totals.s3}</td>
                                <td className="p-3 text-center">{totals.belumTerdata}</td>
                                <td className="p-3 text-center">{totals.jumlahSeluruh}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </RootLayout>
    );
};

export default RekapGolonganPage;
