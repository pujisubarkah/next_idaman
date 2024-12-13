"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faSearch, faEdit, faTrash, faFileExcel, faAdd } from '@fortawesome/free-solid-svg-icons';
import RootLayout from '../../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
  const options = { year: 'numeric' as 'numeric' | '2-digit', month: 'long' as 'numeric' | '2-digit', day: 'numeric' as 'numeric' | '2-digit' | undefined };
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
          // Cek struktur respons untuk unit_kerja_nama
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
      <div className="p-4">
        <div className="overflow-x-auto">
          <h3 className="text-center text-xl font-semibold my-8">DAFTAR PEGAWAI UNIT KERJA {unitKerjaNama}</h3>
          <div className="flex justify-end items-center mb-4">
            <button
              onClick={() => window.location.href = '/tambah-pegawai'}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              aria-label="Add Pegawai"
            >
              <FontAwesomeIcon icon={faAdd} />
              Tambah Pegawai
            </button>
          </div>

          <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
            <thead className="bg-teal-600">
              <tr className="bg-teal-900 text-white">
                <th rowSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Nama/Tempat Tgl Lahir</th>
                <th rowSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">NIP</th>
                <th colSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Pangkat</th>
                <th colSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Jabatan</th>
                <th colSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Pegawai</th>
                <th colSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Masa Kerja</th>
                <th rowSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">PILIHAN</th>
              </tr>
              <tr className="bg-teal-900 text-white">
                <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Gol</th>
                <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">TMT Gol</th>
                <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Nama</th>
                <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">TMT Jabatan</th>
                <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Status</th>
                <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">TMT Status</th>
                <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Thn</th>
                <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Bln</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map(({ peg_nama_lengkap, peg_lahir_tanggal, peg_lahir_tempat, peg_nip, gol_akhir, peg_gol_akhir_tmt, jabatan_nama, peg_jabatan_tmt, status_pegawai, peg_pns_tmt, masa_kerja_tahun, masa_kerja_bulan }, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">
                      {peg_nama_lengkap} {peg_lahir_tempat} , 
                      {formatDate(peg_lahir_tanggal) || "Tanggal Tidak Tersedia"}
                    </td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{peg_nip}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{gol_akhir}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(peg_gol_akhir_tmt) || "Tanggal Tidak Tersedia"}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{jabatan_nama}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(peg_jabatan_tmt) || "Tanggal Tidak Tersedia"}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{status_pegawai}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(peg_pns_tmt) || "Tanggal Tidak Tersedia"}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{masa_kerja_tahun}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{masa_kerja_bulan}</td>
                    <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">
                      {/* Icon View */}
                      <div
                        className="flex items-center cursor-pointer hover:text-teal-500 mb-2"
                        onClick={() => {
                          const nip = peg_nip; // Get the NIP from your data (e.g., from localStorage)
                          console.log("Opening profile for NIP:", nip); // Log the NIP
                          window.open(`/pegawai/profile/edit/${nip}`, "_blank");  // Open the profile in a new tab
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} className="text-teal-700 mr-2" />
                        <span className="text-teal-700 text-sm">View</span>
                      </div>
                      {/* Icon Edit */}
                      <div className="flex items-center cursor-pointer hover:text-teal-500 mb-2">
                        <FontAwesomeIcon icon={faEdit} className="text-teal-700 mr-2" />
                        <span className="text-teal-700 text-sm">Edit</span>
                      </div>
                      {/* Icon Delete */}
                      <div className="flex items-center cursor-pointer hover:text-teal-500">
                        <FontAwesomeIcon icon={faTrash} className="text-teal-700 mr-2" />
                        <span className="text-teal-700 text-sm">Delete</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-3 border border-teal-500 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RootLayout>
  );
};

export default ListPegawai;
