'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PermohonanTable = () => {
  interface Permohonan {
    pegawai_id: string;
    peg_nama: string;
    peg_nip?: string;
    status_name: string;
    nama_editor: string;
    action: string;
    log_time: string;
  }

  const [data, setData] = useState<Permohonan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/permohonan');
        console.log('Response:', response.data);
        setData(response.data.data || []); // Pastikan menggunakan array
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Daftar Permohonan</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Pegawai ID</th>
                <th className="border border-gray-300 px-4 py-2">Nama Pegawai</th>
                <th className="border border-gray-300 px-4 py-2">NIP</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Nama Editor</th>
                <th className="border border-gray-300 px-4 py-2">Aksi</th>
                <th className="border border-gray-300 px-4 py-2">Waktu </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {item.pegawai_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.peg_nama}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.peg_nip || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.status_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.nama_editor}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.action}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(item.log_time).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PermohonanTable;
