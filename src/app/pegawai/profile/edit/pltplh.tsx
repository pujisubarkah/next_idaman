"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RiwayatPltplh = () => {
  // Definisi tipe data untuk state
  interface RiwayatPltplhData {
    id: number;
    nama: string;
    unitkerja: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jenis: string;
    status: string;
  }

  const [data, setData] = useState<RiwayatPltplhData[]>([]);
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

  // Fungsi untuk menentukan status berdasarkan tanggal selesai
  const getStatus = (tanggalSelesai: string): string => {
    const selesai = new Date(tanggalSelesai);
    const hariIni = new Date();

    if (selesai < hariIni) {
      return "Selesai";
    } else {
      return "Masih";
    }
  };

  const fetchRiwayatPltplh = useCallback(async (nip: string) => {
    try {
      const response = await axios.get(
        `/api/riwayat/pltplh?peg_id=${nip}`
      );
      const sortedData = response.data.sort(
        (a: any, b: any) =>
          new Date(a.tanggal_mulai).getTime() -
          new Date(b.tanggal_mulai).getTime()
      );

      const mappedData: RiwayatPltplhData[] = sortedData.map(
        (item: any, index: number) => ({
          id: index + 1,
          nama: item.jabatan.jabatan_nama,
          unitkerja: item.unit_kerja_nama,
          tanggalMulai: formatTanggal(item.tanggal_mulai),
          tanggalSelesai: formatTanggal(item.tanggal_selesai),
          jenis: item.jenis.toUpperCase(),
          status: getStatus(item.tanggal_selesai),
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
      fetchRiwayatPltplh(nipFromUrl);
    }
  }, [fetchRiwayatPltplh]);

  return (
    <div id="pltplh" className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">
        Riwayat PLT/PLH
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
              Nama Jabatan
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Unit Kerja
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tanggal Mulai
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>
              Tanggal Selesai
            </th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Jenis</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Status</th>
            <th className="p-3 border border-teal-500" rowSpan={2}>Aksi</th>
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
                key={item.id}
                className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}
              >
                <td className="p-3 border border-teal-500">{item.id}</td>
                <td className="p-3 border border-teal-500">{item.nama}</td>
                <td className="p-3 border border-teal-500">{item.unitkerja}</td>
                <td className="p-3 border border-teal-500">{item.tanggalMulai}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSelesai}</td>
                <td className="p-3 border border-teal-500">{item.jenis}</td>
                <td className="p-3 border border-teal-500">{item.status}</td>
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

export default RiwayatPltplh
