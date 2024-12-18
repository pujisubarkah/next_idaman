"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";

interface Pendidikan {
  no: number;
  tingpend: string;
  jurusan: string;
  riw_pendidikan_sttb_ijazah: string;
  riw_pendidikan_tanggal: string;
  riw_pendidikan_pejabat: string;
  riw_pendidikan_nm: string;
  riw_pendidikan_lokasi: string;
}

const RiwayatPendidikan: React.FC<{ nip: string }> = ({ nip }) => {
  const [dataPendidikan, setDataPendidikan] = useState<Pendidikan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memformat tanggal
  const formatTanggal = (tanggal: string): string => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];

    const date = new Date(tanggal);
    const hari = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${hari} - ${bulan} - ${tahun}`;
  };

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    if (nipFromUrl) {
      fetchRiwayatPendidikan(nipFromUrl);
    }
  }, []);

  const fetchRiwayatPendidikan = async (nip: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/riwayat/pendidikan?peg_id=${nip}`);
      const sortedData = response.data; // Pastikan ini sesuai dengan struktur data API

      const mappedData = sortedData.map((item: any, index: number) => ({
        no: index + 1,
        tingpend: item.m_spg_tingkat_pendidikan.nm_tingpend,
        jurusan: item.m_spg_jurusan ? item.m_spg_jurusan.jurusan_nm : " ", // Check if 'jurusan_nm' exists
        riw_pendidikan_sttb_ijazah: item.riw_pendidikan_sttb_ijazah,
        riw_pendidikan_tanggal: formatTanggal(item.riw_pendidikan_tgl),
        riw_pendidikan_pejabat: item.riw_pendidikan_pejabat,
        riw_pendidikan_nm: item.riw_pendidikan_nm || item.m_spg_universitas.univ_nmpti, // Fallback to university name if null
        riw_pendidikan_lokasi: item.riw_pendidikan_lokasi,
      }));

      setDataPendidikan(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle file download
  const handleDownload = (fileId: string) => {
    // Add the actual download logic here, e.g., calling an API to download the file
    console.log(`Download file with ID: ${fileId}`);
  };

  // Function to handle file upload
  const handleUpload = (fileId: string) => {
    // Add the actual upload logic here, e.g., triggering file input and uploading
    console.log(`Upload file with ID: ${fileId}`);
  };

  return (
    <div id="pendidikan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT PENDIDIKAN</h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-teal-500">No</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Tingkat Pendidikan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Jurusan</th>
            <th colSpan={3} className="p-3 border border-teal-500">STTB/Ijazah</th>
            <th colSpan={2} className="p-3 border border-teal-500">Sekolah/Pendidikan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Pejabat</th>
            <th className="p-3 border border-teal-500">Nama</th>
            <th className="p-3 border border-teal-500">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center p-4">Memuat data...</td>
            </tr>
          ) : dataPendidikan.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataPendidikan.map((item) => (
              <React.Fragment key={item.no}>
                <tr className={item.no % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                  <td className="p-3 border border-teal-500">{item.no}</td>
                  <td className="p-3 border border-teal-500">{item.tingpend}</td>
                  <td className="p-3 border border-teal-500">{item.jurusan}</td>
                  <td className="p-3 border border-teal-500">{item.riw_pendidikan_sttb_ijazah}</td>
                  <td className="p-3 border border-teal-500">{item.riw_pendidikan_tanggal}</td>
                  <td className="p-3 border border-teal-500">{item.riw_pendidikan_pejabat}</td>
                  <td className="p-3 border border-teal-500">{item.riw_pendidikan_nm}</td>
                  <td className="p-3 border border-teal-500">{item.riw_pendidikan_lokasi}</td>
                  <td className="p-3 border border-teal-500">
                    <div className="flex space-x-4">
                      <button className="text-green-500 hover:text-green-700" aria-label="Edit">
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button className="text-red-500 hover:text-red-700" aria-label="Delete">
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Upload and Download Row */}
                <tr className="bg-gray-100">
  <td colSpan={9} className="p-3">
    <button
      className="flex items-center justify-center space-x-2 text-blue-500 hover:text-blue-700"
      onClick={() => handleUpload(item.riw_pendidikan_sttb_ijazah)}
      aria-label="Upload and Download"
    >
      <FontAwesomeIcon icon={faUpload} />
      <span className="text-sm">Upload and Download</span>
      <FontAwesomeIcon icon={faDownload} />
    </button>
  </td>
</tr>

              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RiwayatPendidikan;
