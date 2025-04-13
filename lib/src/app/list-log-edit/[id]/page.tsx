"use client";

import React, { useEffect, useState } from 'react';  
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js
import { use } from 'react'; // Import use from react
  
const LogOperatorPage = ({ params }: { params: Promise<{ id: string }> }) => {  
    const unwrappedParams = use(params); // Unwrap the params promise
    const [data, setData] = useState<any>(null);  
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState<string | null>(null);  
  
    useEffect(() => {  
        const fetchData = async () => {  
            try {  
                const response = await fetch(`/api/action-log?id=${unwrappedParams.id}`); // Fetch data using ID  
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
  
        fetchData();  
    }, [unwrappedParams.id]);  
  
    if (loading) return <p>Loading...</p>;  
    if (error) return <p>Error: {error}</p>;  
  
    return (  
        <RootLayout>

        
        <div className="p-8">  
            <h1 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
                Log Operator {data?.nama}  
            </h1>  
            <h2 className="text-center mb-4">Total Actions: {data?.count}</h2>  
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
                <thead className="bg-[#3781c7] text-white">  
                    <tr>  
                        <th className="p-3 border border-[#f2bd1d]">Nama Pegawai</th>
                        <th className="p-3 border border-[#f2bd1d]">Aksi</th>  
                        <th className="p-3 border border-[#f2bd1d]">Waktu</th>  
                    </tr>  
                </thead>  
                <tbody>  
                    {data?.actions.length === 0 ? (  
                        <tr>  
                            <td colSpan={2} className="text-center p-4">  
                                Tidak ada aksi yang ditemukan.  
                            </td>  
                        </tr>  
                    ) : (  
                        data.actions.map((action: any, index: number) => (  
                            <tr key={`${action.entity_id}-${index}`} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                                <td className="p-3 border border-[#f2bd1d]">{data?.entity_id}</td>
                                <td className="p-3 border border-[#f2bd1d]">{action.aksi}</td>  
                                <td className="p-3 border border-[#f2bd1d]">{new Date(action.time).toLocaleString('id-ID')}</td>  
                            </tr>  
                        ))  
                    )}  
                </tbody>  
            </table>  
        </div>  
        </RootLayout>
    );  
};  
  
export default LogOperatorPage;
