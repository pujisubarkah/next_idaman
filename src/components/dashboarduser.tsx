import React from 'react';  
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';  
  
const DashboardUser: React.FC = () => {  
    const data = [  
        { jenisDokumen: 'KTP', status: 'Lengkap', file: 'ktp.pdf', aksi: 'Lihat' },  
        { jenisDokumen: 'NPWP', status: 'Belum Lengkap', file: '', aksi: 'Unggah' },  
        { jenisDokumen: 'Ijazah', status: 'Lengkap', file: 'ijazah.pdf', aksi: 'Lihat' },  
    ];  
  
    return (  
        <div className="flex-4 h-full px-4 overflow-auto p-5">  
            <div className="text-center mb-10">  
                <h1 className="text-2xl font-bold font-poppins">Progress Data Primer Arsip Digital Pegawai</h1>  
                <h2 className="text-sm font-medium mt-2">  
                    Harap lengkapi data beserta arsip/dokumen digital berikut dengan menggunggahnya melalui halaman Data Pegawai  
                </h2>  
            </div>  
            <hr className="my-4 border-gray-300" />  
            <div className="overflow-x-auto">  
                <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">  
                    <thead>  
                        <tr className="bg-[#3781c7] text-white">  
                            <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jenis Dokumen</th>  
                            <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Status</th>  
                            <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">File</th>  
                            <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Aksi</th>  
                        </tr>  
                    </thead>  
                    <tbody>  
                        {data.map((item, index) => (  
                            <tr key={index} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>  
                                <td className="px-4 py-2 border border-[#f2bd1d]">{item.jenisDokumen}</td>  
                                <td className="px-4 py-2 border border-[#f2bd1d] text-center">  
                                    {item.status === 'Lengkap' ? (  
                                        <FaCheckCircle className="text-green-500 text-lg" title="Lengkap" />  
                                    ) : (  
                                        <FaTimesCircle className="text-red-500 text-lg" title="Belum Lengkap" />  
                                    )}  
                                </td>  
                                <td className="px-4 py-2 border border-[#f2bd1d]">  
                                    {item.file ? (  
                                        <a  
                                            href={`/${item.file}`}  
                                            target="_blank"  
                                            rel="noopener noreferrer"  
                                            className="text-[#3781c7] underline hover:underline"  
                                        >  
                                            {item.aksi}  
                                        </a>  
                                    ) : (  
                                        <span className="text-red-500">Belum Ada</span>  
                                    )}  
                                </td>  
                                <td className="px-4 py-2 border border-[#f2bd1d]">  
                                    {item.aksi === 'Unggah' ? (  
                                        <button className="bg-[#3781c7] text-white px-4 py-2 rounded hover:bg-[#2a6a9a]">  
                                            {item.aksi}  
                                        </button>  
                                    ) : (  
                                        <span>{item.aksi}</span>  
                                    )}  
                                </td>  
                            </tr>  
                        ))}  
                    </tbody>  
                </table>  
            </div>  
        </div>  
    );  
};  
  
export default DashboardUser;  
