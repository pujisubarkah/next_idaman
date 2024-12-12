"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const RiwayatJabatan = () => {
  const dataDummy = [
    {
      no: 1,
      namaJabatan: "Manajer IT",
      golRuang: "IV/a",
      nomorSuratKeputusan: "1234/2024",
      tanggalSuratKeputusan: "01/01/2024",
      jabatanPenandatangan: "Kepala Dinas",
      tmt: "01/01/2022",
      tmtAkhir: "01/01/2025",
      unitKerja: "IT Department",
      instansiRumpun: "Dinas Kominfo",
      eselon: "IIb",
      migrasiSiasn: "Sudah",
      jabatanAktif: "Aktif",
    },
    {
      no: 2,
      namaJabatan: "Asisten Manajer",
      golRuang: "III/b",
      nomorSuratKeputusan: "5678/2024",
      tanggalSuratKeputusan: "01/02/2023",
      jabatanPenandatangan: "Wakil Kepala Dinas",
      tmt: "01/02/2021",
      tmtAkhir: "01/02/2024",
      unitKerja: "HRD",
      instansiRumpun: "Dinas Pendidikan",
      eselon: "IIIa",
      migrasiSiasn: "Belum",
      jabatanAktif: "Non-Aktif",
    },
  ];

  return (
    <div id="riwayat-jabatan" className="p-8">
      <h3 className="text-center text-xl font-semibold mb-8">RIWAYAT JABATAN</h3>

      <div className="flex justify-end mb-4">
        <button className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800">
          <FontAwesomeIcon icon={faPlus} /> Tambah
        </button>
      </div>

      <table className="w-full border border-teal-600 rounded-lg overflow-hidden">
        <thead className="bg-teal-900 text-white">
          <tr>
            <th rowSpan={2} className="p-3 border border-teal-500">No</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Nama Jabatan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Gol Ruang</th>
            <th colSpan={3} className="p-3 border border-teal-500">Surat Keputusan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">TMT</th>
            <th rowSpan={2} className="p-3 border border-teal-500">TMT Akhir Jabatan</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Unit Kerja</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Instansi & Rumpun</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Eselon</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Migrasi SIASN</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Jabatan Aktif</th>
            <th rowSpan={2} className="p-3 border border-teal-500">Pilihan</th>
          </tr>
          <tr>
            <th className="p-3 border border-teal-500">Nomor</th>
            <th className="p-3 border border-teal-500">Tanggal</th>
            <th className="p-3 border border-teal-500">Jabatan Penandatangan</th>
          </tr>
        </thead>
        <tbody>
          {dataDummy.length === 0 ? (
            <tr>
              <td colSpan={14} className="text-center p-4">Data tidak ditemukan.</td>
            </tr>
          ) : (
            dataDummy.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500">{item.no}</td>
                <td className="p-3 border border-teal-500">{item.namaJabatan}</td>
                <td className="p-3 border border-teal-500">{item.golRuang}</td>
                <td className="p-3 border border-teal-500">{item.nomorSuratKeputusan}</td>
                <td className="p-3 border border-teal-500">{item.tanggalSuratKeputusan}</td>
                <td className="p-3 border border-teal-500">{item.jabatanPenandatangan}</td>
                <td className="p-3 border border-teal-500">{item.tmt}</td>
                <td className="p-3 border border-teal-500">{item.tmtAkhir}</td>
                <td className="p-3 border border-teal-500">{item.unitKerja}</td>
                <td className="p-3 border border-teal-500">{item.instansiRumpun}</td>
                <td className="p-3 border border-teal-500">{item.eselon}</td>
                <td className="p-3 border border-teal-500">{item.migrasiSiasn}</td>
                <td className="p-3 border border-teal-500">{item.jabatanAktif}</td>
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

export default RiwayatJabatan;
