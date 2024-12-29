"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

// Dummy data for each Satuan Kerja (this can be replaced with actual data from an API)
const dataForSatuanKerja = {
  'Satuan Kerja 1': [
    { category: 'Ia', value: 400 },
    { category: 'Ib', value: 300 },
    { category: 'Ic', value: 200 },
    { category: 'Id', value: 278 },
  ],
  'Satuan Kerja 2': [
    { category: 'Ia', value: 500 },
    { category: 'Ib', value: 350 },
    { category: 'Ic', value: 250 },
    { category: 'Id', value: 320 },
  ],
  'Satuan Kerja 3': [
    { category: 'Ia', value: 450 },
    { category: 'Ib', value: 330 },
    { category: 'Ic', value: 280 },
    { category: 'Id', value: 310 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
        <h2 className="text-2xl font-bold mb-2">Grafik Jabatan</h2>
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

        {/* Responsive Bar Chart */}
        <ResponsiveContainer width="80%" height={400}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </RootLayout>
  );
};

export default TestPage;
