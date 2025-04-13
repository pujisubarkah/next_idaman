"use client";  
  
import { useState, useEffect } from "react";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
import axios from "axios";  
  
const RiwayatCuti = () => {  
  interface DataDummy {  
    no: number;  
    jeniscuti: string;  
    tanggalMulai: string;  
    tanggalSelesai: string;  
    keterangan: string;  
    entryOleh: string; // Tambahkan field baru  
    tanggalEntry: string; // Tambahkan field baru  
    diketahuiOleh: string; // Tambahkan field baru  
    tanggalDiketahui: string; // Tambahkan field baru  
    disetujuiOleh: string; // Tambahkan field baru  
    tanggalDisetujui: string; // Tambahkan field baru  
  }  
  
  const [data, setData] = useState<DataDummy[]>([]);  
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
  
  const fetchRiwayatCuti = async (nip: string) => {  
    try {  
      const response = await axios.get(`/api/riwayat/cuti?peg_id=${nip}`);  
  
      const mappedData = response.data.map((item: any, index: number) => ({  
        no: index + 1,  
        jeniscuti: item.m_spg_jenis_cuti.jeniscuti_nm,  
        tanggalMulai: formatTanggal(item.cuti_mulai),  
        tanggalSelesai: formatTanggal(item.cuti_selesai),  
        keterangan: item.cuti_ket,  
        entryOleh: item.entry_oleh, // Ambil data entryOleh  
        tanggalEntry: formatTanggal(item.tanggal_entry), // Ambil dan format tanggalEntry  
        diketahuiOleh: item.diketahui_oleh, // Ambil data diketahuiOleh  
        tanggalDiketahui: formatTanggal(item.tanggal_diketahui), // Ambil dan format tanggalDiketahui  
        disetujuiOleh: item.disetujui_oleh, // Ambil data disetujuiOleh  
        tanggalDisetujui: formatTanggal(item.tanggal_disetujui), // Ambil dan format tanggalDisetujui  
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
      fetchRiwayatCuti(nip);  
    }  
  }, [nip]); // Dependency pada nip, hanya akan dijalankan ketika nip berubah  
  
  return (  
    <div id="cuti" className="p-8">  
      <h3 className="text-center text-xl font-semibold my-8 text-[#3781c7]">  
        Riwayat Cuti  
      </h3>  
  
      <div className="flex justify-end mb-4">  
        <button className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]">  
          <FontAwesomeIcon icon={faPlus} /> Tambah  
        </button>  
      </div>  
  
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr className="text-sm uppercase">  
            <th className="p-3 border border-[#f2bd1d]">No</th>  
            <th className="p-3 border border-[#f2bd1d]">Jenis Cuti</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Mulai</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Selesai</th>  
            <th className="p-3 border border-[#f2bd1d]">Keterangan</th>  
            <th className="p-3 border border-[#f2bd1d]">Entry Oleh</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Entry</th>  
            <th className="p-3 border border-[#f2bd1d]">Diketahui Oleh</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Diketahui</th>  
            <th className="p-3 border border-[#f2bd1d]">Disetujui Oleh</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Disetujui</th>  
            <th className="p-3 border border-[#f2bd1d]">Aksi</th>  
          </tr>  
        </thead>  
  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={12} className="text-center p-4">  
                Tidak ada data.  
              </td>  
            </tr>  
          ) : (  
            data.map((item, index) => (  
              <tr  
                key={index}  
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}  
              >  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jeniscuti}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.keterangan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.entryOleh}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalEntry}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.diketahuiOleh}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalDiketahui}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.disetujuiOleh}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalDisetujui}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
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
  
export default RiwayatCuti;  
