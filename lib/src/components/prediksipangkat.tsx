'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const PrediksiPangkat = () => {
    interface DataItem {
        peg_nama_lengkap: string;
        peg_nip: string;
        satuan_kerja_nama: string;
        unit_kerja_nama: string;
        gol_akhir: string;
        peg_gol_akhir_tmt: string;
        jabatan_nama: string;
    }
    
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchOptions, setSearchOptions] = useState([]);

    const fetchStatuses = async () => {
        setLoading(true);
        try {
          const response = await axios.get("/api/notifikasi/pangkat"); // Adjust API URL as needed
          console.log("Data dari API:", response.data);
          setData(Array.isArray(response.data) ? response.data : []);
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
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const totalPages = Math.ceil(data.length / entriesPerPage);

    const filteredData = data.filter(item =>
        item.satuan_kerja_nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    return (
        <div className="p-4">
            <h3 className="text-lg font-bold text-center mb-4">Daftar Prediksi Pangkat</h3>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    className="p-2 border rounded w-1/3"
                    placeholder="Cari Satuan Kerja..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select
                    className="p-2 border rounded"
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    value={entriesPerPage}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : filteredData.length === 0 ? (
                <p className="text-center">Tidak ada data ditemukan.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">Nama</th>
                                <th className="p-2 border">NIP</th>
                                <th className="p-2 border">Satuan Kerja</th>
                                <th className="p-2 border">Unit Kerja</th>
                                <th className="p-2 border">Golongan</th>
                                <th className="p-2 border">TMT Golongan Akhir</th>
                                <th className="p-2 border">Jabatan</th>
                                <th className="p-2 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50">
                                    <td className="p-2 border">{item.peg_nama_lengkap}</td>
                                    <td className="p-2 border">{item.peg_nip}</td>
                                    <td className="p-2 border">{item.satuan_kerja_nama}</td>
                                    <td className="p-2 border">{item.unit_kerja_nama}</td>
                                    <td className="p-2 border">{item.gol_akhir}</td>
                                    <td className="p-2 border">{item.peg_gol_akhir_tmt}</td>
                                    <td className="p-2 border">{item.jabatan_nama}</td>
                                    <td className="p-2 border text-center">
                                        <FontAwesomeIcon
                                            icon={faSearch}
                                            className="text-blue-600 cursor-pointer hover:text-blue-800"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-between items-center mt-4">
                <button
                    className="p-2 border rounded"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                <p>
                    Halaman {currentPage} dari {totalPages}
                </p>
                <button
                    className="p-2 border rounded"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PrediksiPangkat;
