"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatSertifikat = () => {
  interface DataSertifikat {
    no: number;
    nama: string;
    nomorsurat: string;
    instansi: string;
    penandatangan: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    nilai: string;
  }

  const [data, setData] = useState<DataSertifikat[]>([]);
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

  const fetchRiwayatSertifikat = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/sertifikat?peg_id=${nip}`);
    

      const mappedData = response.data.map((item: any, index: number) => ({
        no: index + 1,
        nama: item.nama_sertifikat,
        nomorsurat: item.nomor_sertifikat,
        instansi: item.institusi_penerbit,
        penandatangan: item.penandatangan,
        tanggalMulai: formatTanggal(item.tanggal_sertifikat),
        tanggalSelesai: formatTanggal(item.tanggal_berakhir_sertifikat),
        nilai: item.nilai,
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
      fetchRiwayatSertifikat(nip);
    }
  }, [nip]); // Dependen

  return (
    <div id="sertifikat" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat Sertifikat
      </h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-teal-500" rowSpan={2}>No</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Nama Sertifikat
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Nomor Sertifikat
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Instansi Penerbit
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Penandatangan </th>
            <th className="p-3 border border-teal-500" colSpan={2}>
              Tanggal
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Nilai</th>
          
            <th className="p-3 border border-teal-500" rowSpan={2}>Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Mulai</th>
            <th className="p-3 border border-teal-500">Selesai</th>
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
                <td className="p-3 border border-teal-500">{index + 1}</td>
                <td className="p-3 border border-teal-500">{item.nama}</td>
                <td className="p-3 border border-teal-500">{item.nomorsurat}</td>
                <td className="p-3 border border-teal-500">{item.instansi}</td>
                <td className="p-3 border border-teal-500">{item.penandatangan}</td>
                <td className="p-3 border border-teal-500">{item.tanggalMulai}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSelesai}</td>
                <td className="p-3 border border-teal-500">{item.nilai}</td>
             
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

export default RiwayatSertifikat;
