"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import RootLayout from "../../pegawai/profile/edit/layout";

export default function DataCompletenessMonitoring() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [selectedEmployee, setSelectedEmployee] = useState<any[] | null>(null);

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/data/mkd`);
      setData(response.data.categories);
    } catch (error) {
      console.error("Error fetching data completeness:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (items) => {
    setSelectedEmployee(items);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  return (
    <RootLayout>
      <div className="flex-4 h-full px-4 overflow-auto">
        <div className="text-center mb-10">
          <h3 className="text-lg font-bold font-poppins">Monitoring Kelengkapan Data Tahun {year}</h3>
        </div>

        {/* Show the Loading Spinner while data is loading */}
        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">
              <thead>
                <tr className="bg-[#3781c7] text-white">
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Keterangan</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Progres</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jumlah Pegawai</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>
                      <td className="px-4 py-2 border border-[#f2bd1d]">Kategori {index + 1}</td>
                      <td className="px-4 py-2 border border-[#f2bd1d]">{item.progres}</td>
                      <td className="px-4 py-2 border border-[#f2bd1d]">{item.jumlah_pegawai}</td>
                      <td className="px-4 py-2 border border-[#f2bd1d]">{item.Total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RootLayout>
  );
}