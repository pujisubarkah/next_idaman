"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatKepangkatan = () => {
  interface dataPangkat {
    no: number;
    golRuang: string;
    masaKerjaTahun: string;
    masaKerjaBulan: string;
    nomorSK: string;
    tanggalSK: string;
    jabatanPenandatangan: string;
    tmt: string;
    unitKerja: string;
  }
    
  const [data, setData] = useState<dataPangkat[]>([]);
  const [nip, setNip] = useState<string | null>(null);

    // Fungsi untuk memformat tanggal
    const formatTanggal = (tanggal: string) => {
      const bulanIndo = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
  
      const date = new Date(tanggal);
      const hari = date.getDate();
      const bulan = bulanIndo[date.getMonth()];
      const tahun = date.getFullYear();
  
      return `${hari} - ${bulan} - ${tahun}`;
    };
  
    const fetchRiwayatpangkat = async (nip: string) => {
      try {
        const response = await axios.get(`/api/riwayat/pangkat?peg_id=${nip}`);
      
  
        const mappedData = response.data.map((item: any, index: number) => ({
          No: index + 1,
          golRuang: item.nama_golongan,
          masaKerjaTahun: item.riw_pangkat_thn,
          masaKerjaBulan: item.riw_pangkat_bln,
          nomorSK: item.riw_pangkat_sk,
          tanggalSK: formatTanggal(item.riw_pangkat_sktgl),
          jabatanPenandatangan: item.riw_pangkat_pejabat,
          tmt: formatTanggal(item.riw_pangkat_tmt),
          unitKerja: item.riw_pangkat_unit_kerja,
        }));
  
        setData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    useEffect(() => {
      // Mendapatkan NIP dari URL
      const path = window.location.pathname;
      const segments = path.split("/"); // Memecah URL menjadi array
      const nipFromUrl = segments[segments.length - 1]; // Ambil elemen terakhir (NIP)
      setNip(nipFromUrl);
    }, []); // Hanya dijalankan sekali ketika komponen pertama kali dimuat
  
    useEffect(() => {
      if (nip) {
        // Fetch data hanya jika nip tersedia
        fetchRiwayatpangkat(nip);
      }
    }, [nip]); // Dependency pada nip, hanya akan dijalankan ketika nip berubah
     

  return (
    <div id="kepangkatan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT KEPANGKATAN</h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-teal-500">No</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Gol. Ruang</th>
            <th colSpan={2} className="p-3 border border-teal-500">Masa Kerja</th>
            <th colSpan={3} className="p-3 border border-teal-500">Surat Keputusan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">TMT</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Unit Kerja</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Tahun</th>
            <th className="p-3 border border-teal-500">Bulan</th>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Jabatan Penandatangan</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{index+1}</td>
                <td className="p-3 border border-teal-500">{item.golRuang}</td>
                <td className="p-3 border border-teal-500">{item.masaKerjaTahun}</td>
                <td className="p-3 border border-teal-500">{item.masaKerjaBulan}</td>
                <td className="p-3 border border-teal-500">{item.nomorSK}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSK}</td>
                <td className="p-3 border border-teal-500">{item.jabatanPenandatangan}</td>
                <td className="p-3 border border-teal-500">{item.tmt}</td>
                <td className="p-3 border border-teal-500">{item.unitKerja}</td>
                <td className="p-3 border border-teal-500">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RiwayatKepangkatan;
