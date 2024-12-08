"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const RiwayatAnak = () => {
  interface DataDummy {
    no: number;
    nik: string;
    namaAnak: string;
    jenisKelamin: string;
    tempatTanggalLahir: string;
    statusPerkawinan: string;
    memperolehTunjangan: string;
    pendidikan: string;
    pekerjaan: string;
    keterangan: string;
  }

  const [dataDummy, setDataDummy] = useState<DataDummy[]>([]);

  useEffect(() => {
    // Data dummy untuk tabel (bisa diambil dari database juga)
    setDataDummy([
      {
        no: 1,
        nik: "1234567890123456",
        namaAnak: "Ahmad Rizky",
        jenisKelamin: "Laki-laki",
        tempatTanggalLahir: "Jakarta, 20/08/2010",
        statusPerkawinan: "Belum Menikah",
        memperolehTunjangan: "Ya",
        pendidikan: "SD Kelas 6",
        pekerjaan: "-",
        keterangan: "Aktif",
      },
      {
        no: 2,
        nik: "9876543210987654",
        namaAnak: "Maya Putri",
        jenisKelamin: "Perempuan",
        tempatTanggalLahir: "Bandung, 15/03/2015",
        statusPerkawinan: "Belum Menikah",
        memperolehTunjangan: "Tidak",
        pendidikan: "SMP Kelas 8",
        pekerjaan: "-",
        keterangan: "Aktif",
      },
    ]);
  }, []);

  return (
    <div id="anak" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT ANAK</h3>

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
            <th className="p-3 border border-teal-500">Nama Anak</th>
            <th className="p-3 border border-teal-500">Jenis Kelamin</th>
            <th className="p-3 border border-teal-500">Tempat dan Tanggal Lahir</th>
            <th className="p-3 border border-teal-500">Status Perkawinan</th>
            <th className="p-3 border border-teal-500">Memperoleh Tunjangan</th>
            <th className="p-3 border border-teal-500">Pendidikan</th>
            <th className="p-3 border border-teal-500">Pekerjaan</th>
            <th className="p-3 border border-teal-500">Keterangan</th>
            <th className="p-3 border border-teal-500">Pilihan</th>
          </tr>
        </thead>
        <tbody>
          {dataDummy.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataDummy.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.nik}</td>
                <td className="p-3 border border-teal-500">{item.namaAnak}</td>
                <td className="p-3 border border-teal-500">{item.jenisKelamin}</td>
                <td className="p-3 border border-teal-500">{item.tempatTanggalLahir}</td>
                <td className="p-3 border border-teal-500">{item.statusPerkawinan}</td>
                <td className="p-3 border border-teal-500">{item.memperolehTunjangan}</td>
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

export default RiwayatAnak;
