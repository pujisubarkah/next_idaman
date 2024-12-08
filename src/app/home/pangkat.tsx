"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const RiwayatKepangkatan = () => {
  const dataDummy = [
    {
      no: 1,
      golRuang: "IV/A",
      masaKerjaTahun: 10,
      masaKerjaBulan: 5,
      nomorSK: "12345",
      tanggalSK: "01/01/2015",
      jabatanPenandatangan: "Budi Santoso",
      tmt: "01/06/2015",
      unitKerja: "Dinas Pendidikan",
    },
    {
      no: 2,
      golRuang: "III/B",
      masaKerjaTahun: 5,
      masaKerjaBulan: 3,
      nomorSK: "67890",
      tanggalSK: "01/01/2020",
      jabatanPenandatangan: "Agus Pratama",
      tmt: "01/06/2020",
      unitKerja: "Dinas Kesehatan",
    },
  ];

  return (
    <div id="kepangkatan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT KEPANGKATAN</h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-teal-500">No</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Gol. Ruang</th>
            <th colSpan={2} className="p-3 border border-teal-500">Masa Kerja</th>
            <th colSpan={3} className="p-3 border border-teal-500">Surat Keputusan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">TMT</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Unit Kerja</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Tahun</th>
            <th className="p-3 border border-teal-500">Bulan</th>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Jabatan Penandatangan</th>
          </tr>
        </thead>
        <tbody>
          {dataDummy.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataDummy.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.golRuang}</td>
                <td className="p-3 border border-teal-500">{item.masaKerjaTahun}</td>
                <td className="p-3 border border-teal-500">{item.masaKerjaBulan}</td>
                <td className="p-3 border border-teal-500">{item.nomorSK}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSK}</td>
                <td className="p-3 border border-teal-500">{item.jabatanPenandatangan}</td>
                <td className="p-3 border border-teal-500">{item.tmt}</td>
                <td className="p-3 border border-teal-500">{item.unitKerja}</td>
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

export default RiwayatKepangkatan;
