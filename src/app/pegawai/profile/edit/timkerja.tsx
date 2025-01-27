'use client';  
import React, { useState, useEffect } from "react";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus } from "@fortawesome/free-solid-svg-icons";  
import axios from "axios";  
  
const Riwayattimkerja = () => {  
    interface DataTimKerja {  
        id?: string;  
        no: number;  
        namakegiatan: string;  
        peran: string;  
        nomorsk: string;  
        tahun: number; // Change to number  
        tingkat: string;  
        penandatangan: string;  
        peg_id?: string;  
    }  
  
    const [data, setData] = useState<DataTimKerja[]>([]);  
    const [nip, setNip] = useState<string | null>(null);  
    const [form, setForm] = useState<DataTimKerja | null>(null);  
    const [error, setError] = useState<string | null>(null);  
  
    // Fetch the work history data  
    const fetchRiwayattimkerja = async (nip: string) => {  
        try {  
            const response = await axios.get(`/api/kinerja/timkerja?peg_id=${nip}`);  
            const mappedData = response.data.map((item: any, index: number) => ({  
                id: item.timkerja_id,  
                no: index + 1,  
                namakegiatan: item.timkerja_nama,  
                peran: item.timkerja_peran,  
                nomorsk: item.timkerja_nomor,  
                tahun: item.timkerja_tahun,  
                tingkat: item.timkerja_tingkat,  
                penandatangan: item.timkerja_penandatangan,  
            }));  
            setData(mappedData);  
        } catch (error) {  
            console.error("Error fetching data:", error);  
            setError("Failed to fetch data");  
        }  
    };  
  
    // Handle adding new data  
    const handleAdd = async () => {  
        try {  
            if (form) {  
                const newForm = { ...form, peg_id: form.peg_id || nip }; // Ensure peg_id is set  
                newForm.tahun = Number(newForm.tahun); // Ensure tahun is a number  
                await axios.post("/api/kinerja/timkerja", newForm);  
                setForm(null);  
                fetchRiwayattimkerja(nip!); // Refresh the list after adding  
            }  
        } catch (error) {  
            console.error("Error adding data:", error);  
            setError("Failed to add data");  
        }  
    };  
  
    // Extract NIP from the URL  
    useEffect(() => {  
        const path = window.location.pathname;  
        const segments = path.split("/");  
        const nipFromUrl = segments[segments.length - 1];  
        setNip(nipFromUrl);  
    }, []);  
  
    // Fetch data whenever NIP changes  
    useEffect(() => {  
        if (nip) {  
            fetchRiwayattimkerja(nip);  
        }  
    }, [nip]);  
  
    return (  
        <div id="timkerja" className="p-8">  
            <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
                Riwayat Tim Kerja  
            </h3>  
  
            {error && <div className="text-red-500">{error}</div>}  
  
            <div className="flex justify-end mb-4">  
                <button  
                    className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"  
                    onClick={() => {  
                        setForm({  
                            no: 0,  
                            namakegiatan: "",  
                            peran: "",  
                            nomorsk: "",  
                            tahun: 0, // Initialize as a number  
                            tingkat: "",  
                            penandatangan: "",  
                        });  
                    }}  
                >  
                    <FontAwesomeIcon icon={faPlus} /> Tambah  
                </button>  
            </div>  
  
            {form && (  
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">  
                    <div className="bg-white w-3/4 md:w-1/2 p-6 rounded shadow-lg">  
                        <h4 className="text-lg font-semibold mb-4">  
                            Tambah Data  
                        </h4>  
                        <div className="space-y-4">  
                            {/* Form Fields */}  
                            {["namakegiatan", "peran", "nomorsk", "tahun", "tingkat", "penandatangan"].map((field) => (  
                                <div className="flex flex-col space-y-2" key={field}>  
                                    <label className="text-sm font-semibold">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>  
                                    <input  
                                        className="block w-full p-2 border"  
                                        placeholder={field.replace(/([A-Z])/g, ' $1')}  
                                        value={form[field as keyof DataTimKerja]}  
                                        onChange={(e) => setForm({ ...form!, [field]: e.target.value })}  
                                    />  
                                </div>  
                            ))}  
                            <div className="flex justify-end space-x-4 mt-4">  
                                <button  
                                    className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]"  
                                    onClick={handleAdd} // Handle Add  
                                >  
                                    Simpan  
                                </button>  
                                <button  
                                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"  
                                    onClick={() => setForm(null)} // Cancel action  
                                >  
                                    Batal  
                                </button>  
                            </div>  
                        </div>  
                    </div>  
                </div>  
            )}  
  
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
                <thead className="bg-[#3781c7] text-white">  
                    <tr className="text-sm uppercase">  
                        <th className="p-3 border border-[#f2bd1d]">No</th>  
                        <th className="p-3 border border-[#f2bd1d]">Nama Kegiatan</th>  
                        <th className="p-3 border border-[#f2bd1d]">Peran</th>  
                        <th className="p-3 border border-[#f2bd1d]">Nomor SK</th>  
                        <th className="p-3 border border-[#f2bd1d]">Tahun</th>  
                        <th className="p-3 border border-[#f2bd1d]">Tingkat</th>  
                        <th className="p-3 border border-[#f2bd1d]">Penandatangan</th>  
                    </tr>  
                </thead>  
                <tbody>  
                    {data.length === 0 ? (  
                        <tr>  
                            <td colSpan={7} className="text-center p-4">  
                                Tidak ada data.  
                            </td>  
                        </tr>  
                    ) : (  
                        data.map((item, index) => (  
                            <tr key={item.id} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                                <td className="p-3 border border-[#f2bd1d]">{index + 1}</td>  
                                <td className="p-3 border border-[#f2bd1d]">{item.namakegiatan}</td>  
                                <td className="p-3 border border-[#f2bd1d]">{item.peran}</td>  
                                <td className="p-3 border border-[#f2bd1d]">{item.nomorsk}</td>  
                                <td className="p-3 border border-[#f2bd1d]">{item.tahun}</td>  
                                <td className="p-3 border border-[#f2bd1d]">{item.tingkat}</td>  
                                <td className="p-3 border border-[#f2bd1d]">{item.penandatangan}</td>  
                            </tr>  
                        ))  
                    )}  
                </tbody>  
            </table>  
        </div>  
    );  
};  
  
export default Riwayattimkerja;  
