"use client";  
  
import React, { useState, useEffect } from 'react';  
import { useRouter, useParams } from 'next/navigation';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import axios from 'axios';  
import { faSearch, faEdit, faTrash, faFileExcel, faPlus } from '@fortawesome/free-solid-svg-icons';  
import RootLayout from '../../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js  
  
// Fungsi untuk memformat tanggal  
const formatDate = (dateString) => {  
  const options = { year: 'numeric' as 'numeric' | '2-digit', month: 'long' as 'numeric' | '2-digit' | 'long' | 'short' | 'narrow', day: 'numeric' as 'numeric' | '2-digit' };  
  return new Date(dateString).toLocaleDateString(undefined, options);  
};  
  
const ListPegawai = () => {  
  const [data, setData] = useState<any[]>([]);  // Change pegawai to data  
  const [unitKerjaNama, setUnitKerjaNama] = useState<string>(""); // Store unit_kerja_nama here  
  const [loading, setLoading] = useState<boolean>(true);  
  const router = useRouter();  
  const params = useParams();  
  const unit_kerja_id = params ? params.unit_kerja_id : null;  
  
  useEffect(() => {  
    let isMounted = true;  
    const fetchData = async () => {  
      if (!unit_kerja_id) {  
        console.error("unit_kerja_id tidak ditemukan.");  
        return;  
      }  
      setLoading(true);  
      try {  
        console.log("Fetching data for unit_kerja_id:", unit_kerja_id); // Log unit_kerja_id being used for the API request  
        const response = await axios.get(`/api/pegawai/unit_kerja`, {  
          params: { unit_kerja_id },  
          headers: { "Cache-Control": "no-cache" }, // Nonaktifkan caching  
        });  
  
        console.log("Response from API:", response); // Log the response from the API  
  
        if (isMounted) {  
          const fetchedData = Array.isArray(response.data) ? response.data : [];  
          setData(fetchedData);  
  
          // Check if the response has the unit_kerja_nama  
          if (response.data.data && response.data.data.unit_kerja_nama) {  
            setUnitKerjaNama(response.data.data.unit_kerja_nama); // Assuming this field is in the response  
          } else {  
            console.error("unit_kerja_nama tidak ditemukan di response");  
          }  
          console.log("Fetched data:", fetchedData); // Log the data being set to state  
        }  
      } catch (error) {  
        console.error("Error fetching data:", error); // Log any error during the API request  
      }  
      setLoading(false);  
    };  
    fetchData();  
  
    return () => {  
      isMounted = false;  
    };  
  }, [unit_kerja_id]);  
  
  return (  
    <RootLayout>  
      <div className="flex-4 h-full px-4 overflow-auto">  
        <div className="text-center mb-10">  
          <h3 className="text-lg font-bold font-poppins">DAFTAR PEGAWAI UNIT KERJA {unitKerjaNama ? unitKerjaNama : 'Loading...'}</h3>  
        </div>  
          
        <div className="flex justify-end items-center mb-4">  
          <button  
            onClick={() => window.location.href = '/tambah-pegawai'}  
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"  
            aria-label="Add Pegawai"  
          >  
            <FontAwesomeIcon icon={faPlus} className="mr-2" />  
            Tambah Pegawai  
          </button>  
        </div>  
  
        {loading ? (  
          <p>Loading...</p>  
        ) : (  
          <div className="overflow-x-auto">  
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">  
              <thead className="bg-[#3781c7] text-white">  
                <tr>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Nama/Tempat Tgl Lahir</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">NIP</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Gol</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">TMT Gol</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jabatan</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">TMT Jabatan</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Status</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">TMT Status</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Thn</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Bln</th>  
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">PILIHAN</th>  
                </tr>  
              </thead>  
              <tbody>  
                {data.length > 0 ? (  
                  data.map(({ peg_nama_lengkap, peg_lahir_tanggal, peg_lahir_tempat, peg_nip, gol_akhir, peg_gol_akhir_tmt, jabatan_nama, peg_jabatan_tmt, status_pegawai, peg_pns_tmt, masa_kerja_tahun, masa_kerja_bulan }, index) => (  
                    <tr key={index} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">  
                        {peg_nama_lengkap} {peg_lahir_tempat}, {formatDate(peg_lahir_tanggal) || "Tanggal Tidak Tersedia"}  
                      </td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{peg_nip}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{gol_akhir}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{formatDate(peg_gol_akhir_tmt) || "Tanggal Tidak Tersedia"}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{jabatan_nama}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{formatDate(peg_jabatan_tmt) || "Tanggal Tidak Tersedia"}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{status_pegawai}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{formatDate(peg_pns_tmt) || "Tanggal Tidak Tersedia"}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{masa_kerja_tahun}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">{masa_kerja_bulan}</td>  
                      <td className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">  
                        <div className="flex items-center">  
                          <FontAwesomeIcon icon={faSearch} className="text-teal-700 cursor-pointer hover:text-teal-500 mr-2" onClick={() => window.open(`/pegawai/profile/edit/${peg_nip}`, "_blank")} />  
                          <FontAwesomeIcon icon={faEdit} className="text-teal-700 cursor-pointer hover:text-teal-500 mr-2" onClick={() => router.push(`/edit-pegawai/${peg_nip}`)} />  
                          <FontAwesomeIcon icon={faTrash} className="text-teal-700 cursor-pointer hover:text-teal-500" />  
                        </div>  
                      </td>  
                    </tr>  
                  ))  
                ) : (  
                  <tr>  
                    <td colSpan={11} className="p-3 border border-[#f2bd1d] text-center">  
                      No data available  
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
  
export default ListPegawai;  
