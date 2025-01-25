'use client';  
  
import React, { useState, useEffect } from "react";  
import axios from "axios";  
import LoadingSpinner from "../../../components/LoadingSpinner";  
import RootLayout from "../../pegawai/profile/edit/layout";  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';  
  
export default function ListUnitPage() {  
  const [categories, setCategories] = useState<any[]>([]);  
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [searchTerm, setSearchTerm] = useState("");  
  const [entriesPerPage, setEntriesPerPage] = useState(10);  
  const [currentPage, setCurrentPage] = useState(1);  
  const [totalPages, setTotalPages] = useState(0);  
  
  // Modal form state  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [kategoriNama, setKategoriNama] = useState("");  
  const [isPegawaiModalOpen, setIsPegawaiModalOpen] = useState(false);  
  const [modalData, setModalData] = useState<any[]>([]);  
  const [kategoriParent, setKategoriParent] = useState("");  
  const [status, setStatus] = useState(1); // 1 for active, 0 for inactive  
  const [editId, setEditId] = useState<number | null>(null);  
  const [error, setError] = useState<string | null>(null);
  
  const fetchCategories = async () => {  
    setLoading(true);  
    try {  
      const response = await axios.get("/api/data/diklat_struktural");  
      const data = Array.isArray(response.data) ? response.data : [];  
      setCategories(data);  
      setFilteredCategories(data);  
      setTotalPages(Math.ceil(data.length / entriesPerPage));  
    } catch (error) {  
      console.error("Error fetching categories:", error.response?.data || error.message);  
      setError("Failed to fetch categories.");  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  useEffect(() => {  
    fetchCategories();  
  }, [currentPage, entriesPerPage]);  
  
  useEffect(() => {  
    handleSearch();  
  }, [searchTerm, categories]);  
  
  const handleSearch = () => {  
    const searchResults = categories.filter((item) => {  
      const kategoriNama = item.kategori_nama?.toLowerCase() || ''; // Optional chaining  
      const kategoriParentNama = item.kategori_parent_name?.kategori_nama?.toLowerCase() || ''; // Optional chaining  
      return kategoriNama.includes(searchTerm.toLowerCase()) || kategoriParentNama.includes(searchTerm.toLowerCase());  
    });  
    setFilteredCategories(searchResults);  
    setTotalPages(Math.ceil(searchResults.length / entriesPerPage)); // Update total pages based on search results  
  };  
  
  const handlePageChange = (page: number) => {  
    setCurrentPage(page);  
  };  
  
  const handleShowPegawai = (pegawai: any[]) => {
    setModalData(pegawai);
    setIsPegawaiModalOpen(true);
  };
  
  const toggleModal = () => {  
    setIsModalOpen(!isModalOpen);  
    if (isModalOpen) {  
      // Reset form when closing the modal  
      setKategoriNama("");  
      setKategoriParent("");  
      setStatus(1);  
      setEditId(null);  
    }  
  };  
  
  const handleEdit = (id: number) => {
    const kategori = categories.find((item) => item.kategori_id === id);
    if (kategori) {  
      setEditId(kategori.kategori_id);  
      setKategoriNama(kategori.kategori_nama);  
      setKategoriParent(kategori.kategori_parent);  
      setStatus(kategori.status);  
      setIsModalOpen(true);  
    } else {  
      console.error("Kategori not found for ID:", id);  
    }  
  };
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/data/diklat_struktural/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting kategori:", error.response?.data || error.message);
      setError("Failed to delete kategori.");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    if (editId === null) {  
      console.error("Edit ID is missing");  
      return;  
    }  
    setLoading(true);
    try {
      const response = await axios.put(`/api/data/diklat_struktural/${editId}`, {  
        kategori_nama: kategoriNama,  
        kategori_parent: kategoriParent,  
        status: status,  
      });  
      console.log("Kategori updated:", response.data);  
      toggleModal();  
      fetchCategories();  
    } catch (error) {  
      console.error("Error updating kategori:", error.response?.data || error.message);  
      setError("Failed to update kategori.");  
    } finally {
      setLoading(false);
    }
  };
      return (
        <RootLayout>
          <div>  
          </div>
        <h3 className="text-lg font-bold font-poppins">DAFTAR MASTER DIKLAT JABATAN STRUKTURAL</h3>  
  
        {/* Search and Add Button */}  
        <div className="mb-4 flex justify-between items-center">  
          <div className="flex items-center space-x-2">  
            <input  
              type="text"  
              className="px-3 py-2 border rounded-md w-64"  
              placeholder="Cari Kategori"  
              value={searchTerm}  
              onChange={(e) => setSearchTerm(e.target.value)}  
            />  
          </div>  
          <button  
            className="px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded shadow"  
            onClick={toggleModal}  
          >  
            Tambah Struktural Kategori  
          </button>  
        </div>  
  
        {/* Show the Loading Spinner while data is loading */}  
        {loading ? (  
          <div className="flex justify-center items-center">  
            <LoadingSpinner />  
          </div>  
        ) : (  
          <div className="overflow-x-auto">  
            <table className="w-full border border-teal-600 rounded-lg overflow-hidden my-5">  
              <thead>  
                <tr className="bg-teal-900 text-white">  
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Nama Kategori</th>  
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Parent</th>  
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Jumlah Pegawai</th>  
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Aksi</th>  
                </tr>  
              </thead>  
              <tbody>  
                {filteredCategories.length > 0 ? (  
                  filteredCategories.map(({ kategori_id, kategori_nama, kategori_parent_name, pegawai_count, pegawai_in_kategori }, index) => (  
                    <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                      <td className="px-4 py-2 border border-teal-300">{kategori_nama}</td>  
                      <td className="px-4 py-2 border border-teal-300">{kategori_parent_name?.kategori_nama || 'N/A'}</td>  
                      <td  
                        className="px-4 py-2 border border-teal-300 cursor-pointer text-teal-700 hover:underline"  
                        onClick={() => handleShowPegawai(pegawai_in_kategori)}  
                      >  
                        {pegawai_count}  
                      </td>  
                      <td className="px-4 py-2 border border-teal-300">  
                        <button  
                          className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"  
                          onClick={() => handleEdit(kategori_id)}  
                        >  
                          Edit  
                        </button>  
                        <button  
                          className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"  
                          onClick={() => handleDelete(kategori_id)}  
                        >  
                          Delete  
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
  
        {isPegawaiModalOpen && (  
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">  
            <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80%]">  
              <h2 className="text-lg font-bold mb-4">Detail Pegawai</h2>  
              <div className="overflow-y-auto max-h-[400px]">  
                <table className="w-full border border-gray-300">  
                  <thead>  
                    <tr className="bg-gray-100">  
                      <th className="p-2 border border-gray-300 text-left">NIP</th>  
                      <th className="p-2 border border-gray-300 text-left">Nama</th>  
                      <th className="p-2 border border-gray-300 text-left">Satuan Kerja</th>  
                      <th className="p-2 border border-gray-300 text-left">Aksi</th>  
                    </tr>  
                  </thead>  
                  <tbody>  
                    {modalData.map(({ peg_nip, peg_nama, satuan_kerja_nama }, index) => (  
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>  
                        <td className="p-2 border border-gray-300">{peg_nip}</td>  
                        <td className="p-2 border border-gray-300">{peg_nama}</td>  
                        <td className="p-2 border border-gray-300">{satuan_kerja_nama}</td>  
                        <td className="p-2 border border-gray-300">  
                          <div className="flex gap-x-2">  
                            <button  
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center"  
                              onClick={() => window.open(`/pegawai/profile/edit/${peg_nip}`, "_blank")}  
                            >  
                              <FontAwesomeIcon icon={faEye} className="mr-2" />  
                              View  
                            </button>  
                            <button  
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center"  
                              onClick={() => window.open(`/edit-pegawai/${peg_nip}`, "_blank")}  
                            >  
                              <FontAwesomeIcon icon={faEdit} className="mr-2" />  
                              Edit  
                            </button>  
                          </div>  
                        </td>  
                      </tr>  
                    ))}  
                  </tbody>  
                </table>  
              </div>  
              <button  
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"  
                onClick={() => setIsPegawaiModalOpen(false)}  
              >  
                Close  
              </button>  
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
            {[...Array(totalPages)].map((_, index) => (  
              <button  
                key={index}  
                className={`px-3 py-1 text-sm rounded ${  
                  index + 1 === currentPage  
                    ? "text-white bg-blue-600 hover:bg-blue-700"  
                    : "text-gray-600 border border-gray-300 hover:bg-gray-100"  
                }`}  
                onClick={() => handlePageChange(index + 1)}  
              >  
                {index + 1}  
              </button>  
            ))}  
            <button  
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"  
              disabled={currentPage === totalPages}  
              onClick={() => handlePageChange(currentPage + 1)}  
            >  
              Next  
            </button>  
          </div>  
        </div>  
    </RootLayout>
  );
}
}  
