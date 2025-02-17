"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import RootLayout from "../../pegawai/profile/edit/layout"; // Import layout
import axios from "axios"; // Import axios for fetching data

// Define colors for the bar chart
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE", "#8CDAFE", "#FEB19C", "#AFEE8C", "#FECF68", "#D47FFF",
];

const EducationChart = () => {
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState<string>("Tugas Belajar");
  const [data, setData] = useState<any[]>([]);
  const [satuanKerjaOptions, setSatuanKerjaOptions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/rekap/pendidikan");
      const fetchedData = response.data;

      // Prepare the data structure for the bar chart
      const formattedData: { [key: string]: any[] } = {};
      fetchedData.forEach((item: any) => {
        const pegawaiByPendidikan = item.pegawai_by_pendidikan;

        // Prepare the data for each education level (e.g., "S1", "S2")
        const educationData = Object.keys(pegawaiByPendidikan).map((level) => ({
          category: level, // Education level (S1, S2, etc.)
          value: pegawaiByPendidikan[level].length, // Count of employees in that level
        }));

        formattedData[item.satuan_kerja_nama] = educationData;
      });

      setData(formattedData[selectedSatuanKerja] || []); // Set data or empty array if not found
      setSatuanKerjaOptions(fetchedData.map((item: any) => ({
        satuan_kerja_id: item.satuan_kerja_id,
        satuan_kerja_nama: item.satuan_kerja_nama,
      })));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later."); // Set error message
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSatuanKerja]);

  const handleSatuanKerjaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSatuanKerja = event.target.value;
    setSelectedSatuanKerja(newSatuanKerja);
    // No need to set data here, it will be updated in useEffect
  };

  return (
    <RootLayout>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 className="text-2xl font-bold mb-2">Grafik Tingkat Pendidikan</h2>
        <p className="text-lg mb-4">Distribusi Tingkat Pendidikan di Lingkungan Lembaga Administrasi Negara</p>

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

        {/* Error message */}
        {error && <p className="text-red-500">{error}</p>}

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