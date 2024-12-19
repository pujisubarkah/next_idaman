"use client";
import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatPelatihanTeknis = () => {
  interface PelatihanTeknis {
    no: number;
    nama: string;
    lainnya: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jumlahJam: number;
    jabatanPenandatangan: string;
    instansi: string;
    lokasi: string;
    instansiPenyelenggara: string;
  }

  const [data, setData] = useState<PelatihanTeknis[]>([]);
  const [nip, setNip] = useState<string | null>(null);

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
          kategori: item.m_spg_diklat_jenis.diklat_jenis_nama,
          nama: item.m_spg_diklat_teknis.diklat_teknis_nm,
          tanggalMulai: formatTanggal(item.diklat_mulai),
          tanggalSelesai: formatTanggal(item.diklat_selesai),
          jumlahJam: item.diklat_jumlah_jam,
          jabatanPenandatangan: item.diklat_sttp_pej,
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
    <div id="pelatihan-teknis" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat Pelatihan Teknis
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
              Nama Pelatihan Teknis
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tanggal Mulai
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tanggal Selesai
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Jumlah Jam
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Jabatan Penandatangan
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Instansi Penyelenggara
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Lokasi
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Pilihan</th>
              </tr>
            
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-4">
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
                <td className="p-3 border border-teal-500">{item.tanggalMulai}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSelesai}</td>
                <td className="p-3 border border-teal-500">{item.jumlahJam}</td>
                <td className="p-3 border border-teal-500">
                  {item.jabatanPenandatangan}
                </td>
                <td className="p-3 border border-teal-500">{item.instansi}</td>
                <td className="p-3 border border-teal-500">{item.lokasi}</td>
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

export default RiwayatPelatihanTeknis;
