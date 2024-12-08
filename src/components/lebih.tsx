"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Check if the date is the Unix epoch (January 1, 1970)
  if (date.getTime() === new Date('1970-01-01').getTime()) {
    return null; // Return null or an appropriate message if the date is invalid
  }
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const ListPegawai = () => {
  const [pegawai, setPegawai] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data with axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/notifikasi/lebih', {
          params: {
            searchQuery,
            page: currentPage,
            itemsPerPage,
            pensiun_id: '1, 4', // Add filter for pensiun_id
          },
        });

        const { data } = response.data;
        setPegawai(data || []);
        setTotalItems(response.data.totalItems);
        setTotalPages(Math.ceil(response.data.totalItems / itemsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <h3 className="text-center text-xl font-semibold my-8">DAFTAR PEGAWAI MELEBIHI BATAS PENSIUN</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
          <thead className="bg-teal-600">
            <tr className="text-white">
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Nama</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">NIP</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Tanggal Lahir</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Satuan Kerja</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Unit Kerja</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Golongan</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Eselon</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Jabatan</th>
              <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">PILIHAN</th>
            </tr>
          </thead>
          <tbody>
            {pegawai.map(({ peg_nama_lengkap, peg_lahir_tanggal, peg_nip, satuan_kerja_nama, unit_kerja_nama, gol_akhir, eselon_nm, jabatan_nama }, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{peg_nama_lengkap}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{peg_nip}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(peg_lahir_tanggal)}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{satuan_kerja_nama}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{unit_kerja_nama}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{gol_akhir}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{eselon_nm}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{jabatan_nama}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">
                  <div className="flex items-center cursor-pointer hover:text-teal-500 mb-2">
                    <FontAwesomeIcon icon={faSearch} className="text-teal-700 mr-2" />
                    <span className="text-teal-700 text-sm">View</span>
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
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div>
            <span>Items per page:</span>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="ml-2 p-1 border border-teal-600 rounded">
              {[10, 20, 30, 50].map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPegawai;
