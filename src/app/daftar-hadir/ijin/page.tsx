"use client";  
import axios from 'axios';  
import React, { useState, useEffect } from 'react';  
import RootLayout from '../../pegawai/profile/edit/layout'; // Layout import  
import LoadingSpinner from '../../../components/LoadingSpinner'; // Adjust the path to your LoadingSpinner file  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface CutiData {
    cuti_id: string;
    cuti_mulai: string;
    tgl_awal: string;
    tgl_akhir: string;
    jml_hari: number;
    bukti_ijin: string;
    m_spg_ijin: {
        ijin_nm: string;
    };
}

const CutiPage: React.FC = () => {  
    const [loading, setLoading] = useState(true);  
    const [data, setData] = useState<CutiData[]>([]);  
    const [selectedYear, setSelectedYear] = useState('');  

    const years = Array.from(new Array(10), (val, index) => {  
        const year = new Date().getFullYear() - index;  
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
                return response.data.first_username;  
            } catch (error) {  
                console.error("Error fetching username:", error);  
                return null;  
            }  
        };  

        const fetchData = async () => {  
            const sessionId = localStorage.getItem('session_id');  
            if (sessionId) {  
                const firstUsername = await fetchUsernameFromSession(sessionId);  
                if (firstUsername) {  
                    try {  
                        const response = await fetch(`/api/riwayat/ijin?peg_id=${firstUsername}`);  
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
        const cutiStartYear = item.tgl_awal ? item.tgl_akhir.split('-')[0] : '';  
        return selectedYear === '' || cutiStartYear === selectedYear;  
    });  

    return (  
        <RootLayout>  
            <div className="overflow-x-auto p-5">  
                <h2 className="text-2xl font-bold mb-4 text-center">Riwayat Ijin</h2>  
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
                        <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">  
                            <thead>  
                                <tr className="bg-teal-900 text-white">  
                                    <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">  
                                        Jenis Ijin  
 </th>  
                                    <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">  
                                        Tanggal Mulai  
                                    </th>  
                                    <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">  
                                        Tanggal Selesai  
                                    </th>  
                                    <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">  
                                       Jumlah Hari  
                                    </th>  
                                    <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">  
                                        Bukti Ijin/Surat Tugas  
                                    </th>  
                                    <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">  
                                       Pilihan  
                                    </th>  
                                </tr>  
                            </thead>  
                            <tbody>  
                                {filteredData.map((item, index) => (  
                                    <tr key={item.cuti_id} className={index % 2 === 0 ? 'bg-teal-50' : 'bg-white'}>  
                                        <td className="px-4 py-2 border border-teal-300">  
                                            {item.m_spg_ijin.ijin_nm}  
                                        </td>  
                                        <td className="px-4 py-2 border border-teal-300">  
                                            {item.tgl_awal}  
                                        </td>  
                                        <td className="px-4 py-2 border border-teal-300">  
                                            {item.tgl_akhir}  
                                        </td>  
                                        <td className="px-4 py-2 border border-teal-300">  
                                            {item.jml_hari}  
                                        </td>  
                                        <td className="px-4 py-2 border border-teal-300">  
                                            {item.bukti_ijin}  
                                        </td>  
                                        <td className="px-4 py-2 border border-teal-300">  
                                            <div className="flex gap-x-2">  
                                                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center">  
                                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />  
                                                    Edit  
                                                </button>  
                                                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center">  
                                                    <FontAwesomeIcon icon={faTrash} className="mr-2" />  
                                                    Delete  
                                                </button>  
                                            </div>  
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
