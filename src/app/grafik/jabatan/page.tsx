"use client";

import React, { useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

// Dummy data for each Satuan Kerja (this can be replaced with actual data from an API)
const dataForSatuanKerja = {
  'Satuan Kerja 1': [
    { name: 'Manager', value: 400 },
    { name: 'Engineer', value: 300 },
    { name: 'HR', value: 300 },
    { name: 'Sales', value: 200 },
    { name: 'Marketing', value: 150 },
  ],
  'Satuan Kerja 2': [
    { name: 'Manager', value: 250 },
    { name: 'Engineer', value: 350 },
    { name: 'HR', value: 150 },
    { name: 'Sales', value: 220 },
    { name: 'Marketing', value: 180 },
  ],
  'Satuan Kerja 3': [
    { name: 'Manager', value: 500 },
    { name: 'Engineer', value: 400 },
    { name: 'HR', value: 350 },
    { name: 'Sales', value: 280 },
    { name: 'Marketing', value: 220 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347'];

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
    <div className="text-center mt-12">
      <h2 className="text-2xl font-bold mb-2">Grafik Jabatan</h2>
      <p className="text-lg mb-4">Aparatur Sipil Negara di Lingkungan Lembaga Administrasi Negara</p>
      
      {/* Dropdown for selecting Satuan Kerja */}
      <div className="mb-5">
        <label htmlFor="satuanKerja">Pilih Satuan Kerja:</label>
        <select
        id="satuanKerja"
        value={selectedSatuanKerja}
        onChange={handleSatuanKerjaChange}
        className="p-2 ml-2 border rounded"
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
          nameKey="name"
          cx="50%" cy="50%" 
          outerRadius={150} 
          fill="#8884d8"
          label
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
