"use client";  
  
import React, { useState } from 'react';  
import RootLayout from '../../pegawai/profile/edit/layout';  
import axios from 'axios';  
  
const SearchPage: React.FC = () => {  
    const [query, setQuery] = useState('');    
    const [data, setData] = useState<any>(null);   
    const [error, setError] = useState<string | null>(null);   
    const [loading, setLoading] = useState(false);   
  
    const handleSearch = async () => {  
        setLoading(true);    
        setError(null);       
        setData(null);        
  
        try {  
            let url = `/api/pegawai/pencarian?`;  
  
            if (query) {  
                if (isNaN(Number(query))) {  
                    url += `peg_nama=${query}`;  
                } else {  
                    url += `peg_id=${query}`;  
                }  
            }  
  
            const response = await fetch(url);  
            if (!response.ok) {  
                throw new Error('Failed to fetch data');  
            }  
            const result = await response.json();  
  
            setData(result);  
  
        } catch (err: any) {  
            setError(err.message);   
        } finally {  
            setLoading(false);   
        }  
    };  
  
    return (  
        <RootLayout>  
            <div className="flex justify-start items-start h-screen p-5">  
                <div className="border-2 border-[#3781c7] p-5 rounded-lg text-center w-full max-w-md mb-5">  
                    <h1 className="text-xl font-bold font-poppins mb-5">Halaman Pencarian</h1>  
                    <div className="flex gap-2 mb-5">  
                        <input  
                            type="text"  
                            value={query}  
                            onChange={(e) => setQuery(e.target.value)}  
                            placeholder="cari berdasarkan nip atau nama"  
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3781c7]"  
                        />  
                        <button  
                            onClick={handleSearch}  
                            className="bg-[#3781c7] text-white px-4 py-2 rounded-md hover:bg-[#2a5a8c] transition-colors"  
                        >  
                            Search  
                        </button>  
                    </div>  
  
                    {loading && <p>Loading...</p>}  
                    {error && <p className="text-red-500">{error}</p>}  
                    {data && data.length === 0 && <p>No data found</p>}  
                </div>  
  
                {data && data.length > 0 && (  
                    <div className="w-full">  
                        <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
                            <thead className="bg-[#3781c7] text-white">  
                                <tr className="text-sm uppercase">  
                                    <th className="p-3 border border-[#f2bd1d]">Nama</th>  
                                    <th className="p-3 border border-[#f2bd1d]">NIP</th>  
                                    <th className="p-3 border border-[#f2bd1d]">Satuan Kerja</th>  
                                    <th className="p-3 border border-[#f2bd1d]">Status Pegawai</th>  
                                    <th className="p-3 border border-[#f2bd1d]">Status Edit</th>  
                                    <th className="p-3 border border-[#f2bd1d]">Aksi</th>  
                                </tr>  
                            </thead>  
                            <tbody>  
                                {data.map((item: any, index: number) => (  
                                    <tr  
                                        key={item.peg_id}  
                                        className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}  
                                    >  
                                        <td className="p-3 border border-[#f2bd1d]">{item.peg_nama}</td>  
                                        <td className="p-3 border border-[#f2bd1d]">{item.peg_nip}</td>  
                                        <td className="p-3 border border-[#f2bd1d]">  
                                            {item.m_spg_satuan_kerja?.satuan_kerja_nama || 'N/A'}  
                                        </td>  
                                        <td className="p-3 border border-[#f2bd1d]">  
                                            {item.peg_status ? 'Aktif' : 'Tidak Aktif'}  
                                            {!item.peg_status && item.peg_ketstatus && (  
                                                <div className="text-sm text-red-500">{item.peg_ketstatus}</div>  
                                            )}  
                                        </td>  
                                        <td className="p-3 border border-[#f2bd1d]"></td>  
                                        <td className="p-3 border border-[#f2bd1d]">  
                                            <button  
                                                className="bg-[#3781c7] text-white px-3 py-1 rounded-md hover:bg-[#2a5a8c] transition-colors"  
                                                onClick={() => window.open(`/pegawai/profile/edit/${item.peg_nip}`, "_blank")}  
                                            >  
                                                Lihat Detail  
                                            </button>  
                                        </td>  
                                    </tr>  
                                ))}  
                            </tbody>  
                        </table>  
                    </div>  
                )}  
            </div>  
        </RootLayout>  
    );  
};  
  
export default SearchPage;  
