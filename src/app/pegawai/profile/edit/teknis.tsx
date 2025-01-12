"use client";  
import { useState, useEffect, useCallback } from "react";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
import axios from "axios";  
  
const RiwayatPelatihanTeknis = () => {  
  // Definisi tipe data untuk state  
  interface PelatihanTeknis {  
    no: number;  
    kategori: string;  
    nama: string;  
    tanggalMulai: string;  
    tanggalSelesai: string;  
    jumlahJam: number;  
    jabatanPenandatangan: string;  
    instansi: string;  
    lokasi: string;  
  }  
  
  const [data, setData] = useState<PelatihanTeknis[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  
  // Fungsi untuk memformat tanggal  
  const formatTanggal = (tanggal: string): string => {  
    const bulanIndo = [  
      "Januari",  
      "Februari",  
      "Maret",  
      "April",  
      "Mei",  
      "Juni",  
      "Juli",  
      "Agustus",  
      "September",  
      "Oktober",  
      "November",  
      "Desember",  
    ];  
  
    const date = new Date(tanggal);  
    const hari = date.getDate();  
    const bulan = bulanIndo[date.getMonth()];  
    const tahun = date.getFullYear();  
  
    return `${hari} ${bulan} ${tahun}`;  
  };  
  
  const fetchRiwayatPelatihan = useCallback(async (nip: string) => {  
    try {  
      const response = await axios.get(  
        `/api/riwayat/diklat?diklat_jenis=3&peg_id=${nip}`  
      );  
      const sortedData = response.data.sort(  
        (a: any, b: any) =>  
          new Date(a.diklat_mulai).getTime() -  
          new Date(b.diklat_mulai).getTime()  
      );  
  
      const mappedData: PelatihanTeknis[] = sortedData.map(  
        (item: any, index: number) => ({  
          no: index + 1,  
          kategori: item.diklat_jenis.diklat_jenis_nama,  
          nama: `${item.diklat_teknis ? item.diklat_teknis.diklat_teknis_nm : "Tidak Ada"} - ${item.diklat_nama || "Tidak Ada"}`,  
          tanggalMulai: formatTanggal(item.diklat_mulai),  
          tanggalSelesai: formatTanggal(item.diklat_selesai),  
          jumlahJam: item.diklat_jumlah_jam,  
          jabatanPenandatangan: item.diklat_sttp_pej || "Tidak Ada",  
          instansi: item.diklat_penyelenggara,  
          lokasi: item.diklat_tempat,  
        })  
      );  
  
      setData(mappedData);  
    } catch (error) {  
      console.error("Error fetching data:", error);  
    }  
  }, []);  
  
  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    setNip(nipFromUrl);  
  
    if (nipFromUrl) {  
      fetchRiwayatPelatihan(nipFromUrl);  
    }  
  }, [fetchRiwayatPelatihan]);  
  
  return (  
    <div id="pelatihan-teknis" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
        Riwayat Pelatihan Teknis  
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
            <th className="p-3 border border-[#f2bd1d]">Kategori</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama Pelatihan Teknis</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Mulai</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Selesai</th>  
            <th className="p-3 border border-[#f2bd1d]">Jumlah Jam</th>  
            <th className="p-3 border border-[#f2bd1d]">Jabatan Penandatangan</th>  
            <th className="p-3 border border-[#f2bd1d]">Instansi Penyelenggara</th>  
            <th className="p-3 border border-[#f2bd1d]">Lokasi</th>  
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={10} className="text-center p-4">  
                Tidak ada data.  
              </td>  
            </tr>  
          ) : (  
            data.map((item, index) => (  
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                <td className="p-3 border border-[#f2bd1d]">{item.no}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.kategori}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jumlahJam}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jabatanPenandatangan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.lokasi}</td>  
                <td className="p-3 border border-[#f2bd1d]">  
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
            ))  
          )}  
        </tbody>  
      </table>  
    </div>  
  );  
};  
  
export default RiwayatPelatihanTeknis;  
