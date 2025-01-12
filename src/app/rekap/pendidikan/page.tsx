"use client";  
  
import React, { useEffect, useState } from 'react';  
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js  
import axios from 'axios'; // Import axios for API calls  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon  
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons"; // Import faEye and faEdit icons  
  
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
  
    useEffect(() => {  
        // Mengambil data dari API  
        const fetchData = async () => {  
            const response = await fetch('/api/rekap/pendidikan');  
            const result = await response.json();  
            setData(result);  
        };  
  
        fetchData();  
    }, []);  
  
    // Define the education levels (columns)  
    const pendidikanLevels = [  
        'SD', 'SLTP', 'SLTA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3', 'belumTerdata'  
    ];  
  
    // Calculate the totals based on pendidikan  
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
                                            <td key={level} className="p-3 border border-[#f2bd1d] text-center">  
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
                </div>  
            </div>  
        </RootLayout>  
    );  
};  
  
export default RekapGolonganPage;  
