'use client';  
  
import React, { useState, useEffect } from "react";  
import axios from "axios";  
import LoadingSpinner from "../../../components/LoadingSpinner";  
import RootLayout from "../../pegawai/profile/edit/layout";  
import { FaPlus } from "react-icons/fa";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";  
  
export default function ListUnitPage() {  
  const [statuses, setStatuses] = useState<any[]>([]);  
  const [filteredStatuses, setFilteredStatuses] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [searchTerm, setSearchTerm] = useState("");  
  
  // Modal form state for Add  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  
  const [satuanKerjaNama, setSatuanKerjaNama] = useState("");  
  const [jenisDiklat, setJenisDiklat] = useState(""); // New state for diklat type  
  
  // Modal form state for Edit  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  
  const [editId, setEditId] = useState<number | null>(null);  
  const [editSatuanKerjaNama, setEditSatuanKerjaNama] = useState("");  
  const [editParentDiklat, setEditParentDiklat] = useState(""); // New state for parent diklat  
  
  const [isPegawaiModalOpen, setIsPegawaiModalOpen] = useState(false);  
  const [modalData, setModalData] = useState<any[]>([]);  
  
  useEffect(() => {  
    fetchStatuses();  
  }, []);  
  
  const handleSearch = () => {  
    const searchResults = statuses.filter(  
      (item) =>  
        item.satuan_kerja_nama.toLowerCase().includes(searchTerm.toLowerCase())  
    );  
    setFilteredStatuses(searchResults);  
  };  
  
  useEffect(() => {  
    handleSearch();  
  }, [searchTerm, handleSearch]);  
  
  const fetchStatuses = async () => {  
    setLoading(true);  
    try {  
      const response = await axios.get("/api/data/diklat_jft");  
      const data = Array.isArray(response.data) ? response.data : [];  
      setStatuses(data);  
      setFilteredStatuses(data);  
    } catch (error) {  
      console.error("Error fetching statuses:", error.response?.data || error.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Open and close modal for Add  
  const toggleAddModal = () => {  
    setIsAddModalOpen(!isAddModalOpen);  
    if (isAddModalOpen) {  
      resetAddForm();  
    }  
  };  
  
  const resetAddForm = () => {  
    setSatuanKerjaNama("");  
    setJenisDiklat(""); // Reset diklat type  
  };  
  
  // Handle form submit to create new Satuan Kerja  
  const handleCreateFormSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    try {  
      const response = await axios.post("/api/data/diklat_jft", {  
        satuan_kerja_nama: satuanKerjaNama,  
        jenis_diklat: jenisDiklat, // Include diklat type  
      });  
      console.log("Satuan Kerja created:", response.data);  
      toggleAddModal(); // Close modal and refresh the data  
      fetchStatuses();  
    } catch (error) {  
      console.error("Error creating satuan kerja:", error.response?.data || error.message);  
    }  
  };  
  
// Handle Edit button click    
const handleEdit = (id: number) => {    
  const diklatFungsional = statuses.find(item => item.diklat_fungsional_id === id); // Change to diklat_fungsional_id  
  if (diklatFungsional) {    
    setEditId(diklatFungsional.diklat_fungsional_id); // Use diklat_fungsional_id  
    setEditSatuanKerjaNama(diklatFungsional.diklat_fungsional_nm); // Use diklat_fungsional_nm for the name  
    setEditParentDiklat(diklatFungsional.parent_diklat); // Set parent diklat for edit    
    setIsEditModalOpen(true); // Open edit modal    
  } else {    
    console.error("Diklat Fungsional not found for ID:", id);    
  }    
};  
  
  const handleEditFormSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    if (editId === null) {  
      console.error("Edit ID is missing");  
      return;  
    }  
    try {  
      const response = await axios.put(`/api/data/diklat_jft/${editId}`, {  
        satuan_kerja_nama: editSatuanKerjaNama,  
        parent_diklat: editParentDiklat, // Include parent diklat  
      });  
      console.log("Satuan Kerja updated:", response.data);  
      setIsEditModalOpen(false); // Close the modal  
      fetchStatuses(); // Refresh the data after edit  
    } catch (error) {  
      console.error("Error updating satuan kerja:", error.response?.data || error.message);  
    }  
  };  
  
  const handleShowPegawai = (pegawai: any) => {  
    setModalData(pegawai);  
    setIsPegawaiModalOpen(true);  
  };  
  
  return (  
    <RootLayout>  
      <div className="flex-4 h-full px-4 overflow-auto">  
        <div className="text-center mb-10">  
          <h3 className="text-lg font-bold font-poppins">DAFTAR MASTER DIKLAT JABATAN FUNGSIONAL TERTENTU</h3>  
        </div>  
  
        {/* Search and Add Button */}  
        <div className="mb-4 flex justify-between items-center">  
          <div className="flex items-center space-x-2">  
            <input  
              type="text"  
              className="px-3 py-2 border rounded-md w-64"  
              placeholder="Cari Diklat Fungsional"  
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
            onClick={toggleAddModal}  
          >  
            <FaPlus className="mr-2" />  
            Tambah Diklat Jabatan Fungsional Tertentu  
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
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Nama Diklat Fungsional</th>  
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Jumlah Pegawai</th>  
                  <th className="p-3 border border-teal-700 text-left font-bold uppercase text-sm">Aksi</th>  
                </tr>  
              </thead>  
              <tbody>  
                {filteredStatuses.length > 0 ? (  
                  filteredStatuses.map(({ diklat_fungsional_id, diklat_fungsional_nm, pegawai_count, pegawai }, index) => (  
                    <tr key={index} className={index % 2 === 0 ? "bg-teal-50" : "bg-white"}>  
                      <td className="px-4 py-2 border border-teal-300">{diklat_fungsional_nm}</td>  
                      <td  
                        className="px-4 py-2 border border-teal-300 cursor-pointer text-teal-700 hover:underline"  
                        onClick={() => handleShowPegawai(pegawai)}  
                      >  
                        {pegawai_count}  
                      </td>  
                      <td className="px-4 py-2 border border-teal-300">  
                        <button  
                          className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"  
                          onClick={() => handleEdit(diklat_fungsional_id)} // Call handleEdit with the correct ID  
                        >  
                          Edit  
                        </button>  
                      </td>  
                    </tr>  
                  ))  
                ) : (  
                  <tr>  
                    <td colSpan={3} className="text-center py-4">  
                      No data found.  
                    </td>  
                  </tr>  
                )}  
              </tbody>  
            </table>  
          </div>  
        )}  
  
        {/* Modal for Add Diklat */}  
        {isAddModalOpen && (  
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">  
            <div className="bg-white p-6 rounded shadow-lg w-3/4">  
              <h2 className="text-lg font-bold mb-4">Tambah Diklat Jabatan Fungsional Tertentu</h2>  
              <form onSubmit={handleCreateFormSubmit}>  
                <div className="mb-4 flex items-center">  
                  <label className="block mb-1 w-1/3">Nama Diklat Jabatan Fungsional Tertentu</label>  
                  <input  
                    type="text"  
                    className="px-3 py-2 border rounded-md w-2/3"  
                    value={satuanKerjaNama}  
                    onChange={(e) => setSatuanKerjaNama(e.target.value)}  
                    required  
                  />  
                </div>  
                <div className="mb-4 flex items-center">  
                  <label className="block mb-1 w-1/3">Jenis Diklat</label>  
                  <input  
                    type="text"  
                    className="px-3 py-2 border rounded-md w-2/3"  
                    value={jenisDiklat}  
                    onChange={(e) => setJenisDiklat(e.target.value)}  
                    required  
                  />  
                </div>  
                <div className="flex justify-end">  
                  <button  
                    type="submit"  
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"  
                  >  
                    Tambah  
                  </button>  
                  <button  
                    type="button"  
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"  
                    onClick={toggleAddModal}  
                  >  
                    Cancel  
                  </button>  
                </div>  
              </form>  
            </div>  
          </div>  
        )}  
  
        {/* Modal for Edit Diklat */}  
        {isEditModalOpen && (  
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">  
            <div className="bg-white p-6 rounded shadow-lg w-3/4">  
              <h2 className="text-lg font-bold mb-4">Edit Diklat Jabatan Fungsional Tertentu</h2>  
              <form onSubmit={handleEditFormSubmit}>  
                <div className="mb-4 flex items-center">  
                  <label className="block mb-1 w-1/3">Nama Diklat Jabatan Fungsional Tertentu</label>  
                  <input  
                    type="text"  
                    className="px-3 py-2 border rounded-md w-2/3"  
                    value={editSatuanKerjaNama}  
                    onChange={(e) => setEditSatuanKerjaNama(e.target.value)}  
                    required  
                  />  
                </div>  
                <div className="mb-4 flex items-center">  
                  <label className="block mb-1 w-1/3">Parent Diklat</label>  
                  <input  
                    type="text"  
                    className="px-3 py-2 border rounded-md w-2/3"  
                    value={editParentDiklat}  
                    onChange={(e) => setEditParentDiklat(e.target.value)}  
                    required  
                  />  
                </div>  
                <div className="flex justify-end">  
                  <button  
                    type="submit"  
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"  
                  >  
                    Update  
                  </button>  
                  <button  
                    type="button"  
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"  
                    onClick={() => setIsEditModalOpen(false)}  
                  >  
                    Cancel  
                  </button>  
                </div>  
              </form>  
            </div>  
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
                    {modalData.map(({ peg_nip, peg_nama, m_spg_satuan_kerja }, index) => (  
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>  
                        <td className="p-2 border border-gray-300">{peg_nip}</td>  
                        <td className="p-2 border border-gray-300">{peg_nama}</td>  
                        <td className="p-2 border border-gray-300">{m_spg_satuan_kerja?.satuan_kerja_nama}</td>  
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
      </div>  
    </RootLayout>  
  );  
}  
