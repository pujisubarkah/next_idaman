"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faSearch, faEdit, faTrash, faFileExcel, faAdd } from '@fortawesome/free-solid-svg-icons';

const formatDate = (dateString) => {
  const options = { year: 'numeric' as 'numeric' | '2-digit', month: 'long' as 'numeric' | '2-digit', day: 'numeric' as 'numeric' | '2-digit' | undefined };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
const sortByTmtPensiun = (data) => {
  return data.sort((a, b) => new Date(b.tmt_pensiun).getTime() - new Date(a.tmt_pensiun).getTime());
};

const ListPegawai = () => {
    const [pegawai, setPegawai] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
  
    // Fetch data dengan axios
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/pegawai', {
            params: {
              searchQuery,
              page: currentPage,
              itemsPerPage,
              pensiun_id: '1, 4', // Tambahkan filter pensiun_id
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
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleViewProfile = (nip) => {
    window.open(`/pegawai/profile/edit/${nip}`, "_blank");
  };

  const handleEditProfile = (nip) => {
    window.open(`/edit-pegawai/${nip}`, "_blank");
  };
  
  const handleExport = () => {
    alert("Exporting to Excel...");
    // You can use a library like `xlsx` here to generate an Excel file
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Cek apakah tanggal adalah 1 Januari 1970
    if (date.getTime() === new Date('1970-01-01').getTime()) {
      return null; // Atau kembalikan string "Tanggal Tidak Tersedia"
    }
  
    const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
    return date.toLocaleDateString(undefined, options);
  };
  


  return (
    <div className="p-4">
    <div className="overflow-x-auto">
      <h3 className="text-center text-xl font-semibold my-8">DAFTAR PEGAWAI SATUAN KERJA LAN</h3>
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

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
             <button
              onClick={() => window.location.href = '/tambah-pegawai'}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              aria-label="Add Pegawai"
            >
              <FontAwesomeIcon icon={faAdd} />
              Tambah Pegawai
            </button>
            <button
              onClick={handleExport}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              aria-label="Export data to Excel"
            >
              <FontAwesomeIcon icon={faFileExcel} />
              Export to Excel
            </button>
          </div>
        </div>
      </div>


        <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
          <thead className="bg-teal-600">
          <tr className="bg-teal-900 text-white">
              <th rowSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Nama/Tempat Tgl Lahir</th>
              <th rowSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">NIP</th>
              <th colSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Pangkat</th>
              <th colSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Jabatan</th>
              <th colSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Pegawai</th>
              <th colSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Masa Kerja</th>
              <th rowSpan={2} className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">PILIHAN</th>
            </tr>
            <tr className="bg-teal-900 text-white">
              <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Gol</th>
              <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">TMT Gol</th>
              <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Nama</th>
              <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">TMT Jabatan</th>
              <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Status</th>
              <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">TMT Status</th>
              <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Thn</th>
              <th className="p-3 border border-teal-500 text-center font-bold uppercase text-sm">Bln</th>
            </tr>
          </thead>
          <tbody>
            
          {pegawai.map(({ peg_nama_lengkap, peg_lahir_tanggal, peg_lahir_tempat, peg_nip, gol_akhir, peg_gol_akhir_tmt, jabatan_nama, peg_jabatan_tmt, status_pegawai, peg_pns_tmt, masa_kerja_tahun, masa_kerja_bulan }, index) => (
              <tr key={index}  className={index % 2 === 0 ? "bg-teal-50" : "bg-white"} // Memeriksa apakah baris ganjil atau genap
              >
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">
                  {peg_nama_lengkap} {peg_lahir_tempat} , 
                  {formatDate(peg_lahir_tanggal) || "Tanggal Tidak Tersedia"}
                </td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{peg_nip}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{gol_akhir}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(peg_gol_akhir_tmt) || "Tanggal Tidak Tersedia"}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{jabatan_nama}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(peg_jabatan_tmt) || "Tanggal Tidak Tersedia"}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{status_pegawai}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{formatDate(peg_pns_tmt) || "Tanggal Tidak Tersedia"}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{masa_kerja_tahun}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">{masa_kerja_bulan}</td>
                <td className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">
{/* Icon View */}
<div
  className="flex items-center cursor-pointer hover:text-teal-500 mb-2"
  onClick={() => {
    const nip = peg_nip; // Get the NIP from your data (e.g., from localStorage)
    console.log("Opening profile for NIP:", nip); // Log the NIP
    window.open(`/pegawai/profile/edit/${nip}`, "_blank");  // Open the profile in a new tab
  }}
>
  <FontAwesomeIcon icon={faSearch} className="text-teal-700 mr-2" />
  <span className="text-teal-700 text-sm">View</span>
</div>
{/* Icon View */}
<div
  className="flex items-center cursor-pointer hover:text-teal-500 mb-2"
  onClick={() => {
    const nip = peg_nip; // Get the NIP from your data (e.g., from localStorage)
    console.log("Opening profile for NIP:", nip); // Log the NIP
    window.open(`/edit-pegawai/${nip}`, "_blank");  // Open the profile in a new tab
  }}
>
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

export default ListPegawai;