'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const PermohonanTable = () => {
  const searchParams = useSearchParams();
  const status_id = searchParams.get('status_id'); // Ambil status_id dari URL
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch and sort data using chaining
  useEffect(() => {
    if (!status_id) return; // Jangan fetch data jika status_id belum tersedia

    setLoading(true);
    axios.get(`/api/permohonan?status_id=${status_id}`)
      .then((response) => {
        console.log('Response:', response.data);
        console.log('Total items fetched:', response.data.data.length);

        // Chaining for sorting and setting data
        const sortedData = (response.data.data || [])
          .sort((a, b) => new Date(b.log_time) - new Date(a.log_time));
        
        setData(sortedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error.response?.data || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [status_id]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  // Determine items for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">
        Daftar Permohonan (Status ID: {status_id || 'Loading...'})
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 px-4 py-2">Waktu</th>
                  <th className="border border-gray-300 px-4 py-2">Nama Pegawai</th>
                  <th className="border border-gray-300 px-4 py-2">Nama Editor</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(item.log_time).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{item.peg_nama}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nama_editor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-teal-600"
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-teal-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermohonanTable;
