"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from "../../../components/LoadingSpinner";
import RootLayout from "../../pegawai/profile/edit/layout";

const SatuanKerjaTable: React.FC = () => {
  const [satuanKerjaData, setSatuanKerjaData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetching data from the API (replace with your API endpoint)
    axios
      .get('http://your-api-endpoint.com/satuan-kerja')  // Replace with the correct API endpoint
      .then((response) => {
        setSatuanKerjaData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Dummy data for now
  const dummyData = [
    {
      namaSatuanKerja: 'Unit 1',
      jumlahPegawai: 10,
      bangkom20Jam: 5,
      bangkomMoreThan20Jam: 3,
    },
    {
      namaSatuanKerja: 'Unit 2',
      jumlahPegawai: 8,
      bangkom20Jam: 3,
      bangkomMoreThan20Jam: 4,
    },
  ];

  const tableData = satuanKerjaData.length > 0 ? satuanKerjaData : dummyData;

  return (
 <RootLayout>
   <div className="overflow-x-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-center">MONITORING BANGKOM</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
          <thead>
            <tr className="bg-teal-900 text-white">
              <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                Nama Satuan Kerja
              </th>
              <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                Jumlah Pegawai
              </th>
              <th colSpan={2} className="p-3 border border-teal-700 text-center font-bold uppercase text-sm">
                Bangkom
              </th>
            </tr>
            <tr className="bg-teal-900 text-white">
              <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                &lt; 20 Jam
              </th>
              <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                &gt; 20 Jam
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-teal-50' : 'bg-white'}>
                <td className="px-4 py-2 border border-teal-300">{row.namaSatuanKerja}</td>
                <td className="px-4 py-2 border border-teal-300">{row.jumlahPegawai}</td>
                <td className="px-4 py-2 border border-teal-300">{row.bangkom20Jam}</td>
                <td className="px-4 py-2 border border-teal-300">{row.bangkomMoreThan20Jam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
     </div>
     </RootLayout>
  );
};

export default SatuanKerjaTable;
