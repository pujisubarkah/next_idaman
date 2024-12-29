"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import RootLayout from '../../pegawai/profile/edit/layout'; // Mengimpor layout dari home/layout.js

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', // Original colors
  '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#8A2BE2', // Additional colors
  '#FF4500', '#6A5ACD', '#7FFF00', '#D2691E', '#DC143C'  // Even more variations
];

const TestPage = () => {
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState<string>('');
  const [data, setData] = useState<{ category: string; value: any }[]>([]);
  const [story, setStory] = useState<string>(''); // State for the narrative story

  interface SatuanKerja {
    satuan_kerja_id: number;
    satuan_kerja_nama: string;
    golongan_details: GolonganDetails;
  }

  const [satuanKerjaList, setSatuanKerjaList] = useState<SatuanKerja[]>([]);

  // Fetch the data from API
  useEffect(() => {
    const fetchGolonganData = async () => {
      try {
        const response = await fetch('/api/rekap/golongan');
        const result = await response.json();
        // Set the first "satuan_kerja_nama" as the default selected satuan kerja
        setSatuanKerjaList(result);
        setSelectedSatuanKerja(result[0]?.satuan_kerja_nama);
        setData(transformDataForChart(result[0]?.golongan_details)); // Transform the data
        generateStory(result[0]?.golongan_details); // Generate narrative based on data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchGolonganData();
  }, []);

  // Transform the data into a format that can be used by the chart
  interface GolonganDetails {
    [key: string]: {
      total: number;
    };
  }

  const transformDataForChart = (golonganDetails: GolonganDetails) => {
    if (!golonganDetails) return [];
    return Object.entries(golonganDetails).map(([category, { total }]) => ({
      category,
      value: total,
    }));
  };

  // Generate the story (narrative) based on the chart data
  const generateStory = (golonganDetails: GolonganDetails) => {
    if (!golonganDetails) return;

    const categories = Object.entries(golonganDetails);
    let narrative = 'Berikut adalah narasi data yang dapat dilihat berdasarkan kategori golongan: ';

    // Add dynamic narrative based on data
    categories.forEach(([category, { total }], index) => {
      narrative += `Kategori ${category} memiliki total ${total} orang. `;
      if (index === categories.length - 1) {
        narrative += `Secara keseluruhan, data ini menunjukkan distribusi golongan yang cukup beragam.`;
      }
    });

    setStory(narrative);
  };

  // Handle change in selected Satuan Kerja and update chart data
  const handleSatuanKerjaChange = (event) => {
    const selected = event.target.value;
    setSelectedSatuanKerja(selected);
    const selectedSatuanKerjaData = satuanKerjaList.find(
      (item) => item.satuan_kerja_nama === selected
    );
    if (selectedSatuanKerjaData) {
      setData(transformDataForChart(selectedSatuanKerjaData.golongan_details));
      generateStory(selectedSatuanKerjaData.golongan_details); // Re-generate story
    }
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
            {satuanKerjaList.map((item) => (
              <option key={item.satuan_kerja_id} value={item.satuan_kerja_nama}>
                {item.satuan_kerja_nama}
              </option>
            ))}
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
         {/* Narrative / Story about the data */}
         <div style={{ marginBottom: '20px' }}>
          <h3 className="text-xl font-semibold">Analisis Data:</h3>
          <p>{story}</p>
        </div>
    </RootLayout>
  );
};

export default TestPage;
