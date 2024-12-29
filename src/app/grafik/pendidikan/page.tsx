"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

// Dummy data for each Satuan Kerja (this can be replaced with actual data from an API)
const dataForEducationLevels = {
  'Satuan Kerja 1': [
    { category: 'SD', value: 10 },
    { category: 'SLTP', value: 20 },
    { category: 'SLTA', value: 30 },
    { category: 'D1', value: 5 },
    { category: 'D2', value: 7 },
    { category: 'D3', value: 15 },
    { category: 'D4', value: 3 },
    { category: 'S1', value: 25 },
    { category: 'S2', value: 10 },
    { category: 'S3', value: 2 },
  ],
  'Satuan Kerja 2': [
    { category: 'SD', value: 15 },
    { category: 'SLTP', value: 25 },
    { category: 'SLTA', value: 35 },
    { category: 'D1', value: 10 },
    { category: 'D2', value: 5 },
    { category: 'D3', value: 20 },
    { category: 'D4', value: 4 },
    { category: 'S1', value: 30 },
    { category: 'S2', value: 12 },
    { category: 'S3', value: 3 },
  ],
  'Satuan Kerja 3': [
    { category: 'SD', value: 8 },
    { category: 'SLTP', value: 18 },
    { category: 'SLTA', value: 28 },
    { category: 'D1', value: 7 },
    { category: 'D2', value: 4 },
    { category: 'D3', value: 12 },
    { category: 'D4', value: 2 },
    { category: 'S1', value: 22 },
    { category: 'S2', value: 8 },
    { category: 'S3', value: 1 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#8CDAFE', '#FEB19C', '#AFEE8C', '#FECF68', '#D47FFF'];

const EducationChart = () => {
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState('Satuan Kerja 1');
  const [data, setData] = useState(dataForEducationLevels[selectedSatuanKerja]);

  const handleSatuanKerjaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSatuanKerja = event.target.value;
    setSelectedSatuanKerja(newSatuanKerja);
    setData(dataForEducationLevels[newSatuanKerja]);
  };

  return (
    <RootLayout>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 className="text-2xl font-bold mb-2">Grafik Tingkat Pendidikan</h2>
        <p className="text-lg mb-4">Distribusi Tingkat Pendidikan di Lingkungan Lembaga Administrasi Negara</p>

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
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
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

export default EducationChart;
