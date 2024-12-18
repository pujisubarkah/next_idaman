'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [statuses, setStatuses] = useState<any[]>([]);
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
      const response = await axios.get("/api/satuan_kerja"); // Adjust API URL as needed
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
        <h3 className="text-lg font-bold font-poppins">DAFTAR MASTER JABATAN FUNGSIONAL TERTENTU</h3>
      </div>
      <hr className="my-4 border-gray-300" />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
            <thead>
              <tr className="bg-teal-900 text-white">
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Nama Jabatan
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Skil
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Jumlah Pegawai
                </th>
                <th rowSpan={2} className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {statuses.map(({ satuan_kerja_nama, kode_skpd, id }, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                  <td className="px-4 py-2 border border-teal-300">{satuan_kerja_nama}</td>
                  <td className="px-4 py-2 border border-teal-300">{satuan_kerja_nama}</td>
                  <td className="px-4 py-2 border border-teal-300">{kode_skpd}</td>
                  <td className="px-4 py-2 border border-teal-300">
                    {/* Icon View */}
                    <div className="flex items-center cursor-pointer hover:text-teal-500 mb-2">
                        <FontAwesomeIcon icon={faEdit} className="text-teal-700 mr-2" />
                        <span className="text-teal-700 text-sm">Edit</span>
                    </div>
                    {/* Icon Kembalikan */}
                    <div className="flex items-center cursor-pointer hover:text-teal-500">
                        <FontAwesomeIcon icon={faTrash} className="text-teal-700 mr-2" />
                        <span className="text-teal-700 text-sm">Delete</span>
                    </div>
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
