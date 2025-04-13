'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import RootLayout from '../../../pegawai/profile/edit/layout';

const ListPegawaiPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/employees'); // Replace with your API endpoint
            const data = Array.isArray(response.data) ? response.data : [];
            setData(data);
        } catch (error) {
            console.error('Error fetching employee data:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RootLayout>
            <div className="flex-4 h-full px-4 overflow-auto">
                <div className="text-center mb-10">
                    <h3 className="text-lg font-bold font-poppins">List Pegawai</h3>
                </div>

                {/* Show the Loading Spinner while data is loading */}
                {loading ? (
                    <div className="flex justify-center items-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">
                            <thead>
                                <tr className="bg-[#3781c7] text-white">
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Nama</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Login</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Update Data</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Progres</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">NPWP</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">SK CPNS</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">SK PNS</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Rekening Bank</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Karis/Karsu</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Riwayat Diklat Struktural</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Sertifikat PBJ</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">SKP</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">KGB</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Riwayat Pendidikan Tinggi</th>
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Riwayat Pangkat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((pegawai, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.nama}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.login}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.updateData}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.progres}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.npwp}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.skCpns}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.skPns}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.rekeningBank}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.karisKarsu}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.riwayatDiklatStruktural}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.sertifikatPbj}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.skp}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.kgb}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.riwayatPendidikanTinggi}</td>
                                            <td className="px-4 py-2 border border-[#f2bd1d]">{pegawai.riwayatPangkat}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={15} className="text-center py-4">
                                            No data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </RootLayout>
    );
};

export default ListPegawaiPage;
