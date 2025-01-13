"use client";  
  
import axios from 'axios';  
import React, { useState, useEffect } from 'react';  
import RootLayout from '../../pegawai/profile/edit/layout'; // Layout import  
import LoadingSpinner from '../../../components/LoadingSpinner'; // Adjust the path to your LoadingSpinner file  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faEdit, faTrash, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';  
  
const IjinPage: React.FC = () => {  
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const [loading, setLoading] = useState(true);  
    const [data, setData] = useState<any[]>([]);  
    const [selectedYear, setSelectedYear] = useState('');  
    const [modalData, setModalData] = useState<any[]>([]);  
  
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
        if (!item.tgl_awal) return false; // Ensure tgl_awal is defined  
        const ijinStartYear = item.tgl_awal.split('-')[0]; // Extract year from tgl_awal  
        return selectedYear === '' || ijinStartYear === selectedYear;  
    });  
  
    const handleShowPegawai = (pegawai) => {  
        setModalData(pegawai);  
        setIsModalOpen(true);  
    };  
  
    const closeModal = () => {  
        setIsModalOpen(false);  
        setModalData([]);  
    };  
  
    return (  
        <RootLayout>  
            <div className="overflow-x-auto p-5">  
                <h2 className="text-2xl font-bold mb-4 text-center">Riwayat Ijin</h2>  
                {loading ? (  
                    <LoadingSpinner />  
                ) : (  
                    <>  
                        <div className="text-right mb-4">  
                            <button className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a6a9a] flex items-center">  
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />  
                                Ijin harian  
                            </button>  
                        </div>  
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
                                        Jenis Ijin  
                                    </th>  
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">  
                                        Tanggal Mulai  
                                    </th>  
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">  
                                        Tanggal Selesai  
                                    </th>  
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">  
                                        Jumlah Hari  
                                    </th>  
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">  
                                        Bukti Ijin/Surat Tugas  
                                    </th>  
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">  
                                        Pilihan  
                                    </th>  
                                </tr>  
                            </thead>  
                            <tbody>  
                                {filteredData.map((item, index) => (  
                                    <tr key={item.cuti_id} className={index % 2 === 0 ? 'bg-[#87ceeb]' : 'bg-white'}>  
                                        <td className="px-4 py-2 border border-[#f2bd1d]">  
                                            {item.m_spg_ijin.ijin_nm} {/* You may want to map this to a more descriptive label */}  
                                        </td>  
                                        <td className="px-4 py-2 border border-[#f2bd1d]">  
                                            {item.tgl_awal}  
                                        </td>  
                                        <td className="px-4 py-2 border border-[#f2bd1d]">  
                                            {item.tgl_akhir}  
                                        </td>  
                                        <td className="px-4 py-2 border border-[#f2bd1d]">  
                                            {item.jml_hari}  
                                        </td>  
                                        <td className="px-4 py-2 border border-[#f2bd1d]">  
                                            {item.bukti_ijin}  
                                        </td>  
                                        <td className="px-4 py-2 border border-[#f2bd1d]">  
                                            <div className="flex gap-x-2">  
                                                <button className="bg-[#3781c7] text-white px-2 py-1 rounded hover:bg-[#2a6a9a] flex items-center">  
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
                {isModalOpen && (  
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">  
                        <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%]">  
                            <h2 className="text-lg font-bold mb-4">Ijin Harian</h2>  
                            <div className="overflow-y-auto max-h-[400px]">  
                                <table className="w-full border border-gray-300">  
                                    <thead>  
                                        <tr className="bg-gray-100">  
                                            <th className="p-2 border border-gray-300 text-left">NIP</th>  
                                            <th className="p-2 border border-gray-300 text-left">Nama</th>  
                                            <th className="p-2 border border-gray-300 text-left">Satuan Kerja</th>  
                                            <th className="p-2 border border-gray-300 text-left">Aksi</th>  
                                        </tr>  
                                    </thead>  
                                    <tbody>  
                                        {modalData.map(({ peg_nip, peg_nama, satuan_kerja_nama }, index) => (  
                                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>  
                                                <td className="p-2 border border-gray-300">{peg_nip}</td>  
                                                <td className="p-2 border border-gray-300">{peg_nama}</td>  
                                                <td className="p-2 border border-gray-300">{satuan_kerja_nama}</td>  
                                                <td className="p-2 border border-gray-300">  
                                                    <div className="flex gap-x-2">  
                                                        <button  
                                                            className="bg-[#3781c7] text-white px-2 py-1 rounded hover:bg-[#2a6a9a] flex items-center"  
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
                                onClick={closeModal}  
                            >  
                                Close  
                            </button>  
                        </div>  
                    </div>  
                )}  
            </div>  
        </RootLayout>  
    );  
};  
  
export default IjinPage;  

