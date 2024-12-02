'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';



const Dashboard = () => {
  const { statusId } = useParams(); // Ambil statusId dari URL
  const [permohonan, setPermohonan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusName, setStatusName] = useState(''); // State untuk menyimpan nama_status

  useEffect(() => {
    if (statusId) {
      fetchPermohonan();
      fetchStatusName();
    }
  }, [statusId, currentPage, entriesPerPage]);

  const fetchPermohonan = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/permohonan?status_id=${statusId}`);
      console.log("Data dari API permohonan:", response.data);

      // Set data permohonan
      if (Array.isArray(response.data)) {
        setPermohonan(response.data);
      } else {
        setPermohonan([]);
      }
    } catch (error) {
      console.error("Error fetching permohonan:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusName = async () => {
    try {
      const response = await axios.get(`/api/status/${statusId}`); // Ubah endpoint sesuai kebutuhan
      if (response.data && response.data.nama_status) {
        setStatusName(response.data.nama_status);
      } else {
        setStatusName('Status tidak ditemukan');
      }
    } catch (error) {
      console.error("Error fetching status name:", error.response?.data || error.message);
      setStatusName('Error');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
  };

  return (
    <div className="flex-4 h-full px-4 overflow-auto">
      <div className="text-center mb-10">
        <h3 className="text-lg font-bold font-poppins">DAFTAR PERMOHONAN (Status: {statusName})</h3>
      </div>
      <hr className="my-4 border-gray-300" />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
            <thead>
              <tr className="bg-teal-900 text-white">
                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Waktu
                </th>
                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Nama Pegawai
                </th>
                <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">
                  Nama Editor
                </th>
              </tr>
            </thead>
            <tbody>
              {permohonan.map(({ log_time, peg_nama, nama_editor }, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                  <td className="px-4 py-2 border border-teal-300">{new Date(log_time).toLocaleString()}</td>
                  <td className="px-4 py-2 border border-teal-300">{peg_nama}</td>
                  <td className="px-4 py-2 border border-teal-300">{nama_editor}</td>
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
