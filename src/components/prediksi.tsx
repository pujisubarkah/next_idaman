"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Function to calculate the retirement date based on the birthdate and retirement age
const calculateRetirementDate = (birthDate, retirementAge) => {
    const birth = new Date(birthDate);
    const retirementDate = new Date(birth.setFullYear(birth.getFullYear() + retirementAge));
    return retirementDate;
};

const Prediksi = () => {
    const [pegawai, setPegawai] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(""); // Satuan kerja yang dipilih
    const [satuanKerjaList, setSatuanKerjaList] = useState([]); // Daftar satuan kerja yang unik

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/pegawai", {
                    params: {
                        year: selectedYear.getFullYear(),
                        page: currentPage,
                        itemsPerPage,
                        search: searchTerm, // Mengirimkan search term untuk filter satuan kerja
                    },
                });

                const { data, totalItems } = response.data;
                setPegawai(data || []);
                setTotalItems(totalItems);

                // Extract unique "satuan_kerja_nama" for dropdown options
                const uniqueSatuanKerja = [
                    ...new Set(data.map((pegawai) => pegawai.satuan_kerja_nama)),
                ];
                setSatuanKerjaList(uniqueSatuanKerja);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedYear, currentPage, itemsPerPage, searchTerm]); // Menambahkan searchTerm sebagai dependensi

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); 
    };

    const handleYearChange = (date) => {
        setSelectedYear(date); 
        setCurrentPage(1); 
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update searchTerm berdasarkan input
        setCurrentPage(1); // Reset halaman ke 1 ketika filter berubah
    };

    const handleExport = () => {
        console.log("Export to Excel");
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Filter pegawai berdasarkan satuan kerja dan tahun pensiun
    const filteredPegawai = pegawai.filter((pegawaiItem) => {
        const retirementDate = calculateRetirementDate(pegawaiItem.peg_lahir_tanggal, pegawaiItem.pegawai_umur_pensiun);
        const isRetirementYearMatch = retirementDate.getFullYear() === selectedYear.getFullYear();
        const isSatuanKerjaMatch = searchTerm ? pegawaiItem.satuan_kerja_nama.includes(searchTerm) : true;
        return isRetirementYearMatch && isSatuanKerjaMatch;
    });

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <h3 className="text-center text-xl font-semibold my-8">
                    PREDIKSI PEGAWAI PENSIUN
                </h3>

                <div className="flex flex-col items-center mb-4">
                    <DatePicker
                        selected={selectedYear}
                        onChange={handleYearChange}
                        dateFormat="yyyy-MM-dd"
                        className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-teal-500 mb-4"
                    />

                  

                    <div className="mt-4">
                        <select
                            className="p-2 border border-gray-300 rounded"
                            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm saat dropdown berubah
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

                <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">
                    <thead className="bg-teal-600">
                        <tr>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Nama</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">NIP</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Tanggal Lahir</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Satuan Kerja</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Unit Kerja</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Golongan</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Jabatan</th>
                            <th className="p-3 border border-teal-500 text-left font-bold uppercase text-sm">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPegawai.map((pegawaiItem, index) => {
                            return (
                                <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>
                                    <td className="p-3 border border-teal-500">{pegawaiItem.peg_nama_lengkap}</td>
                                    <td className="p-3 border border-teal-500">{pegawaiItem.peg_nip}</td>
                                    <td className="p-3 border border-teal-500">{formatDate(pegawaiItem.peg_lahir_tanggal)}</td>
                                    <td className="p-3 border border-teal-500">{pegawaiItem.nm_satuan_kerja}</td>
                                    <td className="p-3 border border-teal-500">{pegawaiItem.unit_kerja_nama}</td>
                                    <td className="p-3 border border-teal-500">{pegawaiItem.gol_akhir}</td>
                                    <td className="p-3 border border-teal-500">{pegawaiItem.jabatan_nama}</td>
                                    <td className="p-3 border border-teal-500">
                                        <button className="text-teal-700 hover:underline">View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

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
        </div>
    );
};

export default Prediksi;
