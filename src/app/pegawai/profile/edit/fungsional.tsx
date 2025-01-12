"use client";  
import { useState, useEffect } from "react";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
import axios from "axios";  
  
const RiwayatPelatihanFungsional = () => {  
  // Definisi tipe data untuk state  
  interface PelatihanFungsional {  
    no: number;  
    kategori: string;  
    nama: string;  
    tanggalMulai: string;  
    tanggalSelesai: string;  
    jumlahJam: string;  
    nomorSTTP: string;  
    tanggalSTTP: string;  
    jabatanPenandatangan: string;  
    instansi: string;  
    lokasi: string;  
  }  
  
  const [data, setData] = useState<PelatihanFungsional[]>([]);  
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
  
  const fetchRiwayatPelatihanfungsional = async (nip: string) => {  
    try {  
      const response = await axios.get(`/api/riwayat/diklat?diklat_jenis=2&peg_id=${nip}`);  
      const mappedData: PelatihanFungsional[] = response.data.map(  
        (item: any, index: number) => ({  
          no: index + 1,  
          nama: item.diklat_nama,  
          tanggalMulai: formatTanggal(item.diklat_mulai),  
          tanggalSelesai: formatTanggal(item.diklat_selesai),  
          jumlahJam: item.diklat_jumlah_jam,  
          nomorSTTP: item.diklat_sttp_no,  
          tanggalSTTP: formatTanggal(item.diklat_sttp_tgl),  
          jabatanPenandatangan: item.diklat_sttp_pej,  
          instansi: item.diklat_penyelenggara,  
          lokasi: item.diklat_tempat,  
        })  
      );  
  
      setData(mappedData);  
    } catch (error: any) {  
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
      fetchRiwayatPelatihanfungsional(nip);  
    }  
  }, [nip]); // Dependency on 'nip' to fetch data when it changes  
  
  return (  
    <div id="pelatihan-fungsional" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
        Riwayat Pelatihan Fungsional  
      </h3>  
  
      <div className="flex justify-end mb-4">  
        <button className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]">  
          <FontAwesomeIcon icon={faPlus} /> Tambah  
        </button>  
      </div>  
  
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr className="text-sm uppercase">  
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>No</th>  
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>  
              Nama Pelatihan Fungsional  
            </th>  
            <th className="p-3 border border-[#f2bd1d]" colSpan={2}>  
              Tanggal  
            </th>  
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Jumlah Jam</th>  
            <th className="p-3 border border-[#f2bd1d]" colSpan={3}>  
              STTP  
            </th>  
            <th className="p-3 border border-[#f2bd1d]" colSpan={2}>  
              Instansi Penyelenggara  
            </th>  
            <th className="p-3 border border-[#f2bd1d]" rowSpan={2}>Pilihan</th>  
          </tr>  
          <tr className="bg-[#3781c7] text-white text-sm">  
            <th className="p-3 border border-[#f2bd1d]">Mulai</th>  
            <th className="p-3 border border-[#f2bd1d]">Selesai</th>  
            <th className="p-3 border border-[#f2bd1d]">Nomor</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal</th>  
            <th className="p-3 border border-[#f2bd1d]">Jabatan Penandatangan</th>  
            <th className="p-3 border border-[#f2bd1d]">Instansi</th>  
            <th className="p-3 border border-[#f2bd1d]">Lokasi</th>  
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
                <td className="p-3 border border-[#f2bd1d]">{index + 1}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jumlahJam}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nomorSTTP}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSTTP}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jabatanPenandatangan}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.lokasi}</td>  
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
  
export default RiwayatPelatihanFungsional;  
