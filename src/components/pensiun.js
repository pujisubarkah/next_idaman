"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faSearch, faRotateRight, faFileExcel } from '@fortawesome/free-solid-svg-icons';

const PensiunPage = () => {
    const [pegawai, setPegawai] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
  
    // Fetch data dengan axios
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/pensiun', {
            params: {
              searchQuery, // Kirimkan query pencarian
              page: currentPage,
              itemsPerPage: 10, // Bisa disesuaikan
            }
          });
  
          const { data } = response.data;
          setPegawai(data);
          setTotalItems(response.data.totalItems);
          setTotalPages(Math.ceil(response.data.totalItems / 10));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [currentPage, searchQuery]); // Dependensi agar dijalankan saat halaman atau query berubah
  

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleExport = () => {
    alert("Exporting to Excel...");
    // You can use a library like `xlsx` here to generate an Excel file
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <h3 className="text-center text-xl font-semibold my-8">DAFTAR PEGAWAI PENSIUN</h3>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="mr-2">Show:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-2 border border-gray-300 rounded"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari Pegawai..."
                className="p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={handleExport}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            aria-label="Export data to Excel"
          >
            <FontAwesomeIcon icon={faFileExcel} />
            Export to Excel
          </button>
        </div>

        <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
          <thead className="bg-teal-600">
          <tr className="bg-teal-900 text-white">
              <th rowSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Nama/Tempat Tgl Lahir</th>
              <th rowSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">NIP</th>
              <th colSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Pangkat</th>
              <th rowSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Unit Kerja</th>
              <th colSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Jabatan</th>
              <th colSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Pegawai</th>
              <th colSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Masa Kerja</th>
              <th rowSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">TMT PENSIUN</th>
              <th rowSpan="2" className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">PILIHAN</th>
            </tr>
            <tr className="bg-teal-900 text-white">
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Gol</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">TMT Gol</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Nama</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">TMT Jabatan</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Status</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">TMT Status</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Thn</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Bln</th>
            </tr>
          </thead>
          <tbody>
            
            {pegawai.map((data, index) => (
              <tr key={index}  className={index % 2 === 0 ? "bg-teal-50" : "bg-white"} // Memeriksa apakah baris ganjil atau genap
              >
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">
                  {data.peg_nama_lengkap} {data.peg_lahir_tempat} , 
                  {formatDate(data.peg_lahir_tanggal)}
                </td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{data.peg_nip}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{data.nm_gol_akhir}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(data.peg_gol_akhir_tmt)}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{data.unit_kerja_nama}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{data.jabatan_nama}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(data.peg_jabatan_tmt)}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{data.status_pegawai}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(data.tmt_status_pegawai)}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{data.masa_kerja_tahun}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{data.masa_kerja_bulan}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(data.tmt_pensiun)}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">
  {/* Icon View */}
  <div className="flex items-center cursor-pointer hover:text-teal-500 mb-2">
    <FontAwesomeIcon icon={faSearch} className="text-teal-700 mr-2" />
    <span className="text-teal-700 text-sm">View</span>
  </div>

  {/* Icon Kembalikan */}
  <div className="flex items-center cursor-pointer hover:text-teal-500">
    <FontAwesomeIcon icon={faRotateRight} className="text-teal-700 mr-2" />
    <span className="text-teal-700 text-sm">Kembalikan</span>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            >
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-teal-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            >
              Next
            </button>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default PENSIUN;