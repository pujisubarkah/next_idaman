'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import RootLayout from "../../pegawai/profile/edit/layout";
import { FaPlus } from "react-icons/fa";

export default function ListUnitPage() {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [satuanKerjaNama, setSatuanKerjaNama] = useState("");
  const [kodeSkpd, setKodeSkpd] = useState("");
  const [status, setStatus] = useState(1); // 1 for active, 0 for inactive
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchStatuses();
  }, [currentPage, entriesPerPage]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, statuses]);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/data/satuan_kerja");
      const data = Array.isArray(response.data) ? response.data : [];
      setStatuses(data);
      setFilteredStatuses(data);
    } catch (error) {
      console.error("Error fetching statuses:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const searchResults = statuses.filter(
      (item) =>
        item.satuan_kerja_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kode_skpd.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStatuses(searchResults);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEntriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
  };

  // Open and close modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      // Reset form when closing the modal
      resetForm();
    }
  };

  const resetForm = () => {
    setSatuanKerjaNama("");
    setKodeSkpd("");
    setStatus(1);
    setEditId(null);
  };

  // Handle form submit to create or update Satuan Kerja
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/data/satuan_kerja/${editId}` : "/api/data/satuan_kerja";
    const method = editId ? "put" : "post";

    try {
      const response = await axios[method](url, {
        satuan_kerja_nama: satuanKerjaNama,
        kode_skpd: kodeSkpd,
        status: status,
      });
      console.log(`Satuan Kerja ${editId ? "updated" : "created"}:`, response.data);
      toggleModal(); // Close the modal
      fetchStatuses(); // Refresh the data after create/update
    } catch (error) {
      console.error(`Error ${editId ? "updating" : "creating"} satuan kerja:`, error.response?.data || error.message);
    }
  };

  const handleEdit = (id: number) => {
    const satuanKerja = statuses.find(item => item.satuan_kerja_id === id);
    if (satuanKerja) {
      setSatuanKerjaNama(satuanKerja.satuan_kerja_nama);
      setKodeSkpd(satuanKerja.kode_skpd);
      setStatus(satuanKerja.status);
      setEditId(satuanKerja.satuan_kerja_id);
      setIsModalOpen(true);
    } else {
      console.error("Satuan Kerja not found for ID:", id);
    }
  };

  return (
    <RootLayout>
      <div className="flex-4 h-full px-4 overflow-auto">
        <div className="text-center mb-10">
          <h3 className="text-lg font-bold font-poppins">DAFTAR SATUAN KERJA LEMBAGA ADMINISTRASI NEGARA</h3>
        </div>

        {/* Search and Add Button */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="px-3 py-2 border rounded-md w-64"
              placeholder="Cari Satuan Kerja"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <button
            className="px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded shadow flex items-center"
            onClick={toggleModal}
          >
            <FaPlus className="mr-2" />
            Add Satuan Kerja
          </button>
        </div>

        {/* Show the Loading Spinner while data is loading */}
        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-[#3781c7] rounded-lg overflow-hidden my-5">
              <thead>
                <tr className="bg-[#3781c7] text-white">
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Nama</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Kode Satuan Kerja</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Status</th>
                  <th className="p-3 border border-[#f2bd1d] text-left font-bold uppercase text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStatuses.length > 0 ? (
                  filteredStatuses.map(({ satuan_kerja_id, satuan_kerja_nama, kode_skpd, status }, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-[#87ceeb]" : "bg-white"}>
                      <td className="px-4 py-2 border border-[#f2bd1d]">{satuan_kerja_nama}</td>
                      <td className="px-4 py-2 border border-[#f2bd1d]">{kode_skpd}</td>
                      <td className="px-4 py-2 border border-[#f2bd1d]">{status === 1 ? "Aktif" : "Tidak Aktif"}</td>
                      <td className="px-4 py-2 border border-[#f2bd1d]">
                        <button
                          className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"
                          onClick={() => handleEdit(satuan_kerja_id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Adding/Editing Satuan Kerja */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-bold mb-4">{editId ? "Edit Satuan Kerja" : "Tambah Satuan Kerja"}</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nama Satuan Kerja</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={satuanKerjaNama}
                    onChange={(e) => setSatuanKerjaNama(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Kode Satuan Kerja</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={kodeSkpd}
                    onChange={(e) => setKodeSkpd(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="1"
                        checked={status === 1}
                        onChange={() => setStatus(1)}
                        className="mr-2"
                      />
                      Aktif
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="0"
                        checked={status === 0}
                        onChange={() => setStatus(0)}
                        className="mr-2"
                      />
                      Tidak Aktif
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-400 rounded"
                    onClick={toggleModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded"
                  >
                    {editId ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
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
    </RootLayout>
  );
}