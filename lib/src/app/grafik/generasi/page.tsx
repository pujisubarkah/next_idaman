"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import RootLayout from "../../pegawai/profile/edit/layout"; // Mengimpor layout dari home/layout.js

// Dummy data for male and female generational distribution
const dataForGenerations = {
  "Satuan Kerja 1": {
    male: [
      { generation: "Baby Boomer", value: 50 },
      { generation: "X", value: 70 },
      { generation: "Y", value: 120 },
      { generation: "Z", value: 100 },
      { generation: "Alpha", value: 80 },
    ],
    female: [
      { generation: "Baby Boomer", value: 40 },
      { generation: "X", value: 65 },
      { generation: "Y", value: 110 },
      { generation: "Z", value: 95 },
      { generation: "Alpha", value: 85 },
    ],
  },
  "Satuan Kerja 2": {
    male: [
      { generation: "Baby Boomer", value: 60 },
      { generation: "X", value: 80 },
      { generation: "Y", value: 130 },
      { generation: "Z", value: 110 },
      { generation: "Alpha", value: 90 },
    ],
    female: [
      { generation: "Baby Boomer", value: 55 },
      { generation: "X", value: 75 },
      { generation: "Y", value: 125 },
      { generation: "Z", value: 105 },
      { generation: "Alpha", value: 95 },
    ],
  },
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE"];

const GenerationalCharts = () => {
  const [selectedSatuanKerja, setSelectedSatuanKerja] = useState(
    "Satuan Kerja 1"
  );
  const [data, setData] = useState(
    dataForGenerations[selectedSatuanKerja]
  );

  const handleSatuanKerjaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSatuanKerja = event.target.value;
    setSelectedSatuanKerja(newSatuanKerja);
    setData(dataForGenerations[newSatuanKerja]);
  };

  return (
    <RootLayout>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 className="text-2xl font-bold mb-2">Grafik Berdasarkan Generasi</h2>
        <p className="text-lg mb-4">
          Distribusi Generasi di Lingkungan Lembaga Administrasi Negara
        </p>

        {/* Dropdown for selecting Satuan Kerja */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="satuanKerja">Pilih Satuan Kerja:</label>
          <select
            id="satuanKerja"
            value={selectedSatuanKerja}
            onChange={handleSatuanKerjaChange}
            style={{ padding: "10px", marginLeft: "10px" }}
          >
            <option value="Satuan Kerja 1">Satuan Kerja 1</option>
            <option value="Satuan Kerja 2">Satuan Kerja 2</option>
          </select>
        </div>

        {/* Male Chart */}
        <div style={{ marginBottom: "40px" }}>
          <h3 className="text-xl font-semibold mb-4">Laki-Laki</h3>
          <ResponsiveContainer width="80%" height={400}>
            <BarChart data={data.male}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="generation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {data.male.map((entry, index) => (
                  <Cell
                    key={`male-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Female Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Perempuan</h3>
          <ResponsiveContainer width="80%" height={400}>
            <BarChart data={data.female}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="generation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d">
                {data.female.map((entry, index) => (
                  <Cell
                    key={`female-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </RootLayout>
  );
};

export default GenerationalCharts;
