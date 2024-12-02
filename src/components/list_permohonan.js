'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Use this import for Next.js 13 `app` directory

const PermohonanTable = () => {
  const router = useRouter();
  const [statusId, setStatusId] = useState(null); // Store the status_id
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ensure this code runs only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Running on client side');
      if (router.isReady) {
        const { status_id } = router.query;
        console.log('status_id from query:', status_id);
        if (status_id) {
          setStatusId(status_id);  // Set statusId once router is ready
        }
      }
    }
  }, [router.isReady, router.query]);

  // Fetch data once statusId is set
  useEffect(() => {
    if (!statusId) return; // Don't fetch data if status_id is not available

    setLoading(true);
    console.log('Fetching data with status_id:', statusId);

    axios
      .get(`/api/permohonan?status_id=${statusId}`)
      .then((response) => {
        const fetchedData = response.data.data || [];
        console.log('Fetched Data:', fetchedData);

        // Sort data by log_time
        const sortedData = fetchedData.sort(
          (a, b) => new Date(b.log_time) - new Date(a.log_time)
        );
        setData(sortedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error.response?.data || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [statusId]); // Only trigger fetch when statusId changes

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">
        Daftar Permohonan {statusId ? `(Status ID: ${statusId})` : 'Loading...'}
      </h2>

      {loading ? (
        <p className="text-center">Loading data...</p>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
              <thead className="bg-teal-600">
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
                    className={index % 2 === 0 ? 'bg-teal-50' : 'bg-white'} // Odd/even row styling
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
