"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const RiwayatOrangTua = () => {
  interface DataOrangTua {
    no: number;
    nik: string;
    namaOrangTua: string;
    jenisKelamin: string;
    tempatTanggalLahir: string;
    pendidikan: string;
    pekerjaan: string;
    keterangan: string;
  }

  const [dataOrangTua, setDataOrangTua] = useState<DataOrangTua[]>([]);

  useEffect(() => {
    // Data dummy untuk tabel
    setDataOrangTua([
      {
        no: 1,
        nik: "1234567890123456",
        namaOrangTua: "Budi Santoso",
        jenisKelamin: "Laki-laki",
        tempatTanggalLahir: "Jakarta, 15/05/1975",
        pendidikan: "S1 Ekonomi",
        pekerjaan: "Wiraswasta",
        keterangan: "Hidup",
      },
      {
        no: 2,
        nik: "6543210987654321",
        namaOrangTua: "Siti Aminah",
        jenisKelamin: "Perempuan",
        tempatTanggalLahir: "Bandung, 12/09/1980",
        pendidikan: "SMA",
        pekerjaan: "Ibu Rumah Tangga",
        keterangan: "Hidup",
      },
    ]);
  }, []);

  return (
    <div id="orangTua" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT ORANG TUA</h3>

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
            <th className="p-3 border border-teal-500">NIK</th>
            <th className="p-3 border border-teal-500">Nama Orang Tua</th>
            <th className="p-3 border border-teal-500">Jenis Kelamin</th>
            <th className="p-3 border border-teal-500">Tempat dan Tanggal Lahir</th>
            <th className="p-3 border border-teal-500">Pendidikan</th>
            <th className="p-3 border border-teal-500">Pekerjaan</th>
            <th className="p-3 border border-teal-500">Keterangan</th>
            <th className="p-3 border border-teal-500">Pilihan</th>
          </tr>
        </thead>
        <tbody>
          {dataOrangTua.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataOrangTua.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.nik}</td>
                <td className="p-3 border border-teal-500">{item.namaOrangTua}</td>
                <td className="p-3 border border-teal-500">{item.jenisKelamin}</td>
                <td className="p-3 border border-teal-500">{item.tempatTanggalLahir}</td>
                <td className="p-3 border border-teal-500">{item.pendidikan}</td>
                <td className="p-3 border border-teal-500">{item.pekerjaan}</td>
                <td className="p-3 border border-teal-500">{item.keterangan}</td>
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
                      aria-label="Delete"
                    >
                      <FaTrash /> Delete
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

export default RiwayatOrangTua;
