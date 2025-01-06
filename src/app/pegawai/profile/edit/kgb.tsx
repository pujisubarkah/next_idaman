"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatKGB = () => {
  interface DataKGB {
    no: number;
    golongan: string;
    gaji: string;
    nomorkgb: string;
    tanggalsk: string;
    yadkgb: string;
    tahunkgb: string;
    bulankgb: string;
    kgbtanggalsurat: string;
    nosuratkgb: string;
  }

   const [data, setData] = useState<DataKGB[]>([]);
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

  const formatRupiah = (amount) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount) + ',-';



  const fetchRiwayatKgb = async (nip: string) => {
    try {
      const response = await axios.get(`/api/riwayat/kgb?peg_id=${nip}`);
    

      const mappedData = response.data.map((item: any, index: number) => ({
        no: index + 1,
        golongan: item.m_spg_golongan.nm_gol,
        gaji: formatRupiah(item.m_spg_gaji.gaji_pokok), // Panggil fungsi formatRupiah di sini
        nomorkgb: item.kgb_nosk,
        tanggalsk: item.kgb_tglsk,
        yadkgb: item.kgb_yad,
        tahunkgb: item.kgb_thn,
        bulankgb: item.kgb_bln,
        kgbtanggalsurat: item.kgb_tglsurat,
        nosuratkgb: item.kgb_nosurat

       
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
      fetchRiwayatKgb(nip);
    }
  }, [nip]); // Dependency pada nip, hanya akan dijalankan ketika nip berubah

  



  return (
    <div id="kgb" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat KGB
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
              Golongan
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Gaji
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              KGB No SK
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tanggal SK </th>

            <th className="p-3 border border-teal-500" rowSpan={2}>Yad KGB</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Tahun KGB</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Bulan KGB</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>KGB Tanggal Surat</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>KGB No Surat</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Aksi</th>
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
                <td className="p-3 border border-teal-500">{item.golongan}</td>
                <td className="p-3 border border-teal-500">{item.gaji}</td>
                <td className="p-3 border border-teal-500">{item.nomorkgb}</td>
                <td className="p-3 border border-teal-500">{item.tanggalsk}</td>
                <td className="p-3 border border-teal-500">{item.yadkgb}</td>
                <td className="p-3 border border-teal-500">{item.tahunkgb}</td>
                <td className="p-3 border border-teal-500">{item.bulankgb}</td>
                <td className="p-3 border border-teal-500">{item.kgbtanggalsurat}</td>
                <td className="p-3 border border-teal-500">{item.nosuratkgb}</td>
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

export default RiwayatKGB;
