"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const RiwayatPenghargaan = () => {
  const dataDummy = [
    {
      no: 1,
      namaPenghargaan: "Penghargaan Satyalancana Karya Satya",
      nomorSK: "12345",
      tanggalSK: "01/06/2020",
      jabatanPenandatangan: "Budi Santoso",
      instansi: "Kementerian Pendidikan dan Kebudayaan",
      lokasi: "Jakarta",
    },
    {
      no: 2,
      namaPenghargaan: "Penghargaan Pegawai Teladan",
      nomorSK: "67890",
      tanggalSK: "01/01/2022",
      jabatanPenandatangan: "Agus Pratama",
      instansi: "Kementerian Kesehatan",
      lokasi: "Jakarta",
    },
  ];

  return (
    <div id="penghargaan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT PENGHARGAAN</h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-teal-500">No</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Nama Penghargaan</th>
            <th colSpan={3} className="p-3 border border-teal-500">Surat Keputusan</th>
            <th colSpan={2} className="p-3 border border-teal-500">Instansi Penyelenggara</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Jabatan Penandatangan</th>
            <th className="p-3 border border-teal-500">Instansi</th>
            <th className="p-3 border border-teal-500">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {dataDummy.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataDummy.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.namaPenghargaan}</td>
                <td className="p-3 border border-teal-500">{item.nomorSK}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSK}</td>
                <td className="p-3 border border-teal-500">{item.jabatanPenandatangan}</td>
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

export default RiwayatPenghargaan;
