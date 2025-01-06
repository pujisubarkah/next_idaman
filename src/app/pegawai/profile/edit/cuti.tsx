"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Riwayatcuti = () => {
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
    <div id="cuti" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat Cuti
      </h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr className="text -sm uppercase">
            <th className="p-3 border border-teal-500" rowSpan={2}>No</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Jenis Cuti</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Tanggal Mulai</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Tanggal Selesai</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Keterangan</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Entry Oleh</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Tanggal Entry</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Diketahui Oleh</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Tanggal Diketahui</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Disetujui Oleh</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Tanggal Disetujui</th>
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
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.jeniscuti}</td>
                <td className="p-3 border border-teal-500">{item.tanggalMulai}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSelesai}</td>
                <td className="p-3 border border-teal-500">{item.keterangan}</td>
                <td className="p-3 border border-teal-500">{item.entryOleh}</td>
                <td className="p-3 border border-teal-500">{item.tanggalEntry}</td>
                <td className="p-3 border border-teal-500">{item.diketahuiOleh}</td>
                <td className="p-3 border border-teal-500">{item.tanggalDiketahui}</td>
                <td className="p-3 border border-teal-500">{item.disetujuiOleh}</td>
                <td className="p-3 border border-teal-500">{item.tanggalDisetujui}</td>
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

export default Riwayatcuti;