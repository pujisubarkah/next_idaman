"use client";  
import { useState, useEffect } from "react";  
import axios from "axios";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";  
  
const RiwayatPelatihanNonKlasikal = () => {  
  interface DataPelatihanNonKlasikal {  
    no: number;  
    jenis: string;  
    nama: string;  
    tanggalMulai: string;  
    tanggalSelesai: string;  
    nomorsurat: string;  
    instansi: string;  
    jumlahJam: string;  
  }  
  
  const [data, setData] = useState<DataPelatihanNonKlasikal[]>([]);  
  const [nip, setNip] = useState<string | null>(null);  
  
  // Fungsi untuk memformat tanggal  
  const formatTanggal = (tanggal: string) => {  
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
  
    return `${hari} - ${bulan} - ${tahun}`;  
  };  
  
  const fetchRiwayatPelatihanNonKlasikal = async (nip: string) => {  
    try {  
      const response = await axios.get(  
        `/api/riwayat/pelatihan_non_klasikal?peg_id=${nip}`  
      );  
  
      const mappedData = response.data.map((item: any, index: number) => ({  
        no: index + 1,  
        jenis: item.jenis_pelatihan,  
        nama: item.non_nama,  
        tanggalMulai: formatTanggal(item.non_tgl_mulai),  
        tanggalSelesai: formatTanggal(item.non_tgl_selesai),  
        nomorsurat: item.non_sttp,  
        instansi: item.non_penyelenggara,  
        jumlahJam: item.diklat_jumlah_jam,  
      }));  
  
      setData(mappedData);  
    } catch (error) {  
      console.error("Error fetching data:", error);  
    }  
  };  
  
  useEffect(() => {  
    const path = window.location.pathname;  
    const segments = path.split("/");  
    const nipFromUrl = segments[segments.length - 1];  
    setNip(nipFromUrl);  
  }, []);  
  
  useEffect(() => {  
    if (nip) {  
      fetchRiwayatPelatihanNonKlasikal(nip);  
    }  
  }, [nip]);  
  
  return (  
    <div id="pelatihan-non-klasikal" className="p-8">  
      <h3 className="text-center text-xl font-semibold mb-8 text-[#3781c7]">  
        Riwayat Pelatihan Non Klasikal  
      </h3>  
  
      <div className="flex justify-end mb-4">  
        <button className="bg-[#3781c7] text-white py-2 px-4 rounded hover:bg-[#2a5a8c]">  
          <FontAwesomeIcon icon={faPlus} className="inline-block mr-2" /> Tambah  
        </button>  
      </div>  
  
      <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden">  
        <thead className="bg-[#3781c7] text-white">  
          <tr className="text-sm uppercase">  
            <th className="p-3 border border-[#f2bd1d]">No</th>  
            <th className="p-3 border border-[#f2bd1d]">Jenis Pelatihan</th>  
            <th className="p-3 border border-[#f2bd1d]">Nama Pelatihan</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Mulai</th>  
            <th className="p-3 border border-[#f2bd1d]">Tanggal Selesai</th>  
            <th className="p-3 border border-[#f2bd1d]">Nomor Sertifikat/Surat Tugas</th>  
            <th className="p-3 border border-[#f2bd1d]">Instansi Penyelenggara</th>  
            <th className="p-3 border border-[#f2bd1d]">Jumlah Jam Pelajaran</th>  
            <th className="p-3 border border-[#f2bd1d]">Pilihan</th>  
          </tr>  
        </thead>  
  
        <tbody>  
          {data.length === 0 ? (  
            <tr>  
              <td colSpan={9} className="text-center p-4">  
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
                <td className="p-3 border border-[#f2bd1d]">{item.jenis}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nama}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalMulai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.tanggalSelesai}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.nomorsurat}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.instansi}</td>  
                <td className="p-3 border border-[#f2bd1d]">{item.jumlahJam}</td>  
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
  
export default RiwayatPelatihanNonKlasikal;  
