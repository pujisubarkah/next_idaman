"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from "../../../components/LoadingSpinner"; // Import the LoadingSpinner
import RootLayout from "../../pegawai/profile/edit/layout"; // Import RootLayout

const HukumanDisiplinTable: React.FC = () => {
  const [hukumanData, setHukumanData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // To manage loading state

  useEffect(() => {
    // Fetching data from the API (replace with your actual API endpoint)
    axios
      .get('http://your-api-endpoint.com/hukuman')
      .then((response) => {
        setHukumanData(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  // Dummy data for now
  const dummyData = [
    {
      kategoriHukuman: 'Pelanggaran Ringan',
      namaHukuman: 'Peringatan Lisan',
      pegawai: [
        {
          namaNip: 'John Doe / 123456',
          pangkat: 'Pangkat A',
          jabatan: 'Manager',
          unitKerja: 'Unit 1',
        },
      ],
      noSk: '12345',
      tanggalSk: '2024-01-01',
      tanggalMulai: '2024-01-01',
      tanggalSelesai: '2024-01-05',
      keteranganPelanggaran: 'Tidak masuk kerja tanpa keterangan.',
    },
    {
      kategoriHukuman: 'Pelanggaran Berat',
      namaHukuman: 'Pemecatan',
      pegawai: [
        {
          namaNip: 'Jane Smith / 789012',
          pangkat: 'Pangkat B',
          jabatan: 'Staff',
          unitKerja: 'Unit 2',
        },
      ],
      noSk: '67890',
      tanggalSk: '2024-02-01',
      tanggalMulai: '2024-02-01',
      tanggalSelesai: '2024-02-28',
      keteranganPelanggaran: 'Korupsi.',
    },
  ];

  const tableData = hukumanData.length > 0 ? hukumanData : dummyData;

  return (
    <RootLayout>
      <div className="overflow-x-auto p-5">
        <h2 className="text-2xl font-bold mb-4 text-center">
          DAFTAR HUKUMAN DISIPLIN PADA LEMBAGA ADMINISTRASI NEGARA
        </h2>

        {loading ? (
          <LoadingSpinner /> // Show the loading spinner while fetching data
        ) : (
          <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
            <thead>
              <tr className="bg-teal-900 text-white">
                <th colSpan={4} className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">
                  Pegawai
                </th>
                <th rowSpan={3} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Kategori Hukuman
                </th>
                <th rowSpan={3} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Nama Hukuman
                </th>
                <th colSpan={2} className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">
                  SK
                </th>
                <th colSpan={2} className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">
                  Lama
                </th>
                <th rowSpan={3} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Keterangan Pelanggaran
                </th>
                <th rowSpan={3} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Pilihan
                </th>
              </tr>
              <tr className="bg-teal-900 text-white">
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Nama-NIP
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Pangkat
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Jabatan
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Unit Kerja
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  No SK
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Tanggal SK
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Tanggal Mulai
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Tanggal Selesai
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-teal-50' : 'bg-white'}>
                  <td className="px-4 py-2 border border-teal-300">
                    {row.pegawai.map((pegawai, idx) => (
                      <div key={idx}>{pegawai.namaNip}</div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border border-teal-300">
                    {row.pegawai.map((pegawai, idx) => (
                      <div key={idx}>{pegawai.pangkat}</div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border border-teal-300">
                    {row.pegawai.map((pegawai, idx) => (
                      <div key={idx}>{pegawai.jabatan}</div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border border-teal-300">
                    {row.pegawai.map((pegawai, idx) => (
                      <div key={idx}>{pegawai.unitKerja}</div>
                    ))}
                  </td>
                  <td className="px-4 py-2 border border-teal-300">{row.kategoriHukuman}</td>
                  <td className="px-4 py-2 border border-teal-300">{row.namaHukuman}</td>
                  <td className="px-4 py-2 border border-teal-300">{row.noSk}</td>
                  <td className="px-4 py-2 border border-teal-300">{row.tanggalSk}</td>
                  <td className="px-4 py-2 border border-teal-300">{row.tanggalMulai}</td>
                  <td className="px-4 py-2 border border-teal-300">{row.tanggalSelesai}</td>
                  <td className="px-4 py-2 border border-teal-300">{row.keteranganPelanggaran}</td>
                  <td className="px-4 py-2 border border-teal-300">Actions</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </RootLayout>
  );
};

export default HukumanDisiplinTable;
