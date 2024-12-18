"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatPelatihanStruktural = () => {
  // Definisi tipe data untuk state
  interface PelatihanStruktural {
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

  const [data, setData] = useState<PelatihanStruktural[]>([]);
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

  const fetchRiwayatPelatihan = async (nip: string) => {
    try {
      const response = await axios.get(
        `/api/riwayat/diklat?diklat_jenis=1&peg_id=${nip}`
      );
      const sortedData = response.data.sort(
        (a: any, b: any) =>
          new Date(a.diklat_mulai).getTime() - new Date(b.diklat_mulai).getTime()
      );

      const mappedData: PelatihanStruktural[] = sortedData.map(
        (item: any, index: number) => ({
          no: index + 1,
          kategori: item.m_spg_diklat_jenis.diklat_jenis_nama,
          nama: item.m_spg_diklat_struk_kategori.kategori_nama,
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const nipFromUrl = segments[segments.length - 1];
    setNip(nipFromUrl);

    if (nipFromUrl) {
      fetchRiwayatPelatihan(nipFromUrl);
    }
  }, []); // Empty dependency array to fetch data only once

  useEffect(() => {
    if (nip) {
      fetchRiwayatPelatihan(nip);
    }
  }, [nip]); // Dependency on 'nip' to fetch data when it changes

  return (
    <div id="pelatihan-struktural" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat Pelatihan Struktural
      </h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr className="text-sm uppercase">
            <th className="p-3 border border-teal-500" rowSpan={2}>
              No
            </th>
            <th className="p-3 border border-teal-500" colSpan={2}>
              Pelatihan Struktural
            </th>
            <th className="p-3 border border-teal-500" colSpan={2}>
              Tanggal
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Jumlah Jam
            </th>
            <th className="p-3 border border-teal-500" colSpan={3}>
              STTP
            </th>
            <th className="p-3 border border-teal-500" colSpan={2}>
              Instansi Penyelenggara
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Pilihan
            </th>
          </tr>
          <tr className="bg-teal-900 text-white text-sm">
            <th className="p-3 border border-teal-500">Kategori</th>
            <th className="p-3 border border-teal-500">Nama</th>
            <th className="p-3 border border-teal-500">Mulai</th>
            <th className="p-3 border border-teal-500">Selesai</th>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">
              Jabatan Penandatangan
            </th>
            <th className="p-3 border border-teal-500">Instansi</th>
            <th className="p-3 border border-teal-500">Lokasi</th>
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
                <td className="p-3 border border-teal-500">{item.kategori}</td>
                <td className="p-3 border border-teal-500">{item.nama}</td>
                <td className="p-3 border border-teal-500">
                  {item.tanggalMulai}
                </td>
                <td className="p-3 border border-teal-500">
                  {item.tanggalSelesai}
                </td>
                <td className="p-3 border border-teal-500">{item.jumlahJam}</td>
                <td className="p-3 border border-teal-500">{item.nomorSTTP}</td>
                <td className="p-3 border border-teal-500">
                  {item.tanggalSTTP}
                </td>
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

export default RiwayatPelatihanStruktural;
