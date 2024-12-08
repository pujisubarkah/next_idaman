"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const RiwayatPendidikan = () => {
  const dataDummy = [
    {
      no: 1,
      tingkat: "SMA",
      jurusan: "IPA",
      nomorIjazah: "12345",
      tanggalIjazah: "01/06/2018",
      kepalaSekolah: "Budi Santoso",
      namaSekolah: "SMA Negeri 1 Jakarta",
      lokasi: "Jakarta",
    },
    {
      no: 2,
      tingkat: "S1",
      jurusan: "Teknik Informatika",
      nomorIjazah: "67890",
      tanggalIjazah: "01/06/2022",
      kepalaSekolah: "Agus Pratama",
      namaSekolah: "Universitas Indonesia",
      lokasi: "Depok",
    },
  ];

  return (
    <div id="pendidikan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT PENDIDIKAN</h3>

      <div className="flex justify-end mb-4">
  <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
    <FontAwesomeIcon icon={faPlus} /> Tambah
  </button>
</div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-teal-500">No</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Tingkat Pendidikan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Jurusan/Rumpun Pendidikan</th>
            <th colSpan={3} className="p-3 border border-teal-500">STTB/Ijazah</th>
            <th colSpan={2} className="p-3 border border-teal-500">Sekolah/Pendidikan Tinggi</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Nama Kepala Sekolah/Rektor</th>
            <th className="p-3 border border-teal-500">Nama</th>
            <th className="p-3 border border-teal-500">Lokasi (Kab/Kota)</th>
          </tr>
        </thead>
        <tbody>
          {dataDummy.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataDummy.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.tingkat}</td>
                <td className="p-3 border border-teal-500">{item.jurusan}</td>
                <td className="p-3 border border-teal-500">{item.nomorIjazah}</td>
                <td className="p-3 border border-teal-500">{item.tanggalIjazah}</td>
                <td className="p-3 border border-teal-500">{item.kepalaSekolah}</td>
                <td className="p-3 border border-teal-500">{item.namaSekolah}</td>
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

export default RiwayatPendidikan;
