"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import RootLayout from '../../pegawai/profile/edit/layout';

const COLORS = ['#0088FE', '#FF69B4']; // Colors for Laki-laki and Perempuan

const TestPage = () => {
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState('');
  const [data, setData] = useState<{ gender: string; value: number }[]>([]);
  const [satuanKerjaOptions, setSatuanKerjaOptions] = useState<{ satuan_kerja_id: number; satuan_kerja_nama: string; pegawai_by_gender: { L: { count: number }; P: { count: number } } }[]>([]);
  const [story, setStory] = useState('');  // State for story

  // Fetch data from API using Axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/rekap/jeniskelamin');
        const apiData = response.data;

        // Set default satuan kerja
        setSatuanKerjaOptions(apiData);
        if (apiData.length > 0) {
          setSelectedSatuanKerja(apiData[0].satuan_kerja_nama);
          setData(transformData(apiData[0].pegawai_by_gender));
          generateStory(apiData[0].pegawai_by_gender);  // Generate story on load
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setStory('Error fetching data');  // Handle error in data story
      }
    };
    fetchData();
  }, []);

  // Generate the narrative based on the gender data
  const generateStory = (pegawaiByGender) => {
    const lakiLakiCount = pegawaiByGender['L']?.count || 0;
    const perempuanCount = pegawaiByGender['P']?.count || 0;

    let narrative = 'Distribusi Gender di Satuan Kerja: ';

    narrative += `Jumlah Laki-laki: ${lakiLakiCount}, `;
    narrative += `Jumlah Perempuan: ${perempuanCount}. `;

    if (lakiLakiCount > perempuanCount) {
      narrative += 'Terdapat lebih banyak pegawai laki-laki dibandingkan pegawai perempuan.';
    } else if (perempuanCount > lakiLakiCount) {
      narrative += 'Terdapat lebih banyak pegawai perempuan dibandingkan pegawai laki-laki.';
    } else {
      narrative += 'Jumlah pegawai laki-laki dan perempuan seimbang.';
    }

    setStory(narrative);
  };

  // Transform data for the PieChart
  const transformData = (pegawaiByGender) => {
    return [
      { gender: 'Laki-laki', value: pegawaiByGender['L']?.count || 0 },
      { gender: 'Perempuan', value: pegawaiByGender['P']?.count || 0 },
    ];
  };

  // Handle change in selected Satuan Kerja
  const handleSatuanKerjaChange = (event) => {
    const newSatuanKerja = event.target.value;
    setSelectedSatuanKerja(newSatuanKerja);

    const selectedData = satuanKerjaOptions.find(
      (item) => item.satuan_kerja_nama === newSatuanKerja
    );
    if (selectedData) {
      setData(transformData(selectedData.pegawai_by_gender));
      generateStory(selectedData.pegawai_by_gender);  // Update the story
    }
  };

  return (
    <RootLayout>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 className="text-2xl font-bold mb-2">Distribusi Gender Berdasarkan Satuan Kerja</h2>
        <p className="text-lg mb-4">
          Aparatur Sipil Negara di Lingkungan Lembaga Administrasi Negara
        </p>

        {/* Dropdown for selecting Satuan Kerja */}
<div className="mb-6 flex items-center space-x-4">
  <label htmlFor="satuanKerja" className="text-lg font-semibold">Pilih Satuan Kerja:</label>
  <select
    id="satuanKerja"
    value={selectedSatuanKerja}
    onChange={handleSatuanKerjaChange}
    className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {satuanKerjaOptions.map((item) => (
      <option key={item.satuan_kerja_id} value={item.satuan_kerja_nama}>
        {item.satuan_kerja_nama}
      </option>
    ))}
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

        {/* Narrative / Story about the data */}
        <div style={{ marginBottom: '20px' }}>
          <h3 className="text-xl font-semibold">Analisis Data:</h3>
          <p>{story}</p>
        </div>
      </div>
    </RootLayout>
  );
};

export default TestPage;
