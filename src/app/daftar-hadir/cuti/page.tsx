"use client";    
    
import axios from 'axios';    
import React, { useState, useEffect } from 'react';    
import RootLayout from '../../pegawai/profile/edit/layout'; // Layout import    
import LoadingSpinner from '../../../components/LoadingSpinner'; // Adjust the path to your LoadingSpinner file    
    
const CutiPage: React.FC = () => {    
    const [loading, setLoading] = useState(true);    
    const [data, setData] = useState<any[]>([]);    
    const [selectedYear, setSelectedYear] = useState('');    
    
    const years = Array.from(new Array(10), (val, index) => {    
        const year = new Date().getFullYear() - index; // Create an array of the last 10 years    
        return { value: year.toString(), label: year.toString() };    
    });    
    
    useEffect(() => {    
        const fetchUsernameFromSession = async (sessionId: string) => {    
            try {    
                const response = await axios.get(`/api/log_session?session_id=${sessionId}`, {    
                    headers: {    
                        'Cache-Control': 'no-cache',    
                        'Pragma': 'no-cache',    
                        'Expires': '0'    
                    }    
                });    
                return response.data.first_username; // Get first_username from response    
            } catch (error) {    
                console.error("Error fetching username:", error);    
                return null;    
            }    
        };    
    
        const fetchData = async () => {    
            const sessionId = localStorage.getItem('session_id'); // Get session_id from local storage    
            if (sessionId) {    
                const firstUsername = await fetchUsernameFromSession(sessionId);    
                if (firstUsername) {    
                    try {    
                        const response = await fetch(`/api/riwayat/cuti?peg_id=${firstUsername}`);    
                        if (!response.ok) {    
                            throw new Error('Network response was not ok');    
                        }    
                        const data = await response.json();    
                        setData(data);    
                    } catch (error) {    
                        console.error('Error fetching data:', error);    
                    }    
                }    
            }    
            setLoading(false);    
        };    
    
        fetchData();    
    }, []);    
    
    const filteredData = data.filter(item => {    
        const cutiStartYear = item.cuti_mulai.split('-')[0]; // Extract year from cuti_mulai    
        return selectedYear === '' || cutiStartYear === selectedYear;    
    });    
    
    return (    
        <RootLayout>    
            <div className="overflow-x-auto p-5">    
                <h2 className="text-2xl font-bold mb-4 text-center">RIWAYAT CUTI</h2>    
                {loading ? (    
                    <LoadingSpinner />    
                ) : (    
                    <>    
                        <div className="mb-4">    
                            <label htmlFor="year" className="text-sm font-bold">Pilih Tahun:</label>    
                            <select    
                                id="year"    
                                value={selectedYear}    
                                onChange={(e) => setSelectedYear(e.target.value)}    
                                className="ml-2 p-2 border border-gray-300 rounded"    
                            >    
                                <option value="">Semua Tahun</option>    
                                {years.map(year => (    
                                    <option key={year.value} value={year.value}>    
                                        {year.label}    
                                    </option>    
                                ))}    
                            </select>    
                        </div>    
                        <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">    
                            <thead>    
                                <tr className="bg-[#3781c7] text-white">    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Jenis Cuti    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Tanggal Mulai    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Tanggal Selesai    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Alasan Cuti    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Alamat Cuti    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Diketahui Oleh    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Disetujui Oleh    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Entry by    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Tanggal Entry    
                                    </th>    
                                </tr>    
                            </thead>    
                            <tbody>    
                                {filteredData.map((item, index) => (    
                                    <tr key={item.cuti_id} className={index % 2 === 0 ? 'bg-[#87ceeb]' : 'bg-white'}>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.jeniscuti_nama} {/* You may want to map this to a more descriptive label */}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.cuti_mulai}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.cuti_selesai}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.alasan_cuti}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.alamat_cuti}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.diketahui_nama}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.disetujui_nama}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.entry_nama}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.tgl_entry}    
                                        </td>    
                                    </tr>    
                                ))}    
                            </tbody>    
                        </table>    
                    </>    
                )}    
            </div>    
        </RootLayout>    
    );    
};    
    
export default CutiPage;    
