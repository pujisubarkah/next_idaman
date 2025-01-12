'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Operator from "./operator"; // Ensure the path is correct

const Dashboard = () => {
  interface Status {
    status: string;
    jumlah: number;
    id: number;
  }

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on initial render
  useEffect(() => {
    fetchStatuses();
  }, []); // No dependencies, fetch once on mount

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/status"); // Adjust API URL if necessary
      console.log("Statuses fetched:", response.data); // Debug log
      setStatuses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching statuses:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-4 h-full px-4 overflow-auto">
      <div className="text-center mb-10">
        <h3 className="text-lg font-bold font-poppins">DAfTAR STATUS</h3>
      </div>
      <hr className="my-4 border-gray-300" />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* Table for Admin */}
          <div className="overflow-x-auto">
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">
              <thead>
                <tr className="bg-[#3781c7] text-white">
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Status</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Jumlah</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map(({ status, jumlah, id }, index) => (
                  <tr key={id} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>
                    <td className="px-4 py-2 border border-[#f2bd1d]">{status}</td>
                    <td className="px-4 py-2 border border-[#f2bd1d]">{jumlah}</td>
                    <td className="px-4 py-2 border border-[#f2bd1d]">
                      <a href={`/list-permohonan/${id}`} className="text-[#3781c7] hover:underline">
                        Lihat Detail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Include the Operator component */}
          <Operator />
        </div>
      )}
    </div>
  );
};

export default Dashboard;