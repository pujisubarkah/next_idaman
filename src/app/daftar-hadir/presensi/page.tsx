"use client";    
    
import axios from 'axios';    
import React, { useState, useEffect } from 'react';    
import RootLayout from '../../pegawai/profile/edit/layout'; // Layout import    
import LoadingSpinner from '../../../components/LoadingSpinner'; // Sesuaikan dengan path file LoadingSpinner Anda    
    
const PresensiPage: React.FC = () => {    
    const [loading, setLoading] = useState(true);    
    const [data, setData] = useState<any[]>([]);    
    const [selectedMonth, setSelectedMonth] = useState('');    
    
    const months = [    
        { value: '01', label: 'Januari' },    
        { value: '02', label: 'Februari' },    
        { value: '03', label: 'Maret' },    
        { value: '04', label: 'April' },    
        { value: '05', label: 'Mei' },    
        { value: '06', label: 'Juni' },    
        { value: '07', label: 'Juli' },    
        { value: '08', label: 'Agustus' },    
        { value: '09', label: 'September' },    
        { value: '10', label: 'Oktober' },    
        { value: '11', label: 'November' },    
        { value: '12', label: 'Desember' },    
    ];    
    
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
                return response.data.first_username; // Ambil first_username dari response    
            } catch (error) {    
                console.error("Error fetching username:", error);    
                return null;    
            }    
        };    
    
        const fetchData = async () => {    
            const sessionId = localStorage.getItem('session_id'); // Ambil session_id dari local storage    
            if (sessionId) {    
                const firstUsername = await fetchUsernameFromSession(sessionId);    
                if (firstUsername) {    
                    try {    
                        const response = await fetch(`/api/absen_pegawai?peg_id=${firstUsername}`);    
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
        const [year, month] = item.tanggal.split('T')[0].split('-');    
        return selectedMonth === '' || month === selectedMonth;    
    });    
    
    const getDayName = (dateString: string): string => {    
        const [year, month, day] = dateString.split('T')[0].split('-');    
        const date = new Date(`${year}-${month}-${day}`);    
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];    
        return days[date.getDay()];    
    };    
    
    const getDayClass = (dateString: string): string => {    
        const [year, month, day] = dateString.split('T')[0].split('-');    
        const date = new Date(`${year}-${month}-${day}`);    
        const dayOfWeek = date.getDay();    
        return dayOfWeek === 0 || dayOfWeek === 6 ? 'text-red-500' : '';    
    };    
    
    const calculateDuration = (jammasuk: string, jampulang: string): string => {    
        const masukTime = new Date(jammasuk);    
        const pulangTime = new Date(jampulang);    
        const duration = (pulangTime.getTime() - masukTime.getTime()) / (1000 * 60 * 60);    
        return duration.toFixed(2);    
    };    
    
    const formatTimeUTC = (dateTimeString: string): string => {    
        const date = new Date(dateTimeString);    
        const hours = date.getUTCHours().toString().padStart(2, '0');    
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');    
        return `${hours}:${minutes}`;    
    };    
    
    return (    
        <RootLayout>    
            <div className="overflow-x-auto p-5">    
                <h2 className="text-2xl font-bold mb-4 text-center">MONITORING PRESENSI</h2>    
                {loading ? (    
                    <LoadingSpinner />    
                ) : (    
                    <>    
                        <div className="mb-4">    
                            <label htmlFor="month" className="text-sm font-bold">Pilih Bulan:</label>    
                            <select    
                                id="month"    
                                value={selectedMonth}    
                                onChange={(e) => setSelectedMonth(e.target.value)}    
                                className="ml-2 p-2 border border-gray-300 rounded"    
                            >    
                                <option value="">Semua Bulan</option>    
                                {months.map(month => (    
                                    <option key={month.value} value={month.value}>    
                                        {month.label}    
                                    </option>    
                                ))}    
                            </select>    
                        </div>    
                        <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">    
                            <thead>    
                                <tr className="bg-[#3781c7] text-white">    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Hari    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Tanggal    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Jam Masuk    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Jam Pulang    
                                    </th>    
                                    <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">    
                                        Durasi (Jam)    
                                    </th>    
                                </tr>    
                            </thead>    
                            <tbody>    
                                {filteredData.map((item, index) => (    
                                    <tr key={item.peg_id} className={index % 2 === 0 ? 'bg-[#87ceeb]' : 'bg-white'}>    
                                        <td className={`px-4 py-2 border border-[#f2bd1d] ${getDayClass(item.tanggal)}`}>    
                                            {getDayName(item.tanggal)}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d]">    
                                            {item.tanggal.split('T')[0].split('-').reverse().join('/')}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d] text-center">    
                                            {formatTimeUTC(item.jam_masuk)}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d] text-center">    
                                            {formatTimeUTC(item.jam_pulang)}    
                                        </td>    
                                        <td className="px-4 py-2 border border-[#f2bd1d] text-center">    
                                            {calculateDuration(item.jam_masuk, item.jam_pulang)}    
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
    
export default PresensiPage;    
