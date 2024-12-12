"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const KontakDarurat = () => {
  interface Kontak {
    no: number;
    nama: string;
    noTelepon: string;
    tinggalSerumah: string;
    hubungan: string;
    alamat: string;
  }

  const [kontakDarurat, setKontakDarurat] = useState<Kontak[]>([]);

  useEffect(() => {
    // Data dummy untuk tabel
    setKontakDarurat([
      {
        no: 1,
        nama: "Andi Rahman",
        noTelepon: "081234567890",
        tinggalSerumah: "Ya",
        hubungan: "Teman Dekat",
        alamat: "Jl. Sudirman No. 123, Jakarta",
      },
    ]);
  }, []);

  return (
    <div id="kontak" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-6">KONTAK DARURAT</h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FaPlus className="inline-block mr-2" />
          Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th className="p-3 border border-teal-500">No</th>
            <th className="p-3 border border-teal-500">Nama</th>
            <th className="p-3 border border-teal-500">No Telepon</th>
            <th className="p-3 border border-teal-500">Tinggal Serumah</th>
            <th className="p-3 border border-teal-500">Hubungan</th>
            <th className="p-3 border border-teal-500">Alamat</th>
            <th className="p-3 border border-teal-500">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kontakDarurat.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">
                Data tidak ditemukan.
              </td>
            </tr>
          ) : (
            kontakDarurat.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.nama}</td>
                <td className="p-3 border border-teal-500">{item.noTelepon}</td>
                <td className="p-3 border border-teal-500">{item.tinggalSerumah}</td>
                <td className="p-3 border border-teal-500">{item.hubungan}</td>
                <td className="p-3 border border-teal-500">{item.alamat}</td>
                <td className="p-3 border border-teal-500">
                  <div className="flex space-x-4">
                    <button
                      className="text-green-500 hover:text-green-700"
                      aria-label="Edit"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      aria-label="Hapus"
                    >
                      <FaTrash /> Hapus
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

export default KontakDarurat;
