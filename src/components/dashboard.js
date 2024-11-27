'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchStatuses();
    }
  }, [currentPage, entriesPerPage]); // Re-fetch on page or entries change

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/status"); // Adjust API URL as needed
      console.log("Data dari API:", response.data);
      setStatuses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching statuses:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(event.target.value);
  };

  return (
    <div className="flex-4 h-full px-4 overflow-auto">
      <div className="text-center mb-10">
        <h3 className="text-lg font-bold font-poppins">DAFTAR STATUS</h3>
      </div>
      <hr className="my-4 border-gray-300" />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
            <thead>
              <tr className="bg-teal-900 text-white">
                <th rowSpan="2" className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Status
                </th>
                <th rowSpan="2" className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Jumlah
                </th>
                <th rowSpan="2" className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {statuses.map(({ status, jumlah, id }, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                  <td className="px-4 py-2 border border-teal-300">{status}</td>
                  <td className="px-4 py-2 border border-teal-300">{jumlah}</td>
                  <td className="px-4 py-2 border border-teal-300">
                    <a href={`http://idaman.lan.go.id/list-permohonan/${id}`} className="text-teal-600 hover:underline">
                      Lihat Detail
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 text-sm rounded ${
                page === currentPage
                  ? "text-white bg-blue-600 hover:bg-blue-700"
                  : "text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
