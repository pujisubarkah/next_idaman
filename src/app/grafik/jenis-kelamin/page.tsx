"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

// Dummy data for each Satuan Kerja (this can be replaced with actual data from an API)
const dataForSatuanKerja = {
  'Satuan Kerja 1': [
    { gender: 'Laki-laki', value: 400 },
    { gender: 'Perempuan', value: 300 },
  ],
  'Satuan Kerja 2': [
    { gender: 'Laki-laki', value: 500 },
    { gender: 'Perempuan', value: 350 },
  ],
  'Satuan Kerja 3': [
    { gender: 'Laki-laki', value: 450 },
    { gender: 'Perempuan', value: 330 },
  ],
};

const COLORS = ['#0088FE', '#FF69B4']; // Colors for Laki-laki and Perempuan

const TestPage = () => {
  // State to manage the selected Satuan Kerja and corresponding chart data
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState('Satuan Kerja 1');
  const [data, setData] = useState(dataForSatuanKerja[selectedSatuanKerja]);

  // Handle change in selected Satuan Kerja and update chart data
  const handleSatuanKerjaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSatuanKerja = event.target.value;
    setSelectedSatuanKerja(newSatuanKerja);
    setData(dataForSatuanKerja[newSatuanKerja]);
  };

  return (
    <RootLayout>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 className="text-2xl font-bold mb-2">Distribusi Gender</h2>
        <p className="text-lg mb-4">Aparatur Sipil Negara di Lingkungan Lembaga Administrasi Negara</p>

        {/* Dropdown for selecting Satuan Kerja */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="satuanKerja">Pilih Satuan Kerja:</label>
          <select
            id="satuanKerja"
            value={selectedSatuanKerja}
            onChange={handleSatuanKerjaChange}
            style={{ padding: '10px', marginLeft: '10px' }}
          >
            <option value="Satuan Kerja 1">Satuan Kerja 1</option>
            <option value="Satuan Kerja 2">Satuan Kerja 2</option>
            <option value="Satuan Kerja 3">Satuan Kerja 3</option>
          </select>
        </div>

        {/* Responsive Pie Chart */}
        <ResponsiveContainer width="80%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="gender"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={(entry) => `${entry.gender}: ${entry.value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </RootLayout>
  );
};

export default TestPage;
