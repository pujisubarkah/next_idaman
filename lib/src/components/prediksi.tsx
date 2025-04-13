"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

// Helper functions
const formatDate = (dateString) => {
    const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const calculateRetirementDate = (birthDate, retirementAge) => {
    const birth = new Date(birthDate);
    return new Date(birth.setFullYear(birth.getFullYear() + retirementAge));
};

interface Pegawai {
    peg_nama_lengkap: string;
    peg_nip: string;
    peg_lahir_tanggal: string;
    satuan_kerja_nama: string;
    unit_kerja_nama: string;
    gol_akhir: string;
    jabatan_nama: string;
    pegawai_umur_pensiun: number;
}

const Prediksi = () => {
    // States
    const [pegawai, setPegawai] = useState<Pegawai[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [satuanKerjaList, setSatuanKerjaList] = useState<string[]>([]);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/pegawai", {
                    params: {
                        year: selectedYear.getFullYear(),
                        page: currentPage,
                        itemsPerPage,
                        search: searchTerm,
                    },
                });

                const { data, totalItems } = response.data as { data: Pegawai[], totalItems: number };
                setPegawai(data || []);
                setTotalItems(totalItems);

                // Extract unique satuan kerja names
                const uniqueSatuanKerja: string[] = [...new Set(data.map((item) => item.satuan_kerja_nama))];
                setSatuanKerjaList(uniqueSatuanKerja);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedYear, currentPage, itemsPerPage, searchTerm]);

    // Handlers
    const handlePageChange = (newPage) => setCurrentPage(newPage);
    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };
    const handleYearChange = (date) => {
        setSelectedYear(date);
        setCurrentPage(1);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };
    const handleExport = () => {
        console.log("Export to Excel functionality triggered.");
    };

    // Pagination logic
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Filtered data
    const filteredPegawai = pegawai.filter((pegawaiItem) => {
        const retirementDate = calculateRetirementDate(pegawaiItem.peg_lahir_tanggal, pegawaiItem.pegawai_umur_pensiun);
        const isRetirementYearMatch = retirementDate.getFullYear() === selectedYear.getFullYear();
        const isSatuanKerjaMatch = searchTerm ? pegawaiItem.satuan_kerja_nama.includes(searchTerm) : true;
        return isRetirementYearMatch && isSatuanKerjaMatch;
    });

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <h3 className="text-center text-xl font-semibold my-8">PREDIKSI PEGAWAI PENSIUN</h3>

                <div className="flex flex-col items-center mb-4">
                    {/* Date Picker */}
                    <DatePicker
                        selected={selectedYear}
                        onChange={handleYearChange}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-teal-500 mb-4"
                    />

                    {/* Dropdown Filter */}
                    <div className="mt-4">
                        <select
                            className="p-2 border border-gray-300 rounded"
                            onChange={handleSearchChange}
                            value={searchTerm}
                        >
                            <option value="">Select Satuan Kerja</option>
                            {satuanKerjaList.map((satuanKerja, index) => (
                                <option key={index} value={satuanKerja}>
                                    {satuanKerja}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
                    <thead className="bg-teal-600">
                        <tr>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Nama</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">NIP</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">
                                Tanggal Lahir
                            </th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Satuan Kerja</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Unit Kerja</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Golongan</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Jabatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPegawai.map((pegawaiItem, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                                <td className="p-3 border border-teal-500">{pegawaiItem.peg_nama_lengkap}</td>
                                <td className="p-3 border border-teal-500">{pegawaiItem.peg_nip}</td>
                                <td className="p-3 border border-teal-500">{formatDate(pegawaiItem.peg_lahir_tanggal)}</td>
                                <td className="p-3 border border-teal-500">{pegawaiItem.satuan_kerja_nama}</td>
                                <td className="p-3 border border-teal-500">{pegawaiItem.unit_kerja_nama}</td>
                                <td className="p-3 border border-teal-500">{pegawaiItem.gol_akhir}</td>
                                <td className="p-3 border border-teal-500">{pegawaiItem.jabatan_nama}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Prediksi;
